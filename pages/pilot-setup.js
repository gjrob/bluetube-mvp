import React, { useState } from 'react';
import { X, Eye, EyeOff, Loader2, Zap, DollarSign, Users } from 'lucide-react';

const SignupModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('signup');
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
    
    setTimeout(() => {
      console.log(`${mode} data:`, formData);
      setLoading(false);
      window.location.href = '/dashboard';
    }, 1500);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </>
  );
};

export default function PilotSetup() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #1a1a2e, #0f0f1e)',
      color: 'white',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <a href="/" style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        textDecoration: 'none',
        fontSize: '1.2rem'
      }}>
        ← Back to Stream
      </a>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          textAlign: 'center',
          marginBottom: '40px',
          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🚁 Start Streaming in 2 Minutes
        </h1>

        {/* Quick Start */}
        <div style={{ 
          background: 'rgba(34, 197, 94, 0.2)', 
          border: '2px solid #22c55e',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ marginBottom: '20px' }}>⚡ Quick Start for DJI Pilots</h2>
          
          <ol style={{ lineHeight: '2', fontSize: '1.1rem' }}>
            <li>Get your stream key from <a href="https://dash.cloudflare.com" style={{ color: '#3b82f6' }}>Cloudflare Stream</a></li>
            <li>Open DJI Fly app → Settings → Live Streaming → RTMP Custom</li>
            <li>Enter URL: <code style={{ 
              background: '#000', 
              padding: '5px 10px', 
              borderRadius: '5px' 
            }}>rtmp://live.cloudflare.com/live/</code></li>
            <li>Paste your stream key and tap "Start Live"</li>
            <li>You're LIVE! Share your link and get tipped! 💰</li>
          </ol>
        </div>

        {/* Supported Drones */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ marginBottom: '20px' }}>✅ Supported Drones</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '10px'
          }}>
            {['Mavic 3', 'Air 2S', 'Mini 3 Pro', 'DJI FPV', 'Phantom 4', 'Inspire 2'].map(drone => (
              <div key={drone} style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid #22c55e',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                ✓ {drone}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Steps */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ marginBottom: '20px' }}>📱 Detailed Setup</h2>
          
          <h3 style={{ color: '#3b82f6', marginTop: '20px' }}>Step 1: Get Cloudflare Stream Key</h3>
          <ul style={{ lineHeight: '1.8' }}>
            <li>Sign up at <a href="https://dash.cloudflare.com" style={{ color: '#3b82f6' }}>dash.cloudflare.com</a> (free)</li>
            <li>Go to Stream → Live Inputs → Create Live Input</li>
            <li>Copy your Stream Key (keep it private!)</li>
          </ul>

          <h3 style={{ color: '#3b82f6', marginTop: '20px' }}>Step 2: Configure DJI App</h3>
          <div style={{ 
            background: '#000', 
            padding: '20px', 
            borderRadius: '10px',
            fontFamily: 'monospace',
            marginTop: '10px'
          }}>
            <div>RTMP URL: rtmp://live.cloudflare.com/live/</div>
            <div>Stream Key: [Your key from step 1]</div>
            <div>Resolution: 720p (recommended)</div>
            <div>Bitrate: 2500-4000 kbps</div>
          </div>

          <h3 style={{ color: '#3b82f6', marginTop: '20px' }}>Step 3: Share Your Stream</h3>
          <p>Your viewers can watch and tip at:</p>
          <code style={{ 
            background: '#000', 
            padding: '10px', 
            borderRadius: '5px',
            display: 'block',
            marginTop: '10px'
          }}>
            https://bluetubetv.live/watch/[your-stream-id]
          </code>
        </div>

        {/* Tips */}
        <div style={{ 
          background: 'rgba(251, 191, 36, 0.1)', 
          border: '1px solid #fbbf24',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ marginBottom: '20px' }}>💡 Pro Tips</h2>
          <ul style={{ lineHeight: '2' }}>
            <li>📡 Use 5GHz WiFi or 4G/5G for best quality</li>
            <li>🔋 Streaming drains battery ~20% faster</li>
            <li>🌅 Golden hour streams get the most tips</li>
            <li>🎤 Narrate your flight for more engagement</li>
            <li>📍 Add location to your stream title</li>
          </ul>
        </div>

        {/* Earnings */}
        <div style={{ 
          background: 'linear-gradient(to right, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
          borderRadius: '15px',
          padding: '30px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>💰 You Keep 80% of All Tips!</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
            Average pilot makes $50-200 per stream
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px',
            flexWrap: 'wrap' 
          }}>
            <div style={{ 
              background: 'rgba(0,0,0,0.3)', 
              padding: '20px', 
              borderRadius: '10px' 
            }}>
              <div style={{ fontSize: '2rem', color: '#22c55e' }}>$25</div>
              <div>Average tip</div>
            </div>
            <div style={{ 
              background: 'rgba(0,0,0,0.3)', 
              padding: '20px', 
              borderRadius: '10px' 
            }}>
              <div style={{ fontSize: '2rem', color: '#22c55e' }}>$20</div>
              <div>You keep</div>
            </div>
          </div>
        </div>

        {/* Include the SignupModal component */}
        <SignupModal />
      </div>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '40px 20px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        color: '#666',
        marginTop: '40px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <a href="/terms" style={{ color: '#888', textDecoration: 'none', margin: '0 15px' }}>Terms of Service</a>
          <a href="/privacy" style={{ color: '#888', textDecoration: 'none', margin: '0 15px' }}>Privacy Policy</a>
          <a href="/legal" style={{ color: '#888', textDecoration: 'none', margin: '0 15px' }}>Legal</a>
        </div>
        <p>© 2025 Blue Ring Holdings LLC • FAA Part 107 Compliant</p>
        <p style={{ fontSize: '2rem', margin: '10px 0' }}>🐙</p>
        <p>Built with a dream 🚚→🏕️</p>
      </footer>
    </div>
  );
}
