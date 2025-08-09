// ===== Create /components/LoginForm.js =====
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'

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
      const data = await signIn(email, password)
      
      // Redirect based on user type
      if (data.userType === 'pilot') {
        router.push('/dashboard')
      } else {
        router.push('/jobs/post')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '40px',
      backgroundColor: '#1a1a2e',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    }}>
      <h2 style={{
        fontSize: '28px',
        marginBottom: '30px',
        textAlign: 'center',
        color: '#3B82F6'
      }}>
        Welcome Back
      </h2>

      {error && (
        <div style={{
          backgroundColor: '#EF4444',
          color: 'white',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          color: '#94A3B8',
          fontSize: '14px'
        }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #374151',
            backgroundColor: '#0F172A',
            color: 'white',
            fontSize: '16px'
          }}
        />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          color: '#94A3B8',
          fontSize: '14px'
        }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #374151',
            backgroundColor: '#0F172A',
            color: 'white',
            fontSize: '16px'
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '6px',
          backgroundColor: '#3B82F6',
          color: 'white',
          fontSize: '16px',
          fontWeight: '600',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'all 0.2s'
        }}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}