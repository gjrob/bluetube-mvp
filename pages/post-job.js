// Save this as: pages/post-job.js
// Fixed version that handles SSR properly

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function PostJob() {
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  // Only use router on client side
  const router = typeof window !== 'undefined' ? useRouter() : null;
  const supabase = createClientComponentClient();

  useEffect(() => {
    setIsClient(true);
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session && router) {
      router.push('/login');
    } else {
      setUser(session?.user);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/post-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          client_id: user?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (router) {
          router.push('/jobs');
        }
      } else {
        alert('Error posting job: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Don't render router-dependent content on server
  if (!isClient) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ color: 'white', marginBottom: '30px' }}>Post a Drone Job</h1>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label>Job Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Real Estate Aerial Photography"
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Describe the job requirements, deliverables, and any special requirements..."
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label>Budget ($) *</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              required
              min="50"
              placeholder="500"
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="City, State"
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label>Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>

        <button 
          onClick={() => router && router.push('/jobs')} 
          style={{ ...buttonStyle, background: '#666', marginTop: '10px' }}
        >
          Back to Jobs
        </button>
      </div>
    </div>
  );
}

const formStyle = {
  background: 'white',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const fieldStyle = {
  marginBottom: '20px'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  fontSize: '16px',
  marginTop: '5px'
};

const buttonStyle = {
  width: '100%',
  padding: '15px',
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  fontSize: '18px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

// Disable SSG for this page
export async function getServerSideProps() {
  return {
    props: {},
  };
}