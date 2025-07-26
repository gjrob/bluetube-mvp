// pages/live.js - Fixed version
import { useState, useEffect } from 'react';
import Footer from '../components/Footer';

export default function Live() {
  const [tipAmount, setTipAmount] = useState('');
  const [showTipModal, setShowTipModal] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #03045e 0%, #023e8a 20%, #0077b6 40%, #0096c7 60%, #00b4d8 80%, #48cae4 100%)',
    }}>
      {/* Navigation */}
      <nav style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <a href="/" style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#caf0f8',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            🚁 BlueTubeTV
          </a>
          
          <a href="/live" style={{
            color: '#caf0f8',
            textDecoration: 'none',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.borderBottom = '2px solid #48cae4'}
          onMouseLeave={(e) => e.target.style.borderBottom = 'none'}
          >
            Live
          </a>
          
          <a href="/dashboard" style={{
            color: '#caf0f8',
            textDecoration: 'none',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.borderBottom = '2px solid #48cae4'}
          onMouseLeave={(e) => e.target.style.borderBottom = 'none'}
          >
            Dashboard
          </a>
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {/* Share Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: '#caf0f8',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              📤 Share
            </button>
            
            {/* Share Dropdown */}
            {showShareMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '10px',
                background: 'rgba(2, 62, 138, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '15px',
                padding: '10px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                minWidth: '200px',
                zIndex: 10
              }}>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out BlueTubeTV - Live drone streaming platform! 🚁')}&url=${encodeURIComponent('https://bluetubetv.live')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    padding: '10px 15px',
                    color: '#caf0f8',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  🐦 Twitter
                </a>
                
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://bluetubetv.live')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    padding: '10px 15px',
                    color: '#caf0f8',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  📘 Facebook
                </a>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('https://bluetubetv.live');
                    alert('Link copied to clipboard!');
                    setShowShareMenu(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 15px',
                    color: '#caf0f8',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  🔗 Copy Link
                </button>
              </div>
            )}
          </div>

          <a href="/pilot-setup" style={{
            background: 'linear-gradient(135deg, #48cae4, #90e0ef)',
            color: '#03045e',
            textDecoration: 'none',
            padding: '10px 25px',
            borderRadius: '10px',
            fontWeight: 'bold',
            transition: 'transform 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            🚁 Start Streaming
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ 
        textAlign: 'center', 
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          color: '#caf0f8',
          marginBottom: '20px',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}>
          🚁 BlueTubeTV
        </h1>
        
        <p style={{
          fontSize: '1.5rem',
          color: '#90e0ef',
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px auto'
        }}>
          The world's first live drone streaming platform. Stream your flights, get tipped, and join the community.
        </p>

        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '60px'
        }}>
          <a href="/live" style={{
            background: 'linear-gradient(135deg, #48cae4, #90e0ef)',
            color: '#03045e',
            textDecoration: 'none',
            padding: '15px 30px',
            borderRadius: '15px',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            transition: 'transform 0.3s',
            boxShadow: '0 8px 25px rgba(72, 202, 228, 0.4)'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            🎥 Watch Live Streams
          </a>
          
          <a href="/pilot-setup" style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            color: '#caf0f8',
            textDecoration: 'none',
            padding: '15px 30px',
            borderRadius: '15px',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'scale(1)';
          }}
          >
            🚁 Start Streaming
          </a>
        </div>

        {/* Features Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginTop: '60px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ color: '#caf0f8', fontSize: '1.5rem', marginBottom: '15px' }}>
              💰 Earn While Flying
            </h3>
            <p style={{ color: '#90e0ef', lineHeight: '1.6' }}>
              Get tipped by viewers who love your content. Keep 80% of all tips received during your streams.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ color: '#caf0f8', fontSize: '1.5rem', marginBottom: '15px' }}>
              🌍 Global Community
            </h3>
            <p style={{ color: '#90e0ef', lineHeight: '1.6' }}>
              Connect with drone pilots and enthusiasts from around the world. Share amazing aerial views.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ color: '#caf0f8', fontSize: '1.5rem', marginBottom: '15px' }}>
              ⚡ Easy Setup
            </h3>
            <p style={{ color: '#90e0ef', lineHeight: '1.6' }}>
              Start streaming in under 2 minutes. Works with all major drone brands and models.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '40px',
          marginTop: '60px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{ color: '#caf0f8', marginBottom: '30px' }}>Join the Movement</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', color: '#48cae4', fontWeight: 'bold' }}>1,247+</div>
              <div style={{ color: '#90e0ef' }}>Active Pilots</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', color: '#48cae4', fontWeight: 'bold' }}>25,000+</div>
              <div style={{ color: '#90e0ef' }}>Hours Streamed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', color: '#48cae4', fontWeight: 'bold' }}>$50K+</div>
              <div style={{ color: '#90e0ef' }}>Tips Earned</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}