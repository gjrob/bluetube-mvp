// pages/index.js - YOUR ENTIRE APP IN ONE FILE!
import { useState } from 'react';
import Head from 'next/head'

export default function BlueTubeTV() {
  const [loading, setLoading] = useState(false);
  
  // CHANGE THESE TO YOUR ACTUAL IDS
  // Update your code with these ACTUAL values:
  const CLOUDFLARE_VIDEO_ID = "4b469103fc44f6abbb1dbd6b43ee0331"; // Your Live Input ID 
  const STREAMER_NAME = "SkyPilot";  
  const CUSTOMER_SUBDOMAIN = "customer-qvzqb8nqvcsqqf40"; // Your subdomain

  // Add this simple chat component
  const [messages, setMessages] = useState([
    { user: 'System', text: 'Welcome to the stream!' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendTip = async (amount) => {
    setLoading(true);
    try {
      const response = await fetch('/api/tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, streamerName: STREAMER_NAME })
      });
      
      const data = await response.json();
      window.location.href = data.url; // Redirect to Stripe
    } catch (error) {
      alert('Error processing tip');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #1a1a2e, #0f0f1e)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <Head>
        <title>BlueTubeTV - Live Drone Streaming</title>
        <meta name="description" content="Stream drone flights, get tipped by viewers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <a href="/live" style={{
            display: 'inline-block',
            background: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '10px',
            textDecoration: 'none',
            margin: '0 10px',
            fontWeight: 'bold'
          }}>🔴 Watch Live Streams</a>
          
          <a href="/pilot-setup" style={{
            display: 'inline-block',
            background: '#10b981',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '10px',
            textDecoration: 'none',
            margin: '0 10px',
            fontWeight: 'bold'
          }}>🚁 Become a Pilot</a>
        </div>

        {/* Header */}
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center' 
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            margin: 0,
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🚁 BlueTubeTV - Live Drone Streaming
          </h1>
          <p style={{ color: '#888', marginTop: '10px' }}>
            FAA Compliant • Live Altitude Monitoring • Support Your Favorite Pilots
          </p>
        </div>

        <div style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1000
        }}>
          <a href="/" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.2rem'
          }}>
            🐙 BlueTubeTV
          </a>
        </div>

        {/* Main Content */}
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '40px 20px' 
        }}>
          {/* Video Player */}
          <div style={{ 
            background: '#000', 
            borderRadius: '20px', 
            overflow: 'hidden',
            marginBottom: '30px',
            position: 'relative',
            paddingBottom: '56.25%' // 16:9 aspect ratio
          }}>
            <iframe
              src={`https://customer-qvzqb8nqvcsqqf40.cloudflarestream.com/5524b836c2f105d5bfb87b420861cf79/iframe`}
              style={{
                border: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%'
              }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
            />
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '15px',
            padding: '20px',
            marginTop: '20px',
            height: '300px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3>Live Chat</h3>
            
            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'scroll',
              marginBottom: '10px'
            }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ marginBottom: '5px' }}>
                  <strong>{msg.user}:</strong> {msg.text}
                </div>
              ))}
            </div>
            
            {/* Input */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setMessages([...messages, { user: 'Viewer', text: newMessage }]);
                    setNewMessage('');
                  }
                }}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #333',
                  background: '#222',
                  color: 'white'
                }}
              />
              <button
                onClick={() => {
                  setMessages([...messages, { user: 'Viewer', text: newMessage }]);
                  setNewMessage('');
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '5px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Send
              </button>
            </div>
          </div>

          {/* Stream Info */}
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: '15px', 
            padding: '30px',
            marginBottom: '30px' 
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.8rem' }}>
              🔴 LIVE: {STREAMER_NAME}'s Aerial Adventure
            </h2>
            
            <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
              <div>
                <span style={{ color: '#888' }}>Altitude: </span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>285 ft ✓</span>
              </div>
              <div>
                <span style={{ color: '#888' }}>Viewers: </span>
                <span style={{ fontWeight: 'bold' }}>1,247</span>
              </div>
              <div>
                <span style={{ color: '#888' }}>Flight Time: </span>
                <span style={{ fontWeight: 'bold' }}>12:34</span>
              </div>
            </div>

            {/* Tip Buttons */}
            <div style={{ marginTop: '30px' }}>
              <h3 style={{ marginBottom: '15px' }}>⚡ Send a Tip</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => sendTip(5)}
                  disabled={loading}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '10px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.5 : 1,
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  ☕ $5
                </button>
                
                <button
                  onClick={() => sendTip(10)}
                  disabled={loading}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '10px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.5 : 1,
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  🍕 $10
                </button>
                
                <button
                  onClick={() => sendTip(25)}
                  disabled={loading}
                  style={{
                    background: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '10px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.5 : 1,
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  🚁 $25
                </button>
                
                <button
                  onClick={() => sendTip(50)}
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(to right, #f59e0b, #ef4444)',
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '10px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.5 : 1,
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  ⛽ $50
                </button>
              </div>
              
              {loading && (
                <p style={{ marginTop: '10px', color: '#888' }}>
                  Redirecting to secure checkout...
                </p>
              )}
            </div>
          </div>

          {/* CTA for Streamers */}
          <div style={{ 
            background: 'linear-gradient(to right, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
            borderRadius: '15px',
            padding: '30px',
            textAlign: 'center',
            border: '1px solid rgba(139,92,246,0.5)'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
              Are you a drone pilot?
            </h3>
            <p style={{ marginBottom: '20px', color: '#ccc' }}>
              Start streaming and earn money! Keep 80% of all tips.
            </p>
            <a 
              href="/pilot-setup"
              style={{
                display: 'inline-block',
                background: 'white',
                color: '#1a1a2e',
                padding: '12px 30px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              Start Streaming →
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          color: '#666'
        }}>
          <p>© 2025 Blue Ring Holdings LLC • FAA Part 107 Compliant</p>
          <p style={{ fontSize: '2rem', margin: '10px 0' }}>🐙</p>
          <p>Built with a dream 🚚→🏕️</p>
            <a href="/terms">Terms of Service</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/legal">Terms & Privacy</a>
        </div>
      </div>
    </div>
  );
}
