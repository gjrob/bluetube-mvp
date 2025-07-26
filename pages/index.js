// pages/live.js - Fixed version
import { useState, useEffect } from 'react';

export default function Live() {
  const [tipAmount, setTipAmount] = useState('');
  const [showTipModal, setShowTipModal] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Add this navigation component to reuse
  const Navigation = () => (
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
          fontWeight: 'bold',
          borderBottom: '2px solid #48cae4'
        }}>
          Live
        </a>
        
        <a href="/dashboard" style={{
          color: '#caf0f8',
          textDecoration: 'none',
          transition: 'all 0.3s'
        }}>
          Dashboard
        </a>
      </div>

      <button
        onClick={() => window.location.href = '/pilot-setup'}
        style={{
          background: 'linear-gradient(135deg, #48cae4, #90e0ef)',
          color: '#03045e',
          border: 'none',
          padding: '10px 25px',
          borderRadius: '10px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'transform 0.3s'
        }}
      >
        Start Streaming
      </button>
    </nav>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #03045e 0%, #023e8a 20%, #0077b6 40%, #0096c7 60%, #00b4d8 80%, #48cae4 100%)',
    }}>
      <Navigation />

      {/* Main Content */}
      <div style={{ padding: '20px' }}>
        {/* Stream Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
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
            
            <div style={{ display: 'flex', gap: '15px' }}>
              {/* Share Button - Ocean Blue */}
   <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              color: '#caf0f8',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '15px 30px',
              borderRadius: '15px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            📤 Share BlueTubeTV
          </button>
          
          {/* Share Dropdown */}
          {showShareMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
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
            position: 'relative',
            border: '2px solid rgba(72, 202, 228, 0.3)'
          }}>
            Stream has not started yet.
            
            {/* Altitude Overlay */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: 'rgba(0, 119, 182, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '10px',
              padding: '10px 20px',
              border: '1px solid rgba(72, 202, 228, 0.5)'
            }}>
              <span style={{ color: '#90e0ef', fontWeight: 'bold' }}>⬆ 285 ft</span>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '2px solid rgba(72, 202, 228, 0.3)'
        }}>
          <h3 style={{ color: '#03045e' }}>Live Chat 💬</h3>
          <div style={{
            background: 'rgba(0, 119, 182, 0.05)',
            borderRadius: '10px',
            padding: '15px',
            minHeight: '200px',
            border: '1px solid rgba(0, 119, 182, 0.1)'
          }}>
            <p style={{ color: '#0077b6' }}>
              <strong>System:</strong> Welcome to the stream!
            </p>
          </div>
        </div>
      </div>

      {/* Tip Modal - with CLOSE button */}
      {showTipModal && (
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
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            position: 'relative'
          }}>
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowTipModal(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ✕
            </button>
            
            <h2 style={{ color: '#03045e', marginBottom: '20px' }}>
              💰 Send a Tip to DroneKing
            </h2>
            
            {/* Tip amounts */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {[5, 10, 20, 50].map(amount => (
                <button
                  key={amount}
                  onClick={() => setTipAmount(amount.toString())}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: tipAmount === amount.toString() ? '2px solid #0077b6' : '1px solid #ddd',
                    borderRadius: '10px',
                    background: tipAmount === amount.toString() ? '#e6f4ff' : 'white',
                    cursor: 'pointer'
                  }}
                >
                  ${amount}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => {
                alert('Coming soon! Payment integration in progress.');
                setShowTipModal(false);
              }}
              style={{
                width: '100%',
                padding: '15px',
                background: 'linear-gradient(135deg, #48cae4, #90e0ef)',
                color: '#03045e',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              Send ${tipAmount || '0'} Tip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}