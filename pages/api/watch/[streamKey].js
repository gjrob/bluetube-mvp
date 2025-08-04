// pages/watch/[streamKey].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SuperChat from '../../components/SuperChat';

export default function WatchStream() {
  const router = useRouter();
  const { streamKey } = router.query;
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (streamKey) {
      fetchStreamData();
    }
  }, [streamKey]);

  const fetchStreamData = async () => {
    try {
      const response = await fetch(`/api/stream-status/${streamKey}`);
      const data = await response.json();
      setStreamData(data);
    } catch (error) {
      console.error('Error fetching stream:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #03045e 0%, #48cae4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.5rem'
      }}>
        Loading stream...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #03045e 0%, #48cae4 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{ color: 'white', marginBottom: '20px' }}>
          🚁 BlueTubeTV Stream
        </h1>

        <div style={{
          background: 'black',
          borderRadius: '10px',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          {/* Cloudflare Stream Player - Using UID not streamKey! */}
          {streamKey && (
            <iframe
              src={`https://iframe.videodelivery.net/${streamKey}`}
              style={{
                border: 'none',
                width: '100%',
                height: '0',
                paddingBottom: '56.25%', // 16:9 aspect ratio
                position: 'relative'
              }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
            />
          )}
        </div>

        {/* SuperChat Component - NEW! */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <SuperChat 
            streamId={streamKey}
            currentUser={{
              id: "viewer_" + Date.now(),
              name: "Anonymous Viewer"
            }}
            isLive={streamData?.isLive}
          />
        </div>

        {/* Chat Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '20px',
          color: 'white'
        }}>
          <h2>Live Chat</h2>
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '5px',
            padding: '15px',
            minHeight: '200px'
          }}>
            <p>Chat coming soon...</p>
          </div>
          
          {/* Stream Info */}
          {streamData && (
            <div style={{ marginTop: '20px' }}>
              <p>Status: {streamData.isLive ? '🔴 LIVE' : '⚫ Offline'}</p>
              <p>Stream Key: {streamKey}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}