import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // success
      router.push(router.query.redirect || '/dashboard');
    } catch (err) {
      alert(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert('Check your email to confirm your account.');
    } catch (err) {
      alert(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  // DEMO MODE: set a cookie so auth guard lets you in
  async function enterDemo() {
    await fetch('/api/demo-login', { method: 'POST' });
    router.push('/dashboard');
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0a1628 0%,#1e3a5f 50%,#3b82c4 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background:'rgba(30,58,95,.9)', padding:'2rem', borderRadius:20, width:'100%', maxWidth:420 }}>
        <h1 style={{ color:'#60a5fa', textAlign:'center', marginBottom:16 }}>🚁 BlueTubeTV</h1>

        <form onSubmit={handleLogin}>
          <input type="email" required placeholder="Email"
            value={email} onChange={e=>setEmail(e.target.value)}
            style={inputStyle}/>
          <input type="password" required placeholder="Password"
            value={password} onChange={e=>setPassword(e.target.value)}
            style={inputStyle}/>
          <button type="submit" disabled={loading} style={primaryBtn}>
            {loading ? 'Loading…' : 'Login'}
          </button>
        </form>

        <button onClick={handleSignup} disabled={loading} style={ghostBtn}>
          Create account
        </button>

        <button onClick={enterDemo} style={{...ghostBtn, marginTop:16}}>
          Skip Login (Demo Mode) →
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width:'100%', padding:12, marginBottom:12, borderRadius:8,
  border:'1px solid rgba(96,165,250,.3)', background:'rgba(10,22,40,.5)', color:'#fff'
};
const primaryBtn = {
  width:'100%', padding:12, borderRadius:8, border:'none',
  background:'linear-gradient(135deg,#3b82c4,#60a5fa)', color:'#fff',
  fontWeight:600, cursor:'pointer', marginBottom:8
};
const ghostBtn = {
  width:'100%', padding:12, borderRadius:8,
  background:'transparent', color:'#60a5fa', border:'1px solid #60a5fa',
  fontWeight:600, cursor:'pointer', marginTop:8
};
