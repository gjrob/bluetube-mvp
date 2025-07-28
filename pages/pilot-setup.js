// pages/pilot-setup.js
import Layout from '../components/Layout';
import Head from 'next/head';
import Link from 'next/link';

export default function PilotSetup() {
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
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #818cf8, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '40px',
              textAlign: 'center'
            }}>
              Pilot Setup Guide
            </h1>
            
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              marginBottom: '40px'
            }}>
              <h2 style={{ 
                fontSize: '32px', 
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                🚁 Connect Your Drone
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  padding: '25px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '12px',
                  borderLeft: '4px solid #3b82f6'
                }}>
                  <h3 style={{ color: '#60a5fa', marginBottom: '10px' }}>Step 1: Install OBS Studio</h3>
                  <p style={{ color: '#94a3b8', marginBottom: '15px' }}>
                    Download and install OBS Studio for your operating system
                  </p>
                  <a 
                    href="https://obsproject.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#60a5fa',
                      textDecoration: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    Download OBS Studio →
                  </a>
                </div>
                
                <div style={{
                  padding: '25px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '12px',
                  borderLeft: '4px solid #3b82f6'
                }}>
                  <h3 style={{ color: '#60a5fa', marginBottom: '10px' }}>Step 2: Configure Stream Settings</h3>
                  <p style={{ color: '#94a3b8', marginBottom: '15px' }}>
                    Use these optimal settings for drone streaming
                  </p>
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    padding: '20px',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    color: '#10b981'
                  }}>
                    <p style={{ margin: '5px 0' }}>Server: rtmp://live.bluetubetv.com/live</p>
                    <p style={{ margin: '5px 0' }}>Stream Key: [Your unique key from dashboard]</p>
                    <p style={{ margin: '5px 0' }}>Bitrate: 4000-6000 Kbps</p>
                    <p style={{ margin: '5px 0' }}>Resolution: 1920x1080</p>
                    <p style={{ margin: '5px 0' }}>FPS: 30 or 60</p>
                  </div>
                </div>
                
                <div style={{
                  padding: '25px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '12px',
                  borderLeft: '4px solid #3b82f6'
                }}>
                  <h3 style={{ color: '#60a5fa', marginBottom: '10px' }}>Step 3: Start Streaming</h3>
                  <p style={{ color: '#94a3b8' }}>
                    Click "Start Streaming" in OBS and go live on BlueTubeTV!
                  </p>
                </div>
              </div>
              
              <button style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #66d9ef 100%)',
                color: 'white',
                padding: '20px',
                borderRadius: '50px',
                fontSize: '18px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
                width: '100%',
                marginTop: '40px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 15px 50px rgba(102, 126, 234, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 40px rgba(102, 126, 234, 0.4)';
              }}>
                📥 Download Complete Setup Guide (PDF)
              </button>
            </div>

            {/* Support Section */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#60a5fa', marginBottom: '20px' }}>Need Help?</h3>
              <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
                Our community is here to support you!
              </p>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a 
                  href="mailto:support@bluetubetv.live"
                  style={{
                    color: '#60a5fa',
                    textDecoration: 'none',
                    padding: '10px 20px',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    borderRadius: '25px',
                    display: 'inline-block',
                    transition: 'all 0.3s ease'
                  }}
                >
                  📧 Email Support
                </a>
                <Link href="/dashboard">
                  <a style={{
                    color: '#60a5fa',
                    textDecoration: 'none',
                    padding: '10px 20px',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    borderRadius: '25px',
                    display: 'inline-block',
                    transition: 'all 0.3s ease'
                  }}>
                    📊 Back to Dashboard
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    </>
  );
}
