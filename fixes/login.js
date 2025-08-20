// pages/login.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Check user type and redirect
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profile?.is_pilot) {
        router.push('/dashboard')
      } else if (profile?.is_client) {
        router.push('/dashboard')
      } else {
        router.push('/browse')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0e7490 100%)'
    }}>
      <div style={{
        background: 'rgba(30, 41, 59, 0.95)',
        padding: '40px',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '30px' }}>
          Welcome Back
        </h1>
        
        {error && (
          <div style={{
            background: '#ef4444',
            color: 'white',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              borderRadius: '6px',
              border: '1px solid #334155',
              background: '#1e293b',
              color: 'white'
            }}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '6px',
              border: '1px solid #334155',
              background: '#1e293b',
              color: 'white'
            }}
          />
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#64748b' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '20px' }}>
          Don't have an account?{' '}
          <Link href="/signup" style={{ color: '#3b82f6' }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}