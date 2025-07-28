// pages/pilot-setup.js - Independent Setup with Inline Styles
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function PilotSetup() {
  const [streamKey, setStreamKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const generateStreamKey = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-stream-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setStreamKey(data);
    } catch (error) {
      alert('Failed to generate stream key');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #03045e 0%, #023e8a 20%, #0077b6 40%, #0096c7 60%, #00b4d8 80%, #48cae4 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <button 
          onClick={() => router.back()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px',
            color: '#90e0ef',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.color = '#caf0f8'}
          onMouseLeave={(e) => e.target.style.color = '#90e0ef'}
        >
          ← Back to Stream
        </button>

        {/* Drone Selection */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: '32px', 
            textAlign: 'center' 
          }}>
            🚁 Start Streaming in 2 Minutes
          </h1>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '16px', 
            marginBottom: '32px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {['Mavic 3', 'Air 2S', 'Mini 3 Pro', 'DJI FPV', 'Phantom 4', 'Inspire 2'].map(drone => (
              <div key={drone} style={{
                border: '2px solid #48cae4',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
                background: 'rgba(72, 202, 228, 0.1)'
              }}>
                <span style={{ color: '#48cae4' }}>✓</span> {drone}
              </div>
            ))}
          </div>
        </div>

        {/* Independent Setup */}
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              📱 Your Independent Streaming Setup
            </h2>

            {!streamKey ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <p style={{ fontSize: '1.25rem', marginBottom: '24px' }}>
                  Generate your personal stream key
                </p>
                <button
                  onClick={generateStreamKey}
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #48cae4, #0096c7)',
                    color: '#03045e',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    transform: loading ? 'scale(0.95)' : 'scale(1)',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Generating...' : 'Generate Stream Key'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Stream Key */}
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '12px' }}>
                    🔑 Your Stream Key:
                  </h3>
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    padding: '16px',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    color: '#48cae4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>{streamKey.streamKey}</span>
                    <button 
                      onClick={() => copyToClipboard(streamKey.streamKey)}
                      style={{
                        background: '#0077b6',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* OBS Setup */}
                <div style={{
                  background: 'rgba(255, 204, 0, 0.1)',
                  border: '1px solid rgba(255, 204, 0, 0.3)',
                  borderRadius: '8px',
                  padding: '24px'
                }}>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    marginBottom: '12px',
                    color: '#ffcc00'
                  }}>
                    🎬 OBS Studio Setup:
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Server:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <code style={{
                          background: 'rgba(0, 0, 0, 0.5)',
                          padding: '4px 8px',
                          borderRadius: '4px'
                        }}>
                          {streamKey.instructions.obs.server}
                        </code>
                        <button 
                          onClick={() => copyToClipboard(streamKey.instructions.obs.server)}
                          style={{
                            background: '#0077b6',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Stream Key:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <code style={{
                          background: 'rgba(0, 0, 0, 0.5)',
                          padding: '4px 8px',
                          borderRadius: '4px'
                        }}>
                          {streamKey.streamKey}
                        </code>
                        <button 
                          onClick={() => copyToClipboard(streamKey.streamKey)}
                          style={{
                            background: '#0077b6',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DJI Fly App Setup */}
                <div style={{
                  background: 'rgba(0, 119, 182, 0.1)',
                  border: '1px solid rgba(0, 119, 182, 0.3)',
                  borderRadius: '8px',
                  padding: '24px'
                }}>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    marginBottom: '12px',
                    color: '#48cae4'
                  }}>
                    🎮 DJI Fly App Setup:
                  </h3>
                  <ol style={{ fontSize: '0.875rem', lineHeight: '1.8' }}>
                    <li>1. Open DJI Fly → Settings → Live Streaming</li>
                    <li>2. Select "RTMP Custom"</li>
                    <li style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                      3. Enter URL: 
                      <code style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        marginLeft: '8px'
                      }}>
                        {streamKey.instructions.obs.server}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(streamKey.instructions.obs.server)}
                        style={{
                          background: '#0077b6',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          marginLeft: '8px'
                        }}
                      >
                        Copy
                      </button>
                    </li>
                    <li>4. Paste your stream key and tap "Start Live"</li>
                    <li>5. You're LIVE! 🎉</li>
                  </ol>
                </div>

                {/* Mobile Apps */}
                <div style={{
                  background: 'rgba(72, 202, 228, 0.1)',
                  border: '1px solid rgba(72, 202, 228, 0.3)',
                  borderRadius: '8px',
                  padding: '24px'
                }}>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    marginBottom: '12px',
                    color: '#48cae4'
                  }}>
                    📱 Mobile Streaming Apps:
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '16px',
                    fontSize: '0.875rem'
                  }}>
                    <div>
                      <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>iOS:</h4>
                      <ul style={{ listStyle: 'disc', paddingLeft: '20px', lineHeight: '1.6' }}>
                        <li>Larix Broadcaster (Free)</li>
                        <li>Broadcast Me</li>
                        <li>Live Stream Studio</li>
                      </ul>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Android:</h4>
                      <ul style={{ listStyle: 'disc', paddingLeft: '20px', lineHeight: '1.6' }}>
                        <li>Larix Broadcaster (Free)</li>
                        <li>CameraFi Live</li>
                        <li>Streamlabs Mobile</li>
                      </ul>
                    </div>
                  </div>
                  <p style={{ marginTop: '12px', fontSize: '0.75rem', color: '#caf0f8' }}>
                    Use RTMP URL: <code style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      padding: '2px 4px',
                      borderRadius: '4px'
                    }}>{streamKey.rtmpUrl}</code>
                  </p>
                </div>

                {/* Share Link */}
                <div style={{
                  background: 'rgba(147, 51, 234, 0.1)',
                  border: '1px solid rgba(147, 51, 234, 0.3)',
                  borderRadius: '8px',
                  padding: '24px'
                }}>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    marginBottom: '12px',
                    color: '#c084fc'
                  }}>
                    🔗 Share Your Stream:
                  </h3>
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    padding: '12px',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    color: '#c084fc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    wordBreak: 'break-all'
                  }}>
                    <span>https://bluetubetv.live/watch/{streamKey.streamKey}</span>
                    <button 
                      onClick={() => copyToClipboard(`https://bluetubetv.live/watch/${streamKey.streamKey}`)}
                      style={{
                        background: '#9333ea',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        marginLeft: '8px',
                        flexShrink: 0
                      }}
                    >
                      Copy Link
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '16px', paddingTop: '24px' }}>
                  <button
                    onClick={() => router.push(`/watch/${streamKey.streamKey}`)}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #48cae4, #0096c7)',
                      color: '#03045e',
                      padding: '12px',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    View My Stream Page
                  </button>
                  <button
                    onClick={generateStreamKey}
                    style={{
                      padding: '12px 24px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '12px',
                      background: 'transparent',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    Generate New Key
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div style={{ 
            marginTop: '48px', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '24px' 
          }}>
            {[
              { icon: '🎯', title: 'Direct Streaming', desc: 'Stream directly to BlueTubeTV - no external services required!' },
              { icon: '💰', title: 'Instant Tips', desc: 'Receive tips directly from viewers while streaming' },
              { icon: '💬', title: 'Live Chat', desc: 'Real-time chat with your audience' }
            ].map((feature, idx) => (
              <div key={idx} style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#caf0f8' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}