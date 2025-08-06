// pages/api/upload-video.js
// Note: This is a mock implementation. In production, you'd use S3/R2 for storage

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Return list of recordings
    const recordings = [
      {
        id: 'rec1',
        title: 'City Skyline Tour',
        pilot: 'Urban Eagle',
        category: 'urban',
        views: 12345,
        duration: '1:23:45',
        uploadDate: new Date('2024-01-15'),
        fileUrl: '/videos/city-skyline.mp4'
      },
      {
        id: 'rec2',
        title: 'Forest Canopy Explorer',
        pilot: 'Nature Drone',
        category: 'nature',
        views: 8901,
        duration: '45:32',
        uploadDate: new Date('2024-01-14'),
        fileUrl: '/videos/forest-canopy.mp4'
      }
    ];
    
    return res.status(200).json({ recordings });
  }
  
  if (req.method === 'POST') {
    try {
      // In production:
      // 1. Parse multipart form data
      // 2. Upload to Cloudflare R2 or AWS S3
      // 3. Store metadata in database
      // 4. Generate thumbnails
      // 5. Process video for streaming
      
      const { title, category, description, pilot = 'Anonymous' } = req.body || {};
      
      const newRecording = {
        id: `rec${Date.now()}`,
        title: title || 'Untitled Flight',
        pilot,
        category: category || 'scenic',
        description,
        views: 0,
        duration: '0:00',
        uploadDate: new Date(),
        fileUrl: `/videos/upload-${Date.now()}.mp4`,
        status: 'processing'
      };
      
      return res.status(200).json({ 
        success: true, 
        recording: newRecording,
        message: 'Video uploaded successfully. Processing...'
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to upload video' 
      });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}