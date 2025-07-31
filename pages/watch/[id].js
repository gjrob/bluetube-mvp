// pages/watch/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout'; // FIXED: Correct path (../../ not ../)
import NFTMinting from '../../components/NFTMinting'; // Add this import

export default function WatchStream() {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  // Cloudflare configuration
  const accountHash = 'customer-qvzqb8nqvcsqqf40';
  
  // For testing - your working stream
  const testStreamId = '5d5c67636850f4e587b7e27067824b1c'; // Your actual live input ID

  useEffect(() => {
    if (id) {
      setIsLoading(false);
      // In production, you'd check if stream is actually live
      setIsLive(true);
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
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '100px' }}>
                <h2>Loading stream...</h2>
              </div>
            ) : (
              <>
                {/* Cloudflare Stream Player - ONLY ONE IFRAME */}
                <div style={{
                  position: 'relative',
                  paddingTop: '56.25%', // 16:9 aspect ratio
                  marginBottom: '20px',
                  background: '#000',
                  borderRadius: '20px',
                  overflow: 'hidden'
                }}>
                  <iframe
                    src={`https://${accountHash}.cloudflarestream.com/${id || testStreamId}/iframe`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Stream Info */}
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
                    Stream ID: {id || testStreamId}
                  </p>
                  
                  {/* Quick Actions */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      padding: '10px 20px',
                      borderRadius: '20px',
                      cursor: 'pointer'
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
                        cursor: 'pointer'
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

                {/* NFT Minting Component */}
                <NFTMinting 
                  streamId={id || testStreamId}
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
    </>
  );
}