// pages/dashboard.js - Simple BlueTubeTV Dashboard
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setUser(session.user)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">BlueTubeTV</h1>
              <span className="text-gray-400">Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-300">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome to BlueTubeTV! 🚁
          </h2>
          <p className="text-gray-300">
            The professional drone streaming & job marketplace
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">🔴</div>
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-gray-400 text-sm">Active Streams</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">👁️</div>
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-gray-400 text-sm">Total Views</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-white">$0</div>
            <div className="text-gray-400 text-sm">Earnings</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">📋</div>
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-gray-400 text-sm">Jobs Posted</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-white/10">
          {['overview', 'stream', 'jobs', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 capitalize transition ${
                activeTab === tab
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Getting Started</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <h4 className="text-white font-semibold">Set up your stream</h4>
                    <p className="text-gray-400">Configure your streaming settings and get your stream key</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <h4 className="text-white font-semibold">Start streaming</h4>
                    <p className="text-gray-400">Go live and share your drone footage with the world</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <h4 className="text-white font-semibold">Find drone jobs</h4>
                    <p className="text-gray-400">Browse and apply for drone pilot opportunities</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stream' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Stream Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Stream Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/20"
                    placeholder="Enter your stream title"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Stream Key</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white border border-white/20"
                      value="****-****-****-****"
                      readOnly
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Generate Key
                    </button>
                  </div>
                </div>
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                  Start Streaming
                </button>
              </div>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Drone Jobs</h3>
              <p className="text-gray-400 mb-4">No jobs available yet. Check back soon!</p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Post a Job
              </button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/20"
                    value={user.email}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">User ID</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-gray-400 border border-white/20"
                    value={user.id}
                    readOnly
                  />
                </div>
                <div className="pt-4">
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}