import React, { useState, useEffect, useRef } from 'react';

// Simple Live Chat Component - Just for messages
const LiveChat = ({ streamId, username = "Anonymous" }) => {
  const [messages, setMessages] = useState([
    { id: 1, user: "System", text: "Welcome to the stream!", type: "system" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        user: username,
        text: inputMessage,
        type: "message"
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      color: 'white'
    }}>
      <h3 style={{ marginBottom: '20px', fontSize: '24px' }}>💬 Live Chat</h3>
      
      {/* Messages */}
      <div style={{
        height: '300px',
        overflowY: 'auto',
        marginBottom: '20px',
        padding: '15px',
        background: 'rgba(15, 23, 42, 0.3)',
        borderRadius: '12px'
      }}>
        {messages.map(message => (
          <div key={message.id} style={{
            padding: '10px',
            marginBottom: '8px',
            borderRadius: '8px',
            background: message.type === 'system' 
              ? 'rgba(59, 130, 246, 0.2)'
              : 'rgba(30, 41, 59, 0.3)'
          }}>
            {message.type === 'system' ? (
              <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>{message.text}</span>
            ) : (
              <span>
                <strong style={{ color: '#60a5fa' }}>{message.user}:</strong> {message.text}
              </span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={{
            flex: 1,
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '12px',
            fontSize: '16px'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim()}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
            opacity: inputMessage.trim() ? 1 : 0.5
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default LiveChat;