#!/bin/bash
# check-all-components.sh - Find and fix all missing components

echo "🔍 BlueTubeTV Component Checker"
echo "================================"

# Check Dashboard dependencies
echo ""
echo "📊 Checking Dashboard Components..."
components=("StreamSetup" "ContentManager" "Analytics")

for comp in "${components[@]}"; do
  if [ ! -f "components/$comp.js" ]; then
    echo "❌ Missing: components/$comp.js - Creating..."
    
    case $comp in
      "StreamSetup")
        cat > components/StreamSetup.js << 'EOF'
const StreamSetup = () => {
  return (
    <div className="glass-card" style={styles.container}>
      <h2 style={styles.title}>🔴 Stream Setup</h2>
      <div style={styles.content}>
        <div style={styles.field}>
          <label style={styles.label}>Stream Key</label>
          <input 
            className="glass-input"
            value="dbf8-bur4-o8fp-x97d"
            readOnly
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Server URL</label>
          <input 
            className="glass-input"
            value="rtmp://rtmp.livepeer.com/live"
            readOnly
            style={styles.input}
          />
        </div>
        <button className="hero-button" style={styles.button}>
          Start Streaming 🌊
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px' },
  title: { 
    fontSize: '24px', 
    marginBottom: '20px',
    color: '#00b4d8',
  },
  content: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: 'rgba(255,255,255,0.7)', fontSize: '14px' },
  input: { padding: '12px', borderRadius: '8px' },
  button: { marginTop: '20px' }
};

export default StreamSetup;
EOF
        ;;
      
      "ContentManager")
        cat > components/ContentManager.js << 'EOF'
const ContentManager = () => {
  return (
    <div className="glass-card" style={styles.container}>
      <h2 style={styles.title}>📦 Content Manager</h2>
      <div style={styles.grid}>
        <div className="glass-card" style={styles.card}>
          <h3 style={styles.cardTitle}>Uploaded</h3>
          <p style={styles.count}>0</p>
        </div>
        <div className="glass-card" style={styles.card}>
          <h3 style={styles.cardTitle}>Drafts</h3>
          <p style={styles.count}>0</p>
        </div>
        <div className="glass-card" style={styles.card}>
          <h3 style={styles.cardTitle}>Live</h3>
          <p style={styles.count}>0</p>
        </div>
      </div>
      <button className="hero-button" style={styles.uploadBtn}>
        Upload New Content 🌊
      </button>
    </div>
  );
};

const styles = {
  container: { padding: '20px' },
  title: { 
    fontSize: '24px', 
    marginBottom: '20px',
    color: '#00b4d8',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  card: {
    padding: '20px',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '10px',
  },
  count: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#00d4ff',
  },
  uploadBtn: {
    width: '100%',
  }
};

export default ContentManager;
EOF
        ;;
      
      "Analytics")
        cat > components/Analytics.js << 'EOF'
const Analytics = () => {
  return (
    <div className="glass-card" style={styles.container}>
      <h2 style={styles.title}>📊 Analytics</h2>
      <div style={styles.statsGrid}>
        <div className="glass-card" style={styles.stat}>
          <h3 style={styles.statLabel}>Total Views</h3>
          <p style={styles.statValue}>12.5K</p>
        </div>
        <div className="glass-card" style={styles.stat}>
          <h3 style={styles.statLabel}>Watch Time</h3>
          <p style={styles.statValue}>847 hrs</p>
        </div>
        <div className="glass-card" style={styles.stat}>
          <h3 style={styles.statLabel}>Revenue</h3>
          <p style={styles.statValue}>$425</p>
        </div>
        <div className="glass-card" style={styles.stat}>
          <h3 style={styles.statLabel}>Engagement</h3>
          <p style={styles.statValue}>78%</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px' },
  title: { 
    fontSize: '24px', 
    marginBottom: '20px',
    color: '#00b4d8',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  stat: {
    padding: '20px',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '10px',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#00d4ff',
  }
};

export default Analytics;
EOF
        ;;
    esac
    echo "✅ Created: components/$comp.js"
  else
    echo "✅ Found: components/$comp.js"
  fi
done

# Check Layout.js export
echo ""
echo "🔧 Checking Layout component..."
if [ -f "components/Layout.js" ]; then
  if grep -q "export default Layout" components/Layout.js; then
    echo "✅ Layout has default export"
  else
    echo "⚠️  Layout might have export issues"
    echo "   Make sure it ends with: export default Layout;"
  fi
else
  echo "❌ Layout.js not found! Creating basic version..."
  cat > components/Layout.js << 'EOF'
import Navigation from './Navigation';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div style={styles.container}>
      <Navigation />
      <main style={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
  }
};

export default Layout;
EOF
  echo "✅ Created basic Layout.js"
fi

# Check useAuth hook
echo ""
echo "🔐 Checking useAuth hook..."
if [ -f "hooks/useAuth.js" ]; then
  if grep -q "export const useAuth" hooks/useAuth.js || grep -q "export { useAuth }" hooks/useAuth.js; then
    echo "✅ useAuth has named export"
  else
    echo "⚠️  useAuth needs named export. Adding..."
    echo "" >> hooks/useAuth.js
    echo "export { useAuth };" >> hooks/useAuth.js
  fi
else
  echo "❌ useAuth.js not found! Creating..."
  mkdir -p hooks
  cat > hooks/useAuth.js << 'EOF'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for user in localStorage or session
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    // Mock login - replace with actual API call
    const mockUser = { 
      id: 1, 
      email, 
      username: email.split('@')[0] 
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return { user, loading, login, logout };
};
EOF
  echo "✅ Created hooks/useAuth.js"
fi

echo ""
echo "📝 Summary"
echo "=========="
echo "All components should now be in place!"
echo ""
echo "Next steps:"
echo "1. Run: npm run dev"
echo "2. If errors persist, check the console for specific component names"
echo "3. Make sure all imports match export types (default vs named)"