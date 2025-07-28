// pages/index.js - Updated home page with clear navigation
import Layout from '../components/Layout';
import Head from 'next/head';

export default function Home() {
  // Your live streams
  const featuredStreams = [
    { id: '6c5352b797fdb73a57dc190c8b617066', title: 'Test Stream 1', status: 'live' },
    { id: 'd48e1606f471fb349746c4b106357931', title: 'Test Stream 2', status: 'offline' }
  ];

  return (
    <Layout>
      <Head>
        <title>BlueTubeTV - Live Drone Streaming Platform</title>
        <meta name="description" content="Watch live drone flights and amazing aerial footage from pilots worldwide" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚁</text></svg>" />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Live Drone Streaming 🚁
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Watch breathtaking aerial footage live or explore our collection of recorded flights from drone pilots worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/browse" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Browse All Content
            </a>
            <a 
              href="/streams" 
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              🔴 Go Live
            </a>
          </div>
        </div>
      </section>

      {/* Featured Streams */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Streams</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStreams.map((stream) => (
              <div key={stream.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-6xl">🚁</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{stream.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${stream.status === 'live' ? 'text-red-600' : 'text-gray-500'}`}>
                      {stream.status === 'live' ? '🔴 LIVE' : 'Offline'}
                    </span>
                    <a 
                      href={`/watch/${stream.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Watch →
                    </a>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Browse More Card */}
            <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <a href="/browse" className="block h-full">
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <span className="text-6xl">📹</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">See All Content</h3>
                  <p className="text-gray-600 text-sm">
                    Browse all live streams and recorded videos
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Streaming Today</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Share your drone adventures with the world. Stream live or upload your recorded flights.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow">
              <span className="text-4xl mb-4 block">🎥</span>
              <h3 className="font-semibold mb-2">Stream Live</h3>
              <p className="text-gray-600 text-sm mb-4">
                Use OBS to stream your drone footage in real-time
              </p>
              <a href="/streams" className="text-blue-600 hover:underline">
                Get Started →
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <span className="text-4xl mb-4 block">📤</span>
              <h3 className="font-semibold mb-2">Upload Videos</h3>
              <p className="text-gray-600 text-sm mb-4">
                Share your best recorded flights (coming soon)
              </p>
              <span className="text-gray-400">Coming Soon</span>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <span className="text-4xl mb-4 block">💰</span>
              <h3 className="font-semibold mb-2">Get Tips</h3>
              <p className="text-gray-600 text-sm mb-4">
                Viewers can support you via PayPal or Buy Me a Coffee
              </p>
              <a href="/dashboard" className="text-blue-600 hover:underline">
                Learn More →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links for Testing */}
      <section className="py-8 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Quick Links</p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <a href="/browse" className="text-blue-600 hover:underline">Browse</a>
              <a href="/streams" className="text-blue-600 hover:underline">My Streams</a>
              <a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a>
              <a href="/watch/6c5352b797fdb73a57dc190c8b617066" className="text-blue-600 hover:underline">Test Stream</a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}