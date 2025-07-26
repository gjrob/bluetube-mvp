// pages/api/generate-stream-key.js
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get Cloudflare credentials from environment variables
    const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
    const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

    if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
      console.error('Missing Cloudflare credentials');
      // Fallback to local stream key generation
      const streamKey = Math.random().toString(36).substring(2, 15);
      return res.status(200).json({
        streamKey: streamKey,
        rtmpUrl: 'rtmp://your-server/live',
        instructions: {
          obs: {
            server: 'rtmp://your-server/live',
            streamKey: streamKey
          }
        },
        watchUrl: `/watch/${streamKey}`,
        isLocal: true
      });
    }

    // Create a new live input in Cloudflare Stream
    const cloudflareResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meta: {
            name: `BlueTubeTV-Stream-${Date.now()}`
          },
          recording: {
            mode: 'automatic',
            timeoutSeconds: 7200 // 2 hours max recording
          }
        })
      }
    );

    if (!cloudflareResponse.ok) {
      const errorText = await cloudflareResponse.text();
      console.error('Cloudflare API error:', errorText);
      throw new Error('Failed to create stream');
    }

    const data = await cloudflareResponse.json();
    
    if (!data.success) {
      throw new Error(data.errors?.[0]?.message || 'Failed to create stream');
    }

    const liveInput = data.result;
    
    // Return the stream details
    return res.status(200).json({
      streamKey: liveInput.uid,
      rtmpUrl: liveInput.rtmps.url,
      rtmpStreamKey: liveInput.rtmps.streamKey,
      instructions: {
        obs: {
          server: liveInput.rtmps.url,
          streamKey: liveInput.rtmps.streamKey
        }
      },
      watchUrl: `/watch/${liveInput.uid}`,
      playbackUrl: liveInput.playback?.hls,
      cloudflareStreamId: liveInput.uid,
      webRTC: {
        url: liveInput.webRTC?.url
      }
    });

  } catch (error) {
    console.error('Error in generate-stream-key:', error);
    
    // Fallback to simple key generation if Cloudflare fails
    const fallbackKey = Math.random().toString(36).substring(2, 15);
    return res.status(200).json({
      streamKey: fallbackKey,
      rtmpUrl: 'rtmp://fallback/live',
      instructions: {
        obs: {
          server: 'rtmp://fallback/live',
          streamKey: fallbackKey
        }
      },
      watchUrl: `/watch/${fallbackKey}`,
      error: 'Using fallback - Cloudflare unavailable',
      isLocal: true
    });
  }
}