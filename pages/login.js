// pages/login.js - Complete working version with OAuth
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient';
import { analytics } from '../lib/analytics-enhanced'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [redirectPath, setRedirectPath] = useState('/dashboard')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    // Check for redirect parameter
    if (router.query.redirect) {
      setRedirectPath(router.query.redirect)
    }
    
    // Handle OAuth callback
    handleAuthCallback()
  }, [router.query])

  const handleAuthCallback = async () => {
    try {
      // Check if we're returning from an OAuth redirect
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      
      if (accessToken) {
        // We have a token from OAuth redirect
        const { data: { user }, error } = await supabase.auth.getUser(accessToken)
        
        if (user && !error) {
          console.log('OAuth login successful:', user.email)
          
          // Store the session
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get('refresh_token')
          })
          
          // Redirect to dashboard
          window.location.href = redirectPath
          return
        }
      }
      
      // Check if already authenticated
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        console.log('Already authenticated, redirecting...')
        router.push(redirectPath)
      }
    } catch (error) {
      console.error('Auth callback error:', error)
    } finally {
      setCheckingAuth(false)
    }
  }

  const validatePassword = (pass) => {
    let strength = 0
    if (pass.length >= 10) strength++
    if (/[a-z]/.test(pass)) strength++
    if (/[A-Z]/.test(pass)) strength++
    if (/[0-9]/.test(pass)) strength++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) strength++
    setPasswordStrength(strength)
    return strength >= 4
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!validatePassword(password)) {
      setError('Password must be at least 10 characters with uppercase, lowercase, numbers, and special characters')
      setLoading(false)
      return
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      console.log('Email login successful:', data.user.email)
      
      // Redirect to dashboard
      router.push(redirectPath)
      
    } catch (error) {
      console.error('Email login error:', error)
      setError(error.message)
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      if (error) throw error
      
      // The browser will redirect to Google
      console.log('Redirecting to Google...')
      
    } catch (error) {
      console.error('Google login error:', error)
      setError('Google sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  const handleFacebookLogin = async () => {
    setLoading(true)
    setError('')
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/login`,
          scopes: 'email public_profile'
        }
      })
      
      if (error) throw error
      
      // The browser will redirect to Facebook
      console.log('Redirecting to Facebook...')
      
    } catch (error) {
      console.error('Facebook login error:', error)
      setError('Facebook sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  const handleTwitterLogin = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Note: Twitter OAuth 2.0 might need different configuration
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/login`
        }
      })
      
      if (error) throw error
      
      // The browser will redirect to Twitter
      console.log('Redirecting to Twitter...')
      
    } catch (error) {
      console.error('Twitter login error:', error)
      setError('Twitter sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return '#ef4444'
    if (passwordStrength <= 3) return '#f97316'
    if (passwordStrength <= 4) return '#eab308'
    return '#10b981'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak'
    if (passwordStrength <= 2) return 'Fair'
    if (passwordStrength <= 3) return 'Good'
    if (passwordStrength <= 4) return 'Strong'
    return 'Very Strong'
  }

  // Show loading spinner while checking auth
  if (checkingAuth) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 50%, #155e75 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid rgba(255,255,255,0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Loading...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 50%, #155e75 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '-100px',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 20s infinite ease-in-out'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-150px',
        right: '-150px',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 25s infinite ease-in-out reverse'
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '480px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo and Branding */}
        <div 
          onClick={() => router.push('/')}
          style={{
            textAlign: 'center',
            marginBottom: '40px',
            cursor: 'pointer',
            animation: 'fadeInDown 0.6s ease-out'
          }}
        >
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 40px rgba(8, 145, 178, 0.3)',
            transform: 'rotate(45deg)'
          }}>
            <div style={{
              transform: 'rotate(-45deg)',
              fontSize: '48px'
            }}>
              🚁
            </div>
          </div>
          
          <h1 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 10px 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            BlueTubeTV
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '16px',
            fontWeight: '300'
          }}>
            Professional Drone Streaming Platform
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
          animation: 'fadeInUp 0.6s ease-out'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1a202c',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            Welcome Back
          </h2>

          {error && (
            <div style={{
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '20px',
              color: '#c00',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Social Sign In Options */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '25px'
          }}>
            {/* Google Sign In */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: 'white',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                transition: 'all 0.3s ease',
                color: '#333',
                opacity: loading ? 0.7 : 1
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.borderColor = '#4285f4'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.15)'
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Connecting...' : 'Continue with Google'}
            </button>

            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              {/* Facebook Sign In */}
              <button
                onClick={handleFacebookLogin}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'white',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  color: '#333',
                  opacity: loading ? 0.7 : 1
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.currentTarget.style.borderColor = '#1877f2'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 119, 242, 0.15)'
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>

              {/* Twitter Sign In */}
              <button
                onClick={handleTwitterLogin}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'white',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  color: '#333',
                  opacity: loading ? 0.7 : 1
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.currentTarget.style.borderColor = '#000000'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#000000" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X
              </button>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0',
            gap: '10px'
          }}>
            <div style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #e0e0e0, transparent)'
            }}></div>
            <span style={{
              color: '#999',
              fontSize: '14px',
              fontWeight: '500'
            }}>OR</span>
            <div style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #e0e0e0, transparent)'
            }}></div>
          </div>

          <form onSubmit={handleEmailLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#4a5568',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#f7fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                placeholder="pilot@bluetubetv.live"
                onFocus={(e) => {
                  e.target.style.borderColor = '#0891b2'
                  e.target.style.background = 'white'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0'
                  e.target.style.background = '#f7fafc'
                }}
              />
            </div>

            <div style={{ marginBottom: '8px' }}>
              <label style={{
                display: 'block',
                color: '#4a5568',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    validatePassword(e.target.value)
                  }}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 48px 12px 16px',
                    background: '#f7fafc',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter your password"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0891b2'
                    e.target.style.background = 'white'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.background = '#f7fafc'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '20px',
                    color: '#718096'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              
              {/* Password Strength Indicator (only show when typing) */}
              {password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    marginBottom: '4px'
                  }}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        style={{
                          flex: 1,
                          height: '4px',
                          borderRadius: '2px',
                          background: level <= passwordStrength 
                            ? getPasswordStrengthColor()
                            : '#e2e8f0',
                          transition: 'background 0.3s ease'
                        }}
                      />
                    ))}
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: getPasswordStrengthColor(),
                    fontWeight: '500'
                  }}>
                    Password Strength: {getPasswordStrengthText()}
                  </span>
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#4a5568'
              }}>
                <input
                  type="checkbox"
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#0891b2'
                  }}
                />
                Remember me
              </label>
              <Link href="/forgot-password" style={{
                fontSize: '14px',
                color: '#0891b2',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading 
                  ? '#cbd5e0'
                  : 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.3s ease',
                boxShadow: !loading 
                  ? '0 4px 15px rgba(8, 145, 178, 0.4)'
                  : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              {loading && (
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{
            textAlign: 'center',
            marginTop: '25px',
            paddingTop: '25px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <p style={{ 
              color: '#718096', 
              marginBottom: '12px',
              fontSize: '14px'
            }}>
              Don't have an account?
            </p>
            <button
              onClick={() => router.push(`/signup?redirect=${redirectPath}`)}
              style={{
                background: 'transparent',
                color: '#0891b2',
                border: '2px solid #0891b2',
                padding: '10px 30px',
                borderRadius: '12px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#0891b2'
                e.target.style.color = 'white'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent'
                e.target.style.color = '#0891b2'
              }}
            >
              Create Free Account
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div style={{
          marginTop: '30px',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.8)',
          fontSize: '13px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '15px'
          }}>
            <span>🔒 SSL Secured</span>
            <span>🛡️ GDPR Compliant</span>
            <span>✅ Part 107 Verified</span>
          </div>
          <p>
            By signing in, you agree to our{' '}
            <Link href="/terms" style={{ color: 'white' }}>Terms</Link> and{' '}
            <Link href="/privacy" style={{ color: 'white' }}>Privacy Policy</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          33% {
            transform: translateY(-30px) rotate(120deg);
          }
          66% {
            transform: translateY(30px) rotate(240deg);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}