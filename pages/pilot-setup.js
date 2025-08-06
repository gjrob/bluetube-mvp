// pages/pilot-setup.js - Inline Styles Version
import { useState } from 'react';
import Layout from '../components/Layout.js';
import Head from 'next/head';
import Link from 'next/link';

export default function PilotSetup() {
  const [selectedTab, setSelectedTab] = useState('desktop');
  const [copiedText, setCopiedText] = useState('');

  const rtmpUrl = 'rtmp://rtmp.livepeer.com/live';

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  return (
    <>
      <Head>
        <title>Pilot Setup Guide - BlueTubeTV</title>
      </Head>
      
      <div style={{
        background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
        minHeight: '100vh',
        color: 'white'
      }}>
        <Layout>
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #818cf8, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Pilot Setup Guide
            </h1>
            <p style={{
              fontSize: '20px',
              color: '#94a3b8',
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              Get your drone footage streaming in minutes
            </p>

            {/* Platform Tabs */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '20px', 
              marginBottom: '30px' 
            }}>
              <button
                onClick={() => setSelectedTab('desktop')}
                style={{
                  background: selectedTab === 'desktop' 
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                    : 'rgba(30, 41, 59, 0.5)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: selectedTab === 'desktop' 
                    ? 'none' 
                    : '1px solid rgba(59, 130, 246, 0.2)',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                📱 Desktop (OBS)
              </button>
              <button
                onClick={() => setSelectedTab('mobile')}
                style={{
                  background: selectedTab === 'mobile' 
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                    : 'rgba(30, 41, 59, 0.5)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: selectedTab === 'mobile' 
                    ? 'none' 
                    : '1px solid rgba(59, 130, 246, 0.2)',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                📱 Mobile (Larix)
              </button>
            </div>

            {/* Quick Start Guide */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '20px',
              padding: '40px',
              marginBottom: '30px'
            }}>
              <h2 style={{ 
                color: '#60a5fa', 
                marginBottom: '30px',
                fontSize: '32px',
                fontWeight: '700'
              }}>
                Quick Start Guide
              </h2>
              
              {selectedTab === 'desktop' ? (
                <>
                  {/* Desktop Instructions */}
                  <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ color: '#60a5fa', marginBottom: '15px', fontSize: '20px' }}>
                      Step 1: Install OBS Studio
                    </h3>
                    <p style={{ color: '#94a3b8', marginBottom: '15px' }}>
                      Download OBS Studio - free and open source streaming software
                    </p>
                    <a
                      href="https://obsproject.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        fontSize: '16px',
                        fontWeight: '600',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                      }}
                    >
                      ⬇️ Download OBS Studio →
                    </a>
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ color: '#60a5fa', marginBottom: '15px', fontSize: '20px' }}>
                      Step 2: Configure Stream Settings
                    </h3>
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.5)',
                      borderRadius: '12px',
                      padding: '20px'
                    }}>
                      <div style={{ marginBottom: '15px' }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginBottom: '8px'
                        }}>
                          <span style={{ color: '#94a3b8' }}>Service:</span>
                          <span style={{ color: 'white', fontFamily: 'monospace' }}>Custom</span>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginBottom: '8px'
                        }}>
                          <span style={{ color: '#94a3b8' }}>Server:</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ 
                              color: 'white', 
                              fontFamily: 'monospace',
                              fontSize: '14px'
                            }}>
                              {rtmpUrl}
                            </span>
                            <button
                              onClick={() => copyToClipboard(rtmpUrl, 'server')}
                              style={{
                                background: 'rgba(59, 130, 246, 0.2)',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                borderRadius: '6px',
                                padding: '4px 8px',
                                color: '#60a5fa',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              📋 Copy
                            </button>
                          </div>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center'
                        }}>
                          <span style={{ color: '#94a3b8' }}>Stream Key:</span>
                          <span style={{ color: '#fbbf24' }}>Get from BlueTubeTV dashboard</span>
                        </div>
                      </div>
                      {copiedText === 'server' && (
                        <p style={{ color: '#10b981', fontSize: '14px', marginTop: '10px' }}>
                          ✓ Server URL copied!
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ color: '#60a5fa', marginBottom: '15px', fontSize: '20px' }}>
                      Step 3: Add Your Sources
                    </h3>
                    <ul style={{ color: '#94a3b8', listStyle: 'none', padding: 0 }}>
                      <li style={{ marginBottom: '8px' }}>• Add Display Capture for screen sharing</li>
                      <li style={{ marginBottom: '8px' }}>• Add Video Capture Device for webcam/drone feed</li>
                      <li style={{ marginBottom: '8px' }}>• Add Audio Input Capture for microphone</li>
                      <li>• Arrange your scene as desired</li>
                    </ul>
                  </div>

                  <div>
                    <h3 style={{ color: '#60a5fa', marginBottom: '15px', fontSize: '20px' }}>
                      Step 4: Start Streaming
                    </h3>
                    <p style={{ color: '#94a3b8', marginBottom: '15px' }}>
                      Click "Start Streaming" in OBS and you're live!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Mobile Instructions */}
                  <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ color: '#60a5fa', marginBottom: '15px', fontSize: '20px' }}>
                      Step 1: Install Larix Broadcaster
                    </h3>
                    <p style={{ color: '#94a3b8', marginBottom: '15px' }}>
                      Download Larix Broadcaster - professional mobile streaming app
                    </p>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                      <a
                        href="https://apps.apple.com/app/larix-broadcaster/id1042474385"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                          color: 'white',
                          padding: '12px 24px',
                          borderRadius: '10px',
                          fontSize: '16px',
                          fontWeight: '600',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                        }}
                      >
                        🍎 iOS App Store →
                      </a>
                      <a
                        href="https://play.google.com/store/apps/details?id=com.wmspanel.larix_broadcaster"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: 'white',
                          padding: '12px 24px',
                          borderRadius: '10px',
                          fontSize: '16px',
                          fontWeight: '600',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        🤖 Google Play →
                      </a>
                    </div>
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ color: '#60a5fa', marginBottom: '15px', fontSize: '20px' }}>
                      Step 2: Add Connection
                    </h3>
                    <p style={{ color: '#94a3b8', marginBottom: '15px' }}>
                      In Larix, go to Settings → Connections → New connection
                    </p>
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.5)',
                      borderRadius: '12px',
                      padding: '20px'
                    }}>
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ color: '#94a3b8' }}>Name: </span>
                        <span style={{ color: 'white', fontFamily: 'monospace' }}>BlueTubeTV</span>
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ color: '#94a3b8' }}>URL: </span>
                        <span style={{ color: 'white', fontFamily: 'monospace' }}>{rtmpUrl}</span>
                        <button
                          onClick={() => copyToClipboard(rtmpUrl, 'mobile')}
                          style={{
                            background: 'rgba(59, 130, 246, 0.2)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            color: '#60a5fa',
                            cursor: 'pointer',
                            fontSize: '14px',
                            marginLeft: '10px'
                          }}
                        >
                          📋
                        </button>
                      </div>
                      <div>
                        <span style={{ color: '#94a3b8' }}>Stream key: </span>
                        <span style={{ color: '#fbbf24' }}>Get from dashboard</span>
                      </div>
                      {copiedText === 'mobile' && (
                        <p style={{ color: '#10b981', fontSize: '14px', marginTop: '10px' }}>
                          ✓ URL copied!
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ color: '#60a5fa', marginBottom: '15px', fontSize: '20px' }}>
                      Step 3: Configure Quality
                    </h3>
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.5)',
                      borderRadius: '12px',
                      padding: '20px'
                    }}>
                      <p style={{ color: '#94a3b8', marginBottom: '10px' }}>
                        Recommended settings for drone streaming:
                      </p>
                      <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px' }}>
                        <li style={{ color: '#94a3b8', marginBottom: '4px' }}>
                          • Resolution: 1920x1080 (1080p)
                        </li>
                        <li style={{ color: '#94a3b8', marginBottom: '4px' }}>
                          • Frame rate: 30 fps
                        </li>
                        <li style={{ color: '#94a3b8', marginBottom: '4px' }}>
                          • Bitrate: 4000-6000 kbps
                        </li>
                        <li style={{ color: '#94a3b8' }}>
                          • Keyframe interval: 2 seconds
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ color: '#60a5fa', marginBottom: '15px', fontSize: '20px' }}>
                      Step 4: Start Broadcasting
                    </h3>
                    <p style={{ color: '#94a3b8' }}>
                      Tap the red record button in Larix to go live!
                    </p>
                  </div>
                </>
              )}
              
              <Link
                href="/live"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  padding: '16px 48px',
                  borderRadius: '50px',
                  fontSize: '18px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-block',
                  boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
                  marginTop: '30px'
                }}
              >
                🎥 Go to Dashboard
              </Link>
            </div>

            {/* Additional Resources */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '20px',
              padding: '40px',
              marginBottom: '30px'
            }}>
              <h2 style={{ 
                color: '#60a5fa', 
                marginBottom: '30px',
                fontSize: '24px'
              }}>
                Additional Resources
              </h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px'
              }}>
                <div>
                  <h3 style={{ color: '#3b82f6', marginBottom: '15px', fontSize: '18px' }}>
                    🎯 Streaming Tips
                  </h3>
                  <ul style={{ color: '#94a3b8', listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '8px' }}>• Use a stable internet connection (5+ Mbps upload)</li>
                    <li style={{ marginBottom: '8px' }}>• Stream in well-lit conditions for best quality</li>
                    <li style={{ marginBottom: '8px' }}>• Test your stream privately before going live</li>
                    <li>• Engage with viewers through live chat</li>
                  </ul>
                </div>
                <div>
                  <h3 style={{ color: '#3b82f6', marginBottom: '15px', fontSize: '18px' }}>
                    🚁 Drone Integration
                  </h3>
                  <ul style={{ color: '#94a3b8', listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '8px' }}>• DJI Fly app supports RTMP streaming</li>
                    <li style={{ marginBottom: '8px' }}>• Use HDMI capture for professional drones</li>
                    <li style={{ marginBottom: '8px' }}>• Consider using a dedicated streaming device</li>
                    <li>• Ensure drone compliance with local regulations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '20px',
              padding: '40px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#60a5fa', marginBottom: '20px', fontSize: '24px' }}>
                Need Help?
              </h3>
              <p style={{ color: '#94a3b8', marginBottom: '30px' }}>
                Join our community or check out additional resources
              </p>

              <div style={{ 
                display: 'flex', 
                gap: '20px', 
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <Link 
                  href="/browse"
                  style={{
                    color: '#60a5fa',
                    textDecoration: 'none',
                    padding: '12px 24px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '10px',
                    display: 'inline-block',
                    transition: 'all 0.3s ease',
                    background: 'rgba(59, 130, 246, 0.1)'
                  }}
                >
                  👀 Watch Other Streams
                </Link>
                
                <Link
                  href="https://docs.livepeer.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#60a5fa',
                    textDecoration: 'none',
                    padding: '12px 24px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '10px',
                    display: 'inline-block',
                    transition: 'all 0.3s ease',
                    background: 'rgba(59, 130, 246, 0.1)'
                  }}
                >
                  📚 LivePeer Docs →
                </Link>
                
                <Link 
                  href="/live"
                  style={{
                    color: '#60a5fa',
                    textDecoration: 'none',
                    padding: '12px 24px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '10px',
                    display: 'inline-block',
                    transition: 'all 0.3s ease',
                    background: 'rgba(59, 130, 246, 0.1)'
                  }}
                >
                  🎮 Pilot Dashboard
                </Link>
              </div>
            </div>
          </div>  
        </Layout>
      </div>
    </>
  );
}