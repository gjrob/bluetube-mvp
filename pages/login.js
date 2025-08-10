// pages/login.js - Complete Login/Signup Page
import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'

export default function Login() {
  const router = useRouter()
  const [mode, setMode] = useState('login') // login or signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [userType, setUserType] = useState('pilot') // pilot or client
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (mode === 'signup') {
        // Sign up new user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              user_type: userType
            }
          }
        })

        if (authError) throw authError

        // Create profile
        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              email: email,
              full_name: fullName,
              user_type: userType,
              subscription_tier: 'free',
              created_at: new Date().toISOString()
            })

          if (profileError) console.error('Profile creation error:', profileError)
        }

        setMessage('✅ Account created! Check your email to verify.')
        
        // Auto-login after signup
        setTimeout(() => {
          router.push(userType === 'pilot' ? '/pilot/dashboard' : '/client/dashboard')
        }, 2000)

      } else {
        // Login existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) throw error

        // Get user profile to determine type
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .single()

        // Redirect based on user type
        router.push(profile?.user_type === 'pilot' ? '/pilot/dashboard' : '/client/dashboard')
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) setMessage(`❌ Error: ${error.message}`)
  }

  return (
    <Layout>
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '450px',
          width: '100%',
          backgroundColor: '#1E293B',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>
              {mode === 'login' ? 'Welcome Back!' : 'Join BlueTubeTV'}
            </h1>
            <p style={{ color: '#94A3B8' }}>
              {mode === 'login' 
                ? 'Login to access your dashboard' 
                : 'Start earning as a drone pilot today'}
            </p>
          </div>

          {/* Toggle */}
          <div style={{
            display: 'flex',
            backgroundColor: '#0F172A',
            borderRadius: '8px',
            padding: '4px',
            marginBottom: '30px'
          }}>
            <button
              onClick={() => setMode('login')}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: mode === 'login' ? '#3B82F6' : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Login
            </button>
            <button
              onClick={() => setMode('signup')}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: mode === 'signup' ? '#3B82F6' : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth}>
            {mode === 'signup' && (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '15px',
                    backgroundColor: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  <button
                    type="button"
                    onClick={() => setUserType('pilot')}
                    style={{
                      padding: '12px',
                      backgroundColor: userType === 'pilot' ? '#10B981' : '#0F172A',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    🚁 I'm a Pilot
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('client')}
                    style={{
                      padding: '12px',
                      backgroundColor: userType === 'client' ? '#10B981' : '#0F172A',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    💼 I'm Hiring
                  </button>
                </div>
              </>
            )}

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
                backgroundColor: '#0F172A',
                border: '1px solid #334155',
                borderRadius: '8px',
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
                backgroundColor: '#0F172A',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: 'white'
              }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Create Account')}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }} />
            <span style={{ padding: '0 10px', color: '#64748B' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }} />
          </div>

          {/* Google Auth */}
          <button
            onClick={handleGoogleAuth}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'white',
              color: '#1F2937',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" width="20" />
            Continue with Google
          </button>

          {/* Message */}
          {message && (
            <div style={{
              marginTop: '20px',
              padding: '12px',
              backgroundColor: message.includes('✅') ? '#065F46' : '#991B1B',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}

          {/* Founder Offer */}
          {mode === 'signup' && userType === 'pilot' && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                🎉 FOUNDER PILOT OFFER
              </p>
              <p style={{ fontSize: '14px' }}>
                First 100 pilots get 50% OFF forever!
                <br />
                Only 73 spots left
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}