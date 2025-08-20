// pages/api/nft/mint-to-blockchain.js - Execute blockchain minting
import { ethers } from 'ethers';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tokenURI, recipientAddress, nftType } = req.body;

    if (!tokenURI || !recipientAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Initialize Web3 provider and contract
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Contract ABI (simplified)
    const contractABI = [
      "function mintFlightMoment(address to, string memory tokenURI, string memory streamId, string memory pilotName, uint256 creatorRoyalty) public payable returns (uint256)",
      "function mintFounderBadge(address to) public payable returns (uint256)",
      "function tokenCounter() public view returns (uint256)"
    ];
    
    const contract = new ethers.Contract(
      process.env.NFT_CONTRACT_ADDRESS,
      contractABI,
      wallet
    );

    let transaction;
    
    if (nftType === 'FOUNDER_BADGE') {
      // Mint founder badge
      transaction = await contract.mintFounderBadge(recipientAddress);
    } else {
      // Mint flight moment
      transaction = await contract.mintFlightMoment(
        recipientAddress,
        tokenURI,
        req.body.streamId || 'live_stream',
        req.body.pilotName || 'BlueTubeTV Pilot',
        500 // 5% royalty
      );
    }

    await transaction.wait();

    // Get token ID from contract
    const tokenCounter = await contract.tokenCounter();
    const tokenId = tokenCounter.toString();

    res.json({
      success: true,
      tokenId,
      transactionHash: transaction.hash,
      contractAddress: process.env.NFT_CONTRACT_ADDRESS,
      openseaUrl: `https://opensea.io/assets/ethereum/${process.env.NFT_CONTRACT_ADDRESS}/${tokenId}`
    });

  } catch (error) {
    console.error('Blockchain minting error:', error);
    res.status(500).json({ error: 'Failed to mint to blockchain' });
  }
}