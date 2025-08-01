// components/SuperChat.js
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

export default function SuperChat({ streamId, currentUser, isLive }) {
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState(5);
  const [superChats, setSuperChats] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Quick tip amounts
  const tipAmounts = [5, 10, 20, 50, 100];

  const handleSuperChat = async () => {
    if (!message.trim() || amount < 5) return;
    
    setIsProcessing(true);
    
    try {
      // Create payment intent
      const response = await fetch('/api/super-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          username: currentUser.name,
          message: message,
          streamId: streamId
        })
      });

      const data = await response.json();
    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    } else {
      console.error('No checkout URL received:', data);
      alert('Payment setup failed');
    }
  } catch (err) {
    console.error('SuperChat error:', err);
    alert('Something went wrong');
  } finally {
    setIsProcessing(false);
  }
};

return (
  <div style={{
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '20px',
    padding: '20px',
    height: '600px',
    display: 'flex',
    flexDirection: 'column'
  }}>
    {/* Header */}
    <div style={{
      borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
      paddingBottom: '15px',
      marginBottom: '15px'
    }}>
      <h3 style={{
        margin: 0,
        fontSize: '20px',
        fontWeight: '600',
        background: 'linear-gradient(135deg, #60a5fa, #818cf8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        💰 Super Chat
      </h3>
      <p style={{ 
        margin: '5px 0 0 0', 
        fontSize: '14px', 
        color: '#94a3b8' 
      }}>
        Support the pilot with a tip!
      </p>
    </div>

      {/* Super Chats List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: '15px'
      }}>
        {superChats.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#64748b',
            padding: '40px',
            fontSize: '14px'
          }}>
            Be the first to send a Super Chat! 🎉
          </div>
        ) : (
          superChats.map(chat => (
            <div key={chat.id} style={{
              background: amount >= 50 
                ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' 
                : 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '10px',
              animation: 'slideIn 0.3s ease-out'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{
                  fontWeight: '600',
                  color: amount >= 50 ? '#000' : '#60a5fa'
                }}>
                  🦈 {chat.username}
                </span>
                <span style={{
                  background: amount >= 50 
                    ? 'rgba(0, 0, 0, 0.2)' 
                    : 'rgba(16, 185, 129, 0.2)',
                  color: amount >= 50 ? '#000' : '#10b981',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  ${chat.amount}
                </span>
              </div>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: amount >= 50 ? '#000' : '#e2e8f0'
              }}>
                {chat.message}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Input Section */}
  <input
  type="text"
  placeholder="Add a message..."
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyPress={(e) => {
    if (e.key === 'Enter') {
      handleSendTip();
    }
  }}
  style={{
    flex: 1,
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    color: 'white',
    padding: '12px',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none'
  }}
/>

        {/* Amount Selector */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '12px'
        }}>
          {tipAmounts.map(tipAmount => (
            <button
              key={tipAmount}
              onClick={() => setAmount(tipAmount)}
              style={{
                flex: 1,
                background: amount === tipAmount 
                  ? 'linear-gradient(135deg, #60a5fa, #818cf8)'
                  : 'rgba(30, 41, 59, 0.5)',
                border: amount === tipAmount 
                  ? '2px solid #60a5fa'
                  : '1px solid rgba(59, 130, 246, 0.2)',
                color: 'white',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: amount === tipAmount ? '600' : '400',
                transition: 'all 0.2s ease'
              }}
            >
              ${tipAmount}
            </button>
          ))}
        </div>

        {/* Message Input */}
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a message..."
            maxLength={200}
            style={{
              flex: 1,
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: 'white',
              padding: '12px',
              borderRadius: '12px',
              fontSize: '14px',
              outline: 'none'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isProcessing) {
                
                handleSuperChat();
              }
            }}
          />
          
<button
  onClick={handleSuperChat}
  disabled={isProcessing || !message.trim()}
  style={{
    background: isProcessing 
      ? 'rgba(100, 116, 139, 0.5)'
      : 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: isProcessing ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: isProcessing 
      ? 'none'
      : '0 4px 20px rgba(16, 185, 129, 0.3)',
    transition: 'all 0.2s ease'
  }}
>
  {isProcessing ? '⏳' : '💰'}
  Send
</button>
              <style jsx>{`
                @keyframes slideIn {
                  from {
                    opacity: 0;
                    transform: translateY(-10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
            </div>
          </div>
        );
    }
