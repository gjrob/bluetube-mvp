// pages/api/generate-stream-key.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://livepeer.studio/api/stream', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LIVEPEER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `BlueTubeTV-Stream-${Date.now()}`,
        profiles: [
          {
            name: '720p',
            bitrate: 2000000,
            fps: 30,
            width: 1280,
            height: 720
          },
          {
            name: '480p', 
            bitrate: 1000000,
            fps: 30,
            width: 854,
            height: 480
          }
        ],
        record: true
      })
    });

    const data = await response.json();
    
    if (data.id) {
      res.status(200).json({
        streamKey: data.streamKey,
        rtmpUrl: 'rtmp://rtmp.livepeer.com/live',
        playbackId: data.playbackId,
        streamId: data.id,
        videoId: data.playbackId, // For compatibility
        watchUrl: `/watch/${data.playbackId}`
      });
    } else {
      throw new Error('Failed to create stream');
    }
  } catch (error) {
    console.error('Stream generation error:', error);
    res.status(500).json({ error: 'Failed to generate stream' });
  }
}