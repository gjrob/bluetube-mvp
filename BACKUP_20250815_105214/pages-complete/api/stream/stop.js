export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Stop stream logic
    
    return res.json({ 
      success: true,
      status: 'stopped'
    });
  }
}