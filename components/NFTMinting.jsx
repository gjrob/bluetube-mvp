// components/NFTMinting.tsx - Founder Badge + Flight Moment NFT System
import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import styles from './NFTMinting.module.css';

// TypeScript Interfaces
interface User {
  id: string;
  name: string;
  email?: string;
  walletAddress?: string;
  isFounder?: boolean;
  founderNumber?: number;
}

interface NFTMintingProps {
  streamId: string;
  streamTitle?: string;
  pilotName: string;
  isLive: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
  currentUser?: User;
}

interface FounderBadge {
  tokenId: string;
  founderNumber: number;
  price: string;
  rarity: 'Ultra Rare' | 'Super Rare' | 'Rare' | 'Limited';
  perks: string[];
}

const NFTMinting: React.FC<NFTMintingProps> = ({ 
  streamId, 
  streamTitle = "BlueTubeTV Live Stream",
  pilotName, 
  isLive, 
  videoRef,
  currentUser 
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [showMintModal, setShowMintModal] = useState<boolean>(false);
  const [showFounderModal, setShowFounderModal] = useState<boolean>(false);
  const [capturedMoment, setCapturedMoment] = useState<any>(null);
  const [minting, setMinting] = useState<boolean>(false);
  const [mintProgress, setMintProgress] = useState<string>('');
  const [founderCount, setFounderCount] = useState<number>(31); // Current from image
  const [isFounder, setIsFounder] = useState<boolean>(false);
  const [founderNumber, setFounderNumber] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Connect wallet on component mount
  useEffect(() => {
    checkWalletConnection();
    loadFounderCount();
  }, []);

  const checkWalletConnection = async (): Promise<void> => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          await checkFounderStatus(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async (): Promise<void> => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to mint NFTs!');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      setIsConnected(true);
      await checkFounderStatus(accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    }
  };

  const checkFounderStatus = async (address: string): Promise<void> => {
    try {
      // This would call your smart contract to check founder status
      const response = await fetch(`/api/nft/founder-status?address=${address}`);
      const data = await response.json();
      
      if (data.isFounder) {
        setIsFounder(true);
        setFounderNumber(data.founderNumber);
      }
    } catch (error) {
      console.error('Error checking founder status:', error);
    }
  };

  const loadFounderCount = async (): Promise<void> => {
    try {
      const response = await fetch('/api/nft/founder-count');
      const data = await response.json();
      setFounderCount(data.count || 31);
    } catch (error) {
      console.error('Error loading founder count:', error);
    }
  };

  const getFounderPrice = (founderNumber: number): { price: string; rarity: string } => {
    if (founderNumber <= 10) return { price: '0.299', rarity: 'Ultra Rare' };
    if (founderNumber <= 25) return { price: '0.199', rarity: 'Super Rare' };
    if (founderNumber <= 50) return { price: '0.149', rarity: 'Rare' };
    return { price: '0.099', rarity: 'Limited' };
  };

  const mintFounderBadge = async (): Promise<void> => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setMinting(true);
    setMintProgress('Minting Founder Badge...');

    try {
      const nextFounderNumber = founderCount + 1;
      const { price } = getFounderPrice(nextFounderNumber);

      const response = await fetch('/api/nft/mint-founder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          founderNumber: nextFounderNumber,
          price
        })
      });

      if (!response.ok) throw new Error('Failed to mint founder badge');

      const result = await response.json();
      
      setIsFounder(true);
      setFounderNumber(nextFounderNumber);
      setFounderCount(nextFounderNumber);
      setShowFounderModal(false);
      
      alert(`🎉 Congratulations! You're now Founder #${nextFounderNumber}!`);
      
    } catch (error) {
      console.error('Founder minting error:', error);
      alert('Failed to mint founder badge: ' + (error as Error).message);
    }

    setMinting(false);
    setMintProgress('');
  };

  const captureCurrentMoment = async (): Promise<void> => {
    if (!videoRef?.current) {
      alert('No video stream available');
      return;
    }

    try {
      const canvas = canvasRef.current!;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;
      
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const blob = await new Promise<Blob>(resolve => 
        canvas.toBlob(resolve as BlobCallback, 'image/jpeg', 0.9)
      );
      
      const capturedData = {
        blob,
        timestamp: Date.now(),
        imageUrl: canvas.toDataURL('image/jpeg', 0.9),
        streamId,
        pilotName
      };
      
      setCapturedMoment(capturedData);
      setShowMintModal(true);
      
    } catch (error) {
      console.error('Error capturing moment:', error);
      alert('Failed to capture moment');
    }
  };

  const mintFlightMoment = async (description: string, mintPrice: string): Promise<void> => {
    if (!capturedMoment || !isConnected) return;

    setMinting(true);
    setMintProgress('Preparing NFT...');

    try {
      const formData = new FormData();
      formData.append('media', capturedMoment.blob, `moment_${capturedMoment.timestamp}.jpg`);
      formData.append('streamId', streamId);
      formData.append('timestamp', capturedMoment.timestamp.toString());
      formData.append('description', description);
      formData.append('pilotName', pilotName);
      formData.append('mintPrice', mintPrice);
      formData.append('isFounder', isFounder.toString());

      setMintProgress('Uploading to IPFS...');

      const response = await fetch('/api/nft/mint-moment', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload NFT data');

      const result = await response.json();

      setMintProgress('Minting to blockchain...');

      const mintResponse = await fetch('/api/nft/mint-to-blockchain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenURI: result.tokenURI,
          recipientAddress: walletAddress,
          nftType: 'FLIGHT_MOMENT'
        })
      });

      if (!mintResponse.ok) throw new Error('Failed to mint to blockchain');

      const mintResult = await mintResponse.json();

      setShowMintModal(false);
      setCapturedMoment(null);
      
      alert(`🎉 Flight moment minted successfully! Token ID: ${mintResult.tokenId}`);
      
    } catch (error) {
      console.error('Minting error:', error);
      alert('Failed to mint NFT: ' + (error as Error).message);
    }

    setMinting(false);
    setMintProgress('');
  };

  const remainingFounderBadges = 99 - founderCount;

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {/* NFT Controls */}
      <div className={styles.controls}>
        {!isConnected ? (
          <button onClick={connectWallet} className={styles.connectWalletBtn}>
            🔗 Connect Wallet
          </button>
        ) : (
          <div className={styles.walletConnected}>
            <div className={styles.walletInfo}>
              <span className={styles.walletIcon}>
                {isFounder ? `🏆 Founder #${founderNumber}` : '👛'}
              </span>
              <span className={styles.walletAddress}>
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </div>
            
            <div className={styles.actionButtons}>
              {/* Founder Badge Button */}
              {!isFounder && remainingFounderBadges > 0 && (
                <button 
                  onClick={() => setShowFounderModal(true)}
                  className={styles.founderButton}
                >
                  🦈 Claim Founder Badge
                  <span className={styles.urgency}>
                    {remainingFounderBadges} left!
                  </span>
                </button>
              )}
              {/* Mint Moment Button */}
              {isLive && (
                <button 
                  onClick={captureCurrentMoment} 
                  className={styles.mintMomentBtn}
                  disabled={!videoRef?.current}
                >
                  ✨ Mint This Moment
                  {isFounder && <span className={styles.discount}>50% OFF</span>}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Founder Status Display */}
      {isFounder && (
        <div className={styles.founderStatus}>
          <div className={styles.founderBadge}>
            <span className={styles.founderIcon}>🏆</span>
            <div className={styles.founderInfo}>
              <h3>Founder #{founderNumber}</h3>
              <p className={styles.founderRarity}>
                {getFounderPrice(founderNumber).rarity}
              </p>
            </div>
          </div>
          <div className={styles.founderPerks}>
            <h4>Your Founder Perks:</h4>
            <ul>
              <li>🎬 50% off all NFT mints</li>
              <li>💬 Priority chat highlighting</li>
              <li>🎯 Exclusive founder streams</li>
              <li>💰 Revenue sharing (0.1%)</li>
            </ul>
          </div>
        </div>
      )}

      {/* Founder Badge Modal */}
      {showFounderModal && (
        <FounderBadgeModal
          founderNumber={founderCount + 1}
          onMint={mintFounderBadge}
          onClose={() => setShowFounderModal(false)}
          minting={minting}
          mintProgress={mintProgress}
        />
      )}

      {/* Flight Moment Modal */}
      {showMintModal && capturedMoment && (
        <FlightMomentModal
          capturedMoment={capturedMoment}
          onMint={mintFlightMoment}
          onClose={() => setShowMintModal(false)}
          minting={minting}
          mintProgress={mintProgress}
          isFounder={isFounder}
          pilotName={pilotName}
        />
      )}
    </div>
  );
};

// Founder Badge Modal Component
const FounderBadgeModal: React.FC<{
  founderNumber: number;
  onMint: () => Promise<void>;
  onClose: () => void;
  minting: boolean;
  mintProgress: string;
}> = ({ founderNumber, onMint, onClose, minting, mintProgress }) => {
  const getFounderDetails = (num: number) => {
    if (num <= 10) return { price: '0.299 ETH', rarity: 'Ultra Rare', color: '#ffd700' };
    if (num <= 25) return { price: '0.199 ETH', rarity: 'Super Rare', color: '#c0c0c0' };
    if (num <= 50) return { price: '0.149 ETH', rarity: 'Rare', color: '#cd7f32' };
    return { price: '0.099 ETH', rarity: 'Limited', color: '#60a5fa' };
  };

  const details = getFounderDetails(founderNumber);

  if (minting) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <div className={styles.mintingProgress}>
            <div className={styles.spinner}></div>
            <h3>Minting Founder Badge #{founderNumber}...</h3>
            <p>{mintProgress}</p>
            <div className={styles.founderCelebration}>🦈🏆✨</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>
        
        <div className={styles.founderModalContent}>
          <div className={styles.founderPreview}>
            <div className={styles.founderBadgePreview} style={{ borderColor: details.color }}>
              <span className={styles.founderNumberLarge}>#{founderNumber}</span>
              <span className={styles.founderTitle}>FOUNDER</span>
            </div>
          </div>

          <div className={styles.founderDetails}>
            <h2>Become Founder #{founderNumber}</h2>
            <div className={styles.rarityBadge} style={{ backgroundColor: details.color }}>
              {details.rarity}
            </div>
            
            <div className={styles.price}>
              <span className={styles.priceAmount}>{details.price}</span>
              <span className={styles.priceNote}>~${Math.round(parseFloat(details.price) * 2400)}</span>
            </div>

            <div className={styles.perksPreview}>
              <h4>Exclusive Founder Perks:</h4>
              <ul>
                <li>🎬 50% off all NFT mints</li>
                <li>💬 Priority chat highlighting</li>
                <li>🎯 Exclusive founder-only streams</li>
                <li>💰 Revenue sharing (0.1% of platform)</li>
                <li>🏆 Founder badge on all messages</li>
                <li>📊 Advanced analytics dashboard</li>
              </ul>
            </div>

            <button 
              onClick={onMint}
              className={styles.founderMintButton}
              style={{ backgroundColor: details.color }}
            >
              🦈 Claim Founder Badge #{founderNumber}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Flight Moment Modal Component (simplified for space)
const FlightMomentModal: React.FC<{
  capturedMoment: any;
  onMint: (description: string, price: string) => Promise<void>;
  onClose: () => void;
  minting: boolean;
  mintProgress: string;
  isFounder: boolean;
  pilotName: string;
}> = ({ capturedMoment, onMint, onClose, minting, mintProgress, isFounder, pilotName }) => {
  const [description, setDescription] = useState<string>('');
  const [mintPrice, setMintPrice] = useState<string>('0.025');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onMint(description, mintPrice);
  };

  if (minting) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <div className={styles.mintingProgress}>
            <div className={styles.spinner}></div>
            <h3>Minting Flight Moment...</h3>
            <p>{mintProgress}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>
        
        <h3>🎬 Mint Flight Moment NFT</h3>
        
        <div className={styles.momentPreview}>
          <img src={capturedMoment.imageUrl} alt="Captured moment" />
          <div className={styles.momentDetails}>
            <p><strong>Pilot:</strong> {pilotName}</p>
            <p><strong>Captured:</strong> {new Date(capturedMoment.timestamp).toLocaleString()}</p>
            {isFounder && <p className={styles.founderDiscount}>🏆 Founder 50% Discount Applied!</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.mintForm}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this epic moment..."
            required
            maxLength={200}
          />

          <select
            value={mintPrice}
            onChange={(e) => setMintPrice(e.target.value)}
          >
            <option value="0.01">0.01 ETH (~$25)</option>
            <option value="0.025">0.025 ETH (~$60)</option>
            <option value="0.05">0.05 ETH (~$120)</option>
            <option value="0.1">0.1 ETH (~$240)</option>
          </select>

          <button type="submit" className={styles.mintSubmitBtn}>
            ✨ Mint NFT for {isFounder ? (parseFloat(mintPrice) * 0.5).toFixed(3) : mintPrice} ETH
            {isFounder && <span className={styles.savings}>Save 50%!</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NFTMinting;