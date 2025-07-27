// pages/watch/[id].js - Updated version
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function WatchStream() {
  const router = useRouter();
  const { id } = router.query;
  const [streamStatus, setStreamStatus] = useState('checking');

  useEffect(() => {
    if (id) {
      // Check stream status
      checkStreamStatus(id);
    }
  }, [id]);

  const checkStreamStatus = async (streamId) => {
    try {
      const res = await fetch(`/api/stream-status/${streamId}`);
      if (res.ok) {
        setStreamStatus('live');
      } else {
        setStreamStatus('waiting');
      }
    } catch (error) {
      setStreamStatus('waiting');
    }
  };

  return (
    <>
      <Head>
        <title>Watch Live Stream - BlueTubeTV</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black">
        {/* Navigation */}
        <nav className="bg-black/50 backdrop-blur-sm p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              🚁 BlueTubeTV
            </h1>
            <a href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
              Back to Home
            </a>
          </div>
        </nav>

        {/* Video Player Container */}
        <div className="max-w-7xl mx-auto p-4">
          <div className="space-y-4">
            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
              {streamStatus === 'live' ? (
                // For Cloudflare Stream
                <iframe
                  src={`https://iframe.cloudflarestream.com/${id}`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                />
              ) : (
                // Placeholder while stream loads
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div className="text-6xl mb-4">🚁</div>
                  <h2 className="text-2xl font-bold mb-2">Stream Starting Soon</h2>
                  <p className="text-gray-300">Drone pilots are preparing for takeoff...</p>
                  <div className="mt-8 flex gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Stream Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Live Drone Stream</h2>
              <p className="text-gray-300 mb-4">Stream ID: {id}</p>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Stream link copied to clipboard!');
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  📋 Copy Stream Link
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  🔄 Refresh Stream
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}