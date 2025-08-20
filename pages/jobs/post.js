import { useState } from 'react';
import Layout from '../../components/Layout';

export default function PostJobPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
    deadline: '',
    job_type: 'custom'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          client_pilot_id: 'test_pilot', // Replace with real auth
          budget: parseFloat(formData.budget)
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create job');
      }

      if (data.payment?.client_secret) {
        // Payment required
        setMessage(`Job posted successfully! Payment of $${data.payment.posting_fee} required to activate.`);
        
        // TODO: Add proper Stripe payment handling here
        // Option 1: Use Stripe.js confirmPayment
        // Option 2: Add a "Complete Payment" button
        // Option 3: Create a payment page
        console.log('Payment required:', data.payment);
        
      } else {
        // No payment required (shouldn't happen for new jobs)
        setMessage('Job posted successfully!');
      }

      // Reset form on success
      setFormData({
        title: '',
        description: '',
        budget: '',
        location: '',
        deadline: '',
        job_type: 'custom'
      });

    } catch (error) {
      console.error('Error creating job:', error);
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '16px',
    backgroundColor: 'white'
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  return (
    <Layout>
      <div style={{maxWidth: '600px', margin: '0 auto', padding: '20px'}}>
        <h1 style={{fontSize: '28px', marginBottom: '24px', color: '#111827'}}>
          Post a Drone Job
        </h1>

        <div style={{
          backgroundColor: '#F3F4F6',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <h3 style={{margin: '0 0 12px 0', color: '#374151'}}>Posting Fees:</h3>
          <ul style={{margin: 0, paddingLeft: '20px', color: '#6B7280'}}>
            <li>Regular Job: $25 posting fee</li>
            <li>Sponsored Job: $50 posting fee (higher visibility)</li>
          </ul>
        </div>

        {message && (
          <div style={{
            padding: '12px',
            backgroundColor: message.includes('Error') ? '#FEE2E2' : '#D1FAE5',
            color: message.includes('Error') ? '#DC2626' : '#065F46',
            borderRadius: '6px',
            marginBottom: '20px',
            border: `1px solid ${message.includes('Error') ? '#FECACA' : '#A7F3D0'}`
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '16px'}}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Job Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Wedding Aerial Photography"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={{marginBottom: '16px'}}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Job Description *
            </label>
            <textarea
              placeholder="Describe what you need, location details, specific requirements..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              style={{...inputStyle, minHeight: '120px', resize: 'vertical'}}
              required
            />
          </div>

          <div style={{marginBottom: '16px'}}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Budget ($) *
            </label>
            <input
              type="number"
              placeholder="e.g. 500"
              min="50"
              step="0.01"
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              style={inputStyle}
              required
            />
            <p style={{fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0'}}>
              Minimum budget: $50
            </p>
          </div>

          <div style={{marginBottom: '16px'}}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Location *
            </label>
            <input
              type="text"
              placeholder="e.g. Austin, TX"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={{marginBottom: '16px'}}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Deadline *
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
              style={inputStyle}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div style={{marginBottom: '24px'}}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Job Type
            </label>
            <select
              value={formData.job_type}
              onChange={(e) => handleInputChange('job_type', e.target.value)}
              style={inputStyle}
            >
              <option value="custom">Regular Job ($25 posting fee)</option>
              <option value="sponsored">Sponsored Job ($50 posting fee - Higher visibility)</option>
            </select>
            <p style={{fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0'}}>
              Sponsored jobs appear at the top of search results
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#9CA3AF' : '#3B82F6',
              color: 'white',
              padding: '16px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
          >
            {loading ? 'Posting Job...' : 
             `Post Job ($${formData.job_type === 'sponsored' ? '50' : '25'} fee)`}
          </button>
        </form>

        <div style={{
          marginTop: '32px',
          padding: '16px',
          backgroundColor: '#F9FAFB',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#6B7280'
        }}>
          <h4 style={{margin: '0 0 12px 0', color: '#374151'}}>What happens next?</h4>
          <ul style={{margin: 0, paddingLeft: '20px'}}>
            <li>Pay the posting fee to activate your job</li>
            <li>Pilots will submit proposals</li>
            <li>Review proposals and select your pilot</li>
            <li>Work directly with the pilot to complete your project</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}