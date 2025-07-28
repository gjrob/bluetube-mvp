// pages/watch/[id].js
import Layout from '../../components/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import FlightCompliance from '../../components/FlightCompliance';

export default function Watch() {
  const router = useRouter();
  const { id } = router.query;

  const [viewerCount, setViewerCount] = useState(1251);
  const [messages, setMessages] = useState([
    { user: 'User123', message: 'Amazing footage! 🚁', color: '#60a5fa' },
    { user: 'DroneEnthusiast', message: 'What drone are you using?', color: '#60a5fa' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showCompliance, setShowCompliance] = useState(false);
  const [complianceStatus, setComplianceStatus] = useState(null);

  const videoRef = useRef(null);
  const flvPlayerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !id) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/flv.js@latest/dist/flv.min.js';
    script.async = true;

    script.onload = () => {
      if (window.flvjs && window.flvjs.isSupported()) {
        const flvPlayer = window.flvjs.createPlayer({
          type: 'flv',
          url: `http://localhost:8000/live/${id}.flv`,
          isLive: true,
          hasAudio: true,
          hasVideo: true,
          enableStashBuffer: false
        });

        flvPlayer.attachMediaElement(videoRef.current);
        flvPlayer.load();
        flvPlayer.play();
        flvPlayerRef.current = flvPlayer;
      }
    };

    document.body.appendChild(script);

    return () => {
      if (flvPlayerRef.current) {
        flvPlayerRef.current.pause();
        flvPlayerRef.current.unload();
        flvPlayerRef.current.detachMediaElement();
        flvPlayerRef.current.destroy();
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 10) - 5);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setComplianceStatus({
      isCompliant: Math.random() > 0.3
    });
  }, [id]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages((prev) => [
        ...prev,
        { user: 'You', message: newMessage, color: '#10b981' }
      ]);
      setNewMessage('');
    }
  };
const handleStripeTip = async (amount) => {
  try {
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        pilotName: 'Sky Pilot Pro' // you can make this dynamic later
      })
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Failed to start checkout');
    }
  } catch (err) {
    console.error('Stripe Checkout error:', err);
    alert('Error: could not start Stripe Checkout');
  }
};


  return (
    <>
      <Head>
        <title>Watch Stream - BlueTubeTV</title>
      </Head>

      <div style={{
        background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
        minHeight: '100vh',
        color: 'white'
      }}>
        <Layout>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
              {/* Video Player */}
              <div>
                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  borderRadius: '20px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: '#000',
                    height: '600px',
                    position: 'relative'
                  }}>
                    <video ref={videoRef} controls style={{ width: '100%', height: '100%' }} />

                    {/* Compliance Banner */}
                    {complianceStatus && (
                      <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '20px',
                        background: complianceStatus.isCompliant
                          ? 'rgba(16, 185, 129, 0.9)'
                          : 'rgba(239, 68, 68, 0.9)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        fontSize: '14px'
                      }}>
                        {complianceStatus.isCompliant
                          ? '✅ FAA Compliant'
                          : '⚠️ Compliance Warning'}
                      </div>
                    )}
                    <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
  <button
    onClick={() => handleStripeTip(5)}
    style={tipButtonStyle}
  >
    💵 Tip $5
  </button>
  <button
    onClick={() => handleStripeTip(10)}
    style={tipButtonStyle}
  >
    💸 Tip $10
  </button>
</div>
                  </div>
                </div>

                {/* Flight Compliance Toggle */}
                <button
                  onClick={() => setShowCompliance((prev) => !prev)}
                  style={{
                    marginTop: '20px',
                    background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                    color: 'white',
                    padding: '12px 30px',
                    borderRadius: '50px',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 10px 40px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  ✈️ Flight Compliance
                </button>

                {showCompliance && <FlightCompliance />}

                {/* Video Info */}
                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '20px',
                  padding: '30px',
                  marginTop: '20px'
                }}>
                  <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>
                    Aerial Adventures: Live Drone Flight 🚁
                  </h1>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ fontSize: '24px' }}>🚁</span>
                      </div>
                      <div>
                        <h3>Sky Pilot Pro</h3>
                        <p style={{ color: '#94a3b8' }}>2.5K followers</p>
                      </div>
                    </div>

                    <button style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #66d9ef 100%)',
                      color: 'white',
                      padding: '12px 30px',
                      borderRadius: '50px',
                      fontSize: '16px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer'
                    }}>
                      Follow
                    </button>
                  </div>

                  {/* Tip Links */}
                  <button
                      onClick={handleStripeTip}
                      style={{
                      background: 'linear-gradient(135deg, #635bff 0%, #2ec4b6 100%)',
                      color: 'white',
                      padding: '14px 30px',
                      borderRadius: '50px',
                      fontSize: '18px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 10px 40px rgba(99, 91, 255, 0.4)'
            }}
      >
                 💸 Tip via Stripe
                 </button>

                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <a href="https://paypal.me/garlanjrobinson" target="_blank" rel="noopener noreferrer" style={tipButtonStyle}>
                      💳 PayPal Tip
                    </a>
                    <a href="https://coff.ee/garlanjrobinson" target="_blank" rel="noopener noreferrer" style={tipButtonStyle}>
                      ☕ Buy Me a Coffee
                    </a>
                  </div>
                </div>
              </div>

              {/* Sidebar: Stream Stats + Chat */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={cardStyle}>
                  <h3 style={{ marginBottom: '20px' }}>Stream Stats</h3>
                  <p>Viewers: <strong>{viewerCount}</strong></p>
                  <p>Duration: <strong>45:23</strong></p>
                  <p>Tips Received: <strong style={{ color: '#10b981' }}>$127.50</strong></p>
                </div>

                <div style={cardStyle}>
                  <h3 style={{ marginBottom: '20px' }}>Live Chat</h3>
                  <div style={{
                    height: '300px',
                    overflowY: 'auto',
                    background: '#1e293b',
                    borderRadius: '12px',
                    padding: '15px',
                    marginBottom: '15px'
                  }}>
                    {messages.map((msg, i) => (
                      <div key={i} style={{ marginBottom: '12px' }}>
                        <strong style={{ color: msg.color }}>{msg.user}:</strong>
                        <span style={{ marginLeft: '8px' }}>{msg.message}</span>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={sendMessage}>
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        background: '#0f172a',
                        color: 'white',
                        border: '1px solid #334155',
                        borderRadius: '10px'
                      }}
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    </>
  );
}

const cardStyle = {
  background: 'rgba(30, 41, 59, 0.5)',
  borderRadius: '20px',
  padding: '30px',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
};

const tipButtonStyle = {
  background: 'linear-gradient(135deg, #0070ba 0%, #00c6ff 100%)',
  color: 'white',
  padding: '14px 25px',
  borderRadius: '50px',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  display: 'inline-block'
};
