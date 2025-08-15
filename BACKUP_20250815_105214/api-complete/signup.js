// pages/signup.js - THIS IS WHAT YOU'RE MISSING!
// ============================================

import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Signup() {
  const router = useRouter()
  const { role } = router.query
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    companyName: '',
    userType: role || 'pilot'
  })

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Call YOUR existing API endpoint
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      alert(data.message || 'Signup successful! Check your email.')
      
      // Redirect based on user type
      if (formData.userType === 'pilot') {
        router.push('/pilot-setup')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      alert(error.message || 'Signup failed')
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
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(30, 41, 59, 0.95)',
        padding: '40px',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
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
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#e2e8f0',
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #334155',
                background: '#1e293b',
                color: 'white',
                fontSize: '16px'
              }}
              placeholder="John Doe"
            />
          </div>

          {formData.userType === 'client' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#e2e8f0',
                marginBottom: '8px',
                fontSize: '14px'
              }}>
                Company Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  background: '#1e293b',
                  color: 'white',
                  fontSize: '16px'
                }}
                placeholder="Acme Corp (optional)"
              />
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#e2e8f0',
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #334155',
                background: '#1e293b',
                color: 'white',
                fontSize: '16px'
              }}
              placeholder="pilot@example.com"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#e2e8f0',
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #334155',
                background: '#1e293b',
                color: 'white',
                fontSize: '16px'
              }}
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#e2e8f0',
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              I want to
            </label>
            <select
              value={formData.userType}
              onChange={(e) => setFormData({...formData, userType: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
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
          </div>

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