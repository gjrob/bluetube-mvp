// components/AnalyticsDashboard.js
import { useEffect, useState } from 'react';

export default function AnalyticsDashboard({ pilotId }) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [pilotId]);

  const fetchAnalytics = async () => {
    const res = await fetch(`/api/faa/analytics?pilotId=${pilotId}`);
    const data = await res.json();
    setAnalytics(data);
  };

  if (!analytics) return <div>Loading analytics...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Pilot Analytics Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div className="glass-card">
          <h3>Flight Compliance</h3>
          <p style={{ fontSize: '48px', color: '#10b981' }}>
            {analytics.flightAnalytics.complianceRate}%
          </p>
        </div>
        
        <div className="glass-card">
          <h3>Training Progress</h3>
          <p style={{ fontSize: '48px', color: '#60a5fa' }}>
            {analytics.trainingAnalytics.trainingProgress}%
          </p>
        </div>
        
        <div className="glass-card">
          <h3>Pilot Rank</h3>
          <p style={{ fontSize: '24px', color: '#fbbf24' }}>
            {analytics.summary.rank}
          </p>
        </div>
      </div>
    </div>
  );
}