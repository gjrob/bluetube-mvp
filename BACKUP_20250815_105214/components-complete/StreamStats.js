// components/StreamStats.js
import { useState, useEffect } from 'react';

export default function StreamStats({ streamId }) {
  const [stats, setStats] = useState({
    altitude: 0,
    viewers: 0,
    flightTime: '00:00',
    isLive: false
  });

  useEffect(() => {
    // Poll for updates every 5 seconds
    const interval = setInterval(async () => {
      try {
        // Get Cloudflare stream data
        const response = await fetch(`/api/stream-stats?streamId=${streamId}`);
        const data = await response.json();
        
        setStats(prev => ({
          ...prev,
          viewers: data.viewers,
          flightTime: formatTime(data.duration),
          isLive: data.status === 'live'
        }));
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [streamId]);

  // Get altitude from stream metadata (sent by OBS)
  useEffect(() => {
    // WebSocket connection for real-time data
    const ws = new WebSocket(`wss://your-websocket-server.com/stream/${streamId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.altitude) {
        setStats(prev => ({ ...prev, altitude: data.altitude }));
      }
    };

    return () => ws.close();
  }, [streamId]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', gap: '40px', color: '#94a3b8' }}>
      <div>
        Altitude: <span style={{ color: '#10b981' }}>{stats.altitude} ft ✓</span>
      </div>
      <div>
        Viewers: {stats.viewers.toLocaleString()}
      </div>
      <div>
        Flight Time: {stats.flightTime}
      </div>
      {stats.isLive && (
        <div style={{ color: '#ef4444' }}>● LIVE</div>
      )}
    </div>
  );
}