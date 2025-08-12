// pages/marketplace.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Navigation from '../components/Navigation'

export default function Marketplace() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchVideos()
  }, [filter])

  const fetchVideos = async () => {
    try {
      let query = supabase
        .from('marketplace_videos')
        .select('*')
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
    // Implement Stripe checkout
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoId,
        price,
        type: 'marketplace_purchase'
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
            Marketplace
          </h1>

          {/* Filters */}
          <div style={{ marginBottom: '30px' }}>
            {['all', 'aerial', 'underwater', 'racing', 'tutorial'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: '8px 16px',
                  marginRight: '10px',
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
            {/* Upload Section */}
<div style={{
  background: 'rgba(30, 41, 59, 0.8)',
  border: '2px dashed #3b82f6',
  borderRadius: '12px',
  padding: '40px',
  textAlign: 'center',
  marginBottom: '40px'
}}>
  <h2 style={{ color: 'white', marginBottom: '20px' }}>
    📤 Upload Your Drone Footage
  </h2>
  <button
    onClick={async () => {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('Please login to upload videos')
        window.location.href = '/login'
        return
      }
      
      // For now, just add a test video
      const { data, error } = await supabase
        .from('marketplace_videos')
        .insert({
          title: prompt('Video title:') || 'Test Video',
          description: 'Drone footage',
          price: parseFloat(prompt('Price in USD:') || '49.99'),
          pilot_id: user.id,
          pilot_name: user.email?.split('@')[0] || 'Pilot',
          category: 'aerial',
          thumbnail: 'https://via.placeholder.com/300x200'
        })
        .select()
      
      if (error) {
        alert(`Upload error: ${error.message}`)
      } else {
        alert('Video uploaded successfully!')
        fetchVideos() // Refresh the list
      }
    }}
    style={{
      padding: '12px 30px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer'
    }}
  >
    Quick Upload (Test)
  </button>
</div>
          {/* Video Grid */}
          {loading ? (
            <div style={{ color: 'white', textAlign: 'center' }}>Loading...</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {videos.map(video => (
                <div
                  key={video.id}
                  style={{
                    background: 'rgba(30, 41, 59, 0.95)',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={video.thumbnail || '/placeholder.jpg'}
                    alt={video.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '15px' }}>
                    <h3 style={{ color: 'white', marginBottom: '10px' }}>
                      {video.title}
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '15px' }}>
                      by {video.pilot_name}
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
                        onClick={() => handlePurchase(video.id, video.price)}
                        style={{
                          padding: '8px 16px',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        Purchase
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {videos.length === 0 && !loading && (
  <div style={{
    background: 'rgba(30, 41, 59, 0.5)',
    borderRadius: '12px',
    padding: '60px',
    textAlign: 'center',
    marginTop: '50px'
  }}>
    <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎬</div>
    <h2 style={{ color: 'white', marginBottom: '20px' }}>
      No videos available yet
    </h2>
    <p style={{ color: '#94a3b8', marginBottom: '30px' }}>
      Be the first to upload drone footage and start earning!
    </p>
    <button
      onClick={() => {
        // Same upload logic as above
        alert('Upload feature coming soon!')
      }}
      style={{
        padding: '12px 30px',
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
  </div>
)}
            </div>
          )}

          {videos.length === 0 && !loading && (
            <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
              No videos available in this category
            </div>
          )}
        </div>
      </div>
    </>
  )
}