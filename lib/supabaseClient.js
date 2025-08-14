// 1. CREATE/UPDATE: lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://akphnfsulfzhrdsvhla.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key-here'

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    redirectTo: typeof window !== 'undefined' 
      ? `${window.location.origin}/dashboard`
      : undefined
  }
})

// 2. UPDATE YOUR LOGIN PAGE: pages/login.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'  // Use this import!
import { analytics } from '../lib/analytics-enhanced'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
      }
    }
    
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      
      if (accessToken) {
        // User authenticated successfully
        router.push('/dashboard')
      }
    }
    
    checkUser()
    handleAuthCallback()
  }, [router])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      analytics?.track('user_login', { method: 'email' })
      router.push('/dashboard')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      
      if (error) throw error
      analytics?.track('user_login', { method: provider })
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="BlueTubeTV" className="h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* OAuth Buttons */}
        <button
          onClick={() => handleOAuthLogin('google')}
          disabled={loading}
          className="w-full bg-white text-gray-800 py-3 px-4 rounded-lg flex items-center justify-center gap-3 mb-3 hover:bg-gray-100 transition disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Connecting...' : 'Continue with Google'}
        </button>

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => handleOAuthLogin('facebook')}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            Facebook
          </button>
          
          <button
            onClick={() => handleOAuthLogin('twitter')}
            disabled={loading}
            className="flex-1 bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            X
          </button>
        </div>

        <div className="text-gray-400 text-center my-4">OR</div>

        {/* Email/Password Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-white text-sm mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none"
              placeholder="pilot@bluetubetv.live"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-white text-sm">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-blue-400 text-sm hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
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

        <div className="text-center mt-4 text-xs text-gray-500">
          🔒 SSL Secured | 🛡️ GDPR Compliant | ✅ Part 107 Verified
        </div>
      </div>
    </div>
  )
}