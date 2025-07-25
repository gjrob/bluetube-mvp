// pages/live.js
import { useState, useEffect } from 'react';

export default function Live() {
  const [tipAmount, setTipAmount] = useState('');
  const [showTipModal, setShowTipModal] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const shareUrl = 'https://bluetubetv.live/live';
  const shareText = "Check out this amazing drone stream on BlueTubeTV! 🚁";

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #023e8a 0%, #0077b6 25%, #0096c7 50%, #00b4d8 75%, #48cae4 100%)',
    }}>
      {/* Navigation Bar - Darker glass */}
      <nav style={{
        background: 'rgba(2, 62, 138, 0.2)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 223, 0, 0.3)',
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
            background: 'linear-gradient(to right, #90e0ef, #caf0f8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none'
          }}>
            🚁 BlueTubeTV
          </a>
          
          <a href="/live" style={{
            color: '#caf0f8',
            textDecoration: 'none',
            fontWeight: 'bold',
            borderBottom: '2px solid #ffdf00'
          }}>
            Live
          </a>
          
          <a href="/dashboard" style={{
            color: '#caf0f8',
            textDecoration: 'none',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.borderBottom = '2px solid #ffdf00'}
          onMouseLeave={(e) => e.target.style.borderBottom = 'none'}
          >
            Dashboard
          </a>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button
            onClick={() => window.location.href = '/pilot-setup'}
            style={{
              background: 'linear-gradient(135deg, #ffdf00, #ffb703)',
              color: '#023e8a',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Start Streaming
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ padding: '20px' }}>
        {/* Stream Section */}
        <div style={{
          background: 'rgba(2, 62, 138, 0.4)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 223, 0, 0.2)'
        }}>
          {/* Stream Info Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div>
              <h2 style={{ color: '#caf0f8', margin: 0 }}>DroneKing's Stream</h2>
              <p style={{ color: '#90e0ef', margin: '5px 0' }}>
                🔴 LIVE • 1,247 viewers • Flying over Miami Beach
              </p>
            </div>
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              {/* Share Button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: '#caf0f8',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
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
                    border: '1px solid rgba(255, 223, 0, 0.2)',
                    minWidth: '200px',
                    zIndex: 10
                  }}>
                    
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
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
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
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
                        navigator.clipboard.writeText(shareUrl);
                        setShowShareMenu(false);
                        alert('Link copied!');
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
              
              {/* Tip Button */}
              <button
                onClick={() => setShowTipModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #ffdf00, #ffb703)',
                  color: '#023e8a',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  boxShadow: '0 5px 15px rgba(255, 223, 0, 0.4)',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 223, 0, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(255, 223, 0, 0.4)';
                }}
              >
                💰 Send Tip
              </button>
            </div>
          </div>

          {/* Stream Player */}
          <div style={{
            background: '#000',
            borderRadius: '15px',
            aspectRatio: '16/9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.5rem',
            position: 'relative'
          }}>
            Stream has not started yet.
            
            {/* Live Stats Overlay */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: 'rgba(2, 62, 138, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '10px',
              padding: '10px 20px',
              border: '1px solid rgba(255, 223, 0, 0.3)'
            }}>
              <span style={{ color: '#ffdf00' }}>⬆ 285 ft</span>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '2px solid rgba(255, 223, 0, 0.3)'
        }}>
          <h3 style={{ color: '#023e8a' }}>Live Chat 💬</h3>
          <div style={{
            background: 'rgba(2, 62, 138, 0.05)',
            borderRadius: '10px',
            padding: '15px',
            minHeight: '200px'
          }}>
            <p style={{ color: '#023e8a' }}>
              <strong>System:</strong> Welcome to the stream!
            </p>
          </div>
        </div>
      </div>

      {/* Keep existing Tip Modal code... */}
      {showTipModal && (
        // ... existing tip modal code
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          {/* ... rest of modal */}
        </div>
      )}
    </div>
  );
}