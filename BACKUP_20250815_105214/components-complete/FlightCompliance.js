// components/FlightCompliance.js
import { useState, useEffect } from 'react';

export default function FlightCompliance({ streamKey }) {
  const [isConnected, setIsConnected] = useState(false);
  const [telemetry, setTelemetry] = useState({
    altitude: 0,
    speed: 0,
    battery: 100,
    location: { lat: 33.7490, lng: -84.3880 }
  });

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setTelemetry(prev => ({
          altitude: Math.min(350, Math.max(0, prev.altitude + (Math.random() - 0.5) * 20)),
          speed: Math.max(0, 15 + (Math.random() - 0.5) * 10),
          battery: Math.max(20, prev.battery - 0.1),
          location: prev.location
        }));
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const isCompliant = telemetry.altitude <= 400;

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '20px',
      padding: '30px',
      marginTop: '20px',
      color: 'white'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '24px', margin: 0, color: 'white' }}>✈️ Flight Compliance Monitor</h2>
        <button
          onClick={() => setIsConnected(!isConnected)}
          style={{
            padding: '10px 20px',
            background: isConnected ? '#ef4444' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {isConnected ? 'Disconnect' : 'Connect'}
        </button>
      </div>

      {isConnected ? (
        <div style={{
          background: 'rgba(15, 23, 42, 0.5)',
          borderRadius: '12px',
          padding: '20px',
          border: `2px solid ${isCompliant ? '#10b981' : '#ef4444'}`
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#60a5fa' }}>
                {telemetry.altitude.toFixed(1)} ft
              </div>
              <div style={{ fontSize: '14px', color: '#94a3b8' }}>Altitude</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#60a5fa' }}>
                {telemetry.speed.toFixed(1)} mph
              </div>
              <div style={{ fontSize: '14px', color: '#94a3b8' }}>Speed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#60a5fa' }}>
                {telemetry.battery.toFixed(1)}%
              </div>
              <div style={{ fontSize: '14px', color: '#94a3b8' }}>Battery</div>
            </div>
          </div>
          
          <div style={{ 
            textAlign: 'center',
            padding: '10px',
            borderRadius: '8px',
            background: isCompliant ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'
          }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: 'bold',
              color: isCompliant ? '#10b981' : '#ef4444'
            }}>
              {isCompliant ? '✅ Flight Compliant' : '⚠️ Altitude Violation!'}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '5px' }}>
              GPS: {telemetry.location.lat.toFixed(4)}, {telemetry.location.lng.toFixed(4)}
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#94a3b8'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📡</div>
          <div>Click "Connect" to start monitoring flight telemetry</div>
        </div>
      )}
    </div>
  );

}
