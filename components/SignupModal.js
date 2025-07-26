import React, { useState } from 'react';
import { X, Eye, EyeOff, Loader2, Zap, DollarSign, Users } from 'lucide-react';

const SignupModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('signup'); // 'signup' or 'login'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (mode === 'signup') {
      if (!formData.username) newErrors.username = 'Username required';
      else if (formData.username.length < 3) newErrors.username = 'Username must be 3+ characters';
      
      if (!formData.email) newErrors.email = 'Email required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    }
    
    if (!formData.password) newErrors.password = 'Password required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be 6+ characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async () => {
  if (!validateForm()) return;
  setLoading(true);
  
  try {
    // For now, just save to localStorage
    localStorage.setItem('user', JSON.stringify({
      username: formData.username,
      email: formData.email
    }));
    
    // Redirect to dashboard
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Signup failed:', error);
  }
  
  setLoading(false);
};
    
    // Simulate API call - Replace with your actual API
    setTimeout(() => {
      console.log(`${mode} data:`, formData);
      setLoading(false);
      // Redirect to dashboard on success
      window.location.href = '/dashboard';
    }, 1500);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      {/* CTA Button */}
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '10px',
          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          Ready to start earning?
        </h2>
        
        <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '1.1rem' }}>
          Join thousands of drone pilots streaming and earning
        </p>

        {/* Value Props */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '30px', 
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={20} style={{ color: '#10b981' }} />
            <span>80% Revenue Share</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={20} style={{ color: '#f59e0b' }} />
            <span>Instant Payouts</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} style={{ color: '#8b5cf6' }} />
            <span>Growing Community</span>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            color: 'white',
            padding: '15px 40px',
            borderRadius: '50px',
            border: 'none',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Start Streaming Now →
        </button>
        
        <p style={{ marginTop: '20px', color: '#64748b' }}>
          Questions? Email pilot@bluetubetv.live
        </p>
      </div>

      {/* Modal */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '450px',
            width: '100%',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '5px'
              }}
            >
              <X size={24} />
            </button>

            {/* Header */}
            <h2 style={{
              fontSize: '2rem',
              marginBottom: '10px',
              textAlign: 'center',
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            
            <p style={{ 
              textAlign: 'center', 
              color: '#94a3b8', 
              marginBottom: '30px' 
            }}>
              {mode === 'signup' 
                ? 'Start streaming in under 2 minutes' 
                : 'Log in to your BlueTubeTV account'}
            </p>

            {/* Form Fields */}
            <div>
              {mode === 'signup' && (
                <div style={{ marginBottom: '20px' }}>
                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: errors.username ? '1px solid #ef4444' : '1px solid #334155',
                      backgroundColor: '#0f172a',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                  {errors.username && (
                    <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '5px' }}>
                      {errors.username}
                    </p>
                  )}
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: errors.email ? '1px solid #ef4444' : '1px solid #334155',
                    backgroundColor: '#0f172a',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
                {errors.email && (
                  <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '5px' }}>
                    {errors.email}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '30px', position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    paddingRight: '45px',
                    borderRadius: '10px',
                    border: errors.password ? '1px solid #ef4444' : '1px solid #334155',
                    backgroundColor: '#0f172a',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '5px'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '5px' }}>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: loading 
                    ? '#334155' 
                    : 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => !loading && (e.target.style.transform = 'scale(1.02)')}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                {loading && <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />}
                {loading ? 'Creating...' : (mode === 'signup' ? 'Create Account' : 'Log In')}
              </button>
            </div>

            {/* Social Login */}
            <div style={{ marginTop: '30px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                marginBottom: '20px'
              }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }} />
                <span style={{ color: '#64748b', fontSize: '14px' }}>or continue with</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => console.log('Google login')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #334155',
                    backgroundColor: '#0f172a',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#1e293b';
                    e.target.style.borderColor = '#3b82f6';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#0f172a';
                    e.target.style.borderColor = '#334155';
                  }}
                >
                  Google
                </button>
                <button
                  onClick={() => console.log('Discord login')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #334155',
                    backgroundColor: '#0f172a',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#1e293b';
                    e.target.style.borderColor = '#8b5cf6';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#0f172a';
                    e.target.style.borderColor = '#334155';
                  }}
                >
                  Discord
                </button>
              </div>
            </div>

            {/* Toggle Mode */}
            <p style={{ 
              textAlign: 'center', 
              marginTop: '20px', 
              color: '#94a3b8' 
            }}>
              {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
              <button
                onClick={() => {
                  setMode(mode === 'signup' ? 'login' : 'signup');
                  setErrors({});
                  setFormData({ username: '', email: '', password: '' });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '14px'
                }}
              >
                {mode === 'signup' ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* CSS for animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </>
  );

export default SignupModal;