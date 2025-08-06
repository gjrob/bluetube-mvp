// pages/index.js - Professional styled version
import Layout from '../components/Layout';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const featuredStreams = [
    { id: '6c5352b797fdb73a57dc190c8b617066', title: 'Test Stream 1', status: 'live' },
    { id: 'd48e1606f471fb349746c4b106357931', title: 'Test Stream 2', status: 'offline' }
  ];

  return (
    <>
      <Head>
        <title>BlueTubeTV - Live Drone Streaming Platform</title>
        <meta name="description" content="Watch live drone flights and amazing aerial footage from pilots worldwide" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚁</text></svg>" />
      </Head>

      <div style={{
        background: 'linear-gradient(135deg, #FFEC8B 0%, #FFD700 25%, #FFC107 50%, #FFB300 75%, #FFA000 100%)',
        minHeight: '100vh',
        color: '#212529'
      }}>
        <Layout>
          {/* Hero Section */}
          <section style={{ 
            padding: '80px 20px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {/* Logo Circle */}
              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 40px',
                transition: 'all 0.3s ease'
              }}>
                <span style={{ fontSize: '80px' }}>🚁</span>
              </div>

              <h1 style={{
                fontSize:'clamp(2rem, 5vw, 4rem)',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #818cf8 0%, #60a5fa 25%, #66d9ef 50%, #a78bfa 75%, #818cf8 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradient-shift 5s ease infinite',
                marginBottom: '20px',
                padding: '0 20px'
              }}>
                BlueTubeTV
              </h1>
              
              <p style={{ 
                fontSize:'clamp(16px, 4vw, 24px)', 
                color: '#94a3b8', 
                marginBottom: '60px',
                maxWidth: '700px',
                margin: '0 auto 60px',
                padding: '0 20px'
              }}>
                The world's first live drone streaming platform. 
                Stream your flights, get tipped, and join the community.
              </p>
              
              <div style={{ 
                display: 'flex', 
                gap: '20px', 
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                    <Link 
                     href="/browse"
                      className="hero-button"
                  >
                    🎬 Watch Live Streams
                </Link>
                <Link href="/live"><span style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                    color: 'white',
                    padding: '16px 48px',
                     width: '90%',
                    borderRadius: '50px',
                    fontSize: '20px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 10px 40px rgba(239, 68, 68, 0.4)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}>
                    🚁 Start Streaming
                  </span></Link>
              </div>
            </div>
          </section>

          {/* Featured Streams */}
          <section style={{ padding: '60px 20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h2 style={{
                fontSize: '48px',
                fontWeight: 'bold',
                marginBottom: '40px',
                background: 'linear-gradient(135deg, #818cf8, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Featured Streams
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '30px'
              }}>
                {featuredStreams.map((stream) => (
                  <div key={stream.id} style={{
                    background: 'rgba(30, 41, 59, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{
                      aspectRatio: '16/9',
                      background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      <span style={{ fontSize: '60px' }}>🚁</span>
                      {stream.status === 'live' && (
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          background: '#ef4444',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          animation: 'pulse 2s infinite'
                        }}>
                          <span style={{
                            width: '8px',
                            height: '8px',
                            background: 'white',
                            borderRadius: '50%',
                            animation: 'blink 1.4s infinite'
                          }}></span>
                          LIVE
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '20px' }}>
                      <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>{stream.title}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: stream.status === 'live' ? '#ef4444' : '#94a3b8' }}>
                          {stream.status === 'live' ? '🔴 LIVE NOW' : 'Offline'}
                        </span>
                        <Link href={`/watch/${stream.id}`}>
                          <span style={{
                            color: '#60a5fa',
                            textDecoration: 'none',
                            fontWeight: 'bold'
                          }}>
                            Watch →
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Browse More Card */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(255, 193, 7, 0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 193, 7, 0.2)';
                }}>
                <Link 
                    href="/browse"
                     className="hero-button">
                        <span style={{ fontSize: '60px' }}>📹</span>
                  
                      <div style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>See All Content</h3>
                        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                          Browse all live streams and recorded videos
                        </p>
                      </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section style={{ padding: '60px 20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{
                fontSize: '48px',
                fontWeight: 'bold',
                marginBottom: '20px',
                background: 'linear-gradient(135deg, #818cf8, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Start Streaming Today
              </h2>
              <p style={{ 
                color: '#94a3b8', 
                marginBottom: '60px',
                maxWidth: '700px',
                margin: '0 auto 60px',
                fontSize: '20px'
              }}>
                Share your drone adventures with the world. Stream live or upload your recorded flights.
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '30px',
                maxWidth: '900px',
                margin: '0 auto'
              }}>
                {[
                  {
                    icon: '🎥',
                    title: 'Stream Live',
                    desc: 'Use OBS to stream your drone footage in real-time',
                    link: '/live',
                    linkText: 'Get Started →'
                  },
                  {
                    icon: '📤',
                    title: 'Upload Videos',
                    desc: 'Share your best recorded flights',
                    link: null,
                    linkText: 'Coming Soon'
                  },
                  {
                    icon: '💰',
                    title: 'Get Tips',
                    desc: 'Viewers can support you via PayPal or Buy Me a Coffee',
                    link: '/dashboard',
                    linkText: 'Learn More →'
                  }
                ].map((item, index) => (
                  <div key={index} style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '20px',
                    padding: '30px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 25px 70px rgba(0, 0, 0, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3)';
                  }}>
                    <span style={{ fontSize: '48px', display: 'block', marginBottom: '20px' }}>
                      {item.icon}
                    </span>
                    <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>{item.title}</h3>
                    <p style={{ color: '#94a3b8', marginBottom: '20px' }}>{item.desc}</p>
                   {item.link ? (
  <Link href={item.link}>
    {item.linkText}
  </Link>
) : (
  <span style={{ color: '#6b7280' }}>{item.linkText}</span>
)}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Layout>
      </div>

      {/* Add keyframes */}
      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
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