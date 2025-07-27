// pages/watch/[id].js - Clean minimal version
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function WatchStream() {
  const router = useRouter();
  const { id } = router.query;
  const [viewerCount, setViewerCount] = useState(117);

  useEffect(() => {
    if (!id) return;
    
    // Simulate viewer count changes
    const interval = setInterval(() => {
      setViewerCount(prev => Math.max(10, prev + Math.floor(Math.random() * 5) - 2));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [id]);

  // UPDATE THESE!
  const PAYPAL_LINK = "https://paypal.me/garlanjrobinson";
  const BUYMEACOFFEE_LINK = "https://buymeacoffee.com/garlanjrobinson";


  return (
    <>
      <Head>
        <title>Live Stream - BlueTubeTV</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen bg-white text-black">
        {/* Simple Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 text-black hover:opacity-70">
              <span className="text-xl">🚁</span>
              <span className="font-semibold">BlueTubeTV</span>
            </a>
            
            <div className="flex items-center gap-3 text-sm">
              <span className="text-red-600 font-semibold">LIVE</span>
              <span>👁 {viewerCount}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Video Column */}
            <div className="md:col-span-2">
              {/* Video Player */}
              <div className="relative aspect-video bg-gray-100 rounded overflow-hidden">
                {!id ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">(Video player placeholder)</p>
                  </div>
                ) : (
                  <iframe
                    src={`https://customer-f33zs165nr7gyfy4.cloudflarestream.com/${id}/iframe`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen={true}
                  />
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold mt-4 mb-2">
                Aerial Adventures: Sunset Coast Flight 🌅
              </h1>
              
              {/* Streamer Info */}
              <p className="text-gray-600 mb-4">
                Sky Pilot Pro•Started streaming 23 minutes ago
              </p>
              
              {/* Payment Links */}
              <div className="flex gap-2 text-sm">
                <a href={PAYPAL_LINK} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline">
                  PayPal 💳
                </a>
                <span>➡️</span>
                <a href={BUYMEACOFFEE_LINK} target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 hover:underline">
                  Buy Me a Coffee ☕
                </a>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Streamer Card */}
              <div>
                <h2 className="text-xl font-bold mb-2">Sky Pilot Pro</h2>
                <p className="text-gray-600 mb-3">2.5K followers</p>
                <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 w-full">
                  Follow
                </button>
              </div>

              {/* Stream Stats */}
              <div>
                <h3 className="font-bold mb-3">Stream Stats</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Viewers</span>
                    <span>{viewerCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span>23:45</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality</span>
                    <span>1080p</span>
                  </div>
                </div>
              </div>

              {/* Support Section */}
              <div>
                <h3 className="font-bold mb-3">Support the Stream 💰</h3>
                <div className="space-y-2">
                  <a href={PAYPAL_LINK} target="_blank" rel="noopener noreferrer"
                     className="block text-blue-600 hover:underline text-sm">
                    PayPal 💳 ➡️ Buy Me a Coffee
                  </a>
                </div>
              </div>

              {/* Share */}
              <div>
                <h3 className="font-bold mb-3">Share Stream</h3>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied!');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 w-full text-sm"
                >
                  📋 Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}