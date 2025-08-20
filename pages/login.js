// pages/login.js
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      router.push('/dashboard');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      alert('Check your email for confirmation!');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #3b82c4 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'rgba(30, 58, 95, 0.9)',
        padding: '2rem',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ color: '#60a5fa', textAlign: 'center' }}>🚁 BlueTubeTV</h1>
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              background: 'rgba(10, 22, 40, 0.5)',
              color: 'white'
            }}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              background: 'rgba(10, 22, 40, 0.5)',
              color: 'white'
            }}
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #3b82c4, #60a5fa)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'wait' : 'pointer',
              marginBottom: '0.5rem'
            }}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        
        <button
          onClick={handleSignup}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'transparent',
            color: '#60a5fa',
            border: '1px solid #60a5fa',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: loading ? 'wait' : 'pointer'
          }}
        >
          Sign Up
        </button>
        
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <a href="/dashboard" style={{ color: '#60a5fa', fontSize: '0.9rem' }}>
            Skip Login (Demo Mode) →
          </a>
        </div>
      </div>
    </div>
  );
}