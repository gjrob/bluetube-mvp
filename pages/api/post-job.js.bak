import React, { useState } from 'react';
import { MapPin, Calendar, DollarSign, Camera, Clock, CheckCircle } from 'lucide-react';

export default function PostJob() {
  const [jobData, setJobData] = useState({
    title: '',
    category: 'real-estate',
    location: '',
    budget: '',
    urgency: 'flexible',
    description: '',
    requirements: []
  });
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  const handleSubmit = async () => {
    setPosting(true);
    
    // Mock API call - replace with your actual endpoint
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      
      if (response.ok) {
        setPosted(true);
        setTimeout(() => {
          window.location.href = '/jobs';
        }, 2000);
      }
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Error posting job. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const styles = {
    container: {
      background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
      minHeight: '100vh',
      color: 'white',
      padding: '40px 20px',
    },
    content: {
      maxWidth: '800px',
      margin: '0 auto',
    },
    title: {
      fontSize: '48px',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '20px',
      textAlign: 'center',
    },
    card: {
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '20px',
      padding: '40px',
      marginBottom: '30px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    },
    formGroup: {
      marginBottom: '25px',
    },
    label: {
      display: 'block',
      marginBottom: '10px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#94a3b8',
    },
    input: {
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '12px',
      fontSize: '16px',
      width: '100%',
    },
    select: {
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '12px',
      fontSize: '16px',
      width: '100%',
      cursor: 'pointer',
    },
    textarea: {
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '12px',
      fontSize: '16px',
      width: '100%',
      minHeight: '120px',
      resize: 'vertical',
    },
    button: {
      background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
      color: 'white',
      border: 'none',
      padding: '20px',
      borderRadius: '50px',
      fontSize: '20px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      boxShadow: '0 10px 40px rgba(139, 92, 246, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    budgetGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '10px',
      marginBottom: '15px',
    },
    budgetOption: {
      background: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      padding: '12px',
      borderRadius: '12px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    budgetActive: {
      background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      border: '1px solid transparent',
    },
    successMessage: {
      background: 'rgba(16, 185, 129, 0.1)',
      border: '2px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '16px',
      padding: '30px',
      textAlign: 'center',
      marginBottom: '30px',
    },
    priceTag: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      textAlign: 'center',
    },
  };

  const budgetOptions = ['$100', '$250', '$500', '$1000+'];
  const categories = [
    { value: 'real-estate', label: 'Real Estate Photography' },
    { value: 'wedding', label: 'Wedding/Event Coverage' },
    { value: 'inspection', label: 'Inspection/Survey' },
    { value: 'construction', label: 'Construction Progress' },
    { value: 'commercial', label: 'Commercial Project' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Post a Drone Job</h1>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '40px', fontSize: '20px' }}>
          Connect with certified drone pilots in your area
        </p>

        {posted && (
          <div style={styles.successMessage}>
            <CheckCircle size={50} color="#10b981" style={{ marginBottom: '15px' }} />
            <h2 style={{ color: '#10b981', marginBottom: '10px' }}>Job Posted Successfully!</h2>
            <p>Redirecting to job listings...</p>
          </div>
        )}

        <div style={styles.card}>
          {/* Job Title */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Job Title *
            </label>
            <input
              type="text"
              placeholder="e.g., Real Estate Aerial Photography for 3-Bedroom Home"
              style={styles.input}
              value={jobData.title}
              onChange={(e) => setJobData({...jobData, title: e.target.value})}
            />
          </div>

          {/* Category */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Category *
            </label>
            <select
              style={styles.select}
              value={jobData.category}
              onChange={(e) => setJobData({...jobData, category: e.target.value})}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <MapPin size={16} style={{ display: 'inline', marginRight: '5px' }} />
              Location *
            </label>
            <input
              type="text"
              placeholder="City, State or Full Address"
              style={styles.input}
              value={jobData.location}
              onChange={(e) => setJobData({...jobData, location: e.target.value})}
            />
          </div>

          {/* Budget */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <DollarSign size={16} style={{ display: 'inline', marginRight: '5px' }} />
              Budget Range *
            </label>
            <div style={styles.budgetGrid}>
              {budgetOptions.map(budget => (
                <div
                  key={budget}
                  style={{
                    ...styles.budgetOption,
                    ...(jobData.budget === budget ? styles.budgetActive : {})
                  }}
                  onClick={() => setJobData({...jobData, budget})}
                >
                  {budget}
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or enter custom amount"
              style={styles.input}
              value={jobData.budget.startsWith('$') ? '' : jobData.budget}
              onChange={(e) => setJobData({...jobData, budget: e.target.value})}
            />
          </div>

          {/* Urgency */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Clock size={16} style={{ display: 'inline', marginRight: '5px' }} />
              When do you need this? *
            </label>
            <select
              style={styles.select}
              value={jobData.urgency}
              onChange={(e) => setJobData({...jobData, urgency: e.target.value})}
            >
              <option value="asap">ASAP (Within 24 hours)</option>
              <option value="week">Within a week</option>
              <option value="flexible">Flexible timing</option>
              <option value="scheduled">Specific date</option>
            </select>
          </div>

          {/* Description */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Project Description *
            </label>
            <textarea
              placeholder="Describe your project in detail. Include specific shots needed, duration, deliverables expected..."
              style={styles.textarea}
              value={jobData.description}
              onChange={(e) => setJobData({...jobData, description: e.target.value})}
            />
          </div>

          {/* Pricing Note */}
          <div style={styles.priceTag}>
            <h3 style={{ marginBottom: '10px', color: '#ef4444' }}>💰 Simple Pricing</h3>
            <p style={{ margin: 0 }}>
              Post your job for <strong>FREE</strong> • Pay pilots directly after completion
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={posting || !jobData.title || !jobData.location || !jobData.budget}
            style={{
              ...styles.button,
              opacity: (posting || !jobData.title || !jobData.location || !jobData.budget) ? 0.5 : 1,
              cursor: (posting || !jobData.title || !jobData.location || !jobData.budget) ? 'not-allowed' : 'pointer',
            }}
          >
            {posting ? '⏳ Posting...' : '🚁 Post Job Now'}
          </button>
        </div>

        {/* How It Works */}
        <div style={styles.card}>
          <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>How It Works</h2>
          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}>
                1
              </div>
              <div>
                <h4 style={{ marginBottom: '5px' }}>Post Your Job</h4>
                <p style={{ color: '#94a3b8', margin: 0 }}>Describe your project and budget</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}>
                2
              </div>
              <div>
                <h4 style={{ marginBottom: '5px' }}>Receive Proposals</h4>
                <p style={{ color: '#94a3b8', margin: 0 }}>Certified pilots submit quotes</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}>
                3
              </div>
              <div>
                <h4 style={{ marginBottom: '5px' }}>Hire & Pay</h4>
                <p style={{ color: '#94a3b8', margin: 0 }}>Choose your pilot and pay after completion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};