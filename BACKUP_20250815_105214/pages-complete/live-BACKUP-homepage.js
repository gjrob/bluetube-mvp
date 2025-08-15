// pages/live.js - This is the STREAMING page
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function LiveStreamingPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [streamKey, setStreamKey] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login?redirect=/live')
        return
      }
      setUser(user)
      // Check for existing stream key
      await checkExistingKey(user)
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkExistingKey = async (user) => {
    try {
      const { data, error } = await supabase
        .from('stream_keys')
        .select('stream_key')
        .eq('user_id', user.id)
        .single()
      
      if (data?.stream_key) {
        setStreamKey(data.stream_key)
      }
    } catch (error) {
      console.log('No existing key found, user can generate one')
    }
  }

  const generateStreamKey = async () => {
    setIsGenerating(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        alert('Please sign in to generate a stream key')
        router.push('/login?redirect=/live')
        return
      }

      const response = await fetch('/api/generate-stream-key', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate stream key')
      }
      
      const data = await response.json()
      setStreamKey(data.streamKey || '4edc-2wvv-t7ra-cgil')
      setShowInstructions(true)
    } catch (error) {
      console.error('Error generating stream key:', error)
      // Use fallback key for demo
      setStreamKey('4edc-2wvv-t7ra-cgil')
      setShowInstructions(true)
      alert('Using demo stream key. Database connection pending.')
    } finally {
      setIsGenerating(false)
    }
  }

  const startBroadcasting = () => {
    if (!streamKey) {
      alert('Please generate a stream key first!')
      return
    }
    
    setShowInstructions(true)
    
    // Show instructions with option to download OBS
    const message = `🎥 Stream Configuration:\n\n` +
      `Server: rtmp://rtmp.livepeer.com/live\n` +
      `Stream Key: ${streamKey}\n\n` +
      `1. Open OBS Studio\n` +
      `2. Go to Settings → Stream\n` +
      `3. Service: Custom\n` +
      `4. Copy the server and key above\n` +
      `5. Click "Start Streaming"\n\n` +
      `Need OBS? Click OK to download`
    
    if (confirm(message)) {
      window.open('https://obsproject.com/download', '_blank')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
      color: 'white'
    }}>
      {/* Navigation Bar */}
      <nav style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 
            onClick={() => router.push('/')}
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              margin: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            🚁 BlueTubeTV
          </h1>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button onClick={() => router.push('/browse')} style={{
              background: 'transparent',
              color: '#94a3b8',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '10px'
            }}>
              Browse
            </button>
            <button onClick={() => router.push('/jobs')} style={{
              background: 'transparent',
              color: '#94a3b8',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '10px'
            }}>
              Jobs
            </button>
            <button onClick={() => router.push('/dashboard')} style={{
              background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
              color: 'white',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #ef4444, #f97316)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🔴 Go Live
        </h1>
        
        <p style={{
          textAlign: 'center',
          fontSize: '20px',
          color: '#94a3b8',
          marginBottom: '60px'
        }}>
          Stream your drone footage to thousands of viewers worldwide
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '30px'
        }}>
          {/* Stream Setup Card */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{
              fontSize: '28px',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              🎥 Stream Configuration
            </h2>

            {!streamKey ? (
              <button 
                onClick={generateStreamKey}
                disabled={isGenerating}
                style={{
                  width: '100%',
                  padding: '20px',
                  background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: isGenerating ? 'wait' : 'pointer',
                  marginBottom: '20px',
                  opacity: isGenerating ? 0.7 : 1
                }}
              >
                {isGenerating ? '⏳ Generating...' : '🔑 Generate Stream Key'}
              </button>
            ) : (
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '20px'
              }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    fontSize: '14px', 
                    color: '#94a3b8', 
                    display: 'block', 
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    RTMP Server
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      value="rtmp://rtmp.livepeer.com/live" 
                      readOnly
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontFamily: 'monospace',
                        fontSize: '14px'
                      }}
                    />
                    <button 
                      onClick={() => copyToClipboard('rtmp://rtmp.livepeer.com/live')}
                      style={{
                        padding: '12px 20px',
                        background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      📋
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ 
                    fontSize: '14px', 
                    color: '#94a3b8', 
                    display: 'block', 
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Stream Key
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      value={streamKey} 
                      readOnly
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        color: '#60a5fa',
                        fontFamily: 'monospace',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                    />
                    <button 
                      onClick={() => copyToClipboard(streamKey)}
                      style={{
                        padding: '12px 20px',
                        background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      📋
                    </button>
                  </div>
                </div>
                
                {copied && (
                  <div style={{
                    marginTop: '15px',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #10b981, #34d399)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}>
                    ✅ Copied to clipboard!
                  </div>
                )}
              </div>
            )}

            <button 
              onClick={startBroadcasting}
              disabled={!streamKey}
              style={{
                width: '100%',
                padding: '20px',
                background: streamKey 
                  ? 'linear-gradient(135deg, #ef4444, #f97316)' 
                  : 'rgba(100,100,100,0.3)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: streamKey ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: streamKey ? '0 10px 40px rgba(239, 68, 68, 0.4)' : 'none',
                opacity: streamKey ? 1 : 0.5
              }}
            >
              <span style={{ fontSize: '24px' }}>🔴</span>
              Start Broadcasting
            </button>
          </div>

          {/* Quick Setup Guide */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{
              fontSize: '28px',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              📖 Quick Setup (3 minutes)
            </h2>

            <ol style={{
              lineHeight: '2',
              color: '#cbd5e1',
              paddingLeft: '20px',
              fontSize: '16px'
            }}>
              <li style={{ marginBottom: '20px' }}>
                <strong style={{ color: 'white', fontSize: '18px' }}>Download OBS Studio</strong>
                <a 
                  href="https://obsproject.com/download" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    color: '#60a5fa',
                    textDecoration: 'none',
                    marginTop: '8px',
                    fontSize: '16px'
                  }}
                >
                  → Get OBS (Free & Open Source)
                </a>
              </li>
              
              <li style={{ marginBottom: '20px' }}>
                <strong style={{ color: 'white', fontSize: '18px' }}>Configure OBS</strong>
                <ul style={{ marginTop: '8px', paddingLeft: '20px', listStyle: 'none' }}>
                  <li>📌 Settings → Stream</li>
                  <li>📌 Service: Custom</li>
                  <li>📌 Paste server & key from above</li>
                </ul>
              </li>
              
              <li style={{ marginBottom: '20px' }}>
                <strong style={{ color: 'white', fontSize: '18px' }}>Add Your Sources</strong>
                <ul style={{ marginTop: '8px', paddingLeft: '20px', listStyle: 'none' }}>
                  <li>🎥 Drone camera feed</li>
                  <li>🖥️ Screen capture </li>
                  <li>🎤 Microphone audio</li>
                </ul>
              </li>
              
              <li>
                <strong style={{ color: 'white', fontSize: '18px' }}>Hit "Start Streaming"!</strong>
                <div style={{
                  marginTop: '12px',
                  padding: '15px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  color: '#34d399'
                }}>
                  💡 <strong>Your stream URL:</strong><br/>
                  bluetubetv.live/watch/{user?.id?.slice(0, 8) || 'your-id'}
                </div>
              </li>
            </ol>

            {showInstructions && (
              <div style={{
                marginTop: '30px',
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(249, 115, 22, 0.1))',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px'
              }}>
                <h3 style={{ 
                  margin: '0 0 10px 0',
                  fontSize: '20px',
                  color: '#fbbf24'
                }}>
                  🎉 You're Live!
                </h3>
                <p style={{ 
                  margin: 0, 
                  fontSize: '16px',
                  color: '#cbd5e1',
                  lineHeight: '1.6'
                }}>
                  Share your stream link with viewers and start earning from tips, 
                  subscriptions, and sponsored content!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stream Preview Section */}
        <div style={{
          marginTop: '40px',
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
          <h2 style={{
            fontSize: '28px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            📺 Stream Preview
          </h2>
          <div style={{
            background: '#000',
            borderRadius: '12px',
            aspectRatio: '16/9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            fontSize: '18px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            {streamKey 
              ? '🔴 Stream will appear here when you go live in OBS' 
              : '🔑 Generate a stream key to get started'}
          </div>
        </div>
      </div>
    </div>
  )
}