// ============================================
// components/Web3Integration.js
// Component to add to your existing pages
// ============================================

import { useWeb3 } from '../hooks/useWeb3';
import { useState } from 'react';

export default function Web3Integration() {
  const { 
    isConnected, 
    address, 
    balance, 
    connect, 
    disconnect,
    sendTip,
    mintNFT,
    loading,
    error
  } = useWeb3();
  
  const [tipAmount, setTipAmount] = useState('0.01');

  return (
    <div className="web3-integration">
      {/* Wallet Connection */}
      <div className="wallet-section">
        {!isConnected ? (
          <button 
            onClick={connect} 
            disabled={loading}
            className="connect-wallet-btn"
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="wallet-info">
            <span className="address">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
            <span className="balance">{balance} ETH</span>
            <button onClick={disconnect} className="disconnect-btn">
              Disconnect
            </button>
          </div>
        )}
        
        {error && (
          <div className="error-message">{error}</div>
        )}
      </div>

      {/* Tip Section - Integrate with your existing SuperChat */}
      {isConnected && (
        <div className="tip-section">
          <input
            type="number"
            value={tipAmount}
            onChange={(e) => setTipAmount(e.target.value)}
            step="0.001"
            min="0.001"
            placeholder="Amount in ETH"
          />
          <button 
            onClick={() => sendTip(STREAMER_ADDRESS, tipAmount)}
            disabled={loading}
          >
            Send Tip 🚁
          </button>
        </div>
      )}
    </div>
  );
}
