// pages/live.js
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// client-only supabase to avoid SSR issues
const createClientComponentClient = () =>
  import('@supabase/auth-helpers-nextjs').then(m => m.createClientComponentClient());

export default function Live() {
  const [supabase, setSupabase] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // init client on mount
  useEffect(() => {
    createClientComponentClient().then(setSupabase);
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const fetchLive = async () => {
      setLoading(true);
      setErr('');
      // Be explicit about columns that actually exist; include optionals if present
      const { data, error } = await supabase
        .from('streams')
        .select(`
          id,
          is_live,
          viewer_count,
          started_at,
          created_at,
          playback_url,
          rtmp_url,
          platform,
          title,
          name,
          users:users(username,id)
        `)
        .eq('is_live', true);

      if (error) {
        setErr(error.message);
        setRows([]);
      } else {
        // Prefer DB order if you have started_at; else sort locally by created_at desc
        const sorted = [...(data || [])].sort((a, b) => {
          const aT = a?.started_at || a?.created_at || 0;
          const bT = b?.started_at || b?.created_at || 0;
          return new Date(bT) - new Date(aT);
        });
        setRows(sorted);
      }
      setLoading(false);
    };

    fetchLive();

    // realtime updates
    const channel = supabase
      .channel('public:streams')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'streams' },
        () => fetchLive()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const hasRows = rows && rows.length > 0;

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <Link href="/" style={styles.brand}>🚁 BlueTubeTV</Link>
        <div style={styles.navRight}>
          <Link href="/dashboard" style={styles.navLink}>Dashboard</Link>
          <Link href="/marketplace" style={styles.navLink}>Marketplace</Link>
          <Link href="/jobs" style={styles.navLink}>Jobs</Link>
        </div>
      </nav>

      <div style={styles.container}>
        <h1 style={styles.h1}>🔵 Live Streams</h1>

        {err && (
          <div style={styles.error}>
            {err}
            <div style={{marginTop:8, fontSize:13, opacity:.8}}>
              Tip: this page doesn’t require a <code>title</code> column. It will
              gracefully use <code>name</code> or the ID if title is missing.
            </div>
          </div>
        )}

        {loading ? (
          <div style={styles.loading}>Loading streams…</div>
        ) : !hasRows ? (
          <div style={styles.card}>
            <h2 style={{margin:0}}>No live streams right now</h2>
            <p style={{color:'#c7d2fe', margin:'12px 0 20px'}}>
              Be the first to go live!
            </p>
            <Link href="/dashboard" style={styles.ctaBtn}>Start Streaming</Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {rows.map((s) => {
              const displayTitle =
                s?.title || s?.name || `Stream ${String(s.id).slice(0, 6)}`;
              const viewers = s?.viewer_count ?? 0;
              const username = s?.users?.username || 'Anonymous';

              return (
                <div key={s.id} style={styles.streamCard}>
                  <div style={styles.thumb}>
                    <span style={{fontSize:46}}>🌊</span>
                    <div style={styles.liveBadge}>LIVE</div>
                  </div>
                  <div style={{padding:16}}>
                    <h3 style={{margin:'0 0 6px 0', color:'#e2e8f0'}}>{displayTitle}</h3>
                    <p style={{margin:0, color:'#a5b4fc'}}>
                      {username} • {viewers} viewers
                    </p>
                    <Link href={`/watch/${s.id}`} style={styles.watchBtn}>
                      Watch Stream
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  // 🔵 unified BlueTube gradient (matches your home/web3 pages)
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#0a1628 0%,#1e3a5f 50%,#3b82c4 100%)',
    color: 'white',
  },
  nav: {
    padding: '16px 28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backdropFilter: 'blur(8px)',
  },
  brand: {
    color: 'white',
    textDecoration: 'none',
    fontSize: 22,
    fontWeight: 800,
  },
  navRight: { display: 'flex', gap: 18 },
  navLink: { color: '#c7d2fe', textDecoration: 'none' },
  container: { maxWidth: 1200, margin: '0 auto', padding: 24 },
  h1: { margin: '8px 0 24px', fontWeight: 800 },
  loading: { textAlign: 'center', opacity: .9 },
  error: {
    background: 'rgba(239,68,68,.15)',
    border: '1px solid rgba(239,68,68,.5)',
    color: '#fecaca',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  card: {
    background: 'rgba(10,22,40,.45)',
    border: '1px solid rgba(96,165,250,.35)',
    padding: 24,
    borderRadius: 14,
    textAlign: 'center',
    maxWidth: 540,
  },
  ctaBtn: {
    display: 'inline-block',
    marginTop: 6,
    padding: '10px 18px',
    background: 'linear-gradient(135deg,#3b82c4,#60a5fa)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: 10,
    fontWeight: 700,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))',
    gap: 18,
  },
  streamCard: {
    background: 'rgba(10,22,40,.45)',
    border: '1px solid rgba(96,165,250,.35)',
    borderRadius: 14,
    overflow: 'hidden',
  },
  thumb: {
    height: 180,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg,#0a1628,#1e3a5f)',
    position: 'relative',
  },
  liveBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    background: '#ef4444',
    color: 'white',
    fontWeight: 800,
    fontSize: 12,
    padding: '6px 10px',
    borderRadius: 8,
    letterSpacing: .5,
  },
  watchBtn: {
    display: 'block',
    marginTop: 14,
    textAlign: 'center',
    padding: '10px 12px',
    background: '#3b82c4',
    color: 'white',
    textDecoration: 'none',
    borderRadius: 10,
    fontWeight: 700,
  },
};
