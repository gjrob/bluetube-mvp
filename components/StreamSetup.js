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
