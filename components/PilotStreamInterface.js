// components/PilotStreamInterface.js
import { useState, useEffect } from 'react';

export default function PilotStreamInterface({ streamKey, isLive }) {
  const [viewerCount, setViewerCount] = useState(0);
  const [streamDuration, setStreamDuration] = useState('0:00');
  const [totalTips, setTotalTips] = useState(0);

  useEffect(() => {
    if (isLive) {
      // Update viewer count every 5 seconds
      const interval = setInterval(() => {
        setViewerCount(prev => Math.floor(Math.random() * 50) + 150);
      }, 5000);

      // Update stream duration
      const startTime = Date.now();
      const durationInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        setStreamDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);

      return () => {
        clearInterval(interval);
        clearInterval(durationInterval);
      };
    }
  }, [isLive]);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
      height: '500px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      borderRadius: '20px',
      overflow: 'hidden'
    }}>
      {/* Live Status Bar */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            background: '#ef4444',
            color: 'white',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
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
          <span style={{ color: 'white', fontSize: '16px' }}>
            {streamDuration}
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '20px',
          color: 'white'
        }}>
          <div>
            <span style={{ opacity: 0.7 }}>Viewers: </span>
            <strong>{viewerCount}</strong>
          </div>
          <div>
            <span style={{ opacity: 0.7 }}>Tips: </span>
            <strong style={{ color: '#10b981' }}>${totalTips}</strong>
          </div>
        </div>
      </div>

      {/* Main Pilot Interface */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {!isLive ? (
          // Pre-stream setup
          <div style={{
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 30px'
            }}>
              <span style={{ fontSize: '60px' }}>🚁</span>
            </div>
            <h2 style={{ marginBottom: '10px' }}>Ready to Stream!</h2>
            <p style={{ opacity: 0.8 }}>Start broadcasting to see your pilot dashboard</p>
          </div>
        ) : (
          // Live streaming interface
          <div style={{
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            padding: '20px'
          }}>
            {/* Left side - Stream Health */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '15px',
              padding: '20px',
              color: 'white'
            }}>
              <h3 style={{ marginBottom: '20px' }}>Stream Health</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span>Bitrate</span>
                  <span style={{ color: '#10b981' }}>4.5 Mbps</span>
                </div>
                <div style={{
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '85%',
                    height: '100%',
                    background: '#10b981',
                    borderRadius: '4px'
                  }}></div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span>Frame Rate</span>
                  <span style={{ color: '#10b981' }}>30 FPS</span>
                </div>
                <div style={{
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: '#10b981',
                    borderRadius: '4px'
                  }}></div>
                </div>
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span>Connection</span>
                  <span style={{ color: '#10b981' }}>Excellent</span>
                </div>
                <div style={{
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '95%',
                    height: '100%',
                    background: '#10b981',
                    borderRadius: '4px'
                  }}></div>
                </div>
              </div>
            </div>

            {/* Right side - Recent Activity */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '15px',
              padding: '20px',
              color: 'white'
            }}>
              <h3 style={{ marginBottom: '20px' }}>Recent Activity</h3>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                fontSize: '14px'
              }}>
                <div style={{
                  padding: '10px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  💰 <strong>John Doe</strong> sent $10 tip!
                </div>
                <div style={{
                  padding: '10px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}>
                  👋 <strong>Sarah</strong> joined the stream
                </div>
                <div style={{
                  padding: '10px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(139, 92, 246, 0.3)'
                }}>
                  🎯 Reached <strong>200 viewers</strong>!
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'center',
        gap: '15px'
      }}>
        <button style={{
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          padding: '10px 20px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontWeight: '600'
        }}>
          🎙️ Mute Audio
        </button>
        
        <button style={{
          background: 'rgba(59, 130, 246, 0.1)',
          color: '#3b82f6',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          padding: '10px 20px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontWeight: '600'
        }}>
          📊 Analytics
        </button>
        
        <button style={{
          background: 'rgba(139, 92, 246, 0.1)',
          color: '#8b5cf6',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          padding: '10px 20px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontWeight: '600'
        }}>
          ⚙️ Settings
        </button>
      </div>
    </div>
  );
}