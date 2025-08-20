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
