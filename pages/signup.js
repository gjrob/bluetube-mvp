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
    part107: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            pilot_name: formData.pilotName,
            part107_certified: formData.part107
          }
        }
      })

      if (error) throw error

      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignup = async (provider) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/dashboard` }
      })
      if (error) throw error
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  if (success) {
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
          padding: '3rem',
          borderRadius: '20px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ color: '#60a5fa', marginBottom: '1rem' }}>Account Created Successfully!</h2>
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #3b82c4 100%)',
      padding: '2rem'
    }}>
      {/* Header */}
      <nav style={{
        maxWidth: '1400px',
        margin: '0 auto 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #3b82c4, #60a5fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🚁 BlueTubeTV
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/login" style={{
            color: '#94a3b8',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            transition: 'all 0.3s'
          }}>
            Sign In
          </Link>
        </div>
      </nav>

      {/* Main Container */}
      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        background: 'rgba(30, 58, 95, 0.95)',
        borderRadius: '20px',
        padding: '2.5rem',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(59, 130, 196, 0.3)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <h1 style={{
          color: '#60a5fa',
          textAlign: 'center',
          marginBottom: '0.5rem',
          fontSize: '2rem',
          background: 'linear-gradient(135deg, #60a5fa, #93c5fd)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Join BlueTubeTV
        </h1>
        
        <p style={{
          color: '#94a3b8',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          Start streaming drone footage today
        </p>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            color: '#fca5a5',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Google OAuth */}
        <button
          onClick={() => handleOAuthSignup('google')}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.875rem',
            background: 'white',
            color: '#1a1a1a',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'wait' : 'pointer',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Connecting...' : 'Sign up with Google'}
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'rgba(96, 165, 250, 0.3)'
          }}></div>
          <span style={{
            padding: '0 1rem',
            color: '#64748b',
            fontSize: '0.875rem'
          }}>
            OR
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'rgba(96, 165, 250, 0.3)'
          }}></div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              color: '#93c5fd',
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              Pilot Name
            </label>
            <input
              type="text"
              name="pilotName"
              value={formData.pilotName}
              onChange={handleChange}
              placeholder="Enter your pilot name"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(96, 165, 250, 0.3)',
                background: 'rgba(10, 22, 40, 0.5)',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#60a5fa'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(96, 165, 250, 0.3)'}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              color: '#93c5fd',
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="pilot@example.com"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(96, 165, 250, 0.3)',
                background: 'rgba(10, 22, 40, 0.5)',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#60a5fa'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(96, 165, 250, 0.3)'}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              color: '#93c5fd',
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(96, 165, 250, 0.3)',
                background: 'rgba(10, 22, 40, 0.5)',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#60a5fa'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(96, 165, 250, 0.3)'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              color: '#93c5fd',
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(96, 165, 250, 0.3)',
                background: 'rgba(10, 22, 40, 0.5)',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#60a5fa'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(96, 165, 250, 0.3)'}
            />
          </div>

          {/* Part 107 Checkbox */}
          <div style={{
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            background: 'rgba(59, 130, 196, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(96, 165, 250, 0.2)'
          }}>
            <input
              type="checkbox"
              name="part107"
              id="part107"
              checked={formData.part107}
              onChange={handleChange}
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer'
              }}
            />
            <label htmlFor="part107" style={{
              color: '#93c5fd',
              cursor: 'pointer',
              flex: 1
            }}>
              <strong>Part 107 Certified</strong>
              <div style={{
                fontSize: '0.875rem',
                color: '#64748b',
                marginTop: '0.25rem'
              }}>
                I have a valid FAA Part 107 certificate
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              background: 'linear-gradient(135deg, #3b82c4, #60a5fa)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'wait' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(59, 130, 196, 0.4)'
            }}
            onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
          >
            {loading ? 'Creating Account...' : 'Create Free Account'}
          </button>
        </form>

        {/* Sign In Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(96, 165, 250, 0.2)'
        }}>
          <span style={{ color: '#94a3b8' }}>
            Already have an account?{' '}
          </span>
          <Link href="/login" style={{
            color: '#60a5fa',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            Sign In
          </Link>
        </div>

        {/* Terms */}
        <p style={{
          textAlign: 'center',
          marginTop: '1rem',
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          By signing up, you agree to our{' '}
          <Link href="/terms" style={{ color: '#60a5fa', textDecoration: 'none' }}>
            Terms
          </Link>
          {' and '}
          <Link href="/privacy" style={{ color: '#60a5fa', textDecoration: 'none' }}>
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}