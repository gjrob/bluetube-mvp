// components/Footer.js
export default function Footer() {
  return (
    <footer style={{
      padding: '40px 20px',
      textAlign: 'center',
      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
      marginTop: 'auto',
      background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3))'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ color: '#90e0ef', marginBottom: '20px' }}>
          <a href="/terms" style={{ 
            color: '#90e0ef', 
            marginRight: '30px', 
            textDecoration: 'none',
            transition: 'color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.color = '#caf0f8'}
          onMouseLeave={(e) => e.target.style.color = '#90e0ef'}
          >
            Terms of Service
          </a>
          <a href="/privacy" style={{ 
            color: '#90e0ef', 
            marginRight: '30px', 
            textDecoration: 'none',
            transition: 'color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.color = '#caf0f8'}
          onMouseLeave={(e) => e.target.style.color = '#90e0ef'}
          >
            Privacy Policy
          </a>
          <a href="/legal" style={{ 
            color: '#90e0ef', 
            textDecoration: 'none',
            transition: 'color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.color = '#caf0f8'}
          onMouseLeave={(e) => e.target.style.color = '#90e0ef'}
          >
            Legal
          </a>
        </p>
        <p style={{ color: '#48cae4', marginTop: '10px' }}>
          © 2025 BlueTubeTV • Built with 🚁 for drone pilots
        </p>
        <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '10px' }}>
          FAA Part 107 Compliant • Secure Payments • 24/7 Support
        </p>
      </div>
    </footer>
  );
}