import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error?.message?.toLowerCase().includes('email not confirmed')) {
        setError('Check your email to confirm your account.');
        return;
      }
      
      if (error) throw error;
      
      // Redirect to dashboard or the page they came from
      const redirectTo = router.query.redirect || '/dashboard';
      router.push(redirectTo);
      
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Google login failed');
      setLoading(false);
    }
  }

  async function enterDemo() {
    try {
      setLoading(true);
      // Optional demo cookie gate if you kept /api/demo-login
      await fetch('/api/demo-login', { method: 'POST' });
      router.push('/dashboard');
    } catch (err) {
      setError('Demo mode failed to load');
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0a1628 0%,#1e3a5f 50%,#3b82c4 100%)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{ 
        background: 'rgba(30,58,95,.9)', 
        padding: '2rem', 
        borderRadius: 20, 
        width: '100%', 
        maxWidth: 420,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <h1 style={{ 
          color: '#60a5fa', 
          textAlign: 'center', 
          marginBottom: 16,
          fontSize: '2rem',
          background: 'linear-gradient(135deg, #60a5fa, #93c5fd)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🚁 BlueTubeTV
        </h1>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            color: '#fca5a5',
            padding: '0.75rem',
            borderRadius: 8,
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <button 
          onClick={handleGoogleLogin} 
          disabled={loading} 
          style={{
            ...primaryBtn,
            background: '#fff',
            color: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Connecting...' : 'Sign in with Google'}
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(96,165,250,.3)' }} />
          <span style={{ padding: '0 1rem', color: '#64748b', fontSize: '.875rem' }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(96,165,250,.3)' }} />
        </div>

        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            required 
            placeholder="Email"
            value={email} 
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input 
            type="password" 
            required 
            placeholder="Password"
            value={password} 
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" disabled={loading} style={primaryBtn}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <button 
          onClick={() => router.push('/signup')} 
          disabled={loading} 
          style={ghostBtn}
        >
          Create account
        </button>

        <button 
          onClick={enterDemo} 
          disabled={loading}
          style={{...ghostBtn, marginTop: 16}}
        >
          Skip Login (Demo Mode) →
        </button>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <a 
            href="/forgot-password" 
            style={{ 
              color: '#60a5fa', 
              textDecoration: 'none', 
              fontSize: '0.875rem' 
            }}
          >
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', 
  padding: 12, 
  marginBottom: 12, 
  borderRadius: 8,
  border: '1px solid rgba(96,165,250,.3)', 
  background: 'rgba(10,22,40,.5)', 
  color: '#fff',
  outline: 'none'
};

const primaryBtn = {
  width: '100%', 
  padding: 12, 
  borderRadius: 8, 
  border: 'none',
  background: 'linear-gradient(135deg,#3b82c4,#60a5fa)', 
  color: '#fff',
  fontWeight: 600, 
  cursor: 'pointer', 
  marginBottom: 8,
  transition: 'opacity 0.3s'
};

const ghostBtn = {
  width: '100%', 
  padding: 12, 
  borderRadius: 8,
  background: 'transparent', 
  color: '#60a5fa', 
  border: '1px solid #60a5fa',
  fontWeight: 600, 
  cursor: 'pointer', 
  marginTop: 8,
  transition: 'all 0.3s'
};
