// pages/dashboard.js - BlueTubeTV Ocean Theme matching globals.css 🌊
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth'; // FIXED: Named import
import Layout from '../components/Layout';
import StreamSetup from '../components/StreamSetup';
import ContentManager from '../components/ContentManager';
import Analytics from '../components/Analytics';

const Dashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('stream');
  const [stats, setStats] = useState({
    views: 0,
    earnings: 0,
    subscribers: 0,
    liveViewers: 0
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="dashboard-wrapper" style={styles.loading}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading Ocean Dashboard...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'stream', label: '🔴 Stream', component: StreamSetup },
    { id: 'content', label: '📦 Content', component: ContentManager },
    { id: 'analytics', label: '📊 Analytics', component: Analytics },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || StreamSetup;

  return (
    <Layout>
      <div className="dashboard-wrapper">
        <div style={styles.container}>
          {/* Ocean Wave Header */}
          <div className="header-content" style={styles.headerOverride}>
            <h1 className="gradient-title" style={styles.title}>
              BlueTube Ocean Dashboard 🌊
            </h1>
            <p className="header-subtitle">
              Welcome back, {user.username || 'Ocean Explorer'}!
            </p>
          </div>

          {/* Stats Grid - Glass Cards */}
          <div style={styles.statsGrid}>
            <div className="glass-card" style={styles.statCard}>
              <div style={styles.statIcon}>🌊</div>
              <div style={styles.statLabel}>Live Viewers</div>
              <div style={styles.statValue}>{stats.liveViewers}</div>
              <div style={styles.statChange}>Riding the wave</div>
            </div>
            
            <div className="glass-card" style={styles.statCard}>
              <div style={styles.statIcon}>🐬</div>
              <div style={styles.statLabel}>Total Views</div>
              <div style={styles.statValue}>{stats.views.toLocaleString()}</div>
              <div style={styles.statChange}>+25% this week</div>
            </div>
            
            <div className="glass-card" style={styles.statCard}>
              <div style={styles.statIcon}>💎</div>
              <div style={styles.statLabel}>Earnings</div>
              <div style={styles.statValue}>${stats.earnings.toFixed(2)}</div>
              <div style={styles.statChange}>Ocean treasures</div>
            </div>
            
            <div className="glass-card" style={styles.statCard}>
              <div style={styles.statIcon}>🦈</div>
              <div style={styles.statLabel}>Subscribers</div>
              <div style={styles.statValue}>{stats.subscribers}</div>
              <div style={styles.statChange}>+45 new crew</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div style={styles.tabContainer}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={activeTab === tab.id ? 'glass-card' : ''}
                style={{
                  ...styles.tabButton,
                  ...(activeTab === tab.id ? styles.activeTab : {})
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="glass-card" style={styles.content}>
            <ActiveComponent />
          </div>

          {/* Quick Actions - Ocean Themed */}
          <div style={styles.quickActions}>
            <h3 style={styles.sectionTitle}>Deep Dive Actions</h3>
            <div style={styles.actionGrid}>
              <button 
                className="glass-card"
                style={styles.actionButton} 
                onClick={() => router.push('/stream/new')}
              >
                <span style={styles.actionIcon}>🚀</span>
                <span>Go Live</span>
              </button>
              <button 
                className="glass-card"
                style={styles.actionButton} 
                onClick={() => router.push('/upload')}
              >
                <span style={styles.actionIcon}>🌊</span>
                <span>Upload</span>
              </button>
              <button 
                className="glass-card"
                style={styles.actionButton} 
                onClick={() => router.push('/settings')}
              >
                <span style={styles.actionIcon}>⚓</span>
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '4px solid rgba(0, 180, 216, 0.2)',
    borderTop: '4px solid #00b4d8',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '20px',
    color: '#00b4d8',
    fontSize: '18px',
  },
  headerOverride: {
    marginBottom: '40px',
    textAlign: 'center',
  },
  title: {
    fontSize: '48px',
    fontWeight: '900',
    marginBottom: '10px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  statIcon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  statLabel: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: '8px',
    textShadow: '0 2px 10px rgba(0, 212, 255, 0.5)',
  },
  statChange: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
  },
  tabContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    padding: '20px',
    background: 'rgba(0, 53, 102, 0.3)',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
  },
  tabButton: {
    padding: '12px 24px',
    background: 'transparent',
    border: '2px solid transparent',
    borderRadius: '12px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  activeTab: {
    color: '#ffffff',
    borderColor: '#00b4d8',
    background: 'rgba(0, 180, 216, 0.1) !important',
  },
  content: {
    minHeight: '400px',
    marginBottom: '40px',
  },
  quickActions: {
    marginTop: '40px',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '24px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #00b4d8, #0096c7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  actionButton: {
    padding: '30px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    fontSize: '18px',
    fontWeight: '500',
    color: '#ffffff',
    transition: 'all 0.3s ease',
    border: 'none',
  },
  actionIcon: {
    fontSize: '36px',
  },
};

export default Dashboard;