import React, { useState, useEffect } from 'react';

const RevenueDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    completedJobs: 0,
    avgJobValue: 0,
    monthlyProjection: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueStats();
  }, []);

  const fetchRevenueStats = async () => {
    try {
      // Fetch from your transactions table
      const response = await fetch('/api/analytics/revenue');
      if (response.ok) {
        const data = await response.json();
        
        // Calculate stats based on your proven $150/job model
        const completedJobs = data.completed_jobs || 0;
        const totalRevenue = completedJobs * 150; // Your proven revenue per job
        
        setStats({
          totalRevenue,
          completedJobs,
          avgJobValue: 150,
          monthlyProjection: (totalRevenue / 30) * 30 // Current pace
        });
      }
    } catch (error) {
      console.error('Failed to fetch revenue stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, color }) => (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      textAlign: 'center',
      border: `3px solid ${color}`
    }}>
      <h3 style={{
        color: '#6B7280',
        fontSize: '14px',
        fontWeight: '600',
        margin: '0 0 8px 0',
        textTransform: 'uppercase'
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '32px',
        fontWeight: '700',
        color: color,
        margin: '8px 0'
      }}>
        {value}
      </p>
      {subtitle && (
        <p style={{
          fontSize: '12px',
          color: '#9CA3AF',
          margin: '4px 0 0 0'
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: '40px'}}>
        <div style={{color: '#6B7280'}}>Loading revenue dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{maxWidth: '1200px', margin: '0 auto', padding: '20px'}}>
      <h2 style={{
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '24px',
        color: '#111827'
      }}>
        📊 Revenue Dashboard
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          subtitle="All-time earnings"
          color="#059669"
        />
        
        <StatCard
          title="Completed Jobs"
          value={stats.completedJobs}
          subtitle="Jobs finished"
          color="#3B82F6"
        />
        
        <StatCard
          title="Avg Per Job"
          value={`$${stats.avgJobValue}`}
          subtitle="Your proven model"
          color="#8B5CF6"
        />
        
        <StatCard
          title="Path to $15K"
          value={`${Math.max(0, 100 - stats.completedJobs)} jobs`}
          subtitle="Remaining to hit monthly target"
          color="#F59E0B"
        />
      </div>

      {/* Progress Bar to $15K */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{marginBottom: '16px', color: '#111827'}}>
          Progress to $15,000/month target
        </h3>
        <div style={{
          backgroundColor: '#E5E7EB',
          borderRadius: '10px',
          height: '20px',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: '#059669',
            height: '100%',
            width: `${Math.min(100, (stats.completedJobs / 100) * 100)}%`,
            transition: 'width 0.5s ease'
          }} />
        </div>
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          marginTop: '8px'
        }}>
          {stats.completedJobs}/100 jobs needed for $15K/month
        </p>
      </div>
    </div>
  );
};

export default RevenueDashboard;