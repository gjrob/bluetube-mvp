// lib/web3-config.js
import { ethers } from 'ethers';

// Contract Configuration
export const CONTRACT_CONFIG = {
  SEPOLIA: {
    CONTRACT_ADDRESS: "0xD699d61Ce1554d4f7ef4b853283845F354f8a9Db",
    CHAIN_ID: "0xaa36a7", // hex string
    CHAIN_NAME: "Sepolia Testnet",
    RPC_URL: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
    EXPLORER: "https://sepolia.etherscan.io",
    NATIVE_CURRENCY: { name: "SepoliaETH", symbol: "ETH", decimals: 18 }
  },
  MAINNET: {
    CONTRACT_ADDRESS: "YOUR_MAINNET_CONTRACT",
    CHAIN_ID: "0x1",
    CHAIN_NAME: "Ethereum Mainnet",
    RPC_URL: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
    EXPLORER: "https://etherscan.io",
    NATIVE_CURRENCY: { name: "Ether", symbol: "ETH", decimals: 18 }
  },
  POLYGON: {
    CONTRACT_ADDRESS: "YOUR_POLYGON_CONTRACT",
    CHAIN_ID: "0x89",
    CHAIN_NAME: "Polygon",
    RPC_URL: "https://polygon-rpc.com",
    EXPLORER: "https://polygonscan.com",
    NATIVE_CURRENCY: { name: "MATIC", symbol: "MATIC", decimals: 18 }
  }
};

// Choose network
export const ACTIVE_NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'SEPOLIA';
export const CONFIG = CONTRACT_CONFIG[ACTIVE_NETWORK];

// ABI
export const CONTRACT_ABI = [
  "function sendTip(address streamer) payable",
  "function mintNFT(string tokenURI, uint256 price) returns (uint256)",
  "function withdraw() external",
  "function getBalance() view returns (uint256)",
  "event TipSent(address indexed from, address indexed to, uint256 amount)",
  "event NFTMinted(address indexed owner, uint256 tokenId, string tokenURI)"
];

// SSR guard
const isBrowser = typeof window !== 'undefined';

// Basic server-side provider (for reading on server if needed)
export const getServerProvider = () => new ethers.providers.JsonRpcProvider(CONFIG.RPC_URL);

// Web3 Provider Class (browser only for signing)
export class Web3Provider {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.address = null;
  }

  async connect() {
    if (!isBrowser) throw new Error('Web3 connect called on server');
    if (!window.ethereum) throw new Error('MetaMask not installed');

    if (!CONFIG?.CONTRACT_ADDRESS || CONFIG.CONTRACT_ADDRESS.startsWith('YOUR_')) {
      throw new Error(`Missing contract address for ${ACTIVE_NETWORK}`);
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    await this.switchNetwork();

    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner();
    this.address = accounts[0];

    this.contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);

    return { address: this.address, network: ACTIVE_NETWORK, contract: CONFIG.CONTRACT_ADDRESS };
  }

  async switchNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CONFIG.CHAIN_ID }],
      });
    } catch (err) {
      // 4902 = chain not added; 4001 = user rejected
      if (err?.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: CONFIG.CHAIN_ID,
            chainName: CONFIG.CHAIN_NAME,
            nativeCurrency: CONFIG.NATIVE_CURRENCY,
            rpcUrls: [CONFIG.RPC_URL],
            blockExplorerUrls: [CONFIG.EXPLORER],
          }]
        });
      } else {
        throw err;
      }
    }
  }

  async getBalance() {
    if (!this.provider || !this.address) throw new Error('Not connected');
    const balance = await this.provider.getBalance(this.address);
    return ethers.utils.formatEther(balance);
  }

  async sendTip(streamerAddress, amountEth) {
    if (!this.contract) throw new Error('Contract not initialized');
    const tx = await this.contract.sendTip(streamerAddress, {
      value: ethers.utils.parseEther(String(amountEth))
    });
    return tx.wait();
  }

  async mintNFT(metadata, priceEth) {
    if (!this.contract) throw new Error('Contract not initialized');
    const tokenURI = await this.uploadToIPFS(metadata);
    const tx = await this.contract.mintNFT(tokenURI, ethers.utils.parseEther(String(priceEth)));
    return tx.wait();
  }

  async uploadToIPFS(metadata) {
    const res = await fetch('/api/upload-metadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metadata)
    });
    if (!res.ok) throw new Error('IPFS upload failed');
    const { ipfsHash } = await res.json();
    return `ipfs://${ipfsHash}`;
  }

  listenToEvents() {
    if (!this.contract) return;
    this.contract.on('TipSent', (from, to, amount) => {
      const human = ethers.utils.formatEther(amount);
      this.updateAnalytics('tip', { from, to, amount: human });
    });
    this.contract.on('NFTMinted', (owner, tokenId, tokenURI) => {
      this.updateAnalytics('nft_mint', { owner, tokenId: tokenId.toString(), tokenURI });
    });
  }

  async updateAnalytics(event, data) {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, data, timestamp: Date.now(), network: ACTIVE_NETWORK })
      });
    } catch (e) {
      // non-fatal
      console.warn('analytics failed', e);
    }
  }
}

// Singleton (safe to import anywhere; connect() only on client)
export const web3Provider = new Web3Provider();
