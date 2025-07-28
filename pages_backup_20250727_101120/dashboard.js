// pages/dashboard.js
import { useState, useEffect } from 'react';
import Footer from '../components/Footer';  // ← ADD THIS IMPORT

export default function Dashboard() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #03045e 0%, #023e8a 20%, #0077b6 40%, #0096c7 60%, #00b4d8 80%, #48cae4 100%)',
      position: 'relative'
    }}>
      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '40px 20px', flex: 1 }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            background: 'linear-gradient(to right, #90e0ef, #caf0f8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            Welcome to Your Dashboard{user ? `, ${user.username}` : ''}!
          </h1>
          <p style={{ color: '#90e0ef', fontSize: '1.2rem' }}>
            Your streaming command center
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Total Views Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transform: 'translateY(0)',
            transition: 'transform 0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ color: '#caf0f8', marginBottom: '10px' }}>Total Views</h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#90e0ef', margin: 0 }}>0</p>
            <p style={{ color: '#48cae4', marginTop: '5px' }}>Start streaming to track views</p>
          </div>

          {/* Streaming Hours Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transform: 'translateY(0)',
            transition: 'transform 0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ color: '#caf0f8', marginBottom: '10px' }}>Stream Hours</h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#90e0ef', margin: 0 }}>0h</p>
            <p style={{ color: '#48cae4', marginTop: '5px' }}>Ready for takeoff!</p>
          </div>

          {/* Earnings Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(72, 202, 228, 0.3), rgba(144, 224, 239, 0.3))',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '2px solid rgba(72, 202, 228, 0.5)',
            transform: 'translateY(0)',
            transition: 'transform 0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ color: '#caf0f8', marginBottom: '10px' }}>Earnings</h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#caf0f8', margin: 0 }}>$0</p>
            <p style={{ color: '#90e0ef', marginTop: '5px' }}>Tips & sponsorships</p>
          </div>
        </div>
          <div style={{
  background: 'linear-gradient(135deg, rgba(255, 223, 0, 0.2), rgba(255, 183, 3, 0.2))',
  backdropFilter: 'blur(10px)',
  border: '2px solid rgba(255, 223, 0, 0.4)',
  borderRadius: '20px',
  padding: '25px',
  marginBottom: '30px',
  boxShadow: '0 5px 20px rgba(255, 223, 0, 0.2)'
}}>
  <h3 style={{ 
    color: '#caf0f8', 
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }}>
    💰 Pilot Payout Information
  </h3>
  <div style={{ color: '#90e0ef' }}>
    <p style={{ marginBottom: '15px' }}>
      <strong>Beta Launch Payout Schedule:</strong>
    </p>
    <ul style={{ 
      listStyle: 'none', 
      padding: 0,
      margin: 0
    }}>
      <li style={{ marginBottom: '8px' }}>
        ✅ Tips collected by BlueTubeTV platform
      </li>
      <li style={{ marginBottom: '8px' }}>
        ✅ Payouts every Friday via PayPal/Venmo
      </li>
      <li style={{ marginBottom: '8px' }}>
        ✅ You keep 80% of all tips received
      </li>
      <li style={{ marginBottom: '8px' }}>
        ✅ Minimum payout: $25
      </li>
      <li style={{ marginBottom: '8px' }}>
        ⏳ Instant payouts coming soon!
      </li>
    </ul>
    <p style={{ 
      marginTop: '20px', 
      fontSize: '0.9rem',
      color: '#48cae4'
    }}>
      <strong>Questions?</strong> Email us at{' '}
      <a 
        href="mailto:pilot@bluetubetv.live" 
        style={{ color: '#90e0ef', textDecoration: 'underline' }}
      >
        pilot@bluetubetv.live
      </a>
    </p>
  </div>
</div>
        {/* Quick Actions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{ color: '#caf0f8', marginBottom: '20px' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.location.href = '/live'}
              style={{
                background: 'linear-gradient(135deg, #48cae4, #90e0ef)',
                color: '#03045e',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 5px 15px rgba(72, 202, 228, 0.3)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              🚀 Go Live
            </button>
            <button
              onClick={() => alert('Analytics coming soon!')}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#caf0f8',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '15px 30px',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              📊 View Analytics
            </button>
            <button
              onClick={() => alert('Settings coming soon!')}
              style={{
                background: 'transparent',
                color: '#90e0ef',
                border: '2px solid #48cae4',
                padding: '15px 30px',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ⚙️ Settings
            </button>
            <div style={{
  background: 'rgba(255, 223, 0, 0.1)',
  border: '1px solid rgba(255, 223, 0, 0.3)',
  borderRadius: '10px',
  padding: '20px',
  marginBottom: '20px'
}}>
  <h3>💰 Pilot Payouts</h3>
  <p>During our beta launch:</p>
  <ul>
    <li>Tips are collected by BlueTubeTV</li>
    <li>Payouts every Friday via PayPal/Venmo</li>
    <li>You keep 80% of all tips</li>
    <li>Instant payouts coming soon!</li>
  </ul>
  <p><strong>Questions?</strong> Email: pilot@bluetubetv.live</p>
</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}