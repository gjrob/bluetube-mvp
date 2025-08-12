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
