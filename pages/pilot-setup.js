// pages/pilot-setup.js - Independent Setup (No External Dependencies)
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PilotSetup() {
  const [streamKey, setStreamKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const generateStreamKey = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-stream-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setStreamKey(data);
    } catch (error) {
      alert('Failed to generate stream key');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 text-white">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 text-blue-300 hover:text-white transition-colors"
        >
          ← Back to Stream
        </button>

        {/* Drone Selection */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-8 text-center">
            🚁 Start Streaming in 2 Minutes
          </h1>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {['Mavic 3', 'Air 2S', 'Mini 3 Pro', 'DJI FPV', 'Phantom 4', 'Inspire 2'].map(drone => (
              <div key={drone} className="border-2 border-green-500 rounded-lg p-4 text-center bg-green-500/10">
                <span className="text-green-400">✓</span> {drone}
              </div>
            ))}
          </div>
        </div>

        {/* Independent Setup */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              📱 Your Independent Streaming Setup
            </h2>

            {!streamKey ? (
              <div className="text-center py-12">
                <p className="text-xl mb-6">Generate your personal stream key</p>
                <button
                  onClick={generateStreamKey}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Stream Key'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stream Key */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">🔑 Your Stream Key:</h3>
                  <div className="bg-black/50 p-4 rounded-lg font-mono text-green-400 flex items-center justify-between">
                    <span>{streamKey.streamKey}</span>
                    <button 
                      onClick={() => copyToClipboard(streamKey.streamKey)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* OBS Setup */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-yellow-400">🎬 OBS Studio Setup:</h3>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex items-center justify-between">
                      <span>Server:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-black/50 px-2 py-1 rounded">{streamKey.instructions.obs.server}</code>
                        <button 
                          onClick={() => copyToClipboard(streamKey.instructions.obs.server)}
                          className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Stream Key:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-black/50 px-2 py-1 rounded">{streamKey.streamKey}</code>
                        <button 
                          onClick={() => copyToClipboard(streamKey.streamKey)}
                          className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DJI Fly App Setup */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-blue-400">🎮 DJI Fly App Setup:</h3>
                  <ol className="space-y-2 text-sm">
                    <li>1. Open DJI Fly → Settings → Live Streaming</li>
                    <li>2. Select "RTMP Custom"</li>
                    <li>3. Enter URL: 
                      <code className="bg-black/50 px-2 py-1 rounded ml-2">{streamKey.instructions.obs.server}</code>
                      <button 
                        onClick={() => copyToClipboard(streamKey.instructions.obs.server)}
                        className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs ml-2"
                      >
                        Copy
                      </button>
                    </li>
                    <li>4. Paste your stream key and tap "Start Live"</li>
                    <li>5. You're LIVE! 🎉</li>
                  </ol>
                </div>

                {/* Mobile Apps */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-green-400">📱 Mobile Streaming Apps:</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold">iOS:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Larix Broadcaster (Free)</li>
                        <li>Broadcast Me</li>
                        <li>Live Stream Studio</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold">Android:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Larix Broadcaster (Free)</li>
                        <li>CameraFi Live</li>
                        <li>Streamlabs Mobile</li>
                      </ul>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-gray-300">
                    Use RTMP URL: <code className="bg-black/50 px-1 rounded">{streamKey.rtmpUrl}</code>
                  </p>
                </div>

                {/* Share Link */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-purple-400">🔗 Share Your Stream:</h3>
                  <div className="bg-black/50 p-3 rounded-lg font-mono text-purple-300 flex items-center justify-between">
                    <span>https://bluetubetv.live/watch/{streamKey.streamKey}</span>
                    <button 
                      onClick={() => copyToClipboard(`https://bluetubetv.live/watch/${streamKey.streamKey}`)}
                      className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => router.push(`/watch/${streamKey.streamKey}`)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 py-3 rounded-xl font-bold transition-all transform hover:scale-105"
                  >
                    View My Stream Page
                  </button>
                  <button
                    onClick={generateStreamKey}
                    className="px-6 py-3 border border-white/30 rounded-xl hover:bg-white/10 transition-all"
                  >
                    Generate New Key
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold mb-2">Direct Streaming</h3>
              <p className="text-sm text-gray-300">Stream directly to BlueTubeTV - no external services required!</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-lg font-semibold mb-2">Instant Tips</h3>
              <p className="text-sm text-gray-300">Receive tips directly from viewers while streaming</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-gray-300">Real-time chat with your audience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}