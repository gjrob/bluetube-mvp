// pages/signup.js - CREATE THIS FILE
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const { role } = router.query
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    userType: role || 'pilot'
  })
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        alert('Signup successful! Please check your email.')
        router.push('/login')
      } else {
        alert(data.error || 'Signup failed')
      }
    } catch (error) {
      alert('Error: ' + error.message)
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
        maxWidth: '450px'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: '28px',
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          Join BlueTubeTV
        </h1>
        
        <p style={{
          color: '#94a3b8',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          {formData.userType === 'pilot' 
            ? 'Start streaming and earning today'
            : 'Hire professional drone pilots'
          }
        </p>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#1e293b',
              color: 'white',
              fontSize: '16px'
            }}
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#1e293b',
              color: 'white',
              fontSize: '16px'
            }}
          />

          <input
            type="password"
            placeholder="Password (min 6 characters)"
            required
            minLength={6}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#1e293b',
              color: 'white',
              fontSize: '16px'
            }}
          />

          <select
            value={formData.userType}
            onChange={(e) => setFormData({...formData, userType: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#1e293b',
              color: 'white',
              fontSize: '16px'
            }}
          >
            <option value="pilot">Stream as a Pilot</option>
            <option value="client">Hire Pilots</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              background: loading 
                ? '#64748b'
                : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating Account...' : 'Start Free (7-Day Trial)'}
          </button>
        </form>

        <p style={{
          color: '#94a3b8',
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '14px'
        }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#3b82f6' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}