import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (e) {
      console.log('No user data');
    }
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard - BlueTubeTV</title>
      </Head>

      <div style={{
        background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
        minHeight: '100vh',
        color: 'white'
      }}>
        <Layout>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #818cf8, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Creator Dashboard
            </h1>

            <p style={{ 
              color: '#94a3b8', 
              fontSize: '20px',
              textAlign: 'center',
              marginBottom: '60px'
            }}>
              Welcome back{user ? `, ${user.username}` : ''}! Your streaming command center awaits.
            </p>

            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px',
              marginBottom: '40px'
            }}>
              {/* Total Views */}
              <div style={cardStyle}
                onMouseEnter={hoverIn}
                onMouseLeave={hoverOut}>
                <h3 style={statHeader}>Total Views</h3>
                <p style={statNumber}>24,539</p>
                <p style={{ color: '#10b981', marginTop: '10px' }}>↑ 12% this week</p>
              </div>

              {/* Stream Hours */}
              <div style={cardStyle}
                onMouseEnter={hoverIn}
                onMouseLeave={hoverOut}>
                <h3 style={statHeader}>Stream Hours</h3>
                <p style={statNumber}>47h</p>
                <p style={{ color: '#60a5fa', marginTop: '10px' }}>Ready for takeoff!</p>
              </div>

              {/* Earnings */}
              <div style={{
                ...cardStyle,
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))',
                border: '2px solid rgba(16, 185, 129, 0.3)'
              }}
                onMouseEnter={hoverIn}
                onMouseLeave={hoverOut}>
                <h3 style={statHeader}>Earnings</h3>
                <p style={{ ...statNumber, color: '#10b981' }}>$1,247</p>
                <p style={{ color: '#10b981', marginTop: '10px' }}>Tips & sponsorships</p>
              </div>
            </div>

            {/* Payout Info */}
            <h3 style={{ 
              color: '#fbbf24', 
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '24px'
            }}>
              💰 Pilot Payout Information
            </h3>
            <div style={{ color: '#e2e8f0' }}>
              <p style={{ marginBottom: '20px', fontSize: '18px' }}>
                <strong>Beta Launch Payout Schedule:</strong>
              </p>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                margin: 0,
                fontSize: '16px',
                lineHeight: '2'
              }}>
                <li style={{ marginBottom: '10px' }}>✅ Tips collected by BlueTubeTV platform</li>
                <li style={{ marginBottom: '10px' }}>✅ Payouts every Friday via PayPal/Venmo</li>
                <li style={{ 
                  marginBottom: '10px',
                  color: '#10b981',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>✅ You keep 85% of all tips received (15% platform fee)</li>
                <li style={{ marginBottom: '10px' }}>✅ Minimum payout: $25</li>
                <li style={{ marginBottom: '10px' }}>⏳ Instant payouts coming soon!</li>
                <li style={{ 
                  marginBottom: '10px',
                  color: '#60a5fa',
                  fontStyle: 'italic'
                }}>🎯 Platform fee drops to 5% after we secure sponsorships!</li>
              </ul>
              <p style={{ marginTop: '20px', color: '#94a3b8' }}>
                <strong>Questions?</strong> Email us at{' '}
                <a 
                  href="mailto:pilot@bluetubetv.live" 
                  style={{ color: '#60a5fa', textDecoration: 'none' }}
                >
                  pilot@bluetubetv.live
                </a>
              </p>
            </div>

            {/* Quick Actions */}
            <div style={cardStyle}>
              <h2 style={{ color: '#60a5fa', marginBottom: '30px', fontSize: '28px' }}>
                Quick Actions
              </h2>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => window.location.href = '/live'}
                  style={primaryButton}
                  onMouseEnter={buttonHoverIn}
                  onMouseLeave={buttonHoverOut}
                >
                  🚀 Go Live Now
                </button>

                <button
                  onClick={() => alert('Analytics coming soon!')}
                  style={outlineButtonBlue}
                >
                  📊 View Analytics
                </button>

                <button
                  onClick={() => alert('Settings coming soon!')}
                  style={outlineButtonPurple}
                >
                  ⚙️ Settings
                </button>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    </>
  );
}

// 🔹 Reusable styles
const cardStyle = {
  background: 'rgba(30, 41, 59, 0.5)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  borderRadius: '20px',
  padding: '30px',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease',
  cursor: 'pointer'
};

const statHeader = {
  color: '#94a3b8',
  marginBottom: '10px'
};

const statNumber = {
  fontSize: '48px',
  fontWeight: 'bold',
  margin: '0'
};

const primaryButton = {
  background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
  color: 'white',
  border: 'none',
  padding: '16px 40px',
  borderRadius: '50px',
  fontSize: '18px',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: '0 10px 40px rgba(239, 68, 68, 0.4)',
  transition: 'all 0.3s ease'
};

const outlineButtonBlue = {
  background: 'rgba(59, 130, 246, 0.2)',
  color: '#60a5fa',
  border: '1px solid rgba(59, 130, 246, 0.4)',
  padding: '16px 40px',
  borderRadius: '50px',
  fontSize: '18px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const outlineButtonPurple = {
  background: 'transparent',
  color: '#818cf8',
  border: '2px solid #818cf8',
  padding: '16px 40px',
  borderRadius: '50px',
  fontSize: '18px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

// 🔹 Hover logic
function hoverIn(e) {
  e.currentTarget.style.transform = 'translateY(-5px)';
  e.currentTarget.style.boxShadow = '0 25px 70px rgba(0, 0, 0, 0.4)';
}

function hoverOut(e) {
  e.currentTarget.style.transform = 'translateY(0)';
  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3)';
}

function buttonHoverIn(e) {
  e.target.style.transform = 'translateY(-3px)';
  e.target.style.boxShadow = '0 15px 50px rgba(239, 68, 68, 0.6)';
}

function buttonHoverOut(e) {
  e.target.style.transform = 'translateY(0)';
  e.target.style.boxShadow = '0 10px 40px rgba(239, 68, 68, 0.4)';
}
