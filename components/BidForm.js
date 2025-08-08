// components/JobBoard.js
import { useState, useEffect } from 'react';

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

  const submitBid = async (jobId, proposal, amount) => {
    await fetch(`/api/jobs/${jobId}/bids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposal, bidAmount: amount })
    });
    setShowBidForm(null);
  };

  return (
    <div style={containerStyle}>
      <h1 style={{fontSize: '28px', fontWeight: 'bold', marginBottom: '24px'}}>
        Available Jobs
      </h1>
      
      {jobs.map(job => (
        <div key={job.id} style={jobCardStyle}>
          <h3 style={titleStyle}>{job.title}</h3>
          <p style={metaStyle}>{job.location}</p>
          <p style={{margin: '12px 0', lineHeight: '1.5'}}>{job.description}</p>
          
          <div style={{margin: '16px 0'}}>
            <span style={{...tagStyle, backgroundColor: '#dcfce7', color: '#166534'}}>
              Budget: ${job.budget}
            </span>
            <span style={{...tagStyle, backgroundColor: '#dbeafe', color: '#1e40af'}}>
              Deadline: {new Date(job.deadline).toLocaleDateString()}
            </span>
            {job.job_type === 'sponsored' && (
              <span style={{...tagStyle, backgroundColor: '#fef3c7', color: '#92400e'}}>
                SPONSORED
              </span>
            )}
          </div>
          
          <button 
            onClick={() => setShowBidForm(job.id)}
            style={buttonStyle}
          >
            Submit Proposal
          </button>
          
          {showBidForm === job.id && (
            <BidForm 
              jobId={job.id} 
              onSubmit={submitBid}
              onCancel={() => setShowBidForm(null)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// components/BidForm.js
const BidForm = ({ jobId, onSubmit, onCancel }) => {
  const [proposal, setProposal] = useState('');
  const [amount, setAmount] = useState('');

  const formStyle = {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    border: '1px solid #e5e7eb'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    marginBottom: '12px'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '16px'
  };

  const submitButtonStyle = {
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const cancelButtonStyle = {
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  return (
    <div style={formStyle}>
      <h4 style={{margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600'}}>
        Submit Your Proposal
      </h4>
      
      <textarea
        placeholder="Describe your approach and experience..."
        value={proposal}
        onChange={(e) => setProposal(e.target.value)}
        style={textareaStyle}
      />
      
      <input
        type="number"
        placeholder="Your bid amount ($)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={inputStyle}
      />
      
      <div style={buttonContainerStyle}>
        <button 
          onClick={() => onSubmit(jobId, proposal, parseFloat(amount))}
          style={submitButtonStyle}
        >
          Submit Bid
        </button>
        <button onClick={onCancel} style={cancelButtonStyle}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default JobBoard;