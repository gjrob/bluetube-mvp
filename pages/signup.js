// pages/signup.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

export default function Signup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    pilotName: '',
    part107: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const redirectTo = `${window.location.origin}/auth/callback`
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            pilot_name: formData.pilotName,
            part107_certified: formData.part107,
          },
        },
      })
      if (error) throw error

      // show success and send them back to login to sign in after confirming email
      setSuccess(true)
      setTimeout(() => {
  window.location.href = '/dashboard'; // full page redirect
}, 2000);
    } catch (err) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignup = async () => {
    try {
      setLoading(true)
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      // Supabase will redirect; nothing else here
    } catch (err) {
      setError(err.message || 'Google sign-in failed')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={pageWrap}>
        <div style={card}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ color: '#60a5fa', marginBottom: '1rem' }}>Account Created!</h2>
          <p>Check your email to confirm your account.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ ...pageWrap, padding: '2rem' }}>
      {/* Header */}
      <nav style={navBar}>
        <Link href="/" style={brandLink}>
          🚁 BlueTubeTV
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/login" style={navLink}>
            Sign In
          </Link>
        </div>
      </nav>

      {/* Main card */}
      <div style={mainCard}>
        <h1 style={headline}>Join BlueTubeTV</h1>
        <p style={subhead}>Start streaming drone footage today</p>

        {error && <div style={errBox}>{error}</div>}

        {/* Google OAuth */}
        <button onClick={handleOAuthSignup} disabled={loading} style={googleBtn}>
          Sign up with Google
        </button>

        <div style={dividerWrap}>
          <div style={dividerLine} />
          <span style={dividerText}>OR</span>
          <div style={dividerLine} />
        </div>

        {/* Email signup */}
        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="pilotName"
            placeholder="Pilot Name"
            value={formData.pilotName}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <label style={{ color: '#94a3b8', display: 'block', marginBottom: 12 }}>
            <input
              type="checkbox"
              name="part107"
              checked={formData.part107}
              onChange={handleChange}
            />{' '}
            Part 107 Certified
          </label>

          <button type="submit" disabled={loading} style={primaryBtn}>
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ color: '#94a3b8', marginTop: 16 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#60a5fa' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

/* styles */
const pageWrap = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #3b82c4 100%)',
  display: 'flex',
  flexDirection: 'column',
}
const navBar = {
  maxWidth: '1400px',
  margin: '0 auto 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}
const brandLink = {
  fontSize: '1.8rem',
  fontWeight: 'bold',
  background: 'linear-gradient(135deg, #3b82c4, #60a5fa)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textDecoration: 'none',
}
const navLink = { color: '#94a3b8', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: 8 }
const mainCard = {
  maxWidth: 500,
  margin: '0 auto',
  background: 'rgba(30, 58, 95, 0.95)',
  borderRadius: 20,
  padding: '2.5rem',
  backdropFilter: 'blur(10px)',
}
const headline = { color: '#60a5fa', textAlign: 'center', marginBottom: '0.5rem', fontSize: '2rem' }
const subhead = { color: '#94a3b8', textAlign: 'center', marginBottom: '2rem' }
const errBox = {
  background: 'rgba(239, 68, 68, 0.2)',
  border: '1px solid rgba(239, 68, 68, 0.5)',
  color: '#fca5a5',
  padding: '0.75rem',
  borderRadius: 8,
  marginBottom: '1rem',
  textAlign: 'center',
}
const googleBtn = {
  width: '100%',
  padding: '0.875rem',
  background: '#fff',
  color: '#1a1a1a',
  border: 'none',
  borderRadius: 8,
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  marginBottom: '1.5rem',
}
const dividerWrap = { display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }
const dividerLine = { flex: 1, height: 1, background: 'rgba(96,165,250,.3)' }
const dividerText = { padding: '0 1rem', color: '#64748b', fontSize: '.875rem' }
const inputStyle = {
  width: '100%',
  padding: 12,
  marginBottom: 12,
  borderRadius: 8,
  border: '1px solid rgba(96,165,250,.3)',
  background: 'rgba(10,22,40,.5)',
  color: '#fff',
}
const primaryBtn = {
  width: '100%',
  padding: 12,
  borderRadius: 8,
  border: 'none',
  background: 'linear-gradient(135deg,#3b82c4,#60a5fa)',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
}
const card = {
  background: 'rgba(30, 58, 95, 0.9)',
  padding: '3rem',
  borderRadius: '20px',
  textAlign: 'center',
  color: 'white',
}
