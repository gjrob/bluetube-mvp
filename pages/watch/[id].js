// pages/watch/[id].js - Beautiful version
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function WatchStream() {
  const router = useRouter();
  const { id } = router.query;
  const [viewerCount, setViewerCount] = useState(Math.floor(Math.random() * 100) + 50);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // Simulate viewer count changes
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>Live Stream - BlueTubeTV</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute -inset-10 opacity-50">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Navigation */}
          <nav className="bg-black/20 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-3xl animate-pulse">🚁</span>
                  BlueTubeTV
                </h1>
                <a 
                  href="/" 
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full transition-all hover:scale-105"
                >
                  ← Back to Home
                </a>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Video Player */}
              <div className="lg:col-span-2">
                <div className="relative group">
                  {/* Live Badge */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 animate-pulse">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      LIVE
                    </span>
                    <span className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      👁 {viewerCount} watching
                    </span>
                  </div>

                  {/* Video Container */}
                  <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                    
                    {/* Replace with your actual video player */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4 animate-bounce">🚁</div>
                        <h2 className="text-2xl font-bold text-white mb-2">Stream Starting Soon</h2>
                        <p className="text-gray-300">Preparing for takeoff...</p>
                      </div>
                    </div>
                  </div>

                  {/* Stream Title */}
                  <div className="mt-4 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Aerial Adventures Live Stream 🌅
                    </h2>
                    <p className="text-gray-300">
                      Experience breathtaking drone footage from around the world
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Streamer Info */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                      🎮
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Sky Pilot Pro</h3>
                      <p className="text-gray-400">2.5K followers</p>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all hover:scale-105">
                    Follow
                  </button>
                </div>

                {/* Share Options */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Share Stream</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied!');
                      }}
                      className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      📋 Copy Link
                    </button>
                    <button className="w-full py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-xl transition-all flex items-center justify-center gap-2">
                      🐦 Share on Twitter
                    </button>
                  </div>
                </div>

                {/* Stream Stats */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Stream Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration</span>
                      <span className="text-white font-semibold">0:23:45</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Peak Viewers</span>
                      <span className="text-white font-semibold">145</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Quality</span>
                      <span className="text-white font-semibold">1080p 60fps</span>
                    </div>
                  </div>
                </div>

                {/* Tip Button */}
                <button className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-2xl transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                  💰 Send Tip
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
}