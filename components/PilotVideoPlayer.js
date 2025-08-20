// =============================================
// PILOT VIDEO PLAYER COMPONENT
// =============================================
// Create: components/PilotVideoPlayer.js

import { useState, useEffect, useRef } from 'react';

export default function PilotVideoPlayer({ streamKey, isLive = false }) {
  const [viewers, setViewers] = useState(0);
  const [tips, setTips] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const videoRef = useRef(null);

  const colors = {
    primary: '#0080FF',
    secondary: '#00B4D8',
    accent: '#0077BE',
    dark: '#003459'
  };

  useEffect(() => {
    // Simulate live stats updates
    const interval = setInterval(() => {
      setViewers(prev => Math.max(0, prev + Math.floor(Math.random() * 10 - 3)));
      if (Math.random() > 0.7) {
        const tipAmount = [5, 10, 20, 25, 50][Math.floor(Math.random() * 5)];
        setTips(prev => prev + tipAmount);
        
        // Add tip message to chat
        setChatMessages(prev => [...prev.slice(-10), {
          id: Date.now(),
          user: `Viewer${Math.floor(Math.random() * 1000)}`,
          message: `💰 Sent $${tipAmount} tip!`,
          type: 'tip',
          timestamp: new Date().toLocaleTimeString()
        }]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev.slice(-10), {
        id: Date.now(),
        user: 'You',
        message: newMessage,
        type: 'message',
        timestamp: new Date().toLocaleTimeString()
      }]);
      setNewMessage('');
    }
  };

  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '20px', 
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        padding: '20px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>🚁 Pilot Control Center</h2>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{viewers}</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Viewers</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>${tips}</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Tips</div>
            </div>
            <div style={{
              padding: '8px 16px',
              background: isLive ? '#00C851' : '#ff4444',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {isLive ? '🔴 LIVE' : '⭕ OFFLINE'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', height: '600px' }}>
        {/* Video Area */}
        <div style={{ position: 'relative', background: '#000' }}>
          {isLive ? (
            <video
              ref={videoRef}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              controls
              autoPlay
              muted
            >
              <source src={`https://stream.mux.com/${streamKey}.m3u8`} type="application/x-mpegURL" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontSize: '24px'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>📹</div>
              <div>Ready to go live!</div>
              <div style={{ fontSize: '16px', opacity: 0.7, marginTop: '10px' }}>
                Start streaming from OBS or DJI Fly App
              </div>
            </div>
          )}

          {/* Overlay Controls */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            display: 'flex',
            gap: '10px'
          }}>
            <button style={{
              padding: '10px 20px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              📊 Analytics
            </button>
            <button style={{
              padding: '10px 20px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Chat/Controls Panel */}
        <div style={{ 
          background: '#f8f9fa',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #ddd'
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '15px',
            background: colors.dark,
            color: 'white',
            fontWeight: 'bold'
          }}>
            💬 Live Chat
          </div>

          {/* Chat Messages */}
          <div style={{
            flex: 1,
            padding: '10px',
            overflowY: 'auto',
            fontSize: '14px'
          }}>
            {chatMessages.map(msg => (
              <div key={msg.id} style={{
                marginBottom: '10px',
                padding: '8px',
                background: msg.type === 'tip' ? '#fff3cd' : 'white',
                borderRadius: '8px',
                border: msg.type === 'tip' ? '1px solid #ffc107' : '1px solid #ddd'
              }}>
                <div style={{ fontWeight: 'bold', color: colors.primary }}>
                  {msg.user} <span style={{ fontSize: '12px', color: '#666' }}>{msg.timestamp}</span>
                </div>
                <div>{msg.message}</div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div style={{ padding: '15px', borderTop: '1px solid #ddd' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Message viewers..."
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  padding: '8px 16px',
                  background: colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================
// VIEWER VIDEO PLAYER COMPONENT
// =============================================
// Create: components/ViewerVideoPlayer.js

export function ViewerVideoPlayer({ streamUrl, streamTitle, pilotName, viewers = 0 }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [selectedTip, setSelectedTip] = useState(5);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'DroneExpert', message: 'Amazing aerial shot! 🚁', timestamp: '2:34 PM' },
    { id: 2, user: 'SkyWatcher', message: 'This location is stunning!', timestamp: '2:35 PM' },
    { id: 3, user: 'AerialFan', message: 'What drone are you using?', timestamp: '2:36 PM' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const colors = {
    primary: '#0080FF',
    secondary: '#00B4D8',
    accent: '#0077BE',
    dark: '#003459'
  };

  const sendTip = async (amount) => {
    alert(`💰 Sent $${amount} tip to ${pilotName}!`);
    setShowTipModal(false);
    // Add tip to chat
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      user: 'You',
      message: `💰 Sent $${amount} tip!`,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        user: 'You',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setNewMessage('');
    }
  };

  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '20px', 
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Stream Info Header */}
      <div style={{
        background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        padding: '20px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, marginBottom: '5px' }}>{streamTitle}</h2>
            <p style={{ margin: 0, opacity: 0.9 }}>by {pilotName} • {viewers} viewers</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              style={{
                padding: '10px 20px',
                background: isFollowing ? '#00C851' : 'transparent',
                color: 'white',
                border: '2px solid white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {isFollowing ? '✅ Following' : '➕ Follow'}
            </button>
            <button
              onClick={() => setShowTipModal(true)}
              style={{
                padding: '10px 20px',
                background: '#FFD700',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              💰 Tip Pilot
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', height: '600px' }}>
        {/* Video Player */}
        <div style={{ position: 'relative', background: '#000' }}>
          <video
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            controls
            autoPlay
            poster="/api/placeholder/800/600"
          >
            <source src={streamUrl} type="application/x-mpegURL" />
            Your browser does not support the video tag.
          </video>

          {/* Video Overlay */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,0,0,0.8)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            🔴 LIVE
          </div>
        </div>

        {/* Chat Panel */}
        <div style={{ 
          background: '#f8f9fa',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #ddd'
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '15px',
            background: colors.dark,
            color: 'white',
            fontWeight: 'bold'
          }}>
            💬 Live Chat ({chatMessages.length})
          </div>

          {/* Chat Messages */}
          <div style={{
            flex: 1,
            padding: '10px',
            overflowY: 'auto',
            fontSize: '14px'
          }}>
            {chatMessages.map(msg => (
              <div key={msg.id} style={{
                marginBottom: '10px',
                padding: '8px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}>
                <div style={{ fontWeight: 'bold', color: colors.primary }}>
                  {msg.user} <span style={{ fontSize: '12px', color: '#666' }}>{msg.timestamp}</span>
                </div>
                <div>{msg.message}</div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div style={{ padding: '15px', borderTop: '1px solid #ddd' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Say something..."
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  padding: '8px 16px',
                  background: colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tip Modal */}
      {showTipModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '20px',
            textAlign: 'center',
            minWidth: '400px'
          }}>
            <h3 style={{ marginBottom: '20px', color: colors.dark }}>💰 Tip {pilotName}</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
              {[5, 10, 20, 50, 100].map(amount => (
                <button
                  key={amount}
                  onClick={() => setSelectedTip(amount)}
                  style={{
                    padding: '15px 20px',
                    background: selectedTip === amount ? colors.primary : '#f0f0f0',
                    color: selectedTip === amount ? 'white' : colors.dark,
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px'
                  }}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => sendTip(selectedTip)}
                style={{
                  padding: '15px 30px',
                  background: colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                Send ${selectedTip}
              </button>
              <button
                onClick={() => setShowTipModal(false)}
                style={{
                  padding: '15px 30px',
                  background: '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}