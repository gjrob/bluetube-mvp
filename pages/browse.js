// pages/browse.js - Browse all live streams and recorded videos
import Layout from '../components/Layout';
import { useState } from 'react';
import Head from 'next/head';


export default function BrowseContent() {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'live', 'vod'

  // Mock data - in production, fetch from your API/Cloudflare
  const [content] = useState([
    // Live Streams
    {
      id: 'd48e1606f471fb349746c4b106357931',
      title: 'Morning Flight Stream',
      type: 'live',
      status: 'offline',
      thumbnail: '🚁',
      viewers: 0,
      created: '17 minutes ago'
    },
    {
      id: '6c5352b797fdb73a57dc190c8b617066',
      title: 'Sunset Coast Live',
      type: 'live',
      status: 'live',
      thumbnail: '🌅',
      viewers: 87,
      created: '12 hours ago'
    },
    // Recorded Videos
    {
      id: 'rec_sunset_flight_001',
      title: 'Epic Sunset Flight - California Coast',
      type: 'vod',
      duration: '23:45',
      thumbnail: '🌊',
      views: 1543,
      uploaded: '2 days ago'
    },
    {
      id: 'rec_mountain_adventure',
      title: 'Mountain Peak Adventure',
      type: 'vod',
      duration: '18:32',
      thumbnail: '🏔️',
      views: 892,
      uploaded: '5 days ago'
    },
    {
      id: 'rec_city_lights',
      title: 'Night Flight Over City Lights',
      type: 'vod',
      duration: '15:20',
      thumbnail: '🌃',
      views: 2104,
      uploaded: '1 week ago'
    }
  ]);

  const filteredContent = content.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  return (
    <Layout>
      <Head>
        <title>Browse Content - BlueTubeTV</title>
      </Head>
    
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <a href="/" className="flex items-center gap-2 hover:opacity-70 mb-4">
              <span className="text-2xl">🚁</span>
              <span className="font-bold text-lg">BlueTubeTV</span>
            </a>
            <h1 className="text-3xl font-bold">Browse Content</h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-md font-medium transition ${
                activeTab === 'all' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Content
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`px-6 py-2 rounded-md font-medium transition ${
                activeTab === 'live' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🔴 Live Streams
            </button>
            <button
              onClick={() => setActiveTab('vod')}
              className={`px-6 py-2 rounded-md font-medium transition ${
                activeTab === 'vod' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📹 Recorded
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">How It Works</h3>
                <p className="text-sm text-blue-800">
                  <strong>Live Streams:</strong> Click to watch when the red dot is showing (broadcaster is live).
                  <strong className="ml-4">Recorded Videos:</strong> Available to watch anytime!
                </p>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {/* Thumbnail Area */}
                <div className="relative aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-6xl">{item.thumbnail}</span>
                  
                  {/* Live Badge */}
                  {item.type === 'live' && item.status === 'live' && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      LIVE
                    </div>
                  )}
                  
                  {/* Duration Badge for VOD */}
                  {item.type === 'vod' && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      {item.duration}
                    </div>
                  )}
                </div>

                {/* Content Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                  
                  {/* Metadata */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    {item.type === 'live' ? (
                      <>
                        <span>
                          {item.status === 'live' 
                            ? `${item.viewers} watching` 
                            : 'Offline'}
                        </span>
                        <span>{item.created}</span>
                      </>
                    ) : (
                      <>
                        <span>{item.views.toLocaleString()} views</span>
                        <span>{item.uploaded}</span>
                      </>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <a
                      href={`/watch/${item.id}`}
                      className={`flex-1 text-center py-2 rounded-lg font-medium transition ${
                        item.type === 'live' && item.status === 'live'
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {item.type === 'live' && item.status === 'live' 
                        ? 'Watch Live' 
                        : 'Watch'}
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://bluetubetv.live/watch/${item.id}`);
                        alert('Link copied!');
                      }}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredContent.length === 0 && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📹</span>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No content found</h3>
              <p className="text-gray-600">
                {activeTab === 'live' 
                  ? 'No live streams at the moment.' 
                  : 'No recorded videos available.'}
              </p>
            </div>
          )}
        </div>
    </Layout>
  );
}