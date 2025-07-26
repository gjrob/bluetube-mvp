// pages/watch/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function WatchStream() {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(false);
    }
  }, [id]);

  return (
    <>
      <Head>
        <title>Watch Stream - BlueTubeTV</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </Head>

      <div className="min-h-screen bg-black">
        {/* Navigation */}
        <nav className="bg-zinc-900 border-b border-zinc-800 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">🚁 BlueTubeTV</h1>
            <a href="/" className="text-blue-400 hover:text-blue-300">
              Back to Home
            </a>
          </div>
        </nav>

        {/* Video Player Container */}
        <div className="max-w-7xl mx-auto p-4">
          {isLoading ? (
            <div className="aspect-video bg-zinc-900 rounded-lg flex items-center justify-center">
              <div className="text-white">Loading stream...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cloudflare Stream Player */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={`https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_CUSTOMER_ID || 'playback'}.cloudflarestream.com/${id}/iframe`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                />
              </div>

              {/* Stream Info */}
              <div className="bg-zinc-900 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Live Drone Stream</h2>
                <p className="text-gray-400">Stream ID: {id}</p>
                
                {/* Share Button */}
                <div className="mt-4">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Stream link copied!');
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    📋 Copy Stream Link
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}