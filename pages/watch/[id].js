// Quick fix for watch page - make it work with Cloudflare Stream
// pages/watch/[id].js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function WatchStream() {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);

  // Cloudflare Stream URL format
  const streamUrl = `https://customer-${id}.cloudflarestream.com/manifest/video.m3u8`;
  
  // For testing - your working stream
  const testStreamId = '9f6bec4c809ca878d3f17ac651ef3e89';

  useEffect(() => {
    // Simple check if stream exists
    if (id) {
      setIsLoading(false);
    }
  }, [id]);

  return (
    <>
      <Head>
        <title>Live Stream - BlueTubeTV</title>
      </Head>
      
      <div style={{
        background: 'linear-gradient(180deg, #0a0e27 0%, #1a237e 50%, #0f172a 100%)',
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
                {/* Cloudflare Stream Player */}
                <div style={{
                  position: 'relative',
                  paddingTop: '56.25%', // 16:9 aspect ratio
                  marginBottom: '20px',
                  background: '#000',
                  borderRadius: '20px',
                  overflow: 'hidden'
                }}>
                  <iframe
                    src={`https://iframe.cloudflarestream.com/${id || testStreamId}?poster=https%3A%2F%2Fbluetubtv.live%2Fdrone-poster.jpg`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Stream Info */}
                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '20px',
                  padding: '30px'
                }}>
                  <h1 style={{ marginBottom: '10px' }}>Drone Live Stream</h1>
                  <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
                    Stream ID: {id || 'test-stream'}
                  </p>
                  
                  {/* Quick Actions */}
                  <div style={{ display: 'flex', gap: '10px' }}>
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
                    {/* ADD TIP PILOT BUTTON */}
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

{/* If you want PayPal option too */}
<button 
  onClick={() => {
    window.open('https://paypal.me/garlanjrobinson', '_blank'); // Change to YOUR PayPal
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
              </>
            )}
          </div>
        </Layout>
      </div>
    </>
  );
}

// Facebook Launch Post Template
export const FacebookLaunchPost = `
🚁 Just launched BlueTubeTV - Drone Streaming WITHOUT the BS! 

Tired of YouTube strikes? Facebook compression? We built something better.

✅ Stream directly from your DJI/Autel app
✅ No copyright strikes on motor noise
✅ Built-in FAA compliance tracking
✅ DRONE CAMERAS ONLY (no pets!)

First 100 pilots get founder badges! 🏆

Testing live now: www.bluetubetv.live

What features do YOU want? Comment below! 👇

#dronelife #fpv #dji #droneracing #droneoftheday
`;