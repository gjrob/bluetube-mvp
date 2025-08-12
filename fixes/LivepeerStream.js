// components/LivepeerStream.js
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
}