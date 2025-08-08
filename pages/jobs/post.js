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

      const result = await response.json();

      if (response.ok) {
        setMessage('Job posted successfully! Payment required to activate.');
        // In real app, redirect to payment
        console.log('Payment URL:', result.payment.client_secret);
      } else {
        setMessage('Error: ' + result.error);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
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
    marginBottom: '16px'
  };

  return (
    <Layout>
      <div style={{maxWidth: '600px', margin: '0 auto', padding: '20px'}}>
        <h1 style={{fontSize: '28px', marginBottom: '24px'}}>Post a Drone Job</h1>

        {message && (
          <div style={{
            padding: '12px',
            backgroundColor: message.includes('Error') ? '#FEE2E2' : '#D1FAE5',
            color: message.includes('Error') ? '#DC2626' : '#065F46',
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Job Title (e.g. Wedding Aerial Photography)"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
            style={inputStyle}
            required
          />

          <textarea
            placeholder="Describe what you need..."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
            style={{...inputStyle, minHeight: '120px', resize: 'vertical'}}
            required
          />

          <input
            type="number"
            placeholder="Budget ($)"
            min="50"
            value={formData.budget}
            onChange={(e) => setFormData(prev => ({...prev, budget: e.target.value}))}
            style={inputStyle}
            required
          />

          <input
            type="text"
            placeholder="Location (e.g. Austin, TX)"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
            style={inputStyle}
            required
          />

          <input
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData(prev => ({...prev, deadline: e.target.value}))}
            style={inputStyle}
            required
          />

          <select
            value={formData.job_type}
            onChange={(e) => setFormData(prev => ({...prev, job_type: e.target.value}))}
            style={inputStyle}
          >
            <option value="custom">Regular Job ($25 posting fee)</option>
            <option value="sponsored">Sponsored Job ($50 posting fee)</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#3B82F6',
              color: 'white',
              padding: '14px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Posting...' : 'Post Job ($25 fee)'}
          </button>
        </form>
      </div>
    </Layout>
  );
}