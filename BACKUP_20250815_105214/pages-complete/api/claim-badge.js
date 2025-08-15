// Store claims in memory (resets on deploy)
let claims = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, number } = req.body;
    claims.push({
      name,
      number,
      time: new Date(),
      ip: req.headers['x-forwarded-for']
    });
    
    console.log(`🏆 Founder #${number}: ${name}`);
    res.json({ success: true });
  }
  
  if (req.method === 'GET') {
    res.json({ 
      totalClaimed: claims.length,
      claims: claims 
    });
  }
}