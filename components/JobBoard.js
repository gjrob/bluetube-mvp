import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    budget_min: '',
    budget_max: '',
    location: '',
    job_type: '',
    min_budget: '',
    max_budget: '',
    sort: 'featured_first'
  });
  const [showBidForm, setShowBidForm] = useState(null);
  
  const router = useRouter();
  const { userType, user } = useAuth();
  
  // Get current pilot ID from authenticated user
  const currentPilotId = user?.id;

  useEffect(() => {
    fetchJobs();
  }, []);
     const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      const data = await response.json()
      
      if (response.ok) {
        setJobs(data.jobs || [])
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (jobId) => {
    router.push(`/jobs/${jobId}`);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        color: '#94A3B8'
      }}>
        <div>Loading jobs...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#0F172A', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '32px', margin: 0 }}>Available Jobs</h1>
          <p style={{ color: '#94A3B8', margin: '8px 0 0 0' }}>
            {jobs.length} jobs available
          </p>
        </div>
        
        {userType === 'client' && (
          <Link href="/jobs/post" style={{
            backgroundColor: '#3B82F6',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            + Post a Job
          </Link>
        )}
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          style={{
            padding: '10px 15px',
            borderRadius: '6px',
            border: '1px solid #374151',
            backgroundColor: '#1E293B',
            color: 'white',
            fontSize: '14px'
          }}
        >
          <option value="">All Categories</option>
          <option value="aerial_photography">Aerial Photography</option>
          <option value="inspection">Inspection</option>
          <option value="mapping">Mapping</option>
          <option value="surveillance">Surveillance</option>
          <option value="delivery">Delivery</option>
        </select>

        <input
          type="number"
          placeholder="Min Budget"
          value={filters.budget_min}
          onChange={(e) => handleFilterChange('budget_min', e.target.value)}
          style={{
            padding: '10px 15px',
            borderRadius: '6px',
            border: '1px solid #374151',
            backgroundColor: '#1E293B',
            color: 'white',
            fontSize: '14px',
            width: '120px'
          }}
        />

        <input
          type="number"
          placeholder="Max Budget"
          value={filters.budget_max}
          onChange={(e) => handleFilterChange('budget_max', e.target.value)}
          style={{
            padding: '10px 15px',
            borderRadius: '6px',
            border: '1px solid #374151',
            backgroundColor: '#1E293B',
            color: 'white',
            fontSize: '14px',
            width: '120px'
          }}
        />

        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          style={{
            padding: '10px 15px',
            borderRadius: '6px',
            border: '1px solid #374151',
            backgroundColor: '#1E293B',
            color: 'white',
            fontSize: '14px',
            width: '200px'
          }}
        />

        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          style={{
            padding: '10px 15px',
            borderRadius: '6px',
            border: '1px solid #374151',
            backgroundColor: '#1E293B',
            color: 'white',
            fontSize: '14px'
          }}
        >
          <option value="featured_first">Featured First</option>
          <option value="budget_high">Highest Budget</option>
          <option value="deadline">Deadline Soon</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {/* Job Grid */}
      {jobs.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#94A3B8', 
          padding: '60px',
          backgroundColor: '#1E293B',
          borderRadius: '12px'
        }}>
          <h3 style={{ color: 'white', marginBottom: '16px' }}>No jobs found</h3>
          <p>Try adjusting your filters or check back later for new opportunities.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {jobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              onClick={() => handleJobClick(job.id)}
              userType={userType}
              currentPilotId={currentPilotId}
              onBid={() => setShowBidForm(job.id)}
            />
          ))}
        </div>
      )}

      {/* Bid Form Modal */}
      {showBidForm && userType === 'pilot' && (
        <BidFormModal
          jobId={showBidForm}
          pilotId={currentPilotId}
          onClose={() => setShowBidForm(null)}
          onSuccess={() => {
            setShowBidForm(null);
            fetchJobs();
          }}
        />
      )}
    </div>
  );
}

