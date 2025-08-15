// pages/dashboard.js - Beautiful BlueTubeTV Dashboard
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import styles from '../styles/Dashboard.module.css'

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
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading Dashboard...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <h1>BlueTubeTV</h1>
            <span className={styles.tagline}>Dashboard</span>
          </div>
          <div className={styles.userSection}>
            <span className={styles.userEmail}>{user.email}</span>
            <button onClick={handleSignOut} className={styles.signOutBtn}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Welcome Section */}
        <section className={styles.welcomeSection}>
          <h2>Welcome to BlueTubeTV! 🚁</h2>
          <p>The professional drone streaming & job marketplace</p>
        </section>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🔴</div>
            <div className={styles.statValue}>0</div>
            <div className={styles.statLabel}>Active Streams</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👁️</div>
            <div className={styles.statValue}>0</div>
            <div className={styles.statLabel}>Total Views</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statValue}>$0</div>
            <div className={styles.statLabel}>Earnings</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📋</div>
            <div className={styles.statValue}>0</div>
            <div className={styles.statLabel}>Jobs Posted</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabNav}>
          <button
            className={`${styles.tab} ${activeTab === 'overview' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'stream' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('stream')}
          >
            Stream
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'jobs' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            Jobs
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'settings' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <div className={styles.contentSection}>
              <h3>Getting Started</h3>
              <div className={styles.stepsList}>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>1️⃣</span>
                  <div>
                    <h4>Set up your stream</h4>
                    <p>Configure your streaming settings and get your stream key</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>2️⃣</span>
                  <div>
                    <h4>Start streaming</h4>
                    <p>Go live and share your drone footage with the world</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>3️⃣</span>
                  <div>
                    <h4>Find drone jobs</h4>
                    <p>Browse and apply for drone pilot opportunities</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stream' && (
            <div className={styles.contentSection}>
              <h3>Stream Settings</h3>
              <div className={styles.formGroup}>
                <label>Stream Title</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter your stream title"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Stream Key</label>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    className={styles.input}
                    value="****-****-****-****"
                    readOnly
                  />
                  <button className={styles.primaryBtn}>Generate Key</button>
                </div>
              </div>
              <button className={styles.successBtn}>Start Streaming</button>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className={styles.contentSection}>
              <h3>Drone Jobs</h3>
              <p className={styles.emptyState}>No jobs available yet. Check back soon!</p>
              <button className={styles.primaryBtn}>Post a Job</button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className={styles.contentSection}>
              <h3>Account Settings</h3>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  className={styles.input}
                  value={user.email}
                  readOnly
                />
              </div>
              <div className={styles.formGroup}>
                <label>User ID</label>
                <input
                  type="text"
                  className={styles.input}
                  value={user.id}
                  readOnly
                />
              </div>
              <button className={styles.secondaryBtn}>Update Profile</button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}