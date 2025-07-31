
// pages/api/nft/founder-count.js - Get current founder count
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // This would query your database or smart contract
    // For now, return the current count from your image (31)
    const founderCount = 31; // This should come from your database/contract
    
    res.json({
      success: true,
      count: founderCount,
      remaining: 99 - founderCount
    });

  } catch (error) {
    console.error('Error fetching founder count:', error);
    res.status(500).json({ error: 'Failed to fetch founder count' });
  }
}
