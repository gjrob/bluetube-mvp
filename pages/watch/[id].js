// pages/watch/[id].js
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import Layout from '../../components/Layout';

// Client-only components
const LivePeerPlayer  = dynamic(() => import('../../components/LivePeerPlayer'),  { ssr: false });
const LiveChat        = dynamic(() => import('../../components/LiveChat'),        { ssr: false });
const SuperChat       = dynamic(() => import('../../components/SuperChat'),       { ssr: false });
const NFTMinting      = dynamic(() => import('../../components/NFTMinting'),      { ssr: false });
const FlightCompliance= dynamic(() => import('../../components/FlightCompliance'),{ ssr: false });

export default function WatchStream() {
  const router = useRouter();
  const { id } = router.query;

  const supabase = useMemo(() => createClientComponentClient(), []);
  const [loading, setLoading] = useState(true);
  const [stream, setStream]   = useState(null);
  const [error, setError]     = useState(null);
  const [me, setMe]           = useState(null);

  // Derive a safe playbackId
  const playbackId =
    stream?.playback_id ||
    (stream?.playback_url && (stream.playback_url.match(/\/hls\/([^/]+)\//)?.[1] || null)) ||
    id;

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Load viewer (optional)
        const { data: sessionData } = await supabase.auth.getSession();
        const viewer = sessionData?.session?.user;
        setMe({
          id: viewer?.id || 'anon',
          username: viewer?.email ? viewer.email.split('@')[0] : 'Anonymous Viewer',
        });

        // Fetch stream row; select(*) so missing columns don't break build
        const { data, error: sErr } = await supabase
          .from('streams')
          .select('*')
          .eq('id', id)
          .single();

        if (sErr) throw sErr;
        setStream(data || null);
      } catch (e) {
        console.error('watch/[id] load error:', e);
        setError(e.message || 'Failed to load stream');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, supabase]);

  return (
    <>
      <Head>
        <title>{stream?.title ? `${stream.title} – BlueTubeTV` : 'Live Stream – BlueTubeTV'}</title>
      </Head>

      <div
        style={{
          minHeight: '100vh',
          color: 'white',
          background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #3b82c4 100%)',
        }}
      >
        <Layout>
          <div
            style={{
              maxWidth: 1200,
              margin: '0 auto',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 30,
            }}
          >
            {/* Header / breadcrumbs */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link href="/live" style={{ color: '#93c5fd', textDecoration: 'none' }}>
                ← Back to Live
              </Link>
              <div style={{ opacity: 0.8, fontSize: 14 }}>
                Stream ID: <code>{id}</code>
              </div>
            </div>

            {loading && (
              <div style={{ textAlign: 'center', padding: 100 }}>
                <h2>Loading stream…</h2>
              </div>
            )}

            {!loading && error && (
              <div style={{ textAlign: 'center', padding: 100 }}>
                <h2>Stream not found</h2>
                <p style={{ opacity: 0.8 }}>{error}</p>
              </div>
            )}

            {!loading && !error && stream && (
              <>
                {/* Player */}
                <div style={{ position: 'relative', paddingTop: '56.25%', marginBottom: 30 }}>
                  {stream.is_live && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 20,
                        left: 20,
                        background: '#ef4444',
                        color: 'white',
                        padding: '8px 20px',
                        borderRadius: 20,
                        fontSize: 14,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        zIndex: 5,
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          background: 'white',
                          borderRadius: '50%',
                          animation: 'pulse 1.4s infinite',
                        }}
                      />
                      LIVE
                    </div>
                  )}

                  {/* Livepeer Player (expects playbackId) */}
                  <LivePeerPlayer playbackId={playbackId} />

                  {!stream.is_live && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.55)',
                        zIndex: 4,
                      }}
                    >
                      <div
                        style={{
                          background: 'rgba(0,0,0,0.75)',
                          padding: 32,
                          borderRadius: 16,
                          textAlign: 'center',
                        }}
                      >
                        <h2>Waiting for the pilot to go live…</h2>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stream info & actions */}
                <div
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: 20,
                    padding: 30,
                  }}
                >
                  <h1 style={{ marginBottom: 10 }}>{stream.title || 'Drone Live Stream'}</h1>
                  <p style={{ color: '#94a3b8', marginBottom: 20 }}>
                    {stream.is_live ? 'Currently live' : 'Offline'} • Started:{' '}
                    {stream.started_at ? new Date(stream.started_at).toLocaleString() : '—'}
                  </p>

                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Stream link copied!');
                      }}
                      style={pillBtn('#3b82f6')}
                    >
                      📋 Copy Link
                    </button>

                    {stream.playback_url && (
                      <a
                        href={stream.playback_url}
                        target="_blank"
                        rel="noreferrer"
                        style={pillBtn('#10b981')}
                      >
                        🔗 Open HLS
                      </a>
                    )}
                  </div>
                </div>

                {/* SuperChat (only if we know the creator wallet) */}
                {stream.creator_wallet && (
                  <div style={{ marginBottom: 30 }}>
                    <SuperChat
                      streamId={stream.id}
                      creatorAddress={stream.creator_wallet}
                      currentUser={me}
                      isLive={!!stream.is_live}
                    />
                  </div>
                )}

                {/* Live Chat */}
                <div style={{ marginBottom: 30 }}>
                  <LiveChat
                    streamId={stream.id}
                    userId={me?.id || 'anon'}
                    username={me?.username || 'Anonymous Viewer'}
                  />
                </div>

                {/* NFT Minting */}
                <NFTMinting
                  streamId={stream.id}
                  pilotName={stream.display_name || 'BlueTubeTV Pilot'}
                  isLive={!!stream.is_live}
                  currentUser={{ id: me?.id || 'anon', name: me?.username || 'Viewer' }}
                />
              </>
            )}
          </div>
        </Layout>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}

function pillBtn(hex) {
  return {
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    border: `1px solid ${hex}55`,
    padding: '10px 20px',
    borderRadius: 20,
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: 16,
  };
}
