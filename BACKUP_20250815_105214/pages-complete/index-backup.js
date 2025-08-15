import React, { useState, useEffect } from 'react';
import { navigationFixes } from '../components/NavigationFix';
import { useActivePilots, useLiveViewers } from '../hooks/useRealData'
const HomePage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Wire up buttons when component mounts
    fixButtons();
  }, []);

  const fixButtons = () => {
    // Fix the Start Streaming button
    const startStreamingBtn = document.getElementById('start-streaming-btn');
    if (startStreamingBtn) {
      startStreamingBtn.onclick = () => {
        window.location.href = navigationFixes.homepage['Start Streaming FREE'];
      };
    }
  };

  const styles = {
    body: {
      margin: 0,
      background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
      color: 'white',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      minHeight: '100vh',
    },
    topNav: {
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    navContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      fontSize: '28px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      textDecoration: 'none',
      color: 'white',
    },
    navLinks: {
      display: 'flex',
      gap: '30px',
      alignItems: 'center',
    },
    navLink: {
      color: '#94a3b8',
      textDecoration: 'none',
      fontSize: '16px',
      transition: 'color 0.3s ease',
      cursor: 'pointer',
    },
    uploadButton: {
      background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
      color: 'white',
      border: 'none',
      padding: '10px 24px',
      borderRadius: '25px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
    },
    signInButton: {
      background: 'transparent',
      border: '1px solid rgba(59, 130, 246, 0.5)',
      color: '#60a5fa',
      padding: '10px 24px',
      borderRadius: '25px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '60px 20px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '60px',
    },
    heroLogo: {
      fontSize: '56px',
      fontWeight: 'bold',
      marginBottom: '20px',
      background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    tagline: {
      fontSize: '24px',
      color: '#94a3b8',
      marginBottom: '40px',
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
      gap: '30px',
      marginBottom: '60px',
    },
    card: {
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    },
    cardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4)',
      border: '1px solid rgba(59, 130, 246, 0.4)',
    },
    iconContainer: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '25px',
      fontSize: '40px',
    },
    watchIcon: {
      background: 'linear-gradient(135deg, #ef4444, #f97316)',
    },
    workIcon: {
      background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    },
    hireIcon: {
      background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    },
    cardTitle: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '15px',
    },
    cardSubtitle: {
      fontSize: '18px',
      color: '#94a3b8',
      marginBottom: '30px',
      lineHeight: '1.6',
    },
    buttonPrimary: {
      background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
      color: 'white',
      border: 'none',
      padding: '20px 40px',
      borderRadius: '50px',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 10px 40px rgba(239, 68, 68, 0.4)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      justifyContent: 'center',
      width: '100%',
      transition: 'all 0.3s ease',
    },
    features: {
      marginTop: '30px',
      paddingTop: '30px',
      borderTop: '1px solid rgba(59, 130, 246, 0.2)',
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '15px',
      color: '#94a3b8',
      fontSize: '16px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '30px',
      marginBottom: '60px',
    },
    statCard: {
      background: 'rgba(30, 41, 59, 0.3)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(59, 130, 246, 0.1)',
      borderRadius: '16px',
      padding: '25px',
      textAlign: 'center',
    },
    statNumber: {
      fontSize: '36px',
      fontWeight: 'bold',
      marginBottom: '8px',
      background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    statLabel: {
      color: '#94a3b8',
      fontSize: '16px',
    },
    footer: {
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(59, 130, 246, 0.2)',
      marginTop: '100px',
    },
    footerContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '60px 20px',
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '40px',
      marginBottom: '40px',
    },
    footerSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    footerTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    footerLink: {
      color: '#94a3b8',
      textDecoration: 'none',
      fontSize: '16px',
      transition: 'color 0.3s ease',
      cursor: 'pointer',
    },
    footerBottom: {
      paddingTop: '40px',
      borderTop: '1px solid rgba(59, 130, 246, 0.2)',
      textAlign: 'center',
      color: '#64748b',
    },
    decorativeGradient: {
      position: 'absolute',
      top: '-50%',
      right: '-50%',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
      pointerEvents: 'none',
    },
    mobileMenuButton: {
      display: 'none',
      background: 'transparent',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      padding: '10px',
    },
    mobileMenu: {
      position: 'fixed',
      top: 0,
      right: 0,
      width: '300px',
      height: '100vh',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      zIndex: 200,
      padding: '20px',
    },
    mobileMenuOpen: {
      transform: 'translateX(0)',
    },
  };

  const navigationPaths = [
    {
      id: 'watch',
      title: 'Watch Live Streams',
      subtitle: 'Experience stunning aerial views from drone pilots worldwide',
      icon: '📺',
      iconBg: styles.watchIcon,
      button: 'Start Watching',
      path: '/browse',
      features: [
        { icon: '🔴', text: 'Live drone streams 24/7' },
        { icon: '💬', text: 'Interactive chat with pilots' },
        { icon: '💰', text: 'Support pilots with tips' },
        { icon: '🎬', text: 'HD quality streaming' },
      ],
    },
    {
      id: 'work',
      title: 'Find Drone Jobs',
      subtitle: 'Connect with clients who need professional drone services',
      icon: '🚁',
      iconBg: styles.workIcon,
      button: 'Browse Jobs',
      path: '/jobs',
      features: [
        { icon: '💼', text: 'Real-time job listings' },
        { icon: '💵', text: '$150+ average per job' },
        { icon: '📍', text: 'Local & remote opportunities' },
        { icon: '⭐', text: 'Build your reputation' },
      ],
    },
    {
      id: 'hire',
      title: 'Hire a Pilot',
      subtitle: 'Find certified drone operators for your project needs',
      icon: '🎯',
      iconBg: styles.hireIcon,
      button: 'Post a Job',
      path: '/jobs/post-job',
      features: [
        { icon: '✅', text: 'Verified professionals' },
        { icon: '🛡️', text: 'Insured & licensed pilots' },
        { icon: '📸', text: 'Portfolio reviews' },
        { icon: '⚡', text: 'Quick turnaround' },
      ],
    },
  ];

  const stats = [
    { number: '0', label: 'Active Pilots' },
    { number: '0', label: 'Live Viewers' },
    { number: '$0', label: 'Jobs Completed' },
    { number: '0%', label: 'Satisfaction' },
  ];

  return (
    <div className="earth-view">
      <div style={styles.body}>
        {/* Top Navigation */}
        <nav style={styles.topNav}>
          <div style={styles.navContainer}>
            <a href="/" style={styles.logo}>
              🚁 BlueTubeTV
            </a>
            
            <div style={styles.navLinks}>
              <a href="/browse" style={styles.navLink}>Browse</a>
              <a href="/live" style={styles.navLink}>Go Live</a>
              <a href="/jobs" style={styles.navLink}>Jobs</a>
              <a href="/pilot-setup" style={styles.navLink}>Become a Pilot</a>
              <a href="/dashboard" style={styles.navLink}>Dashboard</a>
              
              <button
                onClick={() => window.location.href = '/upload'}
                style={styles.uploadButton}
              >
                <span style={{ fontSize: "18px" }}>📤</span>
                Upload
              </button>
              
              <button
                onClick={() => window.location.href = '/login'}
                style={styles.signInButton}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                }}
              >
                Sign In
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              style={styles.mobileMenuButton}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <span style={{ fontSize: "24px" }}>✕</span> : <span style={{ fontSize: "24px" }}>☰</span>}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div style={{
          ...styles.mobileMenu,
          ...(mobileMenuOpen ? styles.mobileMenuOpen : {})
        }}>
          <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Menu</h3>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <span style={{ fontSize: "24px" }}>✕</span>
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <a href="/browse" style={styles.navLink}>Browse</a>
            <a href="/live" style={styles.navLink}>Go Live</a>
            <a href="/jobs" style={styles.navLink}>Jobs</a>
            <a href="/pilot-setup" style={styles.navLink}>Become a Pilot</a>
            <a href="/dashboard" style={styles.navLink}>Dashboard</a>
            <button
              onClick={() => window.location.href = '/upload'}
              style={{ ...styles.uploadButton, width: '100%' }}
            >
              <span style={{ fontSize: "18px" }}>📤</span>
              Upload
            </button>
            <button 
              onClick={() => window.location.href = '/login'}
              style={{ ...styles.signInButton, width: '100%' }}
            >
              Sign In
            </button>
          </div>
        </div>

        <div style={styles.container}>
          {/* Header */}
          <header style={styles.header}>
            <h1 style={styles.heroLogo}>BlueTubeTV</h1>
            <p style={styles.tagline}>
              The Professional Drone Streaming & Job Marketplace
            </p>
          </header>

          {/* Stats Bar */}
          <div style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} style={styles.statCard}>
                <div style={styles.statNumber}>{stat.number}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Main Navigation Cards */}
          <div style={styles.mainGrid}>
            {navigationPaths.map((path) => (
              <div
                key={path.id}
                style={{
                  ...styles.card,
                  ...(hoveredCard === path.id ? styles.cardHover : {}),
                }}
                onMouseEnter={() => setHoveredCard(path.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => window.location.href = path.path}
              >
                <div style={styles.decorativeGradient} />
                
                <div style={{ ...styles.iconContainer, ...path.iconBg }}>
                  <span>{path.icon}</span>
                </div>
                
                <h2 style={styles.cardTitle}>{path.title}</h2>
                <p style={styles.cardSubtitle}>{path.subtitle}</p>
                
                <button 
                  style={{
                    ...styles.buttonPrimary,
                    ...(path.id === 'work' ? { background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' } : {}),
                    ...(path.id === 'hire' ? { background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' } : {}),
                  }}
                >
                  {path.button}
                  <span style={{ fontSize: "20px" }}>→</span>
                </button>

                <div style={styles.features}>
                  {path.features.map((feature, index) => (
                    <div key={index} style={styles.featureItem}>
                      <span>{feature.icon}</span>
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Secondary Actions */}
          <div style={{
            textAlign: 'center',
            marginTop: '80px',
            paddingTop: '40px',
            borderTop: '1px solid rgba(59, 130, 246, 0.2)',
          }}>
            <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>
              Ready to Start Flying?
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '30px' }}>
              Join thousands of drone pilots and enthusiasts
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.location.href = '/pilot-setup'}
                style={styles.buttonPrimary}
              >
                🚁 Become a Pilot
              </button>
              <button
                id="start-streaming-btn"
                className="live-badge"
                onClick={() => window.location.href = '/signup?role=pilot'}
                style={{
                  ...styles.signInButton,
                  padding: '20px 40px',
                  fontSize: '18px',
                }}
              >
                <span className="live-dot"></span>
                🔴 Start Streaming
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerContainer}>
            <div style={styles.footerGrid}>
              {/* Company */}
              <div style={styles.footerSection}>
                <h3 style={styles.footerTitle}>Company</h3>
                <a href="/about" style={styles.footerLink}>About Us</a>
                <a href="/careers" style={styles.footerLink}>Careers</a>
                <a href="/partnerships" style={styles.footerLink}>Partnerships</a>
                <a href="/founders" style={styles.footerLink}>Founders</a>
              </div>

              {/* Platform */}
              <div style={styles.footerSection}>
                <h3 style={styles.footerTitle}>Platform</h3>
                <a href="/browse" style={styles.footerLink}>Browse Streams</a>
                <a href="/jobs" style={styles.footerLink}>Find Jobs</a>
                <a href="/pilot-setup" style={styles.footerLink}>Become a Pilot</a>
                <a href="/pricing" style={styles.footerLink}>Pricing</a>
              </div>

              {/* Resources */}
              <div style={styles.footerSection}>
                <h3 style={styles.footerTitle}>Resources</h3>
                <a href="/help" style={styles.footerLink}>Help Center</a>
                <a href="/safety" style={styles.footerLink}>Safety</a>
                <a href="/guidelines" style={styles.footerLink}>Community Guidelines</a>
                <a href="/blog" style={styles.footerLink}>Blog</a>
              </div>

              {/* Legal */}
              <div style={styles.footerSection}>
                <h3 style={styles.footerTitle}>Legal</h3>
                <a href="/terms" style={styles.footerLink}>Terms of Service</a>
                <a href="/privacy" style={styles.footerLink}>Privacy Policy</a>
                <a href="/legal" style={styles.footerLink}>Legal Notice</a>
                <a href="/cookies" style={styles.footerLink}>Cookie Policy</a>
              </div>
            </div>

            <div style={styles.footerBottom}>
              <p>© 2025 BlueTubeTV. All rights reserved.</p>
              <p style={{ marginTop: '10px', fontSize: '14px' }}>
                Made with ❤️ for the drone community
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;