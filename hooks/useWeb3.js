// ============================================
// hooks/useWeb3.js
// React hook for Web3 integration
// ============================================

import { useState, useEffect } from 'react';
import { web3Provider } from '../lib/web3-config';
import { useAuth } from './useAuth';

export function useWeb3() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState('0.00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if already connected
    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  async function checkConnection() {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        
        if (accounts.length > 0) {
          await connect();
        }
      }
    } catch (err) {
      console.error('Failed to check connection:', err);
    }
  }

  async function connect() {
    setLoading(true);
    setError(null);
    
    try {
      const result = await web3Provider.connect();
      setAddress(result.address);
      setIsConnected(true);
      
      // Get balance
      const balance = await web3Provider.getBalance();
      setBalance(balance);
      
      // Start listening to events
      web3Provider.listenToEvents();
      
      // Save to your database
      if (user) {
        await saveWalletToDatabase(result.address);
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Failed to connect:', err);
    } finally {
      setLoading(false);
    }
  }

  async function disconnect() {
    setIsConnected(false);
    setAddress(null);
    setBalance('0.00');
  }

  async function sendTip(streamerAddress, amount) {
    try {
      setLoading(true);
      const receipt = await web3Provider.sendTip(streamerAddress, amount);
      
      // Update balance
      const newBalance = await web3Provider.getBalance();
      setBalance(newBalance);
      
      return receipt;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function mintNFT(metadata, price) {
    try {
      setLoading(true);
      const receipt = await web3Provider.mintNFT(metadata, price);
      return receipt;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function saveWalletToDatabase(walletAddress) {
    // Save to Supabase
    const response = await fetch('/api/profile/update-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        walletAddress,
        network: ACTIVE_NETWORK
      })
    });
    
    return response.json();
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setAddress(accounts[0]);
      web3Provider.getBalance().then(setBalance);
    }
  }

  function handleChainChanged() {
    window.location.reload();
  }

  return {
    isConnected,
    address,
    balance,
    loading,
    error,
    connect,
    disconnect,
    sendTip,
    mintNFT
  };
}
