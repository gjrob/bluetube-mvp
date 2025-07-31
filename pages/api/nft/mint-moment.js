// pages/api/nft/mint-moment.js - Mint flight moment NFT
import multer from 'multer';
import { createRouter } from 'next-connect';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = createRouter();

router.use(upload.single('media'));

router.post(async (req, res) => {
  try {
    const { streamId, timestamp, description, pilotName, mintPrice, isFounder } = req.body;
    const mediaFile = req.file;

    if (!mediaFile) {
      return res.status(400).json({ error: 'No media file provided' });
    }

    // Calculate actual price (50% discount for founders)
    const actualPrice = isFounder === 'true' ? 
      (parseFloat(mintPrice) * 0.5).toString() : 
      mintPrice;

    // Upload media to IPFS (mock for now)
    const mediaIPFS = await uploadFileToIPFS(mediaFile.buffer, mediaFile.originalname);
    
    // Create NFT metadata
    const metadata = {
      name: `Flight Moment - ${pilotName}`,
      description: description || `Epic drone flight moment captured live on BlueTubeTV`,
      image: `ipfs://${mediaIPFS.IpfsHash}`,
      attributes: [
        { trait_type: "Type", value: "Flight Moment" },
        { trait_type: "Pilot", value: pilotName },
        { trait_type: "Stream ID", value: streamId },
        { trait_type: "Capture Time", value: new Date(parseInt(timestamp)).toISOString() },
        { trait_type: "Platform", value: "BlueTubeTV" },
        { trait_type: "Media Type", value: mediaFile.mimetype.startsWith('video/') ? 'Video' : 'Image' }
      ],
      external_url: `https://bluetubetv.live/nft/${streamId}/${timestamp}`,
      properties: {
        category: "Flight Moment",
        creator: pilotName,
        platform: "BlueTubeTV Live",
        timestamp: timestamp,
        originalStream: streamId,
        founderDiscount: isFounder === 'true'
      }
    };

    // Upload metadata to IPFS
    const metadataIPFS = await uploadToIPFS(metadata, `${pilotName}-flight-moment-metadata.json`);
    const tokenURI = `ipfs://${metadataIPFS.IpfsHash}`;

    // Store in database (add your database logic here)
    const nftRecord = {
      streamId,
      timestamp,
      pilotName,
      description,
      mintPrice: actualPrice,
      originalPrice: mintPrice,
      founderDiscount: isFounder === 'true',
      mediaIpfsHash: mediaIPFS.IpfsHash,
      metadataIpfsHash: metadataIPFS.IpfsHash,
      tokenURI,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // TODO: Save to your database
    // await db.collection('nfts').add(nftRecord);

    res.json({
      success: true,
      tokenURI,
      metadata,
      actualPrice,
      ipfsHash: mediaIPFS.IpfsHash,
      previewUrl: `https://gateway.pinata.cloud/ipfs/${mediaIPFS.IpfsHash}`,
      nftRecord
    });

  } catch (error) {
    console.error('NFT moment minting error:', error);
    res.status(500).json({ error: 'Failed to mint NFT moment' });
  }
});

// Helper function to upload file to IPFS
async function uploadFileToIPFS(buffer, filename) {
  // TODO: Replace with actual Pinata integration
  // For now, return a mock response
  return {
    IpfsHash: `Qm${filename.replace(/[^a-zA-Z0-9]/g, '')}${Date.now()}`,
    PinSize: buffer.length
  };
}

// Helper function to upload JSON to IPFS
async function uploadToIPFS(data, filename) {
  // TODO: Replace with actual Pinata integration
  // For now, return a mock response
  return {
    IpfsHash: `Qm${filename.replace(/[^a-zA-Z0-9]/g, '')}${Date.now()}`,
    PinSize: JSON.stringify(data).length
  };
}

export default router.handler({
  onError: (err, req, res) => {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  },
  onNoMatch: (req, res) => {
    res.status(405).json({ error: 'Method not allowed' });
  }
});

export const config = {
  api: {
    bodyParser: false
  }
};