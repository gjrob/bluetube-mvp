// ===== Create /components/LoginForm.js =====
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js';
import analytics from '../lib/analytics-enhanced';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);
export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Track login attempt
      analytics.track('login_attempt', { email: email });

      // Attempt Supabase login
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        // Demo/bypass login for testing
        if (email === 'pilot@bluetubetv.live' || email === 'demo@bluetubetv.live') {
          // Track successful demo login
          analytics.track('login_success', {
            user_id: 'demo-user',
            role: 'pilot',
            method: 'demo'
          });
          
          // Store demo session
          localStorage.setItem('user', JSON.stringify({
            id: 'demo-user',
            email: email,
            role: 'pilot',
            part107_verified: true
          }));
          
          router.push('/dashboard');
          return;
        }
        
        throw authError;
      }

      // Track successful login
      analytics.track('login_success', {
        user_id: data.user.id,
        role: data.user.user_metadata?.role || 'viewer',
        method: 'supabase'
      });

      // Store user session
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (err) {
      // Track failed login
      analytics.track('login_failed', {
        error: err.message,
        email: email
      });
      
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      {error && <div className="error-message">{error}</div>}
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      
      {/* Demo login hint */}
      <p className="demo-hint">
        Demo: pilot@bluetubetv.live / any password
      </p>
    </form>
  );
}