
export default async function handler(req, res) {
  // Mock data for active streams
  // Replace with actual Supabase query when ready
  
  try {
    // For now, return mock data
    const mockStreams = [
      { id: 1, viewer_count: 245 },
      { id: 2, viewer_count: 89 },
      { id: 3, viewer_count: 432 }
    ];
    
    res.status(200).json(mockStreams);
  } catch (error) {
    console.error('Active streams error:', error);
    res.status(500).json({ error: 'Failed to fetch active streams' });
  }
}
