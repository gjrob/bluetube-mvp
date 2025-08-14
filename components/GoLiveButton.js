
import React, { useState } from 'react';
import analytics from '../lib/analytics-enhanced';
export default function GoLiveButton() {
  const [isLive, setIsLive] = useState(false);
  const [streamKey, setStreamKey] = useState('');
  const [viewers, setViewers] = useState(0);
  
  const handleGoLive = async () => {
    if (!isLive) {
      // Generate stream key
      const newStreamKey = `btv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setStreamKey(newStreamKey);
      
      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Track stream started
      analytics.trackStream('started', {
        id: newStreamKey,
        pilotId: user.id || 'anonymous',
        timestamp: new Date().toISOString()
      });
      
      setIsLive(true);
      
      // Simulate viewers joining
      const viewerInterval = setInterval(() => {
        const newViewers = Math.floor(Math.random() * 10) + 1;
        setViewers(prev => {
          const total = prev + newViewers;
          
          // Track viewer milestones
          if (total > 100 && prev <= 100) {
            analytics.trackStream('milestone_100_viewers', {
              id: streamKey,
              viewers: total
            });
          }
          
          return total;
        });
      }, 5000);
      
      // Store interval ID for cleanup
      window.streamInterval = viewerInterval;
      
    } else {
      // End stream
      analytics.trackStream('ended', {
        id: streamKey,
        pilotId: JSON.parse(localStorage.getItem('user') || '{}').id,
        viewers: viewers,
        duration: Date.now() - parseInt(streamKey.split('-')[1])
      });
      
      setIsLive(false);
      setViewers(0);
      
      // Clear viewer interval
      if (window.streamInterval) {
        clearInterval(window.streamInterval);
      }
    }
  };

  return (
    <div className="stream-control">
      <button 
        onClick={handleGoLive}
        className={`go-live-btn ${isLive ? 'live' : ''}`}
      >
        {isLive ? '🔴 END STREAM' : '📹 GO LIVE'}
      </button>
      
      {isLive && (
        <div className="stream-stats">
          <p>Stream Key: {streamKey}</p>
          <p>Viewers: {viewers}</p>
          <p>RTMP: rtmp://rtmp.livepeer.com/live</p>
        </div>
      )}
    </div>
  );
}
