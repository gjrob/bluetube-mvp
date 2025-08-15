import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Live() {
  const [liveStreams, setLiveStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchLiveStreams();
    // Set up real-time subscription
    const subscription = supabase
      .channel('live-streams')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'streams' }, 
        () => fetchLiveStreams())
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchLiveStreams = async () => {
    const { data } = await supabase
      .from('streams')
      .select('*, users(username, id)')
      .eq('is_live', true)
      .order('started_at', { ascending: false });
    
    setLiveStreams(data || []);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
          🚁 BlueTubeTV
        </Link>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
          <Link href="/marketplace" style={{ color: 'white', textDecoration: 'none' }}>Marketplace</Link>
          <Link href="/jobs" style={{ color: 'white', textDecoration: 'none' }}>Jobs</Link>
        </div>
      </nav>

      <div style={{ padding: '40px' }}>
        <h1 style={{ color: 'white', marginBottom: '30px' }}>🔴 Live Streams</h1>
        
        {loading ? (
          <div style={{ color: 'white', textAlign: 'center' }}>Loading streams...</div>
        ) : liveStreams.length === 0 ? (
          <div style={{ background: 'white', padding: '40px', borderRadius: '10px', textAlign: 'center' }}>
            <h2>No live streams right now</h2>
            <p style={{ color: '#666', margin: '20px 0' }}>Be the first to go live!</p>
            <Link href="/dashboard" style={{
              display: 'inline-block',
              padding: '12px 30px',
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold'
            }}>
              Start Streaming
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {liveStreams.map(stream => (
              <div key={stream.id} style={{ background: 'white', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '200px', 
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <span style={{ fontSize: '48px' }}>🚁</span>
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'red',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    🔴 LIVE
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ marginBottom: '10px' }}>{stream.title}</h3>
                  <p style={{ color: '#666', marginBottom: '15px' }}>
                    {stream.users?.username || 'Anonymous'} • {stream.viewer_count || 0} viewers
                  </p>
                  <Link href={`/watch/${stream.id}`} style={{
                    display: 'block',
                    padding: '10px',
                    background: '#667eea',
                    color: 'white',
                    textAlign: 'center',
                    textDecoration: 'none',
                    borderRadius: '5px',
                    fontWeight: 'bold'
                  }}>
                    Watch Stream
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}
