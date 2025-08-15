import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Marketplace() {
  const [videos, setVideos] = useState([]);
  const [filter, setFilter] = useState('all');
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchVideos();
  }, [filter]);

  const fetchVideos = async () => {
    let query = supabase
      .from('videos')
      .select('*, users(username)')
      .order('created_at', { ascending: false })
      .limit(20);

    if (filter === 'free') {
      query = query.eq('is_free', true);
    } else if (filter === 'premium') {
      query = query.eq('is_free', false);
    }

    const { data } = await query;
    setVideos(data || []);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
          🚁 BlueTubeTV
        </Link>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
          <Link href="/live" style={{ color: 'white', textDecoration: 'none' }}>Live</Link>
          <Link href="/jobs" style={{ color: 'white', textDecoration: 'none' }}>Jobs</Link>
        </div>
      </nav>

      <div style={{ padding: '40px' }}>
        <h1 style={{ marginBottom: '30px' }}>🛍️ Content Marketplace</h1>
        
        <div style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
          <button onClick={() => setFilter('all')} style={filterButton(filter === 'all')}>All Content</button>
          <button onClick={() => setFilter('free')} style={filterButton(filter === 'free')}>Free</button>
          <button onClick={() => setFilter('premium')} style={filterButton(filter === 'premium')}>Premium</button>
        </div>

        {videos.length === 0 ? (
          <div style={{ background: 'white', padding: '40px', borderRadius: '10px', textAlign: 'center' }}>
            <h2>No videos available yet</h2>
            <p style={{ color: '#666', margin: '20px 0' }}>Be the first to upload content!</p>
            <Link href="/upload" style={{
              display: 'inline-block',
              padding: '12px 30px',
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold'
            }}>
              Upload Video
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {videos.map(video => (
              <div key={video.id} style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ height: '180px', background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '48px' }}>📹</span>
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ marginBottom: '10px' }}>{video.title}</h3>
                  <p style={{ color: '#666', marginBottom: '10px' }}>{video.users?.username || 'Anonymous'}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: video.is_free ? '#4CAF50' : '#667eea' }}>
                      {video.is_free ? 'FREE' : `$${video.price}`}
                    </span>
                    <span style={{ color: '#666' }}>{video.views || 0} views</span>
                  </div>
                  <Link href={`/watch/${video.id}`} style={{
                    display: 'block',
                    marginTop: '15px',
                    padding: '10px',
                    background: '#667eea',
                    color: 'white',
                    textAlign: 'center',
                    textDecoration: 'none',
                    borderRadius: '5px'
                  }}>
                    Watch Now
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

const filterButton = (active) => ({
  padding: '10px 20px',
  background: active ? 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)' : 'white',
  color: active ? 'white' : '#667eea',
  border: '2px solid #667eea',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold'
});

export async function getServerSideProps() {
  return { props: {} };
}
