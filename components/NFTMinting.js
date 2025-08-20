import { useWeb3 } from '../hooks/useWeb3';

export default function NFTMinting() {
  const { mintNFT, isConnected } = useWeb3();
  
  const handleMint = async () => {
    if (!isConnected) {
      alert('Connect wallet first!');
      return;
    }
    
    const metadata = {
      name: 'Drone Flight #001',
      description: 'Epic sunset flight',
      image: videoThumbnail,
      attributes: [
        { trait_type: 'Location', value: 'California' },
        { trait_type: 'Duration', value: '15 min' }
      ]
    };
    
    const receipt = await mintNFT(metadata, 0.1);
    console.log('NFT Minted!', receipt);
  };
}
