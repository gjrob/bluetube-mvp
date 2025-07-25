// pages/live.js
export default function Live() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0077be 0%, #00a8cc 25%, #48cae4 50%, #90e0ef 75%, #caf0f8 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Yellow sparkles/accents */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        {/* Floating yellow circles */}
        <div style={{
          position: 'absolute',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,223,0,0.3) 0%, transparent 70%)',
          top: '10%',
          left: '15%',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,223,0,0.4) 0%, transparent 70%)',
          top: '60%',
          right: '20%',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,223,0,0.5) 0%, transparent 70%)',
          bottom: '30%',
          left: '40%',
          animation: 'float 5s ease-in-out infinite'
        }} />
      </div>

      {/* Main content with semi-transparent backgrounds */}
      <div style={{ position: 'relative', zIndex: 1, padding: '20px' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 223, 0, 0.3)'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #0077be, #00a8cc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px',
            textShadow: '0 0 30px rgba(255, 223, 0, 0.5)'
          }}>
            BlueTubeTV
          </h1>
          <h2 style={{
            fontSize: '2rem',
            color: '#0077be',
            marginBottom: '20px'
          }}>
            Live Drone Streaming
          </h2>
          <p style={{ color: '#005577', fontSize: '1.1rem' }}>
            FAA Compliant • Live Altitude Monitoring • Support Your Favorite Pilots
          </p>
        </div>

        {/* Stream Player */}
        <div style={{
          background: 'rgba(0, 47, 73, 0.9)',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          border: '2px solid rgba(255, 223, 0, 0.2)'
        }}>
          <div style={{
            background: '#000',
            borderRadius: '15px',
            aspectRatio: '16/9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.5rem'
          }}>
            Stream has not started yet.
          </div>
        </div>

        {/* Live Chat */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '2px solid rgba(255, 223, 0, 0.3)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '15px',
            color: '#0077be',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            Live Chat
            <span style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#ffdf00',
              animation: 'pulse 2s infinite'
            }}></span>
          </h3>
          <div style={{
            background: 'rgba(0, 119, 190, 0.05)',
            borderRadius: '10px',
            padding: '15px',
            minHeight: '200px'
          }}>
            <p style={{ color: '#0077be' }}>
              <strong>System:</strong> Welcome to the stream!
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}