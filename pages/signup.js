// CREATE: pages/signup.js
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      // Sign up the user
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

      // Show success message
      setSuccess(true)
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
      
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignup = async (provider) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      
      if (error) throw error
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 max-w-md text-center">
          <div className="text-green-400 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
          <p className="text-gray-300">Check your email to verify your account.</p>
          <p className="text-gray-400 text-sm mt-4">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center py-12">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="BlueTubeTV" className="h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">Join BlueTubeTV</h1>
          <p className="text-gray-300 mt-2">Start streaming & earning today</p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* OAuth Signup */}
        <button
          onClick={() => handleOAuthSignup('google')}
          disabled={loading}
          className="w-full bg-white text-gray-800 py-3 px-4 rounded-lg flex items-center justify-center gap-3 mb-3 hover:bg-gray-100 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </button>

        <div className="text-gray-400 text-center my-4">OR</div>

        {/* Signup Form */}
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-white text-sm mb-2">Pilot Name</label>
            <input
              type="text"
              name="pilotName"
              value={formData.pilotName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none"
              placeholder="Your drone pilot name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none"
              placeholder="pilot@email.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none"
              placeholder="••••••••"
              required
              minLength="6"
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none"
              placeholder="••••••••"
              required
              minLength="6"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                name="part107"
                checked={formData.part107}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm">I am Part 107 certified (optional)</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
          >
            {loading ? 'Creating Account...' : 'Create Free Account'}
          </button>

          <div className="text-xs text-gray-400 text-center mt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </div>
        </form>

        <div className="text-center mt-6">
          <span className="text-gray-400">Already have an account? </span>
          <Link href="/login" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </div>

        {/* Founding Pilot Badge */}
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚁</span>
            <div>
              <div className="text-yellow-400 font-bold text-sm">FOUNDING PILOT BONUS</div>
              <div className="text-yellow-300 text-xs">First 100 pilots get 50% lifetime revenue share!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}