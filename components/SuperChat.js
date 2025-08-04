// components/SuperChat.js - COMPLETE WORKING VERSION
import { useState } from 'react';

export default function SuperChat({ streamId, currentUser, isLive }) {
  const [message, setMessage] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [superChats, setSuperChats] = useState([]);

  const handleSuperChat = async () => {
    if (!message.trim() || !selectedAmount || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/super-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedAmount,
          message: message,
          streamId: streamId,
          userId: currentUser?.id || 'anonymous',
          userName: currentUser?.name || 'Anonymous'
        })
      });
    console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error('Failed to create Super Chat');
      }
      const data = await response.json();
      
      if (data.url) {
        // Open Stripe checkout in new tab
        window.open(data.url, '_blank');
        
        // Add to local chat display
        setSuperChats(prev => [...prev, {
          id: Date.now(),
          amount: selectedAmount,
          message: message,
          userName: currentUser?.name || 'Anonymous',
          timestamp: new Date()
        }]);
        
        // Clear form
        setMessage('');
        setSelectedAmount(null);
      }
    } catch (error) {
      console.error('SuperChat error:', error);
      alert('Failed to process tip. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    }}>
      <h3 style={{ 
        fontSize: '24px', 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        💰 Super Chat
      </h3>
      
      <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
        Support the pilot with a tip!
      </p>

      {/* Recent Super Chats Display */}
      {superChats.length > 0 && (
        <div style={{
          maxHeight: '200px',
          overflowY: 'auto',
          marginBottom: '20px',
          padding: '10px',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '10px'
        }}>
          {superChats.map(chat => (
            <div key={chat.id} style={{
              padding: '10px',
              marginBottom: '10px',
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))',
              border: '1px solid rgba(251, 191, 36, 0.5)',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>
                  🦈 {chat.userName}
                </span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                  ${chat.amount}
                </span>
              </div>
              <p style={{ margin: 0, color: 'white' }}>{chat.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={(e) => {
        e.preventDefault();
            console.log('Enter pressed!'); 
        handleSuperChat();
      }}>
        {/* Message Input */}
        <input
          type="text"
          placeholder="Add a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
          console.log('Enter pressed!'); 
        handleSuperChat();
    }
  }}
          disabled={isProcessing}
          style={{
            width: '100%',
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: 'white',
            padding: '12px',
            borderRadius: '12px',
            fontSize: '16px',
            marginBottom: '15px',
            outline: 'none'
          }}
        />
        
        {/* Amount Selection */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          {[5, 10, 20, 50, 100].map(amount => (
            <button
              key={amount}
              type="button"
              onClick={() => setSelectedAmount(amount)}
              disabled={isProcessing}
              style={{
                background: selectedAmount === amount 
                  ? 'linear-gradient(135deg, #3b82f6, #60a5fa)'
                  : 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '12px',
                fontSize: '16px',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                flex: '1',
                minWidth: '60px'
              }}
            >
              ${amount}
            </button>
          ))}
        </div>
        
        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || !selectedAmount || isProcessing}
          style={{
            background: (!message.trim() || !selectedAmount || isProcessing)
              ? 'rgba(107, 114, 128, 0.5)'
              : 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            padding: '15px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: (!message.trim() || !selectedAmount || isProcessing) 
              ? 'not-allowed' 
              : 'pointer',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.2s'
          }}
        >
          {isProcessing ? (
            <>⏳ Processing...</>
          ) : (
            <>💰 Send ${selectedAmount || '0'}</>
          )}
        </button>
      </form>
      
      {/* Tip Display */}
      {!superChats.length && (
        <p style={{ 
          textAlign: 'center', 
          color: '#64748b', 
          marginTop: '20px',
          fontSize: '14px'
        }}>
          Be the first to send a Super Chat! 🎉
        </p>
      )}
    </div>
  );
}