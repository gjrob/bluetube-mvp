import React, { useState, useEffect } from 'react';
import Link from 'next/link';
const JobBoard = ({ currentPilotId }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    job_type: '',
    min_budget: '',
    max_budget: '',
    sort: 'featured_first'
  });
  const [showBidForm, setShowBidForm] = useState(null);

  // Styles
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      marginBottom: '30px',
      textAlign: 'center'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '12px'
    },
    subtitle: {
      fontSize: '16px',
      color: '#6B7280'
    },
    filtersContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '30px',
      padding: '20px',
      backgroundColor: '#F9FAFB',
      borderRadius: '8px'
    },
    filterInput: {
      padding: '8px 12px',
      border: '1px solid #D1D5DB',
      borderRadius: '6px',
      fontSize: '14px'
    },
    jobsGrid: {
      display: 'grid',
      gap: '24px'
    },
    jobCard: (isSponsored) => ({
      backgroundColor: 'white',
      border: isSponsored ? '2px solid #F59E0B' : '1px solid #E5E7EB',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'all 0.2s ease'
    }),
    sponsoredBadge: {
      display: 'inline-block',
      backgroundColor: '#F59E0B',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '600',
      marginBottom: '12px'
    },
    jobTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '8px'
    },
    jobMeta: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      marginBottom: '12px',
      fontSize: '14px',
      color: '#6B7280'
    },
    jobDescription: {
      color: '#4B5563',
      lineHeight: '1.6',
      marginBottom: '16px'
    },
    jobFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '16px',
      borderTop: '1px solid #E5E7EB'
    },
    budget: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#059669'
    },
    bidButton: {
      backgroundColor: '#3B82F6',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    bidCount: {
      fontSize: '14px',
      color: '#6B7280'
    }
  };

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/jobs?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{textAlign: 'center', padding: '60px'}}>
          <div style={{
            display: 'inline-block',
            width: '32px',
            height: '32px',
            border: '3px solid #3B82F6',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <p style={{marginTop: '16px', color: '#6B7280'}}>Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>
        {`@keyframes spin { to { transform: rotate(360deg); } }`}
      </style>

      <div style={styles.header}>
        <h1 style={styles.title}>Available Drone Jobs</h1>
        <p style={styles.subtitle}>Find your next project and start earning</p>
      </div>

      {/* Filters */}
      <div style={styles.filtersContainer}>
        <input
          type="text"
          placeholder="Location (e.g. Austin, TX)"
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          style={styles.filterInput}
        />
        
        <select
          value={filters.job_type}
          onChange={(e) => handleFilterChange('job_type', e.target.value)}
          style={styles.filterInput}
        >
          <option value="">All Job Types</option>
          <option value="custom">Regular Jobs</option>
          <option value="sponsored">Sponsored Jobs</option>
        </select>

        <input
          type="number"
          placeholder="Min Budget ($)"
          value={filters.min_budget}
          onChange={(e) => handleFilterChange('min_budget', e.target.value)}
          style={styles.filterInput}
        />

        <input
          type="number"
          placeholder="Max Budget ($)"
          value={filters.max_budget}
          onChange={(e) => handleFilterChange('max_budget', e.target.value)}
          style={styles.filterInput}
        />

        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          style={styles.filterInput}
        >
          <option value="featured_first">Featured First</option>
          <option value="budget_high">Highest Budget</option>
          <option value="deadline">Deadline Soon</option>
          <option value="newest">Newest First</option>
        </select>
      </div>
<div style={{
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center',
  marginBottom: '20px'
}}>
  <h2 style={{margin: 0, color: '#111827'}}>
    {jobs.length} Jobs Available
  </h2>
  
  <Link href="/jobs/post">
     style={{
      backgroundColor: '#059669',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '14px'
    }}
      + Post a Job
  </Link>
</div>
      {/* Jobs List */}
      <div style={styles.jobsGrid}>
        {jobs.length === 0 ? (
          <div style={{textAlign: 'center', padding: '60px'}}>
            <p style={{color: '#6B7280', fontSize: '16px'}}>No jobs found matching your criteria.</p>
          </div>
        ) : (
          jobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              currentPilotId={currentPilotId}
              onBid={() => setShowBidForm(job.id)}
              styles={styles}
            />
          ))
        )}
      </div>

      {/* Bid Form Modal */}
      {showBidForm && (
        <BidFormModal
          jobId={showBidForm}
          pilotId={currentPilotId}
          onClose={() => setShowBidForm(null)}
          onSuccess={() => {
            setShowBidForm(null);
            fetchJobs(); // Refresh jobs
          }}
        />
      )}
    </div>
  );
};

// Job Card Component
const JobCard = ({ job, currentPilotId, onBid, styles }) => {
  const isSponsored = job.job_type === 'sponsored';
  const bidCount = job.job_bids?.[0]?.count || 0;
  const isOwnJob = job.client_pilot_id === currentPilotId;

  return (
    <div style={styles.jobCard(isSponsored)}>
      {isSponsored && (
        <div style={styles.sponsoredBadge}>
          ⭐ SPONSORED - Higher Commission Rate
        </div>
      )}
      
      <h3 style={styles.jobTitle}>{job.title}</h3>
      
      <div style={styles.jobMeta}>
        <span>📍 {job.location}</span>
        <span>📅 Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
        <span>💰 Commission: {Math.round(job.commission_rate * 100)}%</span>
      </div>
      
      <p style={styles.jobDescription}>{job.description}</p>
      
      <div style={styles.jobFooter}>
        <div>
          <div style={styles.budget}>${job.budget}</div>
          <div style={styles.bidCount}>{bidCount} bids</div>
        </div>
        
        <button 
          style={{
            ...styles.bidButton,
            backgroundColor: isOwnJob ? '#6B7280' : '#3B82F6',
            cursor: isOwnJob ? 'not-allowed' : 'pointer'
          }}
          onClick={onBid}
          disabled={isOwnJob}
        >
          {isOwnJob ? 'Your Job' : 'Submit Proposal'}
        </button>
      </div>
    </div>
  );
};

// Bid Form Modal Component
const BidFormModal = ({ jobId, pilotId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    proposal: '',
    bid_amount: '',
    estimated_completion_days: '',
    portfolio_links: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/jobs/${jobId}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pilot_id: pilotId,
          proposal: formData.proposal,
          bid_amount: parseFloat(formData.bid_amount),
          estimated_completion_days: formData.estimated_completion_days ? parseInt(formData.estimated_completion_days) : null,
          portfolio_links: formData.portfolio_links.split('\n').filter(link => link.trim())
        })
      });

      const result = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        setError(result.error || 'Failed to submit bid');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '32px',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #D1D5DB',
      borderRadius: '6px',
      marginBottom: '16px',
      fontSize: '14px'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #D1D5DB',
      borderRadius: '6px',
      marginBottom: '16px',
      fontSize: '14px',
      minHeight: '120px',
      resize: 'vertical'
    },
    buttonContainer: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end'
    },
    button: (primary) => ({
      padding: '12px 24px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      backgroundColor: primary ? '#3B82F6' : '#6B7280',
      color: 'white'
    })
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={e => e.stopPropagation()}>
        <h3 style={{marginBottom: '24px', fontSize: '20px', fontWeight: '600'}}>
          Submit Your Proposal
        </h3>

        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>
            Your Proposal *
          </label>
          <textarea
            placeholder="Describe your approach, experience, and why you're the best fit for this project..."
            value={formData.proposal}
            onChange={(e) => setFormData(prev => ({...prev, proposal: e.target.value}))}
            style={modalStyles.textarea}
            required
          />

          <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>
            Your Bid Amount ($) *
          </label>
          <input
            type="number"
            placeholder="e.g. 750"
            min="25"
            step="0.01"
            value={formData.bid_amount}
            onChange={(e) => setFormData(prev => ({...prev, bid_amount: e.target.value}))}
            style={modalStyles.input}
            required
          />

          <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>
            Estimated Completion (Days)
          </label>
          <input
            type="number"
            placeholder="e.g. 5"
            min="1"
            value={formData.estimated_completion_days}
            onChange={(e) => setFormData(prev => ({...prev, estimated_completion_days: e.target.value}))}
            style={modalStyles.input}
          />

          <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>
            Portfolio Links (Optional)
          </label>
          <textarea
            placeholder="https://example.com/portfolio1&#10;https://example.com/portfolio2"
            value={formData.portfolio_links}
            onChange={(e) => setFormData(prev => ({...prev, portfolio_links: e.target.value}))}
            style={{...modalStyles.textarea, minHeight: '80px'}}
          />

          <div style={modalStyles.buttonContainer}>
            <button
              type="button"
              onClick={onClose}
              style={modalStyles.button(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...modalStyles.button(true),
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Submitting...' : 'Submit Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobBoard;