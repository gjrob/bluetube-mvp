// components/QuickSetupCard.js - Inline Styles Version
import { useState } from 'react';

const QuickSetupCard = ({ streamKey, onClose }) => {
  const [copiedText, setCopiedText] = useState('');
  const rtmpUrl = 'rtmp://rtmp.livepeer.com/live';

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 50
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '500px',
        width: '100%',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'white',
            margin: 0
          }}>
            Quick Setup Reference
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px',
              lineHeight: 1,
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'white'}
            onMouseLeave={(e) => e.target.style.color = '#64748b'}
          >
            ✕
          </button>
        </div>

        {/* RTMP Settings */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{
            fontSize: '18px',
            color: '#60a5fa',
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            RTMP Settings
          </h3>
          
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(59, 130, 246, 0.1)'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{
                fontSize: '14px',
                color: '#94a3b8',
                display: 'block',
                marginBottom: '5px'
              }}>
                Server URL:
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <code style={{
                  flex: 1,
                  background: 'rgba(30, 41, 59, 0.5)',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: 'white',
                  fontFamily: 'monospace',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  {rtmpUrl}
                </code>
                <button
                  onClick={() => copyToClipboard(rtmpUrl, 'server')}
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#60a5fa',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(59, 130, 246, 0.3)';
                    e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(59, 130, 246, 0.2)';
                    e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                  }}
                >
                  📋 Copy
                </button>
              </div>
              {copiedText === 'server' && (
                <p style={{
                  color: '#10b981',
                  fontSize: '12px',
                  marginTop: '5px',
                  margin: '5px 0 0 0'
                }}>
                  ✓ Copied!
                </p>
              )}
            </div>
            
            <div>
              <label style={{
                fontSize: '14px',
                color: '#94a3b8',
                display: 'block',
                marginBottom: '5px'
              }}>
                Stream Key:
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <code style={{
                  flex: 1,
                  background: 'rgba(30, 41, 59, 0.5)',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: 'white',
                  fontFamily: 'monospace',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  {streamKey.slice(0, 20)}...
                </code>
                <button
                  onClick={() => copyToClipboard(streamKey, 'key')}
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#60a5fa',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(59, 130, 246, 0.3)';
                    e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(59, 130, 246, 0.2)';
                    e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                  }}
                >
                  📋 Copy
                </button>
              </div>
              {copiedText === 'key' && (
                <p style={{
                  color: '#10b981',
                  fontSize: '12px',
                  marginTop: '5px',
                  margin: '5px 0 0 0'
                }}>
                  ✓ Copied!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recommended Settings */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{
            fontSize: '18px',
            color: '#60a5fa',
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            Recommended Settings
          </h3>
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(59, 130, 246, 0.1)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '15px',
              fontSize: '14px'
            }}>
              <div>
                <span style={{ color: '#94a3b8' }}>Resolution:</span>
                <span style={{ color: 'white', marginLeft: '10px' }}>1920x1080</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Framerate:</span>
                <span style={{ color: 'white', marginLeft: '10px' }}>30 fps</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Bitrate:</span>
                <span style={{ color: 'white', marginLeft: '10px' }}>4000-6000 kbps</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Keyframe:</span>
                <span style={{ color: 'white', marginLeft: '10px' }}>2 seconds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{
          display: 'flex',
          gap: '15px'
        }}>
          <a
            href="/pilot-setup"
            target="_blank"
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: '600',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'transform 0.3s ease',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Full Setup Guide →
          </a>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: 'rgba(100, 116, 139, 0.2)',
              color: 'white',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: '600',
              border: '1px solid rgba(100, 116, 139, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(100, 116, 139, 0.3)';
              e.target.style.borderColor = 'rgba(100, 116, 139, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(100, 116, 139, 0.2)';
              e.target.style.borderColor = 'rgba(100, 116, 139, 0.3)';
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickSetupCard;