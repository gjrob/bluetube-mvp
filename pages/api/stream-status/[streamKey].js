// pages/api/stream-status/[streamKey].js
export default async function handler(req, res) {
  const { streamKey } = req.query;
  
  if (!streamKey) {
    return res.status(400).json({ error: 'Stream key required' });
  }

  try {
    const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
    const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

    if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
      return res.status(200).json({
        streamKey,
        isLive: false,
        isLocal: true
      });
    }

    // Get live input details from Cloudflare
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs/${streamKey}`,
      {
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        }
      }
    );

    if (!response.ok) {
      return res.status(200).json({
        streamKey,
        isLive: false,
        error: 'Stream not found'
      });
    }

    const data = await response.json();
    const liveInput = data.result;

    return res.status(200).json({
      streamKey,
      isLive: liveInput.status?.current?.state === 'connected',
      status: liveInput.status,
      playbackUrl: liveInput.playback?.hls,
      rtmpUrl: liveInput.rtmps?.url,
      webRTCUrl: liveInput.webRTC?.url
    });

  } catch (error) {
    console.error('Error fetching stream status:', error);
    return res.status(500).json({
      error: 'Failed to fetch stream status'
    });
  }
}