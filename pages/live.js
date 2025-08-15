// pages/live.js - Using your existing components
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import LivepeerStream from '../components/LivepeerStream'
import LivePeerPlayer from '../components/LivePeerPlayer'
import BrowserStream from '../components/BrowserStream'
import StreamStats from '../components/StreamStats'
import SuperChat from '../components/SuperChat'
import LiveChat from '../components/LiveChat'
import GoLiveButton from '../components/GoLiveButton'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'

export default function LiveStreams() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeStreams, setActiveStreams] = useState([])
  const [selectedStream, setSelectedStream] = useState(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActiveStreams()
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('streams')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'streams' 
      }, handleStreamUpdate)
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function fetchActiveStreams() {
    try {
      const { data, error } = await supabase
        .from('streams')
        .select('*')
        .eq('status', 'live')
        .order('viewer_count', { ascending: false })

      if (data) {
        setActiveStreams(data)
      }
    } catch (error) {
      console.error('Error fetching streams:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleStreamUpdate(payload) {
    fetchActiveStreams()
  }

  return (
    <Layout>
      <div className="live-container">
        <div className="live-header">
          <h1>🔴 Live Drone Streams</h1>
          <p>Watch professional drone pilots in action</p>
          {user && (
            <GoLiveButton 
              onClick={() => router.push('/dashboard?tab=stream')}
            />
          )}
        </div>

        <div className="streams-layout">
          {/* Main Video Player */}
          <div className="main-player">
            {selectedStream ? (
              <>
                <LivePeerPlayer 
                  streamId={selectedStream.stream_key}
                  poster="/drone-preview.jpg"
                />
                <StreamStats 
                  viewers={selectedStream.viewer_count}
                  duration={selectedStream.duration}
                />
              </>
            ) : (
              <div className="no-stream-selected">
                <p>Select a stream to watch</p>
              </div>
            )}
          </div>

          {/* Chat & SuperChat */}
          {selectedStream && (
            <div className="chat-section">
              <LiveChat streamId={selectedStream.id} />
              <SuperChat 
                streamId={selectedStream.id}
                pilotId={selectedStream.user_id}
              />
            </div>
          )}
        </div>

        {/* Active Streams Grid */}
        <div className="streams-grid">
          <h2>Active Streams</h2>
          {loading ? (
            <p>Loading streams...</p>
          ) : activeStreams.length > 0 ? (
            <div className="grid">
              {activeStreams.map(stream => (
                <div 
                  key={stream.id}
                  className="stream-card"
                  onClick={() => setSelectedStream(stream)}
                >
                  <div className="stream-thumbnail">
                    <span className="live-badge">LIVE</span>
                    <span className="viewer-count">
                      👁️ {stream.viewer_count}
                    </span>
                  </div>
                  <div className="stream-info">
                    <h3>{stream.title || 'Untitled Stream'}</h3>
                    <p>{stream.pilot_name || 'Anonymous Pilot'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-streams">
              <p>No live streams at the moment</p>
              {user && (
                <button 
                  onClick={() => router.push('/dashboard?tab=stream')}
                  className="start-streaming-btn"
                >
                  Be the first to stream!
                </button>
              )}
            </div>
          )}
        </div>

        {/* Browser Streaming Option */}
        {user && isStreaming && (
          <BrowserStream 
            streamKey={user.stream_key}
            onStop={() => setIsStreaming(false)}
          />
        )}
      </div>

      <style jsx>{`
        .live-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 2rem;
        }
        .live-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .live-header h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .streams-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
          margin-bottom: 3rem;
        }
        .main-player {
          background: #000;
          border-radius: 1rem;
          overflow: hidden;
          aspect-ratio: 16/9;
          position: relative;
        }
        .no-stream-selected {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #666;
        }
        .chat-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .streams-grid {
          margin-top: 3rem;
        }
        .streams-grid h2 {
          margin-bottom: 1.5rem;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .stream-card {
          cursor: pointer;
          transition: transform 0.3s ease;
          border-radius: 0.5rem;
          overflow: hidden;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .stream-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        }
        .stream-thumbnail {
          aspect-ratio: 16/9;
          background: linear-gradient(135deg, #667eea, #764ba2);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .live-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: red;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: bold;
        }
        .viewer-count {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0,0,0,0.5);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
        }
        .stream-info {
          padding: 1rem;
        }
        .stream-info h3 {
          margin-bottom: 0.5rem;
        }
        .stream-info p {
          color: #666;
          font-size: 0.9rem;
        }
        .no-streams {
          text-align: center;
          padding: 3rem;
          background: #f5f5f5;
          border-radius: 1rem;
        }
        .start-streaming-btn {
          margin-top: 1rem;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          cursor: pointer;
        }
        @media (max-width: 1024px) {
          .streams-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  )
}