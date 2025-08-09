// components/JobBoard.js
import { useState, useEffect } from 'react';

const BidForm = ({ jobId, onSubmit, onCancel }) => {
  const [proposal, setProposal] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!proposal.trim() || !amount || parseFloat(amount) <= 0) {
      alert('Please fill in all fields with valid values');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(jobId, proposal, parseFloat(amount));
    } catch (error) {
      console.error('Error submitting bid:', error);
      alert('Error submitting bid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formStyle = {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#1E293B',
    borderRadius: '12px',
    border: '1px solid #374151',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #374151',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '16px',
    backgroundColor: '#374151',
    color: 'white',
    outline: 'none'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical',
    fontFamily: 'inherit'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    justifyContent: 'flex-end'
  };

  const submitButtonStyle = {
    backgroundColor: loading ? '#6B7280' : '#10B981',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: loading ? 'not-allowed' : 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    opacity: loading ? 0.7 : 1
  };

  const cancelButtonStyle = {
    backgroundColor: 'transparent',
    color: '#94A3B8',
    border: '1px solid #4B5563',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  };

  return (
    <div style={formStyle}>
      <h4 style={{
        margin: '0 0 20px 0', 
        fontSize: '20px', 
        fontWeight: '600',
        color: 'white'
      }}>
        Submit Your Proposal
      </h4>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          color: '#E5E7EB', 
          fontSize: '14px',
          fontWeight: '500'
        }}>
          Proposal Details *
        </label>
        <textarea
          placeholder="Describe your approach, experience, and why you're the best fit for this project..."
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          style={textareaStyle}
          required
        />
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          color: '#E5E7EB', 
          fontSize: '14px',
          fontWeight: '500'
        }}>
          Your Bid Amount ($) *
        </label>
        <input
          type="number"
          placeholder="e.g. 500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
          min="25"
          step="0.01"
          required
        />
        <p style={{ 
          fontSize: '12px', 
          color: '#9CA3AF', 
          margin: '4px 0 0 0' 
        }}>
          Minimum bid: $25
        </p>
      </div>
      
      <div style={buttonContainerStyle}>
        <button 
          onClick={onCancel} 
          style={cancelButtonStyle}
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          style={submitButtonStyle}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Proposal'}
        </button>
      </div>
    </div>
  );
};

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [showBidForm, setShowBidForm] = useState(null);

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px'
  };

  const jobCardStyle = {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '16px',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    color: '#111827'
  };

  const metaStyle = {
    color: '#6b7280',
    fontSize: '14px',
    margin: '4px 0'
  };

  const tagStyle = {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    margin: '4px 8px 4px 0'
  };

  const buttonStyle = {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginTop: '16px'
  };

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(setJobs);
  }, []);

  const handleBidClick = (jobId) => {
    setShowBidForm(jobId);
  };

  const handleBidSubmit = async (jobId, proposal, amount) => {
    // handle bid submission logic
  };

  return (
    <div style={containerStyle}>
      {jobs.map(job => (
        <div key={job.id} style={jobCardStyle}>
          <h3 style={titleStyle}>{job.title}</h3>
          <p style={metaStyle}>Posted by {job.clientName} on {new Date(job.createdAt).toLocaleDateString()}</p>
          <div>
            {job.tags.map(tag => (
              <span key={tag} style={tagStyle}>{tag}</span>
            ))}
          </div>
          <p style={{ ...metaStyle, marginTop: '8px' }}>
            Budget: ${job.budgetLow} - ${job.budgetHigh} · Duration: {job.duration} · 
            <span style={{ color: job.status === 'open' ? '#10B981' : '#EF4444', marginLeft: '4px' }}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </span>
          </p>
          <button 
            onClick={() => handleBidClick(job.id)} 
            style={buttonStyle}
          >
            {showBidForm === job.id ? 'Cancel' : 'Place a Bid'}
          </button>

          {showBidForm === job.id && (
            <BidForm 
              jobId={job.id} 
              onSubmit={handleBidSubmit} 
              onCancel={() => setShowBidForm(null)} 
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default JobBoard;