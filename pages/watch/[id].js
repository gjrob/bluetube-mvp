// pages/watch/[id].js - Fixed & Beautiful Version
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function WatchStream() {
  const router = useRouter();
  const { id } = router.query;
  const [viewerCount, setViewerCount] = useState(Math.floor(Math.random() * 100) + 50);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate viewer count changes
    const interval = setInterval(() => {
      setViewerCount(prev => Math.max(10, prev + Math.floor(Math.random() * 5) - 2));
    }, 5000);
    
    // Simulate loading complete
    setTimeout(() => setIsLoading(false), 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Replace these with your actual payment links
  const PAYPAL_LINK = "https://paypal.me/your-username";
  const BUYMEACOFFEE_LINK = "https://buymeacoffee.com/your-username";

  return (
    <>
      <Head>
        <title>Live Stream - BlueTubeTV</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              <a href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition">
                <span className="text-2xl">🚁</span>
                <span className="font-bold text-lg hidden sm:inline">BlueTubeTV</span>
              </a>
              
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  LIVE
                </div>
                <div className="text-white text-sm">
                  <span className="hidden sm:inline">👁 </span>
                  {viewerCount}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-screen-2xl mx-auto lg:flex lg:gap-6 p-4 sm:p-6">
          {/* Video Section */}
          <div className="flex-1">
            {/* Video Player */}
            <div className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-zinc-400">Loading stream...</p>
                  </div>
                </div>
              ) : (
                <iframe
                  src={`https://customer-f33zs165nr7gyfy4.cloudflarestream.com/${id || '6c5352b797fdb73a57dc190c8b617066'}/iframe`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                ></iframe>
              )}
            </div>

            {/* Stream Info */}
            <div className="mt-4 bg-zinc-900/50 rounded-lg p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Aerial Adventures: Sunset Coast Flight 🌅
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-zinc-400">
                <span>Sky Pilot Pro</span>
                <span className="hidden sm:inline">•</span>
                <span>Started streaming 23 minutes ago</span>
              </div>
            </div>

            {/* Mobile Tip Buttons */}
            <div className="lg:hidden mt-4 grid grid-cols-2 gap-3">
              <a
                href={PAYPAL_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-center transition"
              >
                PayPal 💳
              </a>
              <a
                href={BUYMEACOFFEE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg text-center transition"
              >
                Buy Coffee ☕
              </a>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 mt-6 lg:mt-0 space-y-4">
            {/* Streamer Card */}
            <div className="bg-zinc-900/50 rounded-lg p-4 sm:p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">✈️</span>
                </div>
                <div>
                  <h3 className="font-bold text-white">Sky Pilot Pro</h3>
                  <p className="text-sm text-zinc-400">2.5K followers</p>
                </div>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition">
                Follow
              </button>
            </div>

            {/* Stream Stats */}
            <div className="bg-zinc-900/50 rounded-lg p-4 sm:p-6">
              <h3 className="font-bold text-white mb-4">Stream Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Viewers</span>
                  <span className="text-white">{viewerCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Duration</span>
                  <span className="text-white">23:45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Quality</span>
                  <span className="text-white">1080p</span>
                </div>
              </div>
            </div>

            {/* Desktop Tip Section */}
            <div className="hidden lg:block bg-zinc-900/50 rounded-lg p-4 sm:p-6">
              <h3 className="font-bold text-white mb-4">Support the Stream 💰</h3>
              <div className="space-y-3">
                <a
                  href={PAYPAL_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72c.07-.398.412-.693.814-.693h6.858c4.051 0 6.873 1.805 6.873 5.691 0 4.894-3.451 7.604-7.257 7.604h-2.35l-.962 5.015z"/>
                  </svg>
                  PayPal
                </a>
                <a
                  href={BUYMEACOFFEE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  ☕ Buy Me a Coffee
                </a>
              </div>
            </div>

            {/* Share */}
            <div className="bg-zinc-900/50 rounded-lg p-4 sm:p-6">
              <h3 className="font-bold text-white mb-4">Share Stream</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2.5 rounded-lg transition"
              >
                📋 Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}