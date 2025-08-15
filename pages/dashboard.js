// Save as: pages/dashboard.js
// COMPLETE DASHBOARD WITH ALL FEATURES

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [streamKey, setStreamKey] = useState('');
  const [streamTitle, setStreamTitle] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    activeStreams: 0,
    totalViews: 0,
    earnings: 0,
    jobsPosted: 0
  });
  
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    checkAuth();
    loadUserData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
    } else {
      setUser(session.user);
    }
  };

  const loadUserData = async () => {
    // Load user's stream key if exists
    const { data } = await supabase
      .from('users')
      .select('stream_key, total_earnings')
      .single();
    
    if (data) {
      setStreamKey(data.stream_key || '');
      setStats(prev => ({ ...prev, earnings: data.total_earnings || 0 }));
    }
  };

  const generateStreamKey = async () => {
    setLoading(true);
    const newKey = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          stream_key: newKey
        });

      if (!error) {
        setStreamKey(newKey);
        alert('Stream key generated! Use this in OBS Studio.');
      }
    } catch (error) {
      console.error('Error generating key:', error);
    }
    
    setLoading(false);
  };

  const startStreaming = async () => {
    if (!streamTitle) {
      alert('Please enter a stream title');
      return;
    }
    
    if (!streamKey) {
      alert('Please generate a stream key first');
      return;
    }

    setLoading(true);
    
    try {
      // Create stream record
      const { data, error } = await supabase
        .from('streams')
        .insert({
          user_id: user.id,
          title: streamTitle,
          is_live: true,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (!error) {
        setIsStreaming(true);
        alert('Stream started! Configure OBS with your stream key.');
      }
    } catch (error) {
      console.error('Error starting stream:', error);
    }
    
    setLoading(false);
  };

  const stopStreaming = async () => {
    setIsStreaming(false);
    alert('Stream stopped');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Top Navigation Bar */}
      <nav style={{
        background: 'rgba(0,0,0,0.2)',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
            🚁 BlueTubeTV
          </Link>
          
          {/* Main Navigation */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/" style={navLinkStyle}>
              🏠 Home
            </Link>
            <Link href="/dashboard" style={{ ...navLinkStyle, background: 'rgba(255,255,255,0.2)' }}>
              📊 Dashboard
            </Link>
            <Link href="/marketplace" style={navLinkStyle}>
              🛍️ Marketplace
            </Link>
            <Link href="/live" style={navLinkStyle}>
              🔴 Watch Live
            </Link>
            <Link href="/jobs" style={navLinkStyle}>
              💼 Jobs
            </Link>
            <Link href="/upload" style={navLinkStyle}>
              📤 Upload
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: 'white' }}>{user?.email}</span>
          <button
            onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
            style={{
              padding: '8px 16px',
              background: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Dashboard Header */}
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', marginBottom: '10px' }}>Welcome to BlueTubeTV! 🚁</h1>
        <p style={{ color: 'rgba(255,255,255,0.9)' }}>The professional drone streaming & job marketplace</p>
      </div>

      {/* Stats Cards */}
      <div style={{ padding: '0 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={statCard}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔴</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '5px' }}>{stats.activeStreams}</div>
          <div style={{ color: '#666' }}>ACTIVE STREAMS</div>
        </div>
        <div style={statCard}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>👁️</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '5px' }}>{stats.totalViews}</div>
          <div style={{ color: '#666' }}>TOTAL VIEWS</div>
        </div>
        <div style={statCard}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>💰</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '5px' }}>${stats.earnings}</div>
          <div style={{ color: '#666' }}>EARNINGS</div>
        </div>
        <div style={statCard}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📋</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '5px' }}>{stats.jobsPosted}</div>
          <div style={{ color: '#666' }}>JOBS POSTED</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ padding: '0 40px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid rgba(255,255,255,0.2)' }}>
          {['overview', 'stream', 'jobs', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                background: activeTab === tab ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '5px 5px 0 0',
                cursor: 'pointer',
                fontSize: '16px',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ padding: '0 40px 40px' }}>
        {activeTab === 'stream' && (
          <div style={contentCard}>
            <h2 style={{ marginBottom: '30px' }}>Stream Settings</h2>
            
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Stream Title</label>
              <input
                type="text"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                placeholder="Enter your stream title"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Stream Key</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={streamKey || 'Click Generate to create key'}
                  readOnly
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    background: '#f5f5f5',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                  }}
                />
                <button
                  onClick={generateStreamKey}
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Generate Key
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>RTMP URL</label>
              <input
                type="text"
                value="rtmp://live.bluetubetv.live/live"
                readOnly
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  background: '#f5f5f5',
                  fontSize: '14px',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {!isStreaming ? (
                <button
                  onClick={startStreaming}
                  disabled={loading || !streamKey}
                  style={{
                    padding: '15px 40px',
                    background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  🔴 Start Streaming
                </button>
              ) : (
                <button
                  onClick={stopStreaming}
                  style={{
                    padding: '15px 40px',
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  ⏹️ Stop Streaming
                </button>
              )}
            </div>

            {/* OBS Instructions */}
            <div style={{ marginTop: '40px', padding: '20px', background: '#f5f5f5', borderRadius: '10px' }}>
              <h3 style={{ marginBottom: '15px' }}>📹 OBS Studio Setup:</h3>
              <ol style={{ lineHeight: '1.8' }}>
                <li>Open OBS Studio</li>
                <li>Go to Settings → Stream</li>
                <li>Service: Custom</li>
                <li>Server: <code style={{ background: '#e0e0e0', padding: '2px 5px' }}>rtmp://live.bluetubetv.live/live</code></li>
                <li>Stream Key: <code style={{ background: '#e0e0e0', padding: '2px 5px' }}>{streamKey || '[Generate key above]'}</code></li>
                <li>Click OK and Start Streaming!</li>
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div style={contentCard}>
            <h2 style={{ marginBottom: '30px' }}>Quick Actions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <Link href="/live" style={actionButton}>
                🔴 Go Live Now
              </Link>
              <Link href="/upload" style={actionButton}>
                📤 Upload Video
              </Link>
              <Link href="/jobs/post" style={actionButton}>
                💼 Post a Job
              </Link>
              <Link href="/marketplace" style={actionButton}>
                🛍️ Browse Content
              </Link>
              <Link href="/profile" style={actionButton}>
                👤 Edit Profile
              </Link>
              <Link href="/earnings" style={actionButton}>
                💰 View Earnings
              </Link>
            </div>

            <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>Recent Activity</h3>
            <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '10px', textAlign: 'center', color: '#666' }}>
              No recent activity. Start streaming to see your stats!
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div style={contentCard}>
            <h2 style={{ marginBottom: '30px' }}>Job Management</h2>
            <Link href="/post-job" style={{ ...actionButton, display: 'inline-block', marginBottom: '20px' }}>
              ➕ Post New Job
            </Link>
            <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '10px', textAlign: 'center', color: '#666' }}>
              No jobs posted yet. Post your first drone job!
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={contentCard}>
            <h2 style={{ marginBottom: '30px' }}>Account Settings</h2>
            <div style={{ marginBottom: '20px' }}>
              <strong>Email:</strong> {user?.email}
            </div>
            <div style={{ marginBottom: '20px' }}>
              <strong>Account Type:</strong> Free (Upgrade to Pro for $29/month)
            </div>
            <Link href="/pricing" style={{ ...actionButton, display: 'inline-block' }}>
              ⭐ Upgrade to Pro
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const navLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  padding: '8px 15px',
  borderRadius: '5px',
  transition: 'background 0.3s'
};

const statCard = {
  background: 'white',
  padding: '30px',
  borderRadius: '10px',
  textAlign: 'center',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const contentCard = {
  background: 'white',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const actionButton = {
  padding: '15px 20px',
  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '5px',
  textAlign: 'center',
  display: 'block',
  fontWeight: 'bold',
  cursor: 'pointer',
  border: 'none'
};

// Disable SSG to prevent router issues
export async function getServerSideProps() {
  return { props: {} };
}