export default function GoLiveButton() {
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999
    }}>
      <a href="/live">
        <button style={{
          padding: '20px 40px',
          background: '#ff0000',
          color: 'white',
          fontSize: '20px',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(255,0,0,0.5)'
        }}>
          🔴 GO LIVE NOW
        </button>
      </a>
    </div>
  );
}
