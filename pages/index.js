export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #03045e 0%, #023e8a 20%, #0077b6 40%, #0096c7 60%, #00b4d8 80%, #48cae4 100%)',
    }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        padding: '100px 20px',
        position: 'relative'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #90e0ef, #caf0f8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          🚁 BlueTubeTV
        </h1>
        
        <p style={{
          fontSize: '1.5rem',
          color: '#90e0ef',
          marginBottom: '40px'
        }}>
          Live Drone Streaming Platform
        </p>
        
        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => window.location.href = '/live'}
            style={{
              background: 'linear-gradient(135deg, #48cae4, #90e0ef)',
              color: '#03045e',
              border: 'none',
              padding: '20px 40px',
              borderRadius: '15px',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 5px 20px rgba(72, 202, 228, 0.4)',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            📺 Watch Live Streams
          </button>
          
          <button
            onClick={() => window.location.href = '/pilot-setup'}
            style={{
              background: 'transparent',
              color: '#caf0f8',
              border: '2px solid #48cae4',
              padding: '20px 40px',
              borderRadius: '15px',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#48cae4';
              e.target.style.color = '#03045e';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#caf0f8';
            }}
          >
            🎥 Start Streaming
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        padding: '60px 20px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          color: '#caf0f8',
          marginBottom: '50px'
        }}>
          Why BlueTubeTV?
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: '30px',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🚁</div>
            <h3 style={{ color: '#caf0f8', marginBottom: '10px' }}>FAA Compliant</h3>
            <p style={{ color: '#90e0ef' }}>Live altitude monitoring keeps you legal and safe</p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: '30px',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💰</div>
            <h3 style={{ color: '#caf0f8', marginBottom: '10px' }}>80% Revenue Share</h3>
            <p style={{ color: '#90e0ef' }}>Keep more of your earnings from tips and sponsors</p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: '30px',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🌎</div>
            <h3 style={{ color: '#caf0f8', marginBottom: '10px' }}>Global Reach</h3>
            <p style={{ color: '#90e0ef' }}>Stream to drone enthusiasts worldwide</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '40px 20px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <p style={{ color: '#90e0ef' }}>
          <a href="/terms" style={{ color: '#90e0ef', marginRight: '20px' }}>Terms</a>
          <a href="/privacy" style={{ color: '#90e0ef', marginRight: '20px' }}>Privacy</a>
          <a href="/legal" style={{ color: '#90e0ef' }}>Legal</a>
        </p>
        <p style={{ color: '#48cae4', marginTop: '10px' }}>
          © 2025 BlueTubeTV • Built with ❤️ for drone pilots
        </p>
      </footer>
    </div>
  );
}