// pages/api/generate-stream-key.js - Connect to Railway Backend
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Call your Railway backend
    const response = await fetch(`${process.env.RAILWAY_BACKEND_URL}/api/generate-stream-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      throw new Error('Failed to generate stream key');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Stream key generation error:', error);
    res.status(500).json({ error: 'Failed to generate stream key' });
  }
}