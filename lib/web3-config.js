// lib/web3-config.js
// Centralized Web3 configuration for your entire platform

import { ethers } from 'ethers';

// Contract Configuration
export const CONTRACT_CONFIG = {
  // Testnet Configuration (Current)
  SEPOLIA: {
    CONTRACT_ADDRESS: "0xD699d61Ce1554d4f7ef4b853283845F354f8a9Db",
    CHAIN_ID: "0xaa36a7",
    CHAIN_NAME: "Sepolia Testnet",
    RPC_URL: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
    EXPLORER: "https://sepolia.etherscan.io",
    NATIVE_CURRENCY: {
      name: "SepoliaETH",
      symbol: "ETH",
      decimals: 18
    }
  },
  
  // Mainnet Configuration (Production)
  MAINNET: {
    CONTRACT_ADDRESS: "YOUR_MAINNET_CONTRACT", // Deploy when ready
    CHAIN_ID: "0x1",
    CHAIN_NAME: "Ethereum Mainnet",
    RPC_URL: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
    EXPLORER: "https://etherscan.io",
    NATIVE_CURRENCY: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    }
  },
  
  // Polygon Configuration (Low fees)
  POLYGON: {
    CONTRACT_ADDRESS: "YOUR_POLYGON_CONTRACT", // Deploy when ready
    CHAIN_ID: "0x89",
    CHAIN_NAME: "Polygon",
    RPC_URL: "https://polygon-rpc.com",
    EXPLORER: "https://polygonscan.com",
    NATIVE_CURRENCY: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    }
  }
};

// Select network based on environment
export const ACTIVE_NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'SEPOLIA';
export const CONFIG = CONTRACT_CONFIG[ACTIVE_NETWORK];

// Smart Contract ABI (Add your full ABI here)
export const CONTRACT_ABI = [
  // Basic functions for tips and NFTs
  "function sendTip(address streamer) payable",
  "function mintNFT(string memory tokenURI, uint256 price) returns (uint256)",
  "function withdraw() external",
  "function getBalance() view returns (uint256)",
  "event TipSent(address indexed from, address indexed to, uint256 amount)",
  "event NFTMinted(address indexed owner, uint256 tokenId, string tokenURI)"
];

// Web3 Provider Class
export class Web3Provider {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.address = null;
  }

  async connect() {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      // Switch to correct network
      await this.switchNetwork();

      // Setup provider and signer
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.address = accounts[0];

      // Initialize contract
      this.contract = new ethers.Contract(
        CONFIG.CONTRACT_ADDRESS,
        CONTRACT_ABI,
        this.signer
      );

      return {
        address: this.address,
        network: ACTIVE_NETWORK,
        contract: CONFIG.CONTRACT_ADDRESS
      };
    } catch (error) {
      console.error('Connection failed:', error);
      throw error;
    }
  }

  async switchNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CONFIG.CHAIN_ID }],
      });
    } catch (switchError) {
      // Network not added to MetaMask
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: CONFIG.CHAIN_ID,
            chainName: CONFIG.CHAIN_NAME,
            nativeCurrency: CONFIG.NATIVE_CURRENCY,
            rpcUrls: [CONFIG.RPC_URL],
            blockExplorerUrls: [CONFIG.EXPLORER]
          }]
        });
      } else {
        throw switchError;
      }
    }
  }

  async getBalance() {
    if (!this.provider || !this.address) {
      throw new Error('Not connected');
    }
    const balance = await this.provider.getBalance(this.address);
    return ethers.utils.formatEther(balance);
  }

  // Platform-specific functions
  async sendTip(streamerAddress, amount) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const tx = await this.contract.sendTip(streamerAddress, {
      value: ethers.utils.parseEther(amount.toString())
    });

    return await tx.wait();
  }

  async mintNFT(metadata, price) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    // Upload metadata to IPFS (integrate with your existing upload system)
    const tokenURI = await this.uploadToIPFS(metadata);

    const tx = await this.contract.mintNFT(
      tokenURI,
      ethers.utils.parseEther(price.toString())
    );

    const receipt = await tx.wait();
    return receipt;
  }

  async uploadToIPFS(metadata) {
    // Integrate with your existing upload system
    // This should use your Upload.js component
    const response = await fetch('/api/upload-metadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metadata)
    });
    
    const { ipfsHash } = await response.json();
    return `ipfs://${ipfsHash}`;
  }

  // Listen to contract events
  listenToEvents() {
    if (!this.contract) return;

    this.contract.on('TipSent', (from, to, amount) => {
      console.log('Tip received:', {
        from: from,
        to: to,
        amount: ethers.utils.formatEther(amount)
      });
      
      // Update your analytics
      this.updateAnalytics('tip', {
        from,
        to,
        amount: ethers.utils.formatEther(amount)
      });
    });

    this.contract.on('NFTMinted', (owner, tokenId, tokenURI) => {
      console.log('NFT Minted:', {
        owner,
        tokenId,
        tokenURI
      });
      
      // Update your analytics
      this.updateAnalytics('nft_mint', {
        owner,
        tokenId,
        tokenURI
      });
    });
  }

  async updateAnalytics(event, data) {
    // Integrate with your existing analytics
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        data,
        timestamp: Date.now(),
        network: ACTIVE_NETWORK
      })
    });
  }
}

// Export singleton instance
export const web3Provider = new Web3Provider();