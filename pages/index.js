import React, { useState, useEffect } from 'react';
import { navigationFixes } from '../components/NavigationFix';
import { useActivePilots, useLiveViewers } from '../hooks/useRealData';
import { homeStyles as styles } from '../styles/homeStyles';
import CubeInCircle from '../components/CubeInCircle';
import StartStreamButton from '../components/StartStreamButton';

const HomePage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // live stats (fallbacks)
  const activePilots = useActivePilots?.() ?? 0;
  const liveViewers = useLiveViewers?.() ?? 0;

  useEffect(() => {
    const startStreamingBtn = document.getElementById('start-streaming-btn');
    if (startStreamingBtn && navigationFixes?.homepage?.['Start Streaming FREE']) {
      startStreamingBtn.onclick = () => {
        window.location.href = navigationFixes.homepage['Start Streaming FREE'];
      };
    }
  }, []);

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
    { number: String(activePilots || 0), label: 'Active Pilots' },
    { number: String(liveViewers || 0), label: 'Live Viewers' },
    { number: '$0', label: 'Jobs Completed' },
    { number: '0%', label: 'Satisfaction' },
  ];

  return (
    <div className="earth-view">
      <div style={styles.body}>
        {/* Top Navigation */}
        <nav style={styles.topNav}>
          <div style={styles.navContainer}>
            <a href="/" style={styles.logo}>🚁 BlueTubeTV</a>

            <div style={styles.navLinks}>
              <a href="/browse" style={styles.navLink}>Browse</a>
              <a href="/live" style={styles.navLink}>Go Live</a>
              <a href="/jobs" style={styles.navLink}>Jobs</a>
              <a href="/pilot-setup" style={styles.navLink}>Become a Pilot</a>
              <a href="/dashboard" style={styles.navLink}>Dashboard</a>

              <button onClick={() => (window.location.href = '/upload')} style={styles.uploadButton}>
                <span style={{ fontSize: 18 }}>📤</span> Upload
              </button>

              <button
                onClick={() => (window.location.href = '/login')}
                style={styles.signInButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
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
              <span style={{ fontSize: 24 }}>{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div style={{ ...styles.mobileMenu, ...(mobileMenuOpen ? styles.mobileMenuOpen : {}) }}>
          <div style={{ marginBottom: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Menu</h3>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <span style={{ fontSize: 24 }}>✕</span>
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <a href="/browse" style={styles.navLink}>Browse</a>
            <a href="/live" style={styles.navLink}>Go Live</a>
            <a href="/jobs" style={styles.navLink}>Jobs</a>
            <a href="/pilot-setup" style={styles.navLink}>Become a Pilot</a>
            <a href="/dashboard" style={styles.navLink}>Dashboard</a>
            <button onClick={() => (window.location.href = '/upload')} style={{ ...styles.uploadButton, width: '100%' }}>
              <span style={{ fontSize: 18 }}>📤</span> Upload
            </button>
            <button onClick={() => (window.location.href = '/login')} style={{ ...styles.signInButton, width: '100%' }}>
              Sign In
            </button>
          </div>
        </div>

        <div style={styles.container}>
          {/* HERO (inline cube between "BlueTube" and "TV") */}
          <section style={{ marginBottom: '80px', textAlign: 'center' }}>
            <h1 style={styles.headline}>
              <span style={{ color: '#fff' }}>BlueTube</span>

              {/* inline cube between "BlueTube" and "TV" */}
              <span
                className="inline-cube"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 12px',
                  lineHeight: 0,
                  verticalAlign: 'middle',
                  transform: 'translateY(2px)',
                }}
              >
                <CubeInCircle
                  circleSize={100}
                  cubeSize={48}
                  edge="rgba(56,189,248,.95)"
                  face="#0b122d"
                  tiltX={-38}
                  tiltZ={-38}
                  spinSec={9}
                />
              </span>

              <span style={{ color: '#38bdf8', marginRight: 6 }}>TV</span>
              <span style={{ color: '#38bdf8' }}>Empire</span>
            </h1>

            <p style={styles.subHeadline}>
              From blockchain idea to streaming empire in 6 months
            </p>

            <div style={styles.buttonRow}>
              <a href="/live">
                <button style={{ ...styles.button, ...styles.demoButton }}>Watch Live Demo</button>
              </a>
              <a href="/signup">
                <button style={{ ...styles.button, ...styles.trialButton }}>Start Free Trial</button>
              </a>
            </div>
          </section>

          {/* Stats Bar */}
          <div style={styles.statsGrid}>
            {stats.map((stat, i) => (
              <div key={i} style={styles.statCard}>
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
                style={{ ...styles.card, ...(hoveredCard === path.id ? styles.cardHover : {}) }}
                onMouseEnter={() => setHoveredCard(path.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => (window.location.href = path.path)}
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
                    ...(path.id === 'work' && { background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }),
                    ...(path.id === 'hire' && { background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }),
                  }}
                >
                  {path.button} <span style={{ fontSize: 20 }}>→</span>
                </button>

                <div style={styles.features}>
                  {path.features.map((f, idx) => (
                    <div key={idx} style={styles.featureItem}>
                      <span>{f.icon}</span>
                      <span>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Secondary Actions */}
          <div
            style={{
              textAlign: 'center',
              marginTop: 80,
              paddingTop: 40,
              borderTop: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            <h2 style={{ fontSize: 36, marginBottom: 20 }}>Ready to Start Flying?</h2>
            <p style={{ color: '#94a3b8', fontSize: 18, marginBottom: 30 }}>
              Join thousands of drone pilots and enthusiasts
            </p>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => (window.location.href = '/pilot-setup')} style={styles.buttonPrimary}>
                🚁 Become a Pilot
              </button>
              
              <div style={{ display: 'flex', gap: 16 }}>
                <StartStreamButton />
                <button
                  onClick={() => (window.location.href = '/tip')}
                  style={{ 
                    padding: '12px 24px', 
                    borderRadius: 10, 
                    border: 'none', 
                    background: 'linear-gradient(135deg, #f59e0b, #f97316)', 
                    color: '#fff', 
                    fontWeight: 700 
                  }}
                >
                  💰 Send Tip
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerContainer}>
            <div style={styles.footerGrid}>
              <div style={styles.footerSection}>
                <h3 style={styles.footerTitle}>Company</h3>
                <a href="/about" style={styles.footerLink}>About Us</a>
                <a href="/careers" style={styles.footerLink}>Careers</a>
                <a href="/partnerships" style={styles.footerLink}>Partnerships</a>
                <a href="/founders" style={styles.footerLink}>Founders</a>
              </div>
              <div style={styles.footerSection}>
                <h3 style={styles.footerTitle}>Platform</h3>
                <a href="/browse" style={styles.footerLink}>Browse Streams</a>
                <a href="/jobs" style={styles.footerLink}>Find Jobs</a>
                <a href="/pilot-setup" style={styles.footerLink}>Become a Pilot</a>
                <a href="/pricing" style={styles.footerLink}>Pricing</a>
              </div>
              <div style={styles.footerSection}>
                <h3 style={styles.footerTitle}>Resources</h3>
                <a href="/help" style={styles.footerLink}>Help Center</a>
                <a href="/safety" style={styles.footerLink}>Safety</a>
                <a href="/guidelines" style={styles.footerLink}>Community Guidelines</a>
                <a href="/blog" style={styles.footerLink}>Blog</a>
              </div>
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
              <p style={{ marginTop: 10, fontSize: 14 }}>Made with ❤️ for the drone community</p>
            </div>
          </div>
        </footer>
      </div>

      {/* CSS for badge dot animation */}
      <style jsx>{`
        .live-badge .live-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          margin-right: 6px;
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          animation: pulse 1.6s infinite;
        }
        
        @media (max-width: 640px) {
          .inline-cube { 
            transform: translateY(1px) scale(0.85); 
          }
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
