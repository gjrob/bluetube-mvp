// components/LivepeerStream.js
import { useState } from 'react'
import { Player } from '@livepeer/react'
import { useWeb3 } from '../hooks/useWeb3'

export default function LivepeerStream({ onStreamStart, streamerWallet }) {
  const [streaming, setStreaming] = useState(false)
  const [streamData, setStreamData] = useState(null)
  const { sendTip, isConnected } = useWeb3()

  const generateStreamKey = async () => {
    try {
      const response = await fetch('/api/stream/generate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: localStorage.getItem('userId') })
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate stream key')
      }
      
      const data = await response.json()
      setStreamData(data)
      
      if (onStreamStart) {
        onStreamStart(data)
      }
    } catch (error) {
      console.error('Error generating stream key:', error)
      alert('Failed to generate stream key. Please try again.')
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
      alert('Failed to copy to clipboard')
    }
  }

  const handleSuperChat = async (amount) => {
    try {
      if (isConnected && streamerWallet) {
        // Send blockchain tip
        await sendTip(streamerWallet, amount)
      } else {
        // Fallback to PayPal/CashApp
        window.open(`https://paypal.me/garlanjrobinson/${amount}`, '_blank')
      }
    } catch (error) {
      console.error('Error sending tip:', error)
      alert('Failed to send tip. Please try again.')
    }
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
              marginBottom: '20px',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            🔴 Generate Stream Key
          </button>
          
          {streamData && (
            <div style={{
              background: 'rgba(30, 41, 59, 0.95)',
              padding: '20px',
              borderRadius: '8px',
              marginTop: '20px',
              border: '1px solid #334155'
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
                    value={streamData.rtmpUrl || ''}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#1e293b',
                      color: 'white',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      fontSize: '14px'
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
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#2563eb'}
                    onMouseOut={(e) => e.target.style.background = '#3b82f6'}
                    title="Copy to clipboard"
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
                    value={streamData.streamKey || ''}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#1e293b',
                      color: 'white',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      fontSize: '14px'
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
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#2563eb'}
                    onMouseOut={(e) => e.target.style.background = '#3b82f6'}
                    title="Copy to clipboard"
                  >
                    📋
                  </button>
                </div>
              </div>
              
              <div style={{ 
                padding: '15px', 
                background: 'rgba(59, 130, 246, 0.1)', 
                borderRadius: '6px',
                marginBottom: '15px',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                  💡 <strong>Pro Tip:</strong> Use OBS Studio or similar software with these credentials to start streaming
                </p>
              </div>
              
              <button
                onClick={() => setStreaming(true)}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                ✨ Start Streaming
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h2 style={{ color: 'white', margin: 0 }}>
              🔴 Live Now
            </h2>
            <div style={{
              padding: '8px 16px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid #ef4444',
              borderRadius: '20px',
              animation: 'pulse 2s infinite'
            }}>
              <span style={{ color: '#ef4444', fontSize: '14px', fontWeight: 'bold' }}>
                STREAMING
              </span>
            </div>
          </div>
          
          {streamData?.playbackId && (
            <div style={{ marginBottom: '20px' }}>
              <Player
                playbackId={streamData.playbackId}
                autoPlay
                muted={false}
                showTitle={false}
                aspectRatio="16to9"
                style={{
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              />
            </div>
          )}
          
          {/* Super Chat Section */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.95)',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #334155'
          }}>
            <h4 style={{ color: 'white', marginBottom: '10px' }}>
              💰 Send Super Chat
            </h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[5, 10, 25, 50, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleSuperChat(amount)}
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to end the stream?')) {
                setStreaming(false)
                setStreamData(null)
              }
            }}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            🛑 End Stream
          </button>
        </div>
      )}
      
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}