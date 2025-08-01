
// pages/api/generate-stream-key.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meta: {
            name: `BlueTubeTV-Stream-${Date.now()}`
          },
          recording: {
            mode: 'automatic'
          }
        })
      }
    );

    const data = await response.json();
    
    if (data.success) {
      // Return BOTH the stream key AND the video ID
      res.status(200).json({
        streamKey: data.result.rtmps.streamKey,
        rtmpUrl: data.result.rtmps.url,
        videoId: data.result.uid, // This is what viewers need!
        watchUrl: `/watch/${data.result.uid}` // Ready-to-use URL
      });
    } else {
      throw new Error(data.errors?.[0]?.message || 'Failed to create stream');
    }
  } catch (error) {
    console.error('Stream key generation error:', error);
    res.status(500).json({ error: 'Failed to generate stream key' });
  }
}