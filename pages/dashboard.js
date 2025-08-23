// pages/dashboard.js — Production-ready
import { useEffect, useMemo, useState, useCallback } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import StartStreamButton from '@components/StartStreamButton';

const BG = 'linear-gradient(180deg,#0a1628 0%,#1e3a5f 60%,#0b2746 100%)'; // BlueTube theme

function Dashboard() {
  const supabase = useMemo(() => createClientComponentClient(), []);
  const [userId, setUserId] = useState(null);

  // stream config
  const [streamKey, setStreamKey] = useState('');
  const [rtmpUrl, setRtmpUrl] = useState('rtmp://rtmp.livepeer.com/live');
  const [playbackId, setPlaybackId] = useState('');
  const [playbackSrc, setPlaybackSrc] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // stats
  const [activeStreams, setActiveStreams] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [jobsPosted, setJobsPosted] = useState(0);
  const [earnings, setEarnings] = useState(0);

  // ui
  const [walletConnected, setWalletConnected] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  // ---------------------------
  // Auth + initial load
  // ---------------------------
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const id = data?.user?.id || null;
      setUserId(id);
      refreshStats(id);
      loadLastStreamKey(id);
    });
  }, [supabase]);

  // ---------------------------
  // Helpers
  // ---------------------------
  const safeSum = (rows, field) =>
    (rows || []).reduce((acc, r) => acc + (Number(r?.[field]) || 0), 0);

  const refreshStats = async (uid) => {
    setErr('');
    try {
      // active streams
      try {
        const { count } = await supabase
          .from('streams')
          .select('id', { count: 'exact', head: true })
          .eq('is_live', true);
        setActiveStreams(count || 0);
      } catch {}

      // total views (sum viewer_count)
      try {
        const { data } = await supabase
          .from('streams')
          .select('viewer_count');
        setTotalViews(safeSum(data, 'viewer_count'));
      } catch {}

      // jobs posted (by current user if available, otherwise overall)
      try {
        const q = supabase.from('jobs').select('id', { count: 'exact', head: true });
        const { count } = uid ? await q.eq('created_by', uid) : await q;
        setJobsPosted(count || 0);
      } catch {}

      // earnings: prefer tips/payments table; fall back to 0
      let earned = 0;
      try {
        // Option A: tips table
        const { data: tips } = await supabase
          .from('tips')
          .select('amount_usd')
          .eq('status', 'succeeded');
        earned = safeSum(tips, 'amount_usd');
      } catch {}
      if (!earned) {
        try {
          // Option B: payments table
          const { data: pays } = await supabase
            .from('payments')
            .select('amount_usd')
            .eq('status', 'succeeded');
          earned = safeSum(pays, 'amount_usd');
        } catch {}
      }
      setEarnings(earned || 0);
    } catch (e) {
      setErr(e.message || String(e));
    }
  };

  const loadLastStreamKey = async (uid) => {
    if (!uid) return;
    try {
      const { data } = await supabase
        .from('stream_keys')
        .select('stream_key,rtmp_url,playback_url,platform,created_at')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(1);
      const row = data?.[0];
      if (row) {
        setStreamKey(row.stream_key || '');
        setRtmpUrl(row.rtmp_url || rtmpUrl);
        // derive playbackId if we have a playback_url (Livepeer)
        const pb = row.playback_url || '';
        const match = pb.match(/\/hls\/([^/]+)\//) || pb.match(/\/stream\.mux\.com\/([^/.]+)/);
        if (match) setPlaybackId(match[1]);
      }
    } catch {}
  };

  const generateKey = async (platform = 'livepeer') => {
    setBusy(true);
    setErr('');
    try {
      const res = await fetch('/api/stream/generate-key', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ userId, platform }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || 'Failed to generate key');
      setStreamKey(json.streamKey);
      setRtmpUrl(json.rtmpUrl || rtmpUrl);

      // get playbackId from playbackUrl if present
      if (json.playbackUrl) {
        const m = json.playbackUrl.match(/\/hls\/([^/]+)\//) || json.playbackUrl.match(/\/stream\.mux\.com\/([^/.]+)/);
        if (m) setPlaybackId(m[1]);
      } else {
        setPlaybackId('');
      }
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const connectWallet = async () => {
    if (!window?.ethereum) return alert('Please install MetaMask');
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletConnected(true);
    } catch {
      setWalletConnected(false);
    }
  };

  const startBrowserStream = useCallback(async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const el = document.getElementById('localVideo');
      if (el) el.srcObject = media;
      setShowPreview(true);
      setIsStreaming(true);
    } catch {
      alert('Please allow camera & mic access');
    }
  }, []);

  const stopBrowserStream = () => {
    const el = document.getElementById('localVideo');
    const stream = el?.srcObject;
    if (stream) stream.getTracks().forEach(t => t.stop());
    if (el) el.srcObject = null;
    setIsStreaming(false);
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <>
      <Head><title>Dashboard | BlueTubeTV</title></Head>

      <div style={{ minHeight: '100vh', background: BG, color: 'white', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
        {/* Header */}
        <header style={{
          background: 'rgba(255,255,255,0.96)',
          color: '#0b2746',
          padding: '14px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,.08)'
        }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 800, textDecoration: 'none', color: '#0b2746' }}>🚁 BlueTubeTV</a>
          <nav style={{ display: 'flex', gap: 18 }}>
            <a href="/" style={{ color: '#0b2746', textDecoration: 'none' }}>Home</a>
            <a href="/marketplace" style={{ color: '#0b2746', textDecoration: 'none' }}>Marketplace</a>
            <a href="/jobs" style={{ color: '#0b2746', textDecoration: 'none' }}>Jobs</a>
          </nav>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              background: '#10b981', color: 'white', padding: '6px 12px',
              borderRadius: 999, fontWeight: 700
            }}>
              ${earnings.toFixed(2)}
            </div>
            {!walletConnected ? (
              <button onClick={connectWallet}
                style={{ background: '#f59e0b', color: 'white', border: 0, padding: '8px 12px', borderRadius: 8, fontWeight: 700 }}>
                Connect Wallet
              </button>
            ) : <span style={{ color: '#10b981', fontWeight: 700 }}>✓ Wallet</span>}
          </div>
        </header>

        <div style={{ padding: 32, maxWidth: 1280, margin: '0 auto' }}>
          {/* Top stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
            gap: 16, marginBottom: 28
          }}>
            <StatCard icon="📹" label="Active Streams" value={String(activeStreams)} color="#ef4444" />
            <StatCard icon="💰" label="Total Earnings" value={`$${earnings.toFixed(2)}`} color="#10b981" />
            <StatCard icon="👁️" label="Total Views" value={String(totalViews)} color="#3b82f6" />
            <StatCard icon="💼" label="Jobs Posted" value={String(jobsPosted)} color="#f59e0b" />
          </div>

          {/* Streaming setup */}
          <section style={{ background: 'white', color: '#0f172a', borderRadius: 16, padding: 24, boxShadow: '0 8px 20px rgba(0,0,0,.12)', marginBottom: 24 }}>
            <h2 style={{ margin: 0, marginBottom: 14 }}>🔴 Streaming Setup</h2>

            {err && (
              <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b',
                padding: 10, borderRadius: 8, marginBottom: 12 }}>
                {err}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <Label>Stream Key</Label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input value={streamKey} readOnly style={inputMono} />
                  <button onClick={() => { navigator.clipboard.writeText(streamKey); }}
                    style={btn('#3b82f6')}>Copy</button>
                </div>

                <div style={{ height: 16 }} />
                <Label>RTMP Server</Label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input value={rtmpUrl} readOnly style={inputMono} />
                  <button onClick={() => { navigator.clipboard.writeText(rtmpUrl); }}
                    style={btn('#0f766e')}>Copy</button>
                </div>
              </div>

              <div>
                <button
                  onClick={isStreaming ? stopBrowserStream : startBrowserStream}
                  style={primary(isStreaming ? '#ef4444' : '#10b981')}>
                  {isStreaming ? '⏹ Stop Preview' : '🎥 Start Browser Preview'}
                </button>

                <div style={{ height: 12 }} />
                <button onClick={() => generateKey('livepeer')} disabled={busy} style={primary('#667eea')}>
                  {busy ? 'Generating…' : '🔑 Generate New Key'}
                </button>

                <div style={{ height: 12 }} />
            <button
  onClick={() => window.open('/stream', '_blank')}
  style={{
    display: 'block',
    width: '100%',
    padding: '15px',
    background: '#f59e0b',
    color: 'white',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    border: 'none',
    cursor: 'pointer'
  }}
>
  👁️ View Stream Page
</button>

              </div>
            </div>

            {showPreview && (
              <div style={{ marginTop: 18 }}>
                <video id="localVideo" autoPlay muted style={{ width: '100%', maxWidth: 720, borderRadius: 12, background: '#000' }} />
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: 'white', color: '#0f172a', borderRadius: 14, padding: 20,
      textAlign: 'center', boxShadow: '0 6px 16px rgba(0,0,0,.12)'
    }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontWeight: 800, fontSize: 28, color }}>{value}</div>
      <div style={{ color: '#64748b', fontSize: 12, marginTop: 6 }}>{label.toUpperCase()}</div>
    </div>
  );
}

const Label = (p) => <div style={{ fontWeight: 700, marginBottom: 8 }}>{p.children}</div>;
const inputMono = {
  flex: 1, padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: 8,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12
};
const btn = (bg) => ({
  padding: '10px 14px', background: bg, color: 'white', border: 0, borderRadius: 8, fontWeight: 700, cursor: 'pointer'
});
const primaryStyle = (bg) => ({ padding: '14px 16px', background: bg, color: 'white', borderRadius: 10, fontWeight: 800 });
const primary = (bg) => ({ ...primaryStyle(bg), width: '100%', border: 0, cursor: 'pointer', textAlign: 'center' });

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });
