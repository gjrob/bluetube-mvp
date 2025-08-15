// pages/api/stream/generate-key.js
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;

  try {
    // Check if you have Livepeer API key
  if (process.env.NEXT_PUBLIC_LIVEPEER_API_KEY) {

      // Use Livepeer API directly (no SDK needed)
      const livepeerResponse = await fetch('https://livepeer.studio/api/stream', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LIVEPEER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `BlueTube-${userId}-${Date.now()}`,
          profiles: [
            { name: "720p", bitrate: 2000000, fps: 30, width: 1280, height: 720 },
            { name: "480p", bitrate: 1000000, fps: 30, width: 854, height: 480 }
          ]
        })
      });

      if (livepeerResponse.ok) {
        const stream = await livepeerResponse.json();
        
        return res.status(200).json({
          streamKey: stream.streamKey,
          rtmpUrl: 'rtmp://rtmp.livepeer.com/live',
          playbackId: stream.playbackId,
          fullUrl: `rtmp://rtmp.livepeer.com/live/${stream.streamKey}`,
          streamId: stream.id,
          success: true
        });
      }
    }

    // Fallback if no Livepeer API key
    const fallbackKey = crypto.randomBytes(16).toString('hex');
    
    return res.status(200).json({
      streamKey: fallbackKey,
      rtmpUrl: 'rtmp://rtmp.livepeer.com/live',
      playbackId: fallbackKey,
      fullUrl: `rtmp://rtmp.livepeer.com/live/${fallbackKey}`,
      note: 'Using fallback - add LIVEPEER_API_KEY to .env.local',
      success: true
    });

  } catch (error) {
    console.error('Stream key generation error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate stream key',
      details: error.message 
    });
  }
}