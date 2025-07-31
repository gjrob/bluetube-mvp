// pages/api/nft/mint-founder.js - Mint founder badge NFT (FIXED)
import { ethers } from 'ethers';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract data from request body
    const { walletAddress, founderNumber, price } = req.body;
    
    if (!walletAddress || !founderNumber || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate founder number is available
    const currentCount = await getCurrentFounderCount();
    if (founderNumber !== currentCount + 1) {
      return res.status(400).json({ error: 'Invalid founder number' });
    }

    // Create founder badge metadata
    const metadata = {
      name: `BlueTubeTV Founder #${founderNumber}`,
      description: `Exclusive BlueTubeTV Founder Badge #${founderNumber} - Limited to 99 total founders. Grants access to premium features, revenue sharing, and exclusive content.`,
      image: `ipfs://QmFounderBadge${founderNumber}/image.png`,
      attributes: [
        { trait_type: "Type", value: "Founder Badge" },
        { trait_type: "Founder Number", value: founderNumber },
        { trait_type: "Rarity", value: getFounderRarity(founderNumber) },
        { trait_type: "Platform", value: "BlueTubeTV" },
        { trait_type: "Mint Date", value: new Date().toISOString() },
        { trait_type: "Benefits", value: "Revenue Sharing, Priority Chat, Exclusive Access" }
      ],
      external_url: `https://bluetubetv.live/founder/${founderNumber}`,
      properties: {
        category: "Founder Badge",
        platform: "BlueTubeTV",
        founder_number: founderNumber,
        benefits: [
          "50% discount on all NFT mints",
          "Priority chat highlighting", 
          "Exclusive founder-only streams",
          "Revenue sharing (0.1%)",
          "Advanced analytics dashboard"
        ]
      }
    };

    // Upload metadata to IPFS (mock for now)
    const metadataResponse = await uploadToIPFS(metadata, `founder-${founderNumber}-metadata.json`);
    const tokenURI = `ipfs://${metadataResponse.IpfsHash}`;

    // Store in database (implement your database logic here)
    const founderRecord = {
      founderNumber,
      walletAddress,
      tokenURI,
      price,
      metadata,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // TODO: Save to your database
    // await db.collection('founders').add(founderRecord);

    res.json({
      success: true,
      founderNumber,
      tokenURI,
      metadata,
      transactionData: {
        to: process.env.NFT_CONTRACT_ADDRESS,
        value: ethers.parseEther(price),
        data: encodeFounderMint(walletAddress, tokenURI)
      }
    });

  } catch (error) {
    console.error('Founder minting error:', error);
    res.status(500).json({ error: 'Failed to prepare founder mint' });
  }
}

// Helper function to get founder rarity
function getFounderRarity(founderNumber) {
  if (founderNumber <= 10) return 'Ultra Rare';
  if (founderNumber <= 25) return 'Super Rare';
  if (founderNumber <= 50) return 'Rare';
  return 'Limited';
}

// Helper function to get current founder count
async function getCurrentFounderCount() {
  // TODO: Replace with actual database/blockchain query
  // For now, return the current count from your website (31)
  return 31;
}

// Helper function to upload to IPFS
async function uploadToIPFS(data, filename) {
  // TODO: Replace with actual Pinata integration
  // For now, return a mock response
  return {
    IpfsHash: `Qm${filename.replace(/[^a-zA-Z0-9]/g, '')}${Date.now()}`,
    PinSize: JSON.stringify(data).length
  };
}

// Helper function to encode smart contract call
function encodeFounderMint(to, tokenURI) {
  // TODO: Replace with actual smart contract encoding
  // For now, return mock data
  return '0x' + Buffer.from(`mintFounderBadge(${to}, ${tokenURI})`).toString('hex');
}