import React, { useState } from 'react';
import { Upload, Film, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import Head from 'next/head';

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: 'scenic',
    description: '',
    pilot: ''
  });

  const handleSubmit = async () => {
    if (!formData.title) {
      setUploadError('Please enter a video title');
      return;
    }
    
    setUploading(true);
    setUploadError('');
    
    try {
      const response = await fetch('/api/upload-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUploadSuccess(true);
        setTimeout(() => {
          window.location.href = '/browse';
        }, 2000);
      } else {
        setUploadError(data.error || 'Upload failed');
      }
    } catch (error) {
      setUploadError('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const styles = {
    container: {
      background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
      minHeight: '100vh',
      color: 'white'
    },
    content: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px'
    },
    title: {
      fontSize: '48px',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #818cf8, #60a5fa)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '40px',
      textAlign: 'center'
    },
    uploadCard: {
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    uploadZone: {
      border: '2px dashed rgba(59, 130, 246, 0.5)',
      borderRadius: '16px',
      padding: '60px',
      textAlign: 'center',
      marginBottom: '30px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    input: {
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '12px',
      fontSize: '16px',
      width: '100%',
      marginBottom: '20px'
    },
    select: {
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '12px',
      fontSize: '16px',
      width: '100%',
      marginBottom: '20px',
      cursor: 'pointer'
    },
    textarea: {
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '12px',
      fontSize: '16px',
      width: '100%',
      marginBottom: '20px',
      minHeight: '120px',
      resize: 'vertical'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '16px',
      fontWeight: '600'
    },
    button: {
      background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
      color: 'white',
      border: 'none',
      padding: '20px',
      borderRadius: '50px',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 10px 40px rgba(239, 68, 68, 0.4)',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transition: 'all 0.3s ease'
    },
    successMessage: {
      background: 'rgba(16, 185, 129, 0.1)',
      border: '2px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '16px',
      padding: '20px',
      textAlign: 'center',
      marginBottom: '20px'
    },
    errorMessage: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '2px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '16px',
      padding: '20px',
      textAlign: 'center',
      marginBottom: '20px'
    }
  };

  return (
    <>
      <Head>
        <title>Upload Video - BlueTubeTV</title>
      </Head>
      
      <Layout>
        <div style={styles.container}>
          <div style={styles.content}>
            <h1 style={styles.title}>Upload Your Drone Footage</h1>
            
            <div style={styles.uploadCard}>
              {/* Success Message */}
              {uploadSuccess && (
                <div style={styles.successMessage}>
                  <CheckCircle size={24} style={{ color: '#10b981', marginBottom: '10px' }} />
                  <h3 style={{ color: '#10b981', marginBottom: '10px' }}>Upload Successful!</h3>
                  <p style={{ color: '#64748b' }}>Redirecting to browse page...</p>
                </div>
              )}

              {/* Error Message */}
              {uploadError && (
                <div style={styles.errorMessage}>
                  <AlertCircle size={24} style={{ color: '#ef4444', marginBottom: '10px' }} />
                  <h3 style={{ color: '#ef4444', marginBottom: '10px' }}>Upload Error</h3>
                  <p style={{ color: '#ef4444' }}>{uploadError}</p>
                </div>
              )}

              {/* File Upload Zone - Visual Only for MVP */}
              <div 
                style={styles.uploadZone}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.8)';
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Upload size={60} style={{ marginBottom: '20px', color: '#60a5fa' }} />
                <h3 style={{ marginBottom: '10px' }}>Drag & Drop Video Here</h3>
                <p style={{ color: '#94a3b8' }}>or click to browse (Coming Soon)</p>
                <p style={{ color: '#64748b', fontSize: '14px', marginTop: '10px' }}>
                  MP4, MOV up to 2GB
                </p>
              </div>

              {/* Video Details Form */}
              <div>
                <label style={styles.label}>Video Title *</label>
                <input
                  type="text"
                  placeholder="Amazing sunset flight over the city"
                  style={styles.input}
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div>
                <label style={styles.label}>Category *</label>
                <select
                  style={styles.select}
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="scenic">Scenic</option>
                  <option value="urban">Urban</option>
                  <option value="nature">Nature</option>
                  <option value="sports">Sports</option>
                  <option value="commercial">Commercial</option>
                  <option value="tutorial">Tutorial</option>
                </select>
              </div>

              <div>
                <label style={styles.label}>Pilot Name</label>
                <input
                  type="text"
                  placeholder="Your pilot name (optional)"
                  style={styles.input}
                  value={formData.pilot}
                  onChange={(e) => setFormData({...formData, pilot: e.target.value})}
                />
              </div>

              <div>
                <label style={styles.label}>Description</label>
                <textarea
                  placeholder="Describe your flight, location, equipment used..."
                  style={styles.textarea}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  ...styles.button,
                  opacity: uploading ? 0.7 : 1,
                  cursor: uploading ? 'not-allowed' : 'pointer'
                }}
                disabled={uploading}
              >
                {uploading ? (
                  <>⏳ Processing...</>
                ) : (
                  <>
                    <Film size={20} />
                    Upload Video
                  </>
                )}
              </button>

              <p style={{ 
                textAlign: 'center', 
                marginTop: '20px', 
                color: '#64748b',
                fontSize: '14px'
              }}>
                By uploading, you agree to our Terms of Service and Community Guidelines
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}