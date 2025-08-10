// pages/api/streams/[id].js
// Mock stream data API

const mockStreams = {
  'mk1n9j8jte': {
    id: 'mk1n9j8jte',
    title: 'Epic Mountain Flight',
    pilot: 'Sky Pilot Pro',
    category: 'scenic',
    isLive: true,
    viewers: 1251,
    playbackId: 'mk1n9j8jte',
    streamKey: 'sk_mountain_flight',
    description: 'Flying over the majestic mountain ranges',
    startedAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    totalTips: 235
  },
  'fc97zta00mzqoa52': {
    id: 'fc97zta00mzqoa52',
    title: 'Sunset Beach Patrol',
    pilot: 'Coastal Flyer',
    category: 'coastal',
    isLive: true,
    viewers: 847,
    playbackId: 'fc97zta00mzqoa52',
    streamKey: 'sk_beach_patrol',
    description: 'Patrolling the beautiful coastline at sunset',
    startedAt: new Date(Date.now() - 1000 * 60 * 20), // 20 mins ago
    totalTips: 127
  }
};

export default function handler(req, res) {
  const { id } = req.query;
  
  if (req.method === 'GET') {
    // Check if it's a recording ID
    if (id && id.startsWith('rec')) {
      // Return recording data
      return res.status(200).json({
        id,
        title: 'Recorded Flight',
        pilot: 'Drone Pilot',
        category: 'recorded',
        isLive: false,
        views: 1234,
        videoUrl: `/videos/${id}.mp4`,
        duration: '12:34',
        uploadDate: new Date()
      });
    }
    
    // Check if it's a live stream
    const stream = mockStreams[id];
    if (stream) {
      return res.status(200).json(stream);
    }
    
    // For any other ID, return a default test stream
    return res.status(200).json({
      id,
      title: 'Test Stream',
      pilot: 'Test Pilot',
      category: 'test',
      isLive: true,
      viewers: Math.floor(Math.random() * 1000),
      playbackId: id,
      streamKey: id,
      description: 'This is a test stream',
      startedAt: new Date(),
      totalTips: 0
    });
  }
  
  if (req.method === 'POST') {
    // Update stream data (e.g., viewer count, tips)
    const { viewers, isLive, addTip } = req.body;
    
    if (mockStreams[id]) {
      if (viewers !== undefined) mockStreams[id].viewers = viewers;
      if (isLive !== undefined) mockStreams[id].isLive = isLive;
      if (addTip) mockStreams[id].totalTips += addTip;
      
      return res.status(200).json({ 
        success: true, 
        stream: mockStreams[id] 
      });
    }
    
    return res.status(404).json({ error: 'Stream not found' });
  }
  
  if (req.method === 'DELETE') {
    // End stream
    if (mockStreams[id]) {
      mockStreams[id].isLive = false;
      mockStreams[id].endedAt = new Date();
      
      return res.status(200).json({ 
        success: true, 
        message: 'Stream ended',
        stream: mockStreams[id]
      });
    }
    
    return res.status(404).json({ error: 'Stream not found' });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}