// components/SuperChat.js
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import useWeb3 from '@/hooks/useWeb3';
import events from '@lib/analytics-events';
// Contract ABI for SuperChat functionality
const SUPERCHAT_ABI = [
  "function sendSuperChat(address creator, string message) payable",
  "function tip(address to, string message) payable",
  "event SuperChatSent(address indexed sender, address indexed creator, uint256 amount, string message, uint256 timestamp)"
];

// SuperChat Component - Single declaration
const SuperChat = ({ streamId, creatorAddress, currentUser, isLive }) => {
  const { connect, address, contractW } = useWeb3();
  const [amount, setAmount] = useState('0.01');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [superChats, setSuperChats] = useState([]);
  const [showSuperChat, setShowSuperChat] = useState(false);
  const [note, setNote] = useState('Great stream!');

  // Listen for SuperChat events
  useEffect(() => {
    if (!isLive) return;

    const listenForSuperChats = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contractAddress = process.env.NEXT_PUBLIC_SUPERCHAT_CONTRACT;
          
          if (!contractAddress) {
            console.warn('SuperChat contract address not configured');
            return;
          }

          const contract = new ethers.Contract(contractAddress, SUPERCHAT_ABI, provider);
          
          // Listen for new SuperChats
          contract.on('SuperChatSent', (sender, creator, amountWei, msg, timestamp) => {
            if (creator.toLowerCase() === creatorAddress?.toLowerCase()) {
              const newSuperChat = {
                id: `${sender}-${timestamp}`,
                sender: sender,
                amount: ethers.utils.formatEther(amountWei),
                message: msg,
                timestamp: new Date(timestamp.toNumber() * 1000),
              };
              
              setSuperChats(prev => [...prev, newSuperChat]);
              
              // Show notification
              toast.success(`New SuperChat: ${ethers.utils.formatEther(amountWei)} ETH from ${sender.slice(0, 6)}...`);
            }
          });

          return () => {
            contract.removeAllListeners('SuperChatSent');
          };
        }
      } catch (error) {
        console.error('Error setting up SuperChat listener:', error);
      }
    };

    listenForSuperChats();
  }, [isLive, creatorAddress]);

  const sendTip = async () => {
    if (!amount || !note) {
      toast.error('Please enter both amount and message');
      return;
    }

    if (!creatorAddress) {
      toast.error('Creator address not found');
      return;
    }

    setIsLoading(true);

    try {
      const c = await contractW();
      const tx = await c.tip(creatorAddress, note, {
        value: ethers.utils.parseEther(amount)
      });
      
      toast.loading('Sending tip...', { id: 'tip-tx' });
      await tx.wait();
      toast.success('Tip sent successfully!', { id: 'tip-tx' });

      // Reset form
      setAmount('0.01');
      setNote('Great stream!');

      // Fire analytics event
      try {
        const { trackEvent } = await import('@/lib/analytics-events');
        trackEvent('tip.sent', { amount, to: creatorAddress, hash: tx.hash });
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }
      
    } catch (error) {
      console.error('Tip error:', error);
      toast.error(error.message || 'Failed to send tip', { id: 'tip-tx' });
    } finally {
      setIsLoading(false);
    }
  };

  const sendSuperChat = async () => {
    if (!amount || !message) {
      toast.error('Please enter both amount and message');
      return;
    }

    if (!creatorAddress) {
      toast.error('Creator address not found');
      return;
    }

    setIsLoading(true);

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask to send SuperChats');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = process.env.NEXT_PUBLIC_SUPERCHAT_CONTRACT;
      
      if (!contractAddress) {
        throw new Error('SuperChat contract not configured');
      }

      const contract = new ethers.Contract(contractAddress, SUPERCHAT_ABI, signer);
      
      // Send SuperChat transaction
      const tx = await contract.sendSuperChat(
        creatorAddress,
        message,
        { value: ethers.utils.parseEther(amount) }
      );

      toast.loading('Sending SuperChat...', { id: 'superchat-tx' });
      
      await tx.wait();
      
      toast.success('SuperChat sent successfully!', { id: 'superchat-tx' });
      
      // Reset form
      setAmount('0.01');
      setMessage('');
      setShowSuperChat(false);
      
      // Track analytics
      if (window.analytics) {
        window.analytics.track('superchat_sent', {
          stream_id: streamId,
          creator_address: creatorAddress,
          amount: amount,
          user_id: currentUser?.id
        });
      }
      
    } catch (error) {
      console.error('SuperChat error:', error);
      toast.error(error.message || 'Failed to send SuperChat', { id: 'superchat-tx' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLive) {
    return null;
  }

  return (
    <div style={styles.container}>
      {/* Web3 Tip Section */}
      {!address && (
        <button onClick={connect} style={styles.connectButton}>
          Connect Wallet
        </button>
      )}

      {address && (
        <div style={styles.tipSection}>
          <h4 style={styles.sectionTitle}>Send Tip (Web3)</h4>
          <div style={styles.tipForm}>
            <input 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              placeholder="ETH amount"
              style={styles.input}
              type="number"
              step="0.001"
              min="0.001"
            />
            <input 
              value={note} 
              onChange={e => setNote(e.target.value)} 
              placeholder="Message"
              style={styles.input}
            />
            <button 
              onClick={sendTip}
              disabled={isLoading}
              style={{
                ...styles.tipButton,
                ...(isLoading ? styles.buttonDisabled : {})
              }}
            >
              {isLoading ? 'Sending...' : 'Send Tip'}
            </button>
          </div>
        </div>
      )}

      {/* SuperChat Button */}
      <button
        onClick={() => setShowSuperChat(!showSuperChat)}
        style={styles.toggleButton}
        className="superchat-toggle"
      >
        💎 SuperChat
      </button>

      {/* SuperChat Form Modal */}
      {showSuperChat && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Send SuperChat 💎</h3>
              <button
                onClick={() => setShowSuperChat(false)}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Amount (ETH)</label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.01"
                style={styles.input}
                disabled={isLoading}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message to the creator..."
                maxLength={200}
                rows={3}
                style={styles.textarea}
                disabled={isLoading}
              />
              <div style={styles.charCount}>
                {message.length}/200
              </div>
            </div>

            <button
              onClick={sendSuperChat}
              disabled={isLoading || !amount || !message}
              style={{
                ...styles.sendButton,
                ...(isLoading ? styles.sendButtonDisabled : {})
              }}
            >
              {isLoading ? 'Sending...' : `Send ${amount || '0'} ETH`}
            </button>
          </div>
        </div>
      )}

      {/* SuperChat Display */}
      {superChats.length > 0 && (
        <div style={styles.superChatList}>
          <h4 style={styles.listTitle}>Recent SuperChats</h4>
          {superChats.slice(-5).reverse().map((sc) => (
            <div key={sc.id} style={styles.superChatItem}>
              <div style={styles.superChatHeader}>
                <span style={styles.superChatAmount}>💎 {sc.amount} ETH</span>
                <span style={styles.superChatSender}>
                  {sc.sender.slice(0, 6)}...{sc.sender.slice(-4)}
                </span>
              </div>
              <p style={styles.superChatMessage}>{sc.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Ocean-themed styles
const styles = {
  container: {
    position: 'relative',
    marginTop: '1rem',
  },
  connectButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '0.5rem',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '1rem',
  },
  tipSection: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '1rem',
  },
  sectionTitle: {
    color: '#fff',
    marginBottom: '0.75rem',
    fontSize: '1rem',
  },
  tipForm: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  tipButton: {
    padding: '0.5rem 1rem',
    background: 'linear-gradient(45deg, #00c9ff 0%, #92fe9d 100%)',
    border: 'none',
    borderRadius: '0.375rem',
    color: '#333',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  toggleButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '0.5rem',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '1rem',
    padding: '2rem',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  modalTitle: {
    color: '#fff',
    fontSize: '1.5rem',
    margin: 0,
  },
  closeButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    color: '#fff',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
  },
  input: {
    flex: 1,
    minWidth: '120px',
    padding: '0.5rem 0.75rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.375rem',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.5rem',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    resize: 'vertical',
  },
  charCount: {
    textAlign: 'right',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.8rem',
    marginTop: '0.25rem',
  },
  sendButton: {
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(45deg, #00c9ff 0%, #92fe9d 100%)',
    border: 'none',
    borderRadius: '0.5rem',
    color: '#333',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '1rem',
  },
  sendButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  superChatList: {
    marginTop: '1.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '0.5rem',
    padding: '1rem',
  },
  listTitle: {
    color: '#fff',
    marginBottom: '1rem',
    fontSize: '1.1rem',
  },
  superChatItem: {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '0.5rem',
    padding: '0.75rem',
    marginBottom: '0.5rem',
    borderLeft: '3px solid #92fe9d',
  },
  superChatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  superChatAmount: {
    color: '#92fe9d',
    fontWeight: 'bold',
  },
  superChatSender: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem',
  },
  superChatMessage: {
    color: '#fff',
    margin: 0,
    fontSize: '0.95rem',
  },
};

export default SuperChat;