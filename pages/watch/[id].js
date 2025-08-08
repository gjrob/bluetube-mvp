// pages/watch/[id].js
import LivePeerPlayer from '../../components/LivePeerPlayer';
import LiveChat from '../../components/LiveChat';
import SuperChat from '../../components/SuperChat';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import NFTMinting from '../../components/NFTMinting';
import dynamic from 'next/dynamic';
import { Player } from '@livepeer/react';  // ← ADD THIS LINE

const FlightCompliance = dynamic(() => import('../../components/FlightCompliance'), { ssr: false });

export default function WatchStream() {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [streamError, setStreamError] = useState(false);

  // Remove this line - not needed for LivePeer
  // const accountHash = 'customer-qvzqb8nqvcsqqf40';
  
  useEffect(() => {
    if (id) {
      // Check if the stream exists
      const checkStream = async () => {
        try {
          setIsLoading(true);
          // For now, assume stream is live if we have an ID
          // In production, you'd check LivePeer API
          setIsLive(true);
          setIsLoading(false);
        } catch (error) {
          console.error('Stream check error:', error);
          setStreamError(true);
          setIsLoading(false);
        }
      };
      
      checkStream();
    }
  }, [id]);

  return (
    <>
      <Head>
        <title>Live Stream - BlueTubeTV</title>
      </Head>
      
      <div style={{
        background: 'linear-gradient(180deg, #1a0033 0%, #330066 40%, #4d0099 100%)',
        minHeight: '100vh',
        color: 'white'
      }}>
        <Layout>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px'
          }}>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '100px' }}>
                <h2>Loading stream...</h2>
              </div>
            ) : streamError ? (
              <div style={{ textAlign: 'center', padding: '100px' }}>
                <h2>Stream not found</h2>
                <p>The stream may have ended or the ID is invalid.</p>
              </div>
            ) : (
              <>
                {/* LivePeer Player Container - ONLY THIS SECTION CHANGES */}
                <div style={{
                  position: 'relative',
                  paddingTop: '56.25%', // 16:9 aspect ratio
                  marginBottom: '30px'
                }}>
                  {!isLive && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      zIndex: 10,
                      background: 'rgba(0,0,0,0.8)',
                      padding: '40px',
                      borderRadius: '20px'
                    }}>
                      <h2>Stream has not started yet.</h2>
                      <p>Waiting for the pilot to go live...</p>
                    </div>
                  )}
                  
                  {/* ONLY THIS PART CHANGES - REPLACE IFRAME WITH PLAYER */}
                 <LivePeerPlayer playbackId={id} />
                  
                  {/* Live Badge - KEEP THIS */}
                  {isLive && (
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      left: '20px',
                      background: '#ef4444',
                      color: 'white',
                      padding: '8px 20px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      zIndex: 5
                    }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        background: 'white',
                        borderRadius: '50%',
                        animation: 'pulse 1.4s infinite'
                      }}></span>
                      LIVE
                    </div>
                  )}
                </div>

                {/* ALL THE REST OF YOUR CODE STAYS EXACTLY THE SAME */}
                {/* SuperChat - NO CHANGES */}
                <div style={{ marginBottom: '30px' }}>
                  <SuperChat 
                    streamId={id}
                    currentUser={{
                      id: "viewer_" + Date.now(),
                      name: "Anonymous Viewer",
                      email: "viewer@example.com"
                    }}
                    isLive={true}
                  />
                </div>
                    <div style={{ marginBottom: '30px' }}>
  <LiveChat 
    streamId={id}
    userId="viewer_123"
    username="Anonymous Viewer"
  />
</div>
                {/* Stream Info - NO CHANGES */}
                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '20px',
                  padding: '30px',
                  marginBottom: '20px'
                }}>
                  <h1 style={{ marginBottom: '10px' }}>Drone Live Stream</h1>
                  <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
                    Stream ID: {id}
                  </p>
                  
                  {/* Quick Actions - NO CHANGES */}
                  <div style={{
                    display: 'flex',
                    gap: '15px',
                    flexWrap: 'wrap'
                  }}>
                    <button onClick={() => {
                      // Your button actions
                    }}>
                      ❤️ Like
                    </button>
                      
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Stream link copied!');
                      }}
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#60a5fa',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px'
                      }}
                    >
                      📋 Copy Link
                    </button>
                    
                    <button 
                      onClick={() => {
                        window.open('https://coff.ee/garlanjrobinson', '_blank');
                      }}
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px'
                      }}
                    >
                      💰 Tip Pilot
                    </button>
                    
                    <button 
                      onClick={() => {
                        window.open('https://paypal.me/garlanjrobinson', '_blank');
                      }}
                      style={{
                        background: 'rgba(0, 112, 243, 0.1)',
                        color: '#0070f3',
                        border: '1px solid rgba(0, 112, 243, 0.3)',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px'
                      }}
                    >
                      💳 PayPal Tip
                    </button>
                  </div>
                </div>

                {/* NFT Minting Component - NO CHANGES */}
                <NFTMinting 
                  streamId={id}
                  pilotName="BlueTubeTV Pilot"
                  isLive={isLive}
                  currentUser={{
                    id: "user_123",
                    name: "Pilot Name"
                  }}
                />
              </>
            )}
          </div>
        </Layout>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}