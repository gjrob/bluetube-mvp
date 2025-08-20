// pages/marketplace.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Navigation from '../components/Navigation'

export default function Marketplace() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkUser()
    fetchVideos()
  }, [filter])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      setUser(profile)
    }
  }

  const fetchVideos = async () => {
    try {
      let query = supabase
        .from('marketplace_videos')
        .select('*, pilot:pilot_id (full_name, avatar_url)')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('category', filter)
      }

      const { data, error } = await query
      if (error) throw error
      setVideos(data || [])
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (videoId, price) => {
    if (!user) {
      window.location.href = '/login'
      return
    }

    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoId,
        price,
        type: 'marketplace_purchase',
        userId: user.id
      })
    })

    const { url } = await response.json()
    if (url) window.location.href = url
  }

  return (
    <>
      <Navigation />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0e7490 100%)',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ color: 'white', marginBottom: '30px' }}>
            Drone Footage Marketplace
          </h1>

          {user?.is_pilot && (
            <button
              onClick={() => window.location.href = '/upload'}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '30px'
              }}
            >
              📤 Upload Your Footage
            </button>
          )}

          <div style={{ marginBottom: '30px' }}>
            {['all', 'aerial', 'underwater', 'racing', 'tutorial', 'commercial'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: '8px 16px',
                  marginRight: '10px',
                  marginBottom: '10px',
                  background: filter === cat ? '#3b82f6' : 'transparent',
                  color: 'white',
                  border: '1px solid #3b82f6',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ color: 'white', textAlign: 'center' }}>
              Loading marketplace...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {videos.map(video => (
                <VideoCard key={video.id} video={video} onPurchase={handlePurchase} />
              ))}
            </div>
          )}

          {videos.length === 0 && !loading && (
            <EmptyState user={user} />
          )}
        </div>
      </div>
    </>
  )
}

function VideoCard({ video, onPurchase }) {
  return (
    <div
      style={{
        background: 'rgba(30, 41, 59, 0.95)',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'transform 0.2s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {video.preview_url ? (
        <video
          src={video.preview_url}
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          muted
          loop
          onMouseEnter={(e) => e.target.play()}
          onMouseLeave={(e) => e.target.pause()}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '200px',
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '48px' }}>🎬</span>
        </div>
      )}
      
      <div style={{ padding: '15px' }}>
        <h3 style={{ color: 'white', marginBottom: '10px' }}>
          {video.title}
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '10px' }}>
          by {video.pilot?.full_name || 'Anonymous Pilot'}
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold' }}>
            ${video.price}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPurchase(video.id, video.price)
            }}
            style={{
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ user }) {
  return (
    <div style={{
      color: 'white',
      textAlign: 'center',
      marginTop: '50px',
      padding: '40px',
      background: 'rgba(30, 41, 59, 0.5)',
      borderRadius: '12px'
    }}>
      <h2 style={{ marginBottom: '20px' }}>No videos available yet</h2>
      <p style={{ color: '#94a3b8', marginBottom: '30px' }}>
        Be the first to upload drone footage!
      </p>
      {user?.is_pilot && (
        <button
          onClick={() => window.location.href = '/upload'}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Upload First Video
        </button>
      )}
    </div>
  )
}