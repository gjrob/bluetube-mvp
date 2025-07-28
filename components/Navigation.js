// components/Navigation.js - With inline styles
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Navigation() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path) => router.pathname === path;
  
  // Styles
  const navStyle = {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderBottom: '1px solid #e5e5e5'
  };
  
  const containerStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px'
  };
  
  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: 'black'
  };
  
  const linkStyle = {
    textDecoration: 'none',
    color: '#374151',
    transition: 'color 0.2s',
    cursor: 'pointer'
  };
  
  const activeLinkStyle = {
    ...linkStyle,
    color: '#2563eb',
    fontWeight: '600'
  };
  
  const goLiveButtonStyle = {
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
    border: 'none',
    cursor: 'pointer'
  };
  
  const desktopMenuStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  };
  
  const mobileMenuButtonStyle = {
    display: 'none',
    padding: '0.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  };
  
  const mobileMenuStyle = {
    display: mobileMenuOpen ? 'flex' : 'none',
    flexDirection: 'column',
    gap: '0.75rem',
    padding: '1rem',
    borderTop: '1px solid #e5e5e5'
  };
  
  // Media query handled with JavaScript
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <a href="/" style={logoStyle}>
          <span style={{ fontSize: '1.5rem' }}>🚁</span>
          <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>BlueTubeTV</span>
        </a>
        
        <div style={{ ...desktopMenuStyle, ...(isMobile ? { display: 'none' } : {}) }}>
          <a 
            href="/" 
            style={isActive('/') ? activeLinkStyle : linkStyle}
            onMouseEnter={(e) => e.target.style.color = '#2563eb'}
            onMouseLeave={(e) => e.target.style.color = isActive('/') ? '#2563eb' : '#374151'}
          >
            Home
          </a>
          <a 
            href="/browse" 
            style={isActive('/browse') ? activeLinkStyle : linkStyle}
            onMouseEnter={(e) => e.target.style.color = '#2563eb'}
            onMouseLeave={(e) => e.target.style.color = isActive('/browse') ? '#2563eb' : '#374151'}
          >
            Browse
          </a>
          <a 
            href="/live" 
            style={isActive('/live') ? activeLinkStyle : linkStyle}
            onMouseEnter={(e) => e.target.style.color = '#2563eb'}
            onMouseLeave={(e) => e.target.style.color = isActive('/live') ? '#2563eb' : '#374151'}
          >
            My Streams
          </a>
          <a 
            href="/dashboard" 
            style={isActive('/dashboard') ? activeLinkStyle : linkStyle}
            onMouseEnter={(e) => e.target.style.color = '#2563eb'}
            onMouseLeave={(e) => e.target.style.color = isActive('/dashboard') ? '#2563eb' : '#374151'}
          >
            Dashboard
          </a>
          <a 
            href="/live" 
            style={goLiveButtonStyle}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
          >
            🔴 Go Live
          </a>
        </div>
        
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          style={{ ...mobileMenuButtonStyle, ...(isMobile ? { display: 'block' } : {}) }}
        >
          <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      
      {isMobile && (
        <div style={mobileMenuStyle}>
          <a href="/" style={linkStyle}>Home</a>
          <a href="/browse" style={linkStyle}>Browse</a>
          <a href="/live" style={linkStyle}>My Streams</a>
          <a href="/dashboard" style={linkStyle}>Dashboard</a>
          <a href="/live" style={{ ...goLiveButtonStyle, textAlign: 'center' }}>
            🔴 Go Live
          </a>
        </div>
      )}
    </nav>
  );
}