// Job Card Component
function JobCard({ job, onClick, userType, currentPilotId, onBid }) {
  const proposalCount = job.proposals?.length || job.job_bids?.[0]?.count || 0;
  const isUrgent = job.visibility_package === 'urgent';
  const isFeatured = job.visibility_package === 'featured' || job.job_type === 'sponsored';
  const isPremium = job.visibility_package === 'premium';
  const isOwnJob = job.client_pilot_id === currentPilotId;

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#1E293B',
        borderRadius: '12px',
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: isPremium ? '2px solid #F59E0B' : isFeatured ? '2px solid #3B82F6' : '1px solid #374151',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Badges */}
      {(isUrgent || isFeatured || isPremium) && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'flex',
          gap: '8px'
        }}>
          {isUrgent && (
            <span style={{
              backgroundColor: '#EF4444',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              URGENT
            </span>
          )}
          {isFeatured && (
            <span style={{
              backgroundColor: '#3B82F6',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {job.job_type === 'sponsored' ? 'SPONSORED' : 'FEATURED'}
            </span>
          )}
          {isPremium && (
            <span style={{
              backgroundColor: '#F59E0B',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              PREMIUM
            </span>
          )}
        </div>
      )}

      <h3 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: 'white',
        marginBottom: '12px',
        paddingRight: (isUrgent || isFeatured || isPremium) ? '100px' : '0'
      }}>
        {job.title}
      </h3>

      <p style={{
        color: '#94A3B8',
        fontSize: '14px',
        lineHeight: '1.6',
        marginBottom: '16px',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {job.description}
      </p>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <div>
          <div style={{ color: '#10B981', fontSize: '24px', fontWeight: '700' }}>
            ${job.budget}
          </div>
          <div style={{ color: '#6B7280', fontSize: '12px' }}>
            Budget
          </div>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#60A5FA', fontSize: '20px', fontWeight: '600' }}>
            {proposalCount}
          </div>
          <div style={{ color: '#6B7280', fontSize: '12px' }}>
            Proposals
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '16px'
      }}>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#94A3B8',
          fontSize: '13px'
        }}>
          📍 {job.location || 'Remote'}
        </span>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#94A3B8',
          fontSize: '13px'
        }}>
          ⏱️ {job.duration || 'Flexible'}
        </span>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#94A3B8',
          fontSize: '13px'
        }}>
          🏷️ {job.category?.replace('_', ' ') || 'General'}
        </span>
      </div>

      {job.hazard_pay && (
        <div style={{
          backgroundColor: '#FEE2E2',
          color: '#DC2626',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          ⚠️ Hazard Pay Available
        </div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{
          color: '#6B7280',
          fontSize: '12px'
        }}>
          Posted {new Date(job.created_at).toLocaleDateString()}
        </span>
        
        {userType === 'pilot' && !isOwnJob && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onBid) onBid();
            }}
            style={{
              backgroundColor: '#3B82F6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Submit Proposal
          </button>
        )}
        
        {isOwnJob && (
          <span style={{
            color: '#6B7280',
            fontSize: '12px',
            fontStyle: 'italic'
          }}>
            Your Job
          </span>
        )}
      </div>
    </div>
  );
}

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

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#1E293B',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ 
          color: 'white', 
          marginBottom: '24px', 
          fontSize: '24px', 
          fontWeight: '600' 
        }}>
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
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '500', 
            color: 'white' 
          }}>
            Your Proposal *
          </label>
          <textarea
            placeholder="Describe your approach, experience, and why you're the best fit..."
            value={formData.proposal}
            onChange={(e) => setFormData(prev => ({...prev, proposal: e.target.value}))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #374151',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '14px',
              minHeight: '120px',
              resize: 'vertical',
              backgroundColor: '#374151',
              color: 'white'
            }}
            required
          />

          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '500', 
            color: 'white' 
          }}>
            Your Bid Amount ($) *
          </label>
          <input
            type="number"
            placeholder="e.g. 750"
            min="25"
            step="0.01"
            value={formData.bid_amount}
            onChange={(e) => setFormData(prev => ({...prev, bid_amount: e.target.value}))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #374151',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '14px',
              backgroundColor: '#374151',
              color: 'white'
            }}
            required
          />

          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'flex-end',
            marginTop: '24px'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                border: '1px solid #6B7280',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: 'transparent',
                color: '#6B7280'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: '#3B82F6',
                color: 'white',
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