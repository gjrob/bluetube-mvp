
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';  
import { supabase } from '../lib/supabase';

const Layout = ({ children }) => {
  const router = useRouter();
  const { user, profile, userType, loading, signOut } = useAuth(); // ✅ Now this works!
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get navigation items based on userType
  const getNavItems = () => {
    // Not logged in
    if (!user) {
      return [
        { href: '/browse', label: 'Browse' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/pilot-setup', label: 'How It Works', icon: '📖' },
        { href: '/login', label: 'Login' }
      ];
    }

    // Pilot navigation
    if (userType === 'pilot') {
      return [
        { href: '/dashboard', label: 'Dashboard', icon: '📊' },
        { href: '/browse', label: 'Browse' },
        { href: '/dashboard#earnings', label: 'Earnings', icon: '💰' },
        { href: '/dashboard#analytics', label: 'Analytics', icon: '📈' }
      ];
    }

    // Client navigation
    if (userType === 'client') {
      return [
        { href: '/dashboard', label: 'Dashboard', icon: '📊' },
        { href: '/browse', label: 'Find Pilots' },
        { href: '/dashboard#jobs', label: 'My Jobs', icon: '💼' }
      ];
    }

    // Default viewer navigation
    return [
      { href: '/browse', label: 'Browse' },
      { href: '/pilot-setup', label: 'Become a Pilot', icon: '🚁' }
    ];
  };

  const navItems = getNavItems();

  // Get primary CTA based on userType
  const getPrimaryCTA = () => {
    if (!user) {
      return {
        href: '/signup?role=pilot',
        label: 'Start Streaming FREE',
        style: {
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          color: 'white',
          padding: '10px 24px',
          borderRadius: '9999px',
          fontWeight: '600',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
          display: 'inline-block'
        }
      };
    }

    if (userType === 'pilot') {
      return {
        href: '/live',
        label: '🔴 Go Live',
        style: {
          background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
          color: 'white',
          padding: '10px 24px',
          borderRadius: '9999px',
          fontWeight: '600',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
          display: 'inline-block',
          animation: 'pulse 2s infinite'
        }
      };
    }

    if (userType === 'client') {
      return {
        href: '/jobs/post',
        label: '💼 Post Job',
        style: {
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          color: 'white',
          padding: '10px 24px',
          borderRadius: '9999px',
          fontWeight: '600',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
          display: 'inline-block'
        }
      };
    }

    return {
      href: '/signup?role=pilot',
      label: 'Become a Pilot',
      style: {
        background: 'linear-gradient(135deg, #059669, #047857)',
        color: 'white',
        padding: '10px 24px',
        borderRadius: '9999px',
        fontWeight: '600',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)',
        display: 'inline-block'
      }
    };
  };

  const primaryCTA = getPrimaryCTA();

  // Link styles
  const linkStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '16px',
    fontWeight: '500',
    color: isActive ? '#60a5fa' : '#cbd5e1',
    textDecoration: 'none',
    transition: 'color 0.3s ease'
  });

  // Add CSS keyframes for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Show loading state while auth is checking
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)'
    }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: isScrolled ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.3)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '64px'
          }}>
            {/* Logo */}
            <Link 
              href="/" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none'
              }}
            >
              <span style={{ fontSize: '32px' }}>🚁</span>
              <span style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'white'
              }}>
                BlueTube<span style={{ color: '#3b82f6' }}>TV</span>
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px'
            }}>
              {/* Navigation Items */}
              {navItems.map(item => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  style={linkStyle(router.pathname === item.href)}
                  onMouseEnter={(e) => {
                    if (router.pathname !== item.href) {
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (router.pathname !== item.href) {
                      e.currentTarget.style.color = '#cbd5e1';
                    }
                  }}
                >
                  {item.icon && <span>{item.icon}</span>}
                  {item.label}
                </Link>
              ))}
              
              {/* Primary CTA Button */}
              <Link 
                href={primaryCTA.href}
                style={primaryCTA.style}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}
              >
                {primaryCTA.label}
              </Link>

              {/* User Menu (if logged in) */}
              {user && (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px',
                      color: '#cbd5e1',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}
                  >
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                  
                  {userDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      marginTop: '8px',
                      width: '200px',
                      background: 'rgba(30, 41, 59, 0.95)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '8px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
                        color: '#94a3b8',
                        fontSize: '12px'
                      }}>
                        {profile?.email || user?.email || 'User'}
                      </div>
                      <Link href="/profile" style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#cbd5e1',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                      }}>
                        Profile
                      </Link>
                      <Link href="/settings" style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#cbd5e1',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                      }}>
                        Settings
                      </Link>
                      <button onClick={signOut} style={{
                        display: 'block',
                        width: '100%',
                        padding: '12px 16px',
                        color: '#cbd5e1',
                        textDecoration: 'none',
                        background: 'transparent',
                        border: 'none',
                        borderTop: '1px solid rgba(59, 130, 246, 0.2)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main style={{ paddingTop: '64px' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'rgba(15, 23, 42, 0.9)',
        borderTop: '1px solid rgba(59, 130, 246, 0.2)',
        marginTop: '80px',
        padding: '32px 24px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div style={{ color: '#64748b', fontSize: '14px' }}>
            © 2024 BlueTubeTV. BlueRingHolding LLC All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/terms" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>
              Terms
            </Link>
            <Link href="/privacy" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>
              Privacy
            </Link>
            <Link href="/help" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>
              Help
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;


