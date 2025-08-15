// components/Footer.js
import Link from 'next/link';
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
        {/* Support Links */}
        <div style={{ marginBottom: '30px' }}>
          <p style={{ color: '#caf0f8', marginBottom: '15px', fontSize: '18px' }}>
            💙 Support BlueTubeTV Development
          </p>
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a 
              href="https://paypal.me/teemg88"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg, #0070ba 0%, #003087 100%)',
                color: 'white',
                padding: '10px 25px',
                borderRadius: '25px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.3s',
                fontSize: '16px',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              💳 PayPal
            </a>

            <a 
              href="https://buymeacoffee.com/teemg88"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg, #FFDD00 0%, #FBB034 100%)',
                color: '#000',
                padding: '10px 25px',
                borderRadius: '25px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.3s',
                fontSize: '16px',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              ☕ Buy Me a Coffee
            </a>
          </div>
        </div>

        {/* Legal Links */}
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

        {/* Platform Fee Notice */}
        <p style={{ 
          color: '#10b981', 
          fontSize: '0.8rem', 
          marginTop: '15px',
          fontStyle: 'italic'
        }}>
          Platform fee: 15% (dropping to 5% after securing sponsorships)
        </p>
      </div>
    </footer>
  );
}
