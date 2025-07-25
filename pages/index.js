// pages/index.js - Your HOMEPAGE should be different!
export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0096c7 0%, #00b4d8 25%, #48cae4 50%, #90e0ef 75%, #ade8f4 100%)',
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
          background: 'linear-gradient(to right, #023e8a, #0077b6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          🚁 BlueTubeTV
        </h1>
        
        <p style={{
          fontSize: '1.5rem',
          color: '#0077b6',
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
              background: 'linear-gradient(135deg, #ffdf00, #ffb703)',
              color: '#023e8a',
              border: 'none',
              padding: '20px 40px',
              borderRadius: '15px',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 5px 20px rgba(255, 223, 0, 0.4)',
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
              color: '#0077b6',
              border: '2px solid #0077b6',
              padding: '20px 40px',
              borderRadius: '15px',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#0077b6';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#0077b6';
            }}
          >
            🎥 Start Streaming
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        padding: '60px 20px',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          color: '#023e8a',
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
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '30px',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🚁</div>
            <h3 style={{ color: '#0077b6', marginBottom: '10px' }}>FAA Compliant</h3>
            <p style={{ color: '#0096c7' }}>Live altitude monitoring keeps you legal and safe</p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '30px',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💰</div>
            <h3 style={{ color: '#0077b6', marginBottom: '10px' }}>80% Revenue Share</h3>
            <p style={{ color: '#0096c7' }}>Keep more of your earnings from tips and sponsors</p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '30px',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🌎</div>
            <h3 style={{ color: '#0077b6', marginBottom: '10px' }}>Global Reach</h3>
            <p style={{ color: '#0096c7' }}>Stream to drone enthusiasts worldwide</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '40px 20px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 223, 0, 0.3)'
      }}>
        <p style={{ color: '#0077b6' }}>
          <a href="/terms" style={{ color: '#0077b6', marginRight: '20px' }}>Terms</a>
          <a href="/privacy" style={{ color: '#0077b6', marginRight: '20px' }}>Privacy</a>
          <a href="/legal" style={{ color: '#0077b6' }}>Legal</a>
        </p>
        <p style={{ color: '#0096c7', marginTop: '10px' }}>
          © 2025 BlueTubeTV • Built with ❤️ for drone pilots
        </p>
      </footer>
    </div>
  );
}