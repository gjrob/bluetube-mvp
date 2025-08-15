// pages/profile.js - Using your existing components
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import Part107Verification from '../components/Part107Verification'
import FlightCompliance from '../components/FlightCompliance'
import EarningsOverview from '../components/EarningsOverview'
import RevenueDashboard from '../components/RevenueDashboard'
import TransactionHistory from '../components/TransactionHistory'
import NFTMinting from '../components/NFTMinting'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'

export default function Profile() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      fetchProfile()
    }
  }, [user])

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile(updates) {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        })

      if (!error) {
        fetchProfile()
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading profile...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{profile?.pilot_name || user?.email}</h1>
            <p className="pilot-badge">
              {profile?.part107_verified ? '✅ Part 107 Certified' : '⚠️ Not Verified'}
            </p>
            <div className="stats-row">
              <span>📹 {profile?.total_streams || 0} Streams</span>
              <span>👁️ {profile?.total_views || 0} Views</span>
              <span>💰 ${profile?.total_earnings || 0} Earned</span>
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={activeTab === 'certification' ? 'active' : ''}
            onClick={() => setActiveTab('certification')}
          >
            Certification
          </button>
          <button 
            className={activeTab === 'compliance' ? 'active' : ''}
            onClick={() => setActiveTab('compliance')}
          >
            Compliance
          </button>
          <button 
            className={activeTab === 'earnings' ? 'active' : ''}
            onClick={() => setActiveTab('earnings')}
          >
            Earnings
          </button>
          <button 
            className={activeTab === 'nft' ? 'active' : ''}
            onClick={() => setActiveTab('nft')}
          >
            NFTs
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <h2>Profile Overview</h2>
              <div className="profile-form">
                <div className="form-group">
                  <label>Pilot Name</label>
                  <input 
                    type="text"
                    value={profile?.pilot_name || ''}
                    onChange={(e) => setProfile({...profile, pilot_name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea 
                    value={profile?.bio || ''}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    rows={4}
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input 
                    type="text"
                    value={profile?.location || ''}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                  />
                </div>
                <button 
                  onClick={() => updateProfile(profile)}
                  className="save-btn"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'certification' && (
            <Part107Verification 
              userId={user.id}
              onVerified={() => fetchProfile()}
            />
          )}

          {activeTab === 'compliance' && (
            <FlightCompliance userId={user.id} />
          )}

          {activeTab === 'earnings' && (
            <div className="earnings-section">
              <EarningsOverview userId={user.id} />
              <RevenueDashboard userId={user.id} />
              <TransactionHistory userId={user.id} />
            </div>
          )}

          {activeTab === 'nft' && (
            <NFTMinting userId={user.id} />
          )}
        </div>
      </div>

      <style jsx>{`
        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        .loading {
          text-align: center;
          padding: 3rem;
        }
        .profile-header {
          display: flex;
          gap: 2rem;
          margin-bottom: 3rem;
          padding: 2rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 3rem;
          font-weight: bold;
        }
        .profile-info {
          flex: 1;
        }
        .profile-info h1 {
          margin-bottom: 0.5rem;
        }
        .pilot-badge {
          color: #666;
          margin-bottom: 1rem;
        }
        .stats-row {
          display: flex;
          gap: 2rem;
          color: #666;
        }
        .profile-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid #e5e5e5;
        }
        .profile-tabs button {
          background: none;
          border: none;
          padding: 1rem 1.5rem;
          cursor: pointer;
          color: #666;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .profile-tabs button.active {
          color: #667eea;
          border-bottom: 2px solid #667eea;
        }
        .profile-content {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .overview-section h2 {
          margin-bottom: 1.5rem;
        }
        .profile-form {
          max-width: 600px;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #333;
          font-weight: 500;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 0.5rem;
          font-size: 1rem;
        }
        .save-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 1rem;
        }
        .earnings-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
      `}</style>
    </Layout>
  )
}