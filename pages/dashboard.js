// pages/dashboard.js - BlueTubeTV Ocean Theme with Enhanced Analytics 🌊
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';
import StreamSetup from '../components/StreamSetup';
import ContentManager from '../components/ContentManager';
import Analytics from '../components/Analytics';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import analytics from '../lib/analytics-enhanced';

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
    } else {
      // Track dashboard view when user is authenticated
      analytics.track('dashboard_viewed', {
        user_id: user.id || user._id,
        username: user.username,
        timestamp: new Date().toISOString()
      });

      // Track initial tab view
      analytics.track('tab_viewed', {
        tab: activeTab,
        user_id: user.id || user._id
      });
    }
  }, [user, router]);

  // Track tab changes
  useEffect(() => {
    if (user && activeTab) {
      analytics.track('tab_switched', {
        tab: activeTab,
        user_id: user.id || user._id,
        timestamp: new Date().toISOString()
      });
    }
  }, [activeTab, user]);

  // Fetch real stats from analytics
  useEffect(() => {
    const fetchAnalyticsStats = async () => {
      if (user) {
        try {
          // Get analytics data from your enhanced analytics system
          const analyticsData = analytics.getMetrics();
          
          // Update stats with real data if available
          setStats(prevStats => ({
            ...prevStats,
            views: analyticsData?.totalViews || prevStats.views,
            liveViewers: analyticsData?.activeSessions || prevStats.liveViewers
          }));
        } catch (error) {
          console.error('Error fetching analytics:', error);
        }
      }
    };

    fetchAnalyticsStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchAnalyticsStats, 30000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) {
    return (
      <div className="dashboard-wrapper" style={styles.loading}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading Ocean Dashboard...</p>
      </div>
    );
  }

  // Updated tabs to include Analytics Dashboard
  const tabs = [
    { id: 'stream', label: '🔴 Stream', component: StreamSetup },
    { id: 'content', label: '📦 Content', component: ContentManager },
    { id: 'analytics', label: '📊 Analytics', component: AnalyticsDashboard }, // Changed to AnalyticsDashboard
    { id: 'insights', label: '🎯 Insights', component: Analytics }, // Keep original Analytics as Insights
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || StreamSetup;

  // Track stat card clicks
  const handleStatClick = (statType) => {
    analytics.track('stat_card_clicked', {
      stat_type: statType,
      user_id: user.id || user._id,
      current_value: stats[statType]
    });
  };

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

          {/* Stats Grid - Glass Cards with Click Tracking */}
          <div style={styles.statsGrid}>
            <div 
              className="glass-card" 
              style={styles.statCard}
              onClick={() => handleStatClick('liveViewers')}
            >
              <div style={styles.statIcon}>🌊</div>
              <div style={styles.statLabel}>Live Viewers</div>
              <div style={styles.statValue}>{stats.liveViewers}</div>
              <div style={styles.statChange}>Riding the wave</div>
            </div>
            
            <div 
              className="glass-card" 
              style={styles.statCard}
              onClick={() => handleStatClick('views')}
            >
              <div style={styles.statIcon}>🐬</div>
              <div style={styles.statLabel}>Total Views</div>
              <div style={styles.statValue}>{stats.views.toLocaleString()}</div>
              <div style={styles.statChange}>+25% this week</div>
            </div>
            
            <div 
              className="glass-card" 
              style={styles.statCard}
              onClick={() => handleStatClick('earnings')}
            >
              <div style={styles.statIcon}>💎</div>
              <div style={styles.statLabel}>Earnings</div>
              <div style={styles.statValue}>${stats.earnings.toFixed(2)}</div>
              <div style={styles.statChange}>Ocean treasures</div>
            </div>
            
            <div 
              className="glass-card" 
              style={styles.statCard}
              onClick={() => handleStatClick('subscribers')}
            >
              <div style={styles.statIcon}>🦈</div>
              <div style={styles.statLabel}>Subscribers</div>
              <div style={styles.statValue}>{stats.subscribers}</div>
              <div style={styles.statChange}>+45 new crew</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div style={styles.tabNav}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...styles.tabButton,
                  ...(activeTab === tab.id ? styles.activeTab : {})
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Component */}
          <div style={styles.componentContainer}>
            <ActiveComponent />
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Ocean-themed styles
const styles = {
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid rgba(255, 255, 255, 0.3)',
    borderTop: '5px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: 'white',
    marginTop: '20px',
    fontSize: '18px'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px'
  },
  headerOverride: {
    marginBottom: '40px',
    textAlign: 'center'
  },
  title: {
    fontSize: '3rem',
    marginBottom: '10px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  statCard: {
    padding: '25px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
    }
  },
  statIcon: {
    fontSize: '2.5rem',
    marginBottom: '10px'
  },
  statLabel: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '5px'
  },
  statChange: {
    fontSize: '12px',
    color: '#4ade80',
    fontStyle: 'italic'
  },
  tabNav: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '10px'
  },
  tabButton: {
    padding: '10px 20px',
    background: 'transparent',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderRadius: '8px 8px 0 0'
  },
  activeTab: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontWeight: 'bold'
  },
  componentContainer: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '30px',
    minHeight: '400px'
  }
};

export default Dashboard;