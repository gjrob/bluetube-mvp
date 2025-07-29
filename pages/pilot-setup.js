// pages/pilot-setup.js - WORKING VERSION
import Layout from '../components/Layout';
import Head from 'next/head';
import Link from 'next/link';

export default function PilotSetup() {
  return (
    <>
      <Head>
        <title>Pilot Setup - BlueTubeTV</title>
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
              marginBottom: '30px'
            }}>
              <h2 style={{ color: '#60a5fa', marginBottom: '30px' }}>Quick Start Guide</h2>
              
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#60a5fa', marginBottom: '10px' }}>Step 1: Install OBS Studio</h3>
                <p style={{ color: '#94a3b8', marginBottom: '10px' }}>
                  Download OBS Studio from obsproject.com
                </p>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#60a5fa', marginBottom: '10px' }}>Step 2: Configure Stream Settings</h3>
                <ul style={{ color: '#94a3b8', listStyle: 'none', padding: 0 }}>
                  <li>• Service: Custom</li>
                  <li>• Server: rtmps://live.cloudflare.com:443/live/</li>
                  <li>• Stream Key: Get from BlueTubeTV dashboard</li>
                </ul>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#60a5fa', marginBottom: '10px' }}>Step 3: Start Streaming</h3>
                <p style={{ color: '#94a3b8' }}>
                  Click Start Streaming in OBS and you&apos;re live!
                </p>
              </div>

              <Link 
                href="/live"
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                  color: 'white',
                  padding: '16px 48px',
                  borderRadius: '50px',
                  fontSize: '18px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-block',
                  boxShadow: '0 10px 40px rgba(239, 68, 68, 0.4)',
                  marginTop: '20px'
                }}
              >
                🚁 Go Live Now
              </Link>
            </div>

            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '20px',
              padding: '40px'
            }}>
              <h3 style={{ color: '#60a5fa', marginBottom: '20px' }}>Need Help?</h3>
              <div style={{ display: 'flex', gap: '20px' }}>
                <Link 
                  href="/docs"
                  style={{
                    color: '#60a5fa',
                    textDecoration: 'none',
                    padding: '10px 20px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '10px',
                    display: 'inline-block',
                    transition: 'all 0.3s ease'
                  }}
                >
                  📚 Documentation
                </Link>
                <Link 
                  href="/community"
                  style={{
                    color: '#60a5fa',
                    textDecoration: 'none',
                    padding: '10px 20px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '10px',
                    display: 'inline-block',
                    transition: 'all 0.3s ease'
                  }}
                >
                  💬 Community
                </Link>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    </>
  );
}
