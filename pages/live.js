
export default function LiveNow() {
  return (
    <div style={{ minHeight: '100vh', background: '#1a1a2e', color: 'white', padding: '20px' }}>
      <h1>🔴 Live Drone Streams</h1>
      
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '40px', 
        borderRadius: '20px',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <h2>No pilots streaming right now</h2>
        <p>Be the first to go live!</p>
        <a href="/pilot-setup" style={{
          display: 'inline-block',
          background: '#3b82f6',
          color: 'white',
          padding: '15px 30px',
          borderRadius: '10px',
          textDecoration: 'none',
          marginTop: '20px'
        }}>
          Start Streaming →
        </a>
      </div>
      
      <div style={{ marginTop: '60px', textAlign: 'center' }}>
        <h3>🚁 Coming Soon:</h3>
        <p>SkyPilot - Sunset Beach Flight - 6:00 PM EST</p>
        <p>FPVRacer - Downtown Racing - 7:30 PM EST</p>
      </div>
    </div>
  );
}