import React, { useState } from 'react';

export default function SuperChat({ streamId = 'live', pilotId = 'pilot-123' }) {
  const [amount, setAmount] = useState(25);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const quickAmounts = [5, 25, 50, 100, 500];

const sendSuperChat = async () => {
  setLoading(true);
  setStatus('');
  try {
    const response = await fetch('/api/super-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amount || 5,
        message: message || '',
        streamId,
        pilotId,
        userId: 'user-' + Date.now()
      })
    });

    const data = await response.json();

    if (data.success) {
      setStatus('✅ SuperChat created! Check Stripe Dashboard');
      // In production, you'd handle Stripe payment here

      // Reset form
      setTimeout(() => {
        setMessage('');
        setStatus('');
      }, 3000);
    } else {
      setStatus(`❌ Error: ${data.error || 'Failed'}`);
    }
  } catch (error) {
    setStatus(`❌ Error: ${error.message}`);
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '15px',
      padding: '20px',
      color: 'white',
      maxWidth: '400px'
    }}>
      <h3 style={{ marginBottom: '20px', color: '#ffd700' }}>
        💰 Send SuperChat
      </h3>

      {/* Quick Amount Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
        {quickAmounts.map(value => (
          <button
            key={value}
            onClick={() => setAmount(value)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: amount === value ? '2px solid #00ff88' : '1px solid #666',
              background: amount === value ? '#00ff88' : '#333',
              color: amount === value ? '#000' : '#fff',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ${value}
          </button>
        ))}
      </div>

      {/* Custom Amount */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
          Amount: ${amount}
        </label>
        <input
          type="range"
          min="5"
          max="1000"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Message */}
      <div style={{ marginBottom: '15px' }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a message (optional)"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '10px',
            background: '#1a1a1a',
            border: '1px solid #333',
            color: 'white',
            resize: 'none'
          }}
          rows="3"
          maxLength="200"
        />
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          {message.length}/200 characters
        </div>
      </div>

      {/* Send Button */}
      <button
        onClick={sendSuperChat}
        disabled={loading}
        style={{
          width: '100%',
          padding: '15px',
          borderRadius: '10px',
          background: loading ? '#666' : 'linear-gradient(45deg, #00ff88, #00d4ff)',
          color: loading ? '#ccc' : '#000',
          border: 'none',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        Send ${amount} SuperChat
      </button>

      {/* Status */}
      {status && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          borderRadius: '8px',
          background: status.includes('✅') ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)',
          fontSize: '14px'
        }}>
          {status}
        </div>
      )}

      {/* Info */}
      <div style={{
        marginTop: '15px',
        fontSize: '12px',
        color: '#666',
        textAlign: 'center'
      }}>
        70% goes to pilot • 30% platform fee
      </div>
    </div>
  );
}

