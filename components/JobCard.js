import React from 'react';
import { MapPin, DollarSign, Clock, Calendar } from 'lucide-react';

export default function JobCard({ job, onClick }) {
  // Demo data for artifact preview
  const demoJob = {
    id: '1',
    title: 'Real Estate Photography - Luxury Home',
    location: 'Los Angeles, CA',
    budget: '$350',
    urgency: 'asap',
    description: 'Need aerial photos and video of a 5-bedroom luxury home in Beverly Hills. Must include sunset shots and pool area coverage.',
    posted: new Date(),
    category: 'real-estate',
    proposals: [1, 2, 3]
  };

  // Use demo data if no job provided (for artifact preview)
  const jobData = job || demoJob;
  const styles = {
    card: {
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '20px',
      padding: '30px',
      marginBottom: '20px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    },
    cardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(59, 130, 246, 0.4)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '20px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: 'white',
    },
    budget: {
      background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      padding: '8px 20px',
      borderRadius: '20px',
      fontSize: '20px',
      fontWeight: 'bold',
    },
    meta: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap',
      marginBottom: '15px',
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      color: '#94a3b8',
      fontSize: '14px',
    },
    description: {
      color: '#cbd5e1',
      lineHeight: '1.6',
      marginBottom: '20px',
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid rgba(59, 130, 246, 0.2)',
      paddingTop: '20px',
    },
    urgencyBadge: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      color: '#ef4444',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600',
    },
    proposalCount: {
      color: '#60a5fa',
      fontSize: '16px',
      fontWeight: '600',
    },
  };

  const [isHovered, setIsHovered] = React.useState(false);

  // Handle missing job data
  if (!jobData) {
    return (
      <div style={styles.card}>
        <p style={{ color: '#94a3b8', textAlign: 'center' }}>No job data available</p>
      </div>
    );
  }

  // Format date
  const formatDate = (date) => {
    if (!date) return 'Recently posted';
    try {
      const now = new Date();
      const posted = new Date(date);
      const diffHours = Math.floor((now - posted) / (1000 * 60 * 60));
      
      if (diffHours < 1) return 'Just posted';
      if (diffHours < 24) return `${diffHours} hours ago`;
      if (diffHours < 48) return 'Yesterday';
      return `${Math.floor(diffHours / 24)} days ago`;
    } catch (error) {
      return 'Recently posted';
    }
  };

  return (
    <div style={{ 
      padding: '20px',
      background: job ? 'transparent' : 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
      minHeight: job ? 'auto' : '100vh'
    }}>
      <div
        style={{
          ...styles.card,
          ...(isHovered ? styles.cardHover : {})
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onClick && onClick(jobData)}
      >
        <div style={styles.header}>
          <div style={{ flex: 1 }}>
            <h3 style={styles.title}>{jobData.title || 'Untitled Job'}</h3>
            <div style={styles.meta}>
              <div style={styles.metaItem}>
                <MapPin size={16} />
                <span>{jobData.location || 'Location TBD'}</span>
              </div>
              <div style={styles.metaItem}>
                <Calendar size={16} />
                <span>{formatDate(jobData.posted)}</span>
              </div>
              <div style={styles.metaItem}>
                <Clock size={16} />
                <span>{jobData.urgency === 'asap' ? 'ASAP' : 'Flexible'}</span>
              </div>
            </div>
          </div>
          <div style={styles.budget}>
            {jobData.budget || '$150'}
          </div>
        </div>

        <p style={styles.description}>
          {jobData.description ? 
            (jobData.description.length > 150 ? 
              jobData.description.substring(0, 150) + '...' : 
              jobData.description) : 
            'No description provided'
          }
        </p>

        <div style={styles.footer}>
          {jobData.urgency === 'asap' && (
            <div style={styles.urgencyBadge}>
              ⚡ Urgent
            </div>
          )}
          <div style={styles.proposalCount}>
            {(jobData.proposals && jobData.proposals.length) || 0} proposals
          </div>
        </div>
      </div>
    </div>
  );
}