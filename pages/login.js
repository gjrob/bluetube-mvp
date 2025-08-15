import { analytics } from '../lib/analytics-enhanced'
// pages/login.js - COMPLETE UPDATED FILE
// Copy this entire file to replace your current login.js

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // THIS IS THE KEY PART - Handle OAuth code exchange
    const handleOAuthCallback = async () => {
      // Step 1: Check if there's a 'code' parameter in the URL
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      
      if (code) {
        console.log('OAuth code found:', code)
        setLoading(true)
        setError(null)
        
        try {
          // Step 2: Exchange the code for a session
          // This is the missing piece that was causing the loop!
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            console.error('Failed to exchange code:', error)
            setError('Authentication failed. Please try again.')
            // Clear the URL parameters
            window.history.replaceState({}, document.title, '/login')
          } else {
            console.log('Successfully authenticated!')
            // Step 3: Redirect to dashboard after successful exchange
            router.push('/dashboard')
          }
        } catch (err) {
          console.error('Exchange error:', err)
          setError('Failed to complete authentication')
          // Clear the URL parameters
          window.history.replaceState({}, document.title, '/login')
        } finally {
          setLoading(false)
        }
      }
    }

    // Check if user is already logged in (but not during OAuth callback)
    const checkExistingSession = async () => {
      // Don't check session if we're processing OAuth callback
      if (router.query.code) return
      
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        console.log('Existing session found, redirecting to dashboard')
        router.push('/dashboard')
      }
    }
    
    // Run both checks
    handleOAuthCallback()
    checkExistingSession()
  }, [router])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      })

      if (error) {
        if (error.message.includes('Invalid login')) {
          setError('Invalid email or password')
        } else {
          setError(error.message)
        }
        return
      }
      
      console.log('Email login successful')
      router.push('/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          // This tells Supabase where to redirect after OAuth
          redirectTo: `${window.location.origin}/login`,
        }
      })
      
      if (error) {
        console.error(`${provider} OAuth error:`, error)
        setError(`${provider} login failed: ${error.message}`)
        setLoading(false)
      }
      // If successful, the browser will redirect to the OAuth provider
    } catch (err) {
      console.error(`${provider} error:`, err)
      setError(`Failed to connect with ${provider}`)
      setLoading(false)
    }
  }

  // Show loading screen while processing OAuth callback
  if (loading && router.query.code) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Completing authentication...</p>
          <p className="text-sm text-gray-400 mt-2">Please wait...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">BlueTubeTV</h1>
          <p className="text-gray-300 mt-2">Welcome Back</p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded mb-4">
            {error}
            <button 
              onClick={() => setError(null)}
              className="float-right text-red-200 hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        {/* Google Login Button */}
        <button
          onClick={() => handleOAuthLogin('google')}
          disabled={loading}
          className="w-full bg-white text-gray-800 py-3 px-4 rounded-lg flex items-center justify-center gap-3 mb-3 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Connecting...' : 'Continue with Google'}
        </button>

        {/* Facebook Login Button */}
        <button
          onClick={() => handleOAuthLogin('facebook')}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 mb-3 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          {loading ? 'Connecting...' : 'Continue with Facebook'}
        </button>

        <div className="text-gray-400 text-center my-4">OR</div>

        {/* Email/Password Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none"
              placeholder="Email address"
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none"
              placeholder="Password"
              required
              minLength="6"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6">
          <span className="text-gray-400">Don't have an account? </span>
          <Link href="/signup" className="text-blue-400 hover:underline">
            Create Free Account
          </Link>
        </div>

        <div className="text-center mt-4">
          <Link href="/forgot-password" className="text-gray-400 text-sm hover:text-blue-400">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  )
}