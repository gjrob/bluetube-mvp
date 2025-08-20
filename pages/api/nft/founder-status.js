// pages/api/nft/founder-status.js - Check if address is a founder
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: 'Address required' });
    }

    // This would query your smart contract or database
    // For demo purposes, check against known founder addresses
    const founderData = await checkFounderStatus(address);
    
    res.json({
      success: true,
      isFounder: founderData.isFounder,
      founderNumber: founderData.founderNumber || 0,
      tokenId: founderData.tokenId || null
    });

  } catch (error) {
    console.error('Error checking founder status:', error);
    res.status(500).json({ error: 'Failed to check founder status' });
  }
}

async function checkFounderStatus(address) {
  // This would integrate with your smart contract
  // For now, return demo data
  const knownFounders = {
    // Add known founder addresses here
    '0x742d35cc6ea5b4c4f4e6c5e4a0e2e6b8c2d9f1a3': { isFounder: true, founderNumber: 31 }
  };
  
  return knownFounders[address.toLowerCase()] || { isFounder: false };
}