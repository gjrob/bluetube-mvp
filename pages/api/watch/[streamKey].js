// pages/api/watch/[streamKey].js
// This is an API endpoint - NO React imports!

export default async function handler(req, res) {
  const { streamKey } = req.query;
  
  if (!streamKey) {
    return res.status(400).json({ error: 'Stream key required' });
  }

  try {
    // For now, return mock data
    // In production, you'd check with Cloudflare API
    const streamData = {
      streamKey: streamKey,
      isLive: true,
      title: `Stream ${streamKey}`,
      viewerCount: Math.floor(Math.random() * 100) + 10,
      startedAt: new Date().toISOString()
    };

    return res.status(200).json(streamData);
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch stream data' 
    });
  }
}