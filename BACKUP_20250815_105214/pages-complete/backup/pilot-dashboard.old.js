// pages/pilot/dashboard.js - Complete Pilot Dashboard
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import Layout from '../../components/Layout'

export default function PilotDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeJobs: 0,
    completedJobs: 0,
    profileViews: 0,
    rating: 0,
    subscription: 'free'
  })
  const [recentJobs, setRecentJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // Get profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(profileData)

      // Get jobs
      const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .or(`pilot_id.eq.${user.id},proposals.pilot_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentJobs(jobs || [])

      // Calculate stats
      setStats({
        totalEarnings: profileData?.total_earnings || 0,
        activeJobs: jobs?.filter(j => j.status === 'in_progress').length || 0,
        completedJobs: profileData?.completed_jobs || 0,
        profileViews: profileData?.profile_views || 0,
        rating: profileData?.rating || 0,
        subscription: profileData?.subscription_tier || 'free'
      })

    } catch (error) {
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (tier) => {
    // Redirect to Stripe checkout
    const response = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier, userId: user.id })
    })
    
    const { checkoutUrl } = await response.json()
    window.location.href = checkoutUrl
  }

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          Loading dashboard...
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>
            Welcome back, {profile?.full_name || 'Pilot'}! 🚁
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '18px' }}>
            Your pilot dashboard - Track earnings, manage jobs, and grow your business
          </p>
        </div>

        {/* Subscription Alert */}
        {stats.subscription === 'free' && (
          <div style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ marginBottom: '5px' }}>
                🎉 Upgrade to Pro - Save 50% as a Founding Pilot!
              </h3>
              <p>Unlock unlimited applications, priority listing, and save on fees</p>
            </div>
            <button
              onClick={() => handleUpgrade('pro')}
              style={{
                padding: '12px 30px',
                backgroundColor: 'white',
                color: '#EF4444',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Upgrade Now →
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <StatCard
            title="Total Earnings"
            value={`$${stats.totalEarnings.toLocaleString()}`}
            icon="💰"
            color="#10B981"
          />
          <StatCard
            title="Active Jobs"
            value={stats.activeJobs}
            icon="🚁"
            color="#3B82F6"
          />
          <StatCard
            title="Completed Jobs"
            value={stats.completedJobs}
            icon="✅"
            color="#8B5CF6"
          />
          <StatCard
            title="Profile Views"
            value={stats.profileViews}
            icon="👁"
            color="#F59E0B"
          />
          <StatCard
            title="Rating"
            value={`${stats.rating} ⭐`}
            icon="⭐"
            color="#EF4444"
          />
          <StatCard
            title="Subscription"
            value={stats.subscription.toUpperCase()}
            icon="💎"
            color={stats.subscription === 'free' ? '#6B7280' : '#10B981'}
          />
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          {/* Left Column */}
          <div>
            {/* Quick Actions */}
            <div style={{
              backgroundColor: '#1E293B',
              borderRadius: '12px',
              padding: '25px',
              marginBottom: '20px'
            }}>
              <h2 style={{ marginBottom: '20px' }}>Quick Actions</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                <button
                  onClick={() => router.push('/jobs')}
                  style={{
                    padding: '15px',
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  🔍 Find Jobs
                </button>
                <button
                  onClick={() => router.push('/live')}
                  style={{
                    padding: '15px',
                    backgroundColor: '#EF4444',
                    color: 'white',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  🔴 Go Live
                </button>
                <button
                  onClick={() => router.push('/pilot/profile')}
                  style={{
                    padding: '15px',
                    backgroundColor: '#10B981',
                    color: 'white',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  👤 Edit Profile
                </button>
                <button
                  onClick={() => router.push('/pilot/earnings')}
                  style={{
                    padding: '15px',
                    backgroundColor: '#8B5CF6',
                    color: 'white',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  💳 Withdraw Earnings
                </button>
              </div>
            </div>

            {/* Recent Jobs */}
            <div style={{
              backgroundColor: '#1E293B',
              borderRadius: '12px',
              padding: '25px'
            }}>
              <h2 style={{ marginBottom: '20px' }}>Recent Jobs</h2>
              {recentJobs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {recentJobs.map(job => (
                    <div
                      key={job.id}
                      style={{
                        padding: '15px',
                        backgroundColor: '#0F172A',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <h4 style={{ marginBottom: '5px' }}>{job.title}</h4>
                        <p style={{ color: '#94A3B8', fontSize: '14px' }}>
                          ${job.budget} • {job.location}
                        </p>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        backgroundColor: getStatusColor(job.status),
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {job.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#94A3B8' }}>No jobs yet. Start applying!</p>
              )}
            </div>
          </div>

          {/* Right Column - Subscription */}
          <div>
            <div style={{
              backgroundColor: '#1E293B',
              borderRadius: '12px',
              padding: '25px'
            }}>
              <h2 style={{ marginBottom: '20px' }}>Your Plan</h2>
              
              {/* Current Plan */}
              <div style={{
                padding: '20px',
                backgroundColor: '#0F172A',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '2px solid #10B981'
              }}>
                <h3 style={{ marginBottom: '10px' }}>
                  {stats.subscription === 'free' ? 'Free Pilot' : 
                   stats.subscription === 'pro' ? 'Pro Pilot' : 'Elite Squadron'}
                </h3>
                <p style={{ color: '#10B981', fontSize: '24px', marginBottom: '10px' }}>
                  {stats.subscription === 'free' ? '$0' : 
                   stats.subscription === 'pro' ? '$29' : '$99'}/month
                </p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {stats.subscription === 'free' ? (
                    <>
                      <li>✅ 5 applications/month</li>
                      <li>❌ 20% platform fee</li>
                      <li>❌ No priority support</li>
                    </>
                  ) : (
                    <>
                      <li>✅ Unlimited applications</li>
                      <li>✅ {stats.subscription === 'pro' ? '15%' : '10%'} platform fee</li>
                      <li>✅ Priority support</li>
                      <li>✅ Analytics dashboard</li>
                      {stats.subscription === 'elite' && <li>✅ API access</li>}
                    </>
                  )}
                </ul>
              </div>

              {/* Upgrade Options */}
              {stats.subscription !== 'elite' && (
                <div>
                  <h4 style={{ marginBottom: '15px' }}>Upgrade Your Plan</h4>
                  {stats.subscription === 'free' && (
                    <button
                      onClick={() => handleUpgrade('pro')}
                      style={{
                        width: '100%',
                        padding: '15px',
                        marginBottom: '10px',
                        backgroundColor: '#3B82F6',
                        color: 'white',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Upgrade to Pro ($29/mo)
                    </button>
                  )}
                  <button
                    onClick={() => handleUpgrade('elite')}
                    style={{
                      width: '100%',
                      padding: '15px',
                      backgroundColor: '#8B5CF6',
                      color: 'white',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Upgrade to Elite ($99/mo)
                  </button>
                </div>
              )}

              {/* Founder Badge */}
              {profile?.is_founder && (
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <p style={{ fontWeight: 'bold' }}>🏆 FOUNDING PILOT</p>
                  <p style={{ fontSize: '14px' }}>50% lifetime discount active</p>
                </div>
              )}
            </div>

            {/* Referral Program */}
            <div style={{
              backgroundColor: '#1E293B',
              borderRadius: '12px',
              padding: '25px',
              marginTop: '20px'
            }}>
              <h3 style={{ marginBottom: '15px' }}>Refer & Earn</h3>
              <p style={{ color: '#94A3B8', marginBottom: '15px' }}>
                Earn $10 for each pilot who signs up with your code
              </p>
              <div style={{
                padding: '10px',
                backgroundColor: '#0F172A',
                borderRadius: '8px',
                textAlign: 'center',
                fontFamily: 'monospace',
                fontSize: '18px'
              }}>
                {profile?.referral_code || 'PILOT123'}
              </div>
              <button
                style={{
                  width: '100%',
                  marginTop: '10px',
                  padding: '10px',
                  backgroundColor: '#10B981',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Copy Referral Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function StatCard({ title, value, icon, color }) {
  return (
    <div style={{
      backgroundColor: '#1E293B',
      borderRadius: '12px',
      padding: '20px',
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: '#94A3B8', marginBottom: '8px' }}>{title}</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{value}</p>
        </div>
        <span style={{ fontSize: '32px' }}>{icon}</span>
      </div>
    </div>
  )
}

function getStatusColor(status) {
  const colors = {
    'open': '#3B82F6',
    'in_progress': '#F59E0B',
    'completed': '#10B981',
    'cancelled': '#EF4444'
  }
  return colors[status] || '#6B7280'
}