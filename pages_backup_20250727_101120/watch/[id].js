// pages/watch/[id].js - COMPLETE VERSION with Layout
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function WatchStream() {
  const router = useRouter();
  const { id } = router.query;
  const [viewerCount, setViewerCount] = useState(117);
  const [isReady, setIsReady] = useState(false);
  const [contentType, setContentType] = useState('detecting');
  const [streamInfo, setStreamInfo] = useState({
    title: 'Loading...',
    description: '',
    duration: null,
    isLive: false
  });

  useEffect(() => {
    if (id) {
      setIsReady(true);
      detectContentType(id);
    }
  }, [id]);

  const detectContentType = (videoId) => {
    if (videoId.length === 32 && /^[a-f0-9]+$/.test(videoId)) {
      setContentType('live');
      setStreamInfo({
        title: 'Aerial Adventures: Live Drone Flight 🚁',
        description: 'Live streaming drone footage from amazing locations',
        duration: null,
        isLive: true
      });
    } else {
      setContentType('vod');
      setStreamInfo({
        title: 'Recorded Flight: Sunset Coast 🌅',
        description: 'Beautiful aerial footage from our coastal flight',
        duration: '15:32',
        isLive: false
      });
    }
  };

  useEffect(() => {
    if (!isReady || contentType !== 'live') return;
    
    const interval = setInterval(() => {
      setViewerCount(prev => Math.max(10, prev + Math.floor(Math.random() * 5) - 2));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isReady, contentType]);

  const PAYPAL_LINK = "https://paypal.me/garlanjrobinson";
  const BUYMEACOFFEE_LINK = "https://buymeacoffee.com/garlanjrobinson";

  if (!isReady) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-spin">🚁</div>
            <p className="text-gray-600">Loading content...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{streamInfo.title} - BlueTubeTV</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative aspect-video bg-black">
                  <iframe
                    src={`https://customer-f33zs165nr7gyfy4.cloudflarestream.com/${id}/iframe`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                  
                  {contentType === 'vod' && streamInfo.duration && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      {streamInfo.duration}
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-2">{streamInfo.title}</h1>
                  <p className="text-gray-600 mb-4">{streamInfo.description}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    {contentType === 'live' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        🔴 Live Stream • {viewerCount} watching
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        📹 Recorded Video
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <a 
                      href={PAYPAL_LINK} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      💳 PayPal
                    </a>
                    <a 
                      href={BUYMEACOFFEE_LINK} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                      ☕ Buy Me a Coffee
                    </a>
                  </div>
                </div>
              </div>
              
              {contentType === 'live' && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-900 mb-2">📡 Live Streaming Now</h3>
                  <p className="text-sm text-amber-800">
                    This is a live broadcast. If you see "Stream has not started yet", 
                    the broadcaster may be setting up. Refresh the page in a moment!
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Creator Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✈️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Sky Pilot Pro</h3>
                    <p className="text-gray-600 text-sm">2.5K followers</p>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  Follow
                </button>
              </div>

              {/* Stream Stats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold mb-4">
                  {contentType === 'live' ? 'Stream Stats' : 'Video Stats'}
                </h3>
                <div className="space-y-2 text-sm">
                  {contentType === 'live' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Viewers</span>
                        <span className="font-medium">{viewerCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className="text-green-600 font-medium">● Live</span>
                      </div>
                    </>
                  )}
                  {contentType === 'vod' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">{streamInfo.duration}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quality</span>
                    <span className="font-medium">1080p</span>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold mb-4">Share</h3>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  📋 Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}