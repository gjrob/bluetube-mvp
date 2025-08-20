// pages/marketplace.js
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
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #3b82c4 100%)'
    }}>
      {/* Navigation Header */}
      <nav style={{ 
        background: 'rgba(10, 22, 40, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(59, 130, 196, 0.3)',
        padding: '1rem 2rem',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Link href="/" style={{ 
          fontSize: '1.8rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #3b82c4, #60a5fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🚁 BlueTubeTV
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link href="/dashboard" style={{ 
            color: '#94a3b8', 
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            transition: 'all 0.3s'
          }}>Dashboard</Link>
          <Link href="/live" style={{ 
            color: '#94a3b8', 
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            transition: 'all 0.3s'
          }}>Live</Link>
          <Link href="/jobs" style={{ 
            color: '#94a3b8', 
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            transition: 'all 0.3s'
          }}>Jobs</Link>
        </div>
      </nav>

      <div style={{ 
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          marginBottom: '2rem',
          color: '#60a5fa',
          fontSize: '2.5rem',
          background: 'linear-gradient(135deg, #60a5fa, #93c5fd)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🛍️ Content Marketplace
        </h1>
        
        {/* Filter Buttons */}
        <div style={{ 
          marginBottom: '2rem', 
          display: 'flex', 
          gap: '1rem',
          background: 'rgba(30, 58, 95, 0.5)',
          padding: '1rem',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)'
        }}>
          <button 
            onClick={() => setFilter('all')} 
            style={filterButton(filter === 'all')}
          >
            All Content
          </button>
          <button 
            onClick={() => setFilter('free')} 
            style={filterButton(filter === 'free')}
          >
            Free
          </button>
          <button 
            onClick={() => setFilter('premium')} 
            style={filterButton(filter === 'premium')}
          >
            Premium
          </button>
        </div>

        {videos.length === 0 ? (
          <div style={{ 
            background: 'rgba(30, 58, 95, 0.9)',
            backdropFilter: 'blur(20px)',
            padding: '3rem',
            borderRadius: '20px',
            textAlign: 'center',
            border: '1px solid rgba(59, 130, 196, 0.3)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ 
              color: '#93c5fd',
              marginBottom: '1rem'
            }}>
              No videos available yet
            </h2>
            <p style={{ 
              color: '#64748b', 
              margin: '1.5rem 0',
              fontSize: '1.1rem'
            }}>
              Be the first to upload content!
            </p>
            <Link href="/upload" style={{
              display: 'inline-block',
              padding: '1rem 2.5rem',
              background: 'linear-gradient(135deg, #3b82c4, #60a5fa)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '1.1rem',
              boxShadow: '0 4px 15px rgba(59, 130, 196, 0.4)',
              transition: 'all 0.3s'
            }}>
              Upload Video
            </Link>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {videos.map(video => (
              <div key={video.id} style={{ 
                background: 'rgba(30, 58, 95, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '15px',
                overflow: 'hidden',
                border: '1px solid rgba(59, 130, 196, 0.3)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(59, 130, 196, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
              }}>
                <div style={{ 
                  height: '180px', 
                  background: 'linear-gradient(135deg, #1e3a5f, #3b82c4)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <span style={{ fontSize: '48px' }}>📹</span>
                  {!video.is_free && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#1a1a1a'
                    }}>
                      PREMIUM
                    </div>
                  )}
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ 
                    marginBottom: '0.75rem',
                    color: '#93c5fd',
                    fontSize: '1.25rem'
                  }}>
                    {video.title}
                  </h3>
                  <p style={{ 
                    color: '#64748b', 
                    marginBottom: '1rem',
                    fontSize: '0.9rem'
                  }}>
                    By {video.users?.username || 'Anonymous Pilot'}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ 
                      fontWeight: 'bold', 
                      fontSize: '1.25rem',
                      color: video.is_free ? '#10b981' : '#fbbf24'
                    }}>
                      {video.is_free ? 'FREE' : `$${video.price || '9.99'}`}
                    </span>
                    <span style={{ 
                      color: '#64748b',
                      fontSize: '0.875rem'
                    }}>
                      👁️ {video.views || 0} views
                    </span>
                  </div>
                  <Link href={`/watch/${video.id}`} style={{
                    display: 'block',
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #3b82c4, #60a5fa)',
                    color: 'white',
                    textAlign: 'center',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                  }}>
                    Watch Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Send Tip Button */}
      <button
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          padding: '1rem 2rem',
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          color: '#1a1a1a',
          border: 'none',
          borderRadius: '50px',
          fontSize: '1.1rem',
          fontWeight: '700',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(251, 191, 36, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.3s',
          zIndex: 100
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 15px 40px rgba(251, 191, 36, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(251, 191, 36, 0.4)';
        }}
        onClick={() => window.open('https://paypal.me/garlanjrobinson', '_blank')}
      >
        💰 Send Tip
      </button>
    </div>
  );
}

const filterButton = (active) => ({
  padding: '0.75rem 1.5rem',
  background: active 
    ? 'linear-gradient(135deg, #3b82c4, #60a5fa)' 
    : 'rgba(10, 22, 40, 0.5)',
  color: active ? 'white' : '#94a3b8',
  border: active 
    ? 'none' 
    : '1px solid rgba(59, 130, 196, 0.3)',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '1rem',
  transition: 'all 0.3s',
  boxShadow: active 
    ? '0 4px 15px rgba(59, 130, 196, 0.4)' 
    : 'none'
});

export async function getServerSideProps() {
  return { props: {} };
}