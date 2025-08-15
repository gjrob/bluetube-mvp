// pages/api/watch/[id].js
// This is an API endpoint - NO React imports!

export default async function handler(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Stream key required' });
  }

  try {
    // For now, return mock data
    // In production, you'd check with Cloudflare API
    const streamData = {
      id: id,
      isLive: true,
      title: `Stream ${id}`,
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