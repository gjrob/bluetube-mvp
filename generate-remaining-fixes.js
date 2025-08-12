#!/usr/bin/env node

// ============================================
// Generate Remaining Fix Files
// Save as: generate-remaining-fixes.js
// Run: node generate-remaining-fixes.js
// ============================================

const fs = require('fs');
const path = require('path');

// Create fixes directory if it doesn't exist
const fixesDir = path.join(process.cwd(), 'fixes');
if (!fs.existsSync(fixesDir)) {
  fs.mkdirSync(fixesDir, { recursive: true });
}

console.log('🔧 Generating remaining fix files...\n');

// ============================================
// 3. Fix Mock Data in Components (FIXED)
// ============================================
const fixMockData = `// utils/replaceMockData.js
// Utility to replace all mock data in your components

export const replaceMockData = {
  // Replace in pages/index.js
  homepage: {
    oldStats: [
      { number: '2,847', label: 'Active Pilots' },
      { number: '12.5K', label: 'Live Viewers' },
      { number: '$1.2M', label: 'Jobs Completed' },
      { number: '98%', label: 'Satisfaction' }
    ],
    newImplementation: 'Use useRealStats hook from useRealData.js'
  },

  // Replace in pages/live.js (Cloud Storage section)
  cloudStorage: {
    old: {
      totalFiles: '1,234',
      deliveries: '89',  
      downloads: '3,456',
      revenue: '$234'
    },
    implementation: 'Import useRealStats and use stats.totalFiles, stats.deliveries, etc.'
  },

  // Replace placeholder emails
  emails: {
    old: ['test@example.com', 'john@example.com', 'pilot@example.com'],
    new: 'user?.email || ""'
  },

  // Replace placeholder names
  names: {
    old: ['John Doe', 'Jane Doe', 'Test User'],
    new: 'user?.full_name || user?.email?.split("@")[0] || "User"'
  }
}`;

fs.writeFileSync(path.join(fixesDir, 'replaceMockData.js'), fixMockData);
console.log('✅ Created: replaceMockData.js');

// ============================================
// 4. Working Marketplace Page
// ============================================
const marketplacePage = `// pages/marketplace.js
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
            \${video.price}
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
}`;

fs.writeFileSync(path.join(fixesDir, 'marketplace.js'), marketplacePage);
console.log('✅ Created: marketplace.js');

// ============================================
// 5. Livepeer Stream Component
// ============================================
const livepeerStream = `// components/LivepeerStream.js
import { useState } from 'react'
import { Player } from '@livepeer/react'

export default function LivepeerStream({ onStreamStart }) {
  const [streaming, setStreaming] = useState(false)
  const [streamData, setStreamData] = useState(null)

  const generateStreamKey = async () => {
    const response = await fetch('/api/stream/generate-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: localStorage.getItem('userId') })
    })
    
    const data = await response.json()
    setStreamData(data)
    
    if (onStreamStart) {
      onStreamStart(data)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  return (
    <div style={{ padding: '20px' }}>
      {!streaming ? (
        <div>
          <h2 style={{ color: 'white', marginBottom: '20px' }}>
            Start Your Stream
          </h2>
          
          <button
            onClick={generateStreamKey}
            style={{
              padding: '15px 30px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
              marginBottom: '20px'
            }}
          >
            🔴 Generate Stream Key
          </button>
          
          {streamData && (
            <div style={{
              background: 'rgba(30, 41, 59, 0.95)',
              padding: '20px',
              borderRadius: '8px',
              marginTop: '20px'
            }}>
              <h3 style={{ color: 'white', marginBottom: '15px' }}>
                Stream Configuration
              </h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#94a3b8', fontSize: '14px' }}>
                  RTMP URL:
                </label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                  <input
                    type="text"
                    value={streamData.rtmpUrl}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#1e293b',
                      color: 'white',
                      border: '1px solid #334155',
                      borderRadius: '4px'
                    }}
                  />
                  <button
                    onClick={() => copyToClipboard(streamData.rtmpUrl)}
                    style={{
                      padding: '10px 15px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    📋
                  </button>
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#94a3b8', fontSize: '14px' }}>
                  Stream Key:
                </label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                  <input
                    type="password"
                    value={streamData.streamKey}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#1e293b',
                      color: 'white',
                      border: '1px solid #334155',
                      borderRadius: '4px'
                    }}
                  />
                  <button
                    onClick={() => copyToClipboard(streamData.streamKey)}
                    style={{
                      padding: '10px 15px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    📋
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => setStreaming(true)}
                style={{
                  padding: '12px 24px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Start Streaming
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 style={{ color: 'white', marginBottom: '20px' }}>
            🔴 Live Now
          </h2>
          
          {streamData?.playbackId && (
            <Player
              playbackId={streamData.playbackId}
              autoPlay
              muted={false}
              showTitle={false}
              aspectRatio="16to9"
            />
          )}
          
          <button
            onClick={() => setStreaming(false)}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            End Stream
          </button>
        </div>
      )}
    </div>
  )
}`;

fs.writeFileSync(path.join(fixesDir, 'LivepeerStream.js'), livepeerStream);
console.log('✅ Created: LivepeerStream.js');

// ============================================
// 6. Stream Instructions Component
// ============================================
const streamInstructions = `// components/StreamInstructions.js
import { useState } from 'react'

export default function StreamInstructions({ streamKey, rtmpUrl }) {
  const [copied, setCopied] = useState('')
  const [selectedSoftware, setSelectedSoftware] = useState('obs')

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(''), 2000)
  }

  const instructions = {
    obs: {
      name: 'OBS Studio',
      steps: [
        'Open OBS Studio',
        'Go to Settings > Stream',
        'Select "Custom" as Service',
        'Enter the RTMP URL and Stream Key below',
        'Click OK and Start Streaming'
      ]
    },
    drone: {
      name: 'DJI Drone',
      steps: [
        'Open DJI Fly/Go app',
        'Go to Live Streaming settings',
        'Select "RTMP" or "Custom"',
        'Enter the full RTMP URL with key',
        'Start your flight and stream!'
      ]
    }
  }

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.95)',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '20px'
    }}>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>
        Stream Setup Instructions
      </h2>

      <div style={{ marginBottom: '20px' }}>
        {Object.keys(instructions).map(software => (
          <button
            key={software}
            onClick={() => setSelectedSoftware(software)}
            style={{
              padding: '8px 16px',
              marginRight: '10px',
              background: selectedSoftware === software ? '#3b82f6' : 'transparent',
              color: 'white',
              border: '1px solid #3b82f6',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {instructions[software].name}
          </button>
        ))}
      </div>

      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#94a3b8', fontSize: '14px' }}>RTMP Server:</label>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
            <input
              type="text"
              value={rtmpUrl}
              readOnly
              style={{
                flex: 1,
                padding: '8px',
                background: '#1e293b',
                color: 'white',
                border: '1px solid #334155',
                borderRadius: '4px'
              }}
            />
            <button
              onClick={() => copyToClipboard(rtmpUrl, 'url')}
              style={{
                marginLeft: '10px',
                padding: '8px 12px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {copied === 'url' ? '✓' : '📋'}
            </button>
          </div>
        </div>

        <div>
          <label style={{ color: '#94a3b8', fontSize: '14px' }}>Stream Key:</label>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
            <input
              type="password"
              value={streamKey}
              readOnly
              style={{
                flex: 1,
                padding: '8px',
                background: '#1e293b',
                color: 'white',
                border: '1px solid #334155',
                borderRadius: '4px'
              }}
            />
            <button
              onClick={() => copyToClipboard(streamKey, 'key')}
              style={{
                marginLeft: '10px',
                padding: '8px 12px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {copied === 'key' ? '✓' : '📋'}
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ color: 'white', marginBottom: '15px' }}>
          Setup {instructions[selectedSoftware].name}
        </h3>
        <ol style={{ color: '#94a3b8', paddingLeft: '20px' }}>
          {instructions[selectedSoftware].steps.map((step, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}`;

fs.writeFileSync(path.join(fixesDir, 'StreamInstructions.js'), streamInstructions);
console.log('✅ Created: StreamInstructions.js');

// ============================================
// Summary
// ============================================
console.log('\n' + '='.repeat(50));
console.log('✅ ALL FIX FILES GENERATED SUCCESSFULLY!');
console.log('='.repeat(50));
console.log('\n📁 Files in ./fixes folder:');
console.log('  ✅ useRealData.js - Real-time data hooks');
console.log('  ✅ generate-key.js - Livepeer stream key generator');
console.log('  ✅ replaceMockData.js - Mock data replacement guide');
console.log('  ✅ marketplace.js - Working marketplace page');
console.log('  ✅ LivepeerStream.js - Livepeer streaming component');
console.log('  ✅ StreamInstructions.js - Stream setup instructions');

console.log('\n📌 Next Steps:');
console.log('  1. Copy files to their proper locations:');
console.log('     - useRealData.js → hooks/');
console.log('     - generate-key.js → pages/api/stream/');
console.log('     - marketplace.js → pages/');
console.log('     - LivepeerStream.js → components/');
console.log('     - StreamInstructions.js → components/');
console.log('  2. Update your components to use the real data hooks');
console.log('  3. Test with your Livepeer API key');

console.log('\n✨ Your BlueTubeTV platform is ready for real data!');