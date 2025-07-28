// pages/browse.js
import Layout from '../components/Layout';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function Browse() {
  const [activeTab, setActiveTab] = useState('live');
  
  // Sample streams data
  const streams = [
    { 
      id: 'mk1n9j8jte', 
      title: 'Epic Mountain Flight', 
      pilot: 'Sky Pilot Pro', 
      viewers: 1251, 
      isLive: true,
      thumbnail: '🏔️',
      duration: '45:23',
      category: 'Scenic'
    },
    { 
      id: '6c5352b797fdb73a57dc190c8b617066', 
      title: 'Sunset Beach Patrol', 
      pilot: 'Coastal Flyer', 
      viewers: 847, 
      isLive: true,
      thumbnail: '🌅',
      duration: '32:15',
      category: 'Coastal'
    },
    { 
      id: 'd48e1606f471fb349746c4b106357931', 
      title: 'City Skyline Tour', 
      pilot: 'Urban Eagle', 
      viewers: 0, 
      isLive: false,
      thumbnail: '🏙️',
      duration: '1:23:45',
      category: 'Urban'
    },
    { 
      id: 'demo4', 
      title: 'Forest Exploration', 
      pilot: 'Nature Drone', 
      viewers: 0, 
      isLive: false,
      thumbnail: '🌲',
      duration: '56:32',
      category: 'Nature'
    }
  ];

  const liveStreams = streams.filter(s => s.isLive);
  const recordedStreams = streams.filter(s => !s.isLive);

  return (
    <>
      <Head>
        <title>Browse Streams - BlueTubeTV</title>
      </Head>
      
      <div style={{
        background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
        minHeight: '100vh',
        color: 'white'
      }}>
        <Layout>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            {/* Header */}
            <h1 style={{
              fontSize: '48px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #818cf8, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Live Drone Streams
            </h1>
            <p style={{ 
              color: '#94a3b8', 
              fontSize: '20px',
              textAlign: 'center',
              marginBottom: '40px',
              maxWidth: '600px',
              margin: '0 auto 40px'
            }}>
              Watch breathtaking aerial footage from pilots worldwide
            </p>

            {/* Category Filters */}
            <div style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '30px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {['All', 'Scenic', 'Urban', 'Coastal', 'Nature', 'Racing'].map((category) => (
                <button
                  key={category}
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: '#94a3b8',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(59, 130, 246, 0.2)';
                    e.target.style.color = '#60a5fa';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                    e.target.style.color = '#94a3b8';
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Tab Navigation */}
            <div style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '40px',
              justifyContent: 'center',
              borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
              paddingBottom: '20px'
            }}>
              <button
                onClick={() => setActiveTab('all')}
                style={{
                  background: activeTab === 'all' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  color: activeTab === 'all' ? '#60a5fa' : '#94a3b8',
                  border: activeTab === 'all' ? '1px solid rgba(59, 130, 246, 0.3)' : 'none',
                  padding: '12px 30px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: activeTab === 'all' ? '600' : '400'
                }}
              >
                📺 All Content
              </button>
              <button
                onClick={() => setActiveTab('live')}
                style={{
                  background: activeTab === 'live' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                  color: activeTab === 'live' ? '#ef4444' : '#94a3b8',
                  border: activeTab === 'live' ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
                  padding: '12px 30px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: activeTab === 'live' ? '600' : '400'
                }}
              >
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: '#ef4444',
                  borderRadius: '50%',
                  animation: 'blink 1.4s infinite'
                }}></span>
                Live Streams ({liveStreams.length})
              </button>
              <button
                onClick={() => setActiveTab('recorded')}
                style={{
                  background: activeTab === 'recorded' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  color: activeTab === 'recorded' ? '#60a5fa' : '#94a3b8',
                  border: activeTab === 'recorded' ? '1px solid rgba(59, 130, 246, 0.3)' : 'none',
                  padding: '12px 30px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: activeTab === 'recorded' ? '600' : '400'
                }}
              >
                📹 Recorded ({recordedStreams.length})
              </button>
            </div>

            {/* Streams Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '30px'
            }}>
              {(activeTab === 'all' ? streams : 
                activeTab === 'live' ? liveStreams : 
                recordedStreams).map((stream) => (
                  <Link href={`/watch/${stream.id}`} style={{ textDecoration: 'none' }} key={stream.id}>
                    <div style={{
                      background: 'rgba(30, 41, 59, 0.6)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 20px 50px rgba(59, 130, 246, 0.3)';
                      e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                    }}>
                      {/* Thumbnail */}
                      <div style={{
                        aspectRatio: '16/9',
                        background: stream.isLive 
                          ? 'linear-gradient(135deg, #1e3a8a, #3b82f6)' 
                          : 'linear-gradient(135deg, #374151, #4b5563)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        fontSize: '80px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
                        }} />
                        {stream.thumbnail}
                        
                        {stream.isLive && (
                          <div style={{
                            position: 'absolute',
                            top: '15px',
                            left: '15px',
                            background: '#ef4444',
                            color: 'white',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            animation: 'pulse 2s infinite',
                            boxShadow: '0 2px 10px rgba(239, 68, 68, 0.5)'
                          }}>
                            <span style={{
                              width: '6px',
                              height: '6px',
                              background: 'white',
                              borderRadius: '50%',
                              animation: 'blink 1.4s infinite'
                            }}></span>
                            LIVE
                          </div>
                        )}

                        {/* Category Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '15px',
                          right: '15px',
                          background: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '15px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          {stream.category}
                        </div>
                        
                        {/* Duration/Viewers */}
                        <div style={{
                          position: 'absolute',
                          bottom: '15px',
                          right: '15px',
                          background: 'rgba(0, 0, 0, 0.8)',
                          color: 'white',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          {stream.isLive ? (
                            <>👁️ {stream.viewers.toLocaleString()}</>
                          ) : (
                            <>⏱️ {stream.duration}</>
                          )}
                        </div>
                      </div>
                      
                      {/* Stream Info */}
                      <div style={{ padding: '20px' }}>
                        <h3 style={{ 
                          fontSize: '20px', 
                          marginBottom: '10px',
                          color: 'white',
                          fontWeight: '600'
                        }}>
                          {stream.title}
                        </h3>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                              {stream.pilot}
                            </p>
                          </div>
                          <span style={{ 
                            color: stream.isLive ? '#ef4444' : '#60a5fa',
                            fontWeight: 'bold',
                            fontSize: '14px'
                          }}>
                            {stream.isLive ? 'Watch Live →' : 'Watch →'}
                          </span>
                        </div>
                      </div>
                    </div>
                </Link>
              ))}
              
              {/* Add More Content Card */}
              <div style={{
                background: 'rgba(30, 41, 59, 0.3)',
                backdropFilter: 'blur(10px)',
                border: '2px dashed rgba(59, 130, 246, 0.3)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '320px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => window.location.href = '/live'}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.6)';
                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.3)';
                e.currentTarget.style.transform = 'scale(1)';
              }}>
                <span style={{ fontSize: '60px', marginBottom: '20px' }}>➕</span>
                <h3 style={{ fontSize: '24px', marginBottom: '10px', fontWeight: '600' }}>
                  Start Streaming
                </h3>
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '0 20px' }}>
                  Share your drone adventures with the world
                </p>
              </div>
            </div>

            {/* Empty State */}
            {((activeTab === 'live' && liveStreams.length === 0) || 
              (activeTab === 'recorded' && recordedStreams.length === 0)) && (
              <div style={{
                textAlign: 'center',
                padding: '100px 20px',
                background: 'rgba(30, 41, 59, 0.3)',
                borderRadius: '20px',
                marginTop: '40px'
              }}>
                <span style={{ fontSize: '80px', display: 'block', marginBottom: '20px' }}>
                  {activeTab === 'live' ? '📡' : '📹'}
                </span>
                <h3 style={{ fontSize: '28px', marginBottom: '15px', color: 'white' }}>
                  No {activeTab} streams available
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '30px' }}>
                  Be the first to {activeTab === 'live' ? 'go live' : 'upload content'}!
                </p>
            <Link href="/live">
  <span
    className="hero-button"
    style={{
      background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
      color: 'white',
      padding: '16px 48px',
      borderRadius: '50px',
      fontSize: '18px',
      fontWeight: '600',
      textDecoration: 'none',
      display: 'inline-block',
      boxShadow: '0 10px 40px rgba(239, 68, 68, 0.4)'
    }}
  >
    🚁 Start Streaming Now
  </span>
</Link>

              </div>
            )}
          </div>
        </Layout>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </>
  );
}