// components/Layout.js - With inline styles
import Navigation from './Navigation';
import Link from 'next/link';

export default function Layout({ children }) {
  const layoutStyle = {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    display: 'flex',
    flexDirection: 'column'
  };
  
  const mainStyle = {
    flex: 1
  };
  
  const footerStyle = {
    backgroundColor: '#f3f4f6',
    borderTop: '1px solid #e5e7eb',
    marginTop: '3rem',
    padding: '1.5rem 0'
  };
  
  const footerContainerStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  };
  
  const footerLinksStyle = {
    display: 'flex',
    gap: '1.5rem',
    fontSize: '0.875rem'
  };
  
  const footerLinkStyle = {
    color: '#6b7280',
    textDecoration: 'none',
    transition: 'color 0.2s'
  };
  
  const logoSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#6b7280'
  };
  
  // ADD THIS - Donation button style
  const donationButtonStyle = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    border: '1px solid rgba(251, 191, 36, 0.3)',
    color: '#fbbf24',
    padding: '12px 24px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    zIndex: 100,
    transition: 'all 0.3s ease'
  };
  
  // Media query for responsive
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
    <div style={layoutStyle}>
      <Navigation />
      <main style={mainStyle}>{children}</main>
      
      {/* ADD THIS - Donation Button */}
      <a
       href="https://coff.ee/garlanjrobinson"
// CHANGE THIS TO YOUR LINK!
        target="_blank"
        rel="noopener noreferrer"
style={{
  position: 'fixed',
  bottom: '30px',
  right: '30px',
  background: '#000',  // Make it BLACK
  color: '#fbbf24',    // Yellow text
  padding: '12px 24px',
  borderRadius: '50px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 'bold',
  border: '2px solid #fbbf24',  // Yellow border
  zIndex: 1000
}}
      >
        ☕ Buy me a coffee
      </a>
      
      <footer style={footerStyle}>
        <div style={{
          ...footerContainerStyle,
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: isMobile ? 'center' : 'space-between'
        }}>
          <div style={logoSectionStyle}>
            <span style={{ fontSize: '1.25rem' }}>🚁</span>
            <span>© 2024 BlueTubeTV</span>
          </div>
          <div style={footerLinksStyle}>
            <a 
              href="/legal" 
              style={footerLinkStyle}
              onMouseEnter={(e) => e.target.style.color = '#1f2937'}
              onMouseLeave={(e) => e.target.style.color = '#6b7280'}
            >
              Legal
            </a>
            <a 
              href="mailto:support@bluetubetv.live" 
              style={footerLinkStyle}
              onMouseEnter={(e) => e.target.style.color = '#1f2937'}
              onMouseLeave={(e) => e.target.style.color = '#6b7280'}
            >
              Contact
            </a>
            <a 
              href="https://twitter.com/bluetubetv" 
              style={footerLinkStyle}
              onMouseEnter={(e) => e.target.style.color = '#1f2937'}
              onMouseLeave={(e) => e.target.style.color = '#6b7280'}
            >
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}