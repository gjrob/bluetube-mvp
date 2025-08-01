// pages/live.js - COMPLETE VERSION WITH ALL MONETIZATION

import PilotStreamInterface from '../components/PilotStreamInterface';
import Layout from '../components/Layout';
import BrowserStream from '../components/BrowserStream';
import SuperChat from '../components/SuperChat';
import NFTMinting from '../components/NFTMinting';
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const FlightCompliance = dynamic(() => import('../components/FlightCompliance'), { ssr: false });

// This prevents the build error
export const getServerSideProps = async () => {
  return { props: {} };
};

export default function Live() {
  const [streamKey, setStreamKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFlightCompliance, setShowFlightCompliance] = useState(false);
  const [showNFTMinting, setShowNFTMinting] = useState(false);
  const router = useRouter();

  const generateStreamKey = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-stream-key', { method: 'POST' });
      const data = await res.json();
      setStreamKey(data);
    } catch (error) {
      console.error('Error generating stream key:', error);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Go Live - BlueTubeTV</title>
      </Head>
      
      <div style={{
        background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
        minHeight: '100vh',
        color: 'white'
      }}>
        <Layout>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #818cf8, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '40px',
              textAlign: 'center'
            }}>
              Start Broadcasting
            </h1>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 400px',
              gap: '30px',
              marginTop: '20px'
            }}>
              {/* LEFT COLUMN - Stream Preview */}
              <div style={{
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                  height: '500px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '2px solid rgba(59, 130, 246, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '60px' }}>🚁</span>
                  </div>
                  
                  {/* Top Controls */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    right: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    {/* LIVE Badge */}
                    <div style={{
                      background: '#ef4444',
                      color: 'white',
                      padding: '8px 20px',
                      borderRadius: '20px',
                      fontSize: '16px',
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

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {/* NFT Minting Button */}
                      <button
                        onClick={() => setShowNFTMinting(!showNFTMinting)}
                        style={{
                          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                          color: 'white',
                          padding: '10px 20px',
                          borderRadius: '25px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                        }}
                      >
                        🎨 Mint NFT
                      </button>

                      {/* Flight Compliance Button */}
                      <button
                        onClick={() => setShowFlightCompliance(!showFlightCompliance)}
                        style={{
                          background: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          padding: '10px 20px',
                          borderRadius: '25px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        ✈️ Flight Compliance
                      </button>
                    </div>
                  </div>
                </div>
                
                <div style={{ padding: '30px' }}>
                  <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Your Stream Setup</h2>
                  <p style={{ color: '#94a3b8', marginBottom: '30px' }}>
                    Configure your stream settings below and click "Generate Stream Key"
                  </p>
                  <button
                    onClick={generateStreamKey}
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '20px',
                      borderRadius: '50px',
                      fontSize: '20px',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 10px 40px rgba(239, 68, 68, 0.4)',
                      width: '100%',
                      opacity: loading ? 0.7 : 1,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? '⏳ Generating...' : '🔴 Generate Stream Key'}
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN - Settings & Monetization */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Stream Settings */}
                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '20px',
                  padding: '30px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                }}>
                  <h3 style={{ marginBottom: '20px', fontSize: '24px' }}>Stream Settings</h3>
                  <input 
                    placeholder="Stream Title" 
                    style={{
                      background: 'rgba(30, 41, 59, 0.5)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      color: 'white',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      width: '100%',
                      marginBottom: '15px'
                    }}
                  />
                  <select style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    width: '100%',
                    marginBottom: '15px',
                    cursor: 'pointer'
                  }}>
                    <option>Select Drone Model</option>
                    <option>DJI Mavic 3</option>
                    <option>DJI Mini 3 Pro</option>
                    <option>Autel EVO II</option>
                  </select>
                  <input 
                    placeholder="Location" 
                    style={{
                      background: 'rgba(30, 41, 59, 0.5)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      color: 'white',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      width: '100%'
                    }}
                  />
                </div>

                {/* SuperChat Component */}
                <SuperChat 
                  streamId="live_stream_main"
                  currentUser={{
                    id: "pilot_123",
                    name: "Your Pilot Name",
                    email: "pilot@example.com"
                  }}
                  isLive={true}
                />

                {/* NFT Minting Component (shown when toggled) */}
                {showNFTMinting && (
                  <NFTMinting 
                    streamId="live_stream_main"
                    streamTitle="Drone Flight Stream"
                    pilotAddress="0x123..."
                  />
                )}

                {/* Stream Key Success Message (if generated) */}
                {streamKey && (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '2px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '20px',
                    padding: '20px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                  }}>
                    <h3 style={{ color: '#10b981', marginBottom: '15px' }}>✅ Stream Ready!</h3>
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.5)',
                      padding: '15px',
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      marginBottom: '15px',
                      wordBreak: 'break-all'
                    }}>
                      <p style={{ margin: '5px 0' }}>Server: {streamKey.rtmpUrl || 'rtmp://live.bluetubetv.live/live'}</p>
                      <p style={{ margin: '5px 0' }}>Key: {streamKey.streamKey || streamKey}</p>
                    </div>
                    <button
                      onClick={() => {
                        // Use the actual video ID from Cloudflare
                        const videoId = streamKey.videoId || '7aca43ca01ef93f28a8d6e2e020eea0d';
                        router.push(`/watch/${videoId}`);
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        width: '100%',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                      }}
                    >
                      👁️ View Stream Page →
                    </button>
                  </div>
                )}

                {/* Browser Stream Component */}
                <div style={{ marginTop: '40px' }}>
                  <BrowserStream />
                </div>
              </div>
            </div>

            {/* Show Flight Compliance if toggled */}
            {showFlightCompliance && (
              <div style={{ marginTop: '30px' }}>
                <FlightCompliance />
              </div>
            )}
          </div>
        </Layout>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        select option {
          background: #1e293b;
          color: white;
        }
        
        input::placeholder {
          color: #64748b;
        }
      `}</style>
    </>
  );
}