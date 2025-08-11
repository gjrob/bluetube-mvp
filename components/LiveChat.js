// components/LiveChat.js - COMPLETE IMPLEMENTATION
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// CRITICAL MODERATION - Zero Tolerance
const criticalTerms = [
  'cp', 'csam', 'pedo', 'loli', 'underage', 'minor', 'child',
  'porn', 'xxx', 'nsfw', 'nude', 'naked', 'onlyfans',
  'rape', 'murder', 'kill', 'suicide', 'kys',
  'cocaine', 'heroin', 'meth', 'drugs'
];

const spamWords = ['spam', 'scam', 'buy now', 'click here', 'viagra'];

// Check for critical content
function checkCritical(text) {
  const lower = text.toLowerCase();
  for (const term of criticalTerms) {
    if (lower.includes(term)) {
      return { 
        isCritical: true, 
        term: term 
      };
    }
  }
  return { isCritical: false };
}

// Clean regular bad words
function cleanMessage(text) {
  let cleaned = text;
  spamWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    cleaned = cleaned.replace(regex, '***');
  });
  return cleaned;
}

export default function LiveChat({ streamId, userId, username }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isBanned, setIsBanned] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // Subscribe to live messages
  useEffect(() => {
    if (!streamId) return;

    const channel = supabase.channel(`chat:${streamId}`);
    
    channel
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        // Check incoming messages too (in case someone bypasses client)
        const check = checkCritical(payload.text);
        if (!check.isCritical) {
          setMessages(prev => [...prev, {
            id: payload.id || Date.now(),
            text: cleanMessage(payload.text),
            user: payload.user,
            timestamp: payload.timestamp,
            moderated: payload.moderated
          }].slice(-50)); // Keep last 50 messages
        }
      })
      .on('broadcast', { event: 'user_banned' }, ({ payload }) => {
        if (payload.userId === userId) {
          setIsBanned(true);
        }
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      channel.unsubscribe();
    };
  }, [streamId, userId]);

  // Send message with moderation
  const sendMessage = async () => {
    if (!messageInput.trim() || isBanned) return;
    
    // CRITICAL CONTENT CHECK - INSTANT BAN
    const criticalCheck = checkCritical(messageInput);
    if (criticalCheck.isCritical) {
      // Ban user immediately
      setIsBanned(true);
      
      // Log violation
      await supabase.from('critical_violations').insert({
        user_id: userId,
        content: messageInput,
        stream_id: streamId,
        violation_type: criticalCheck.term,
        action_taken: 'BANNED'
      });
      
      // Ban from platform
      await supabase.from('banned_users').insert({
        user_id: userId,
        reason: 'CRITICAL_CONTENT_VIOLATION',
        permanent: true
      });
      
      // Notify all users this person is banned
      await supabase.channel(`chat:${streamId}`).send({
        type: 'broadcast',
        event: 'user_banned',
        payload: { userId, reason: 'Terms violation' }
      });
      
      alert('Your account has been permanently banned for violating terms of service.');
      window.location.href = '/';
      return;
    }
    
    // Regular moderation
    const cleaned = cleanMessage(messageInput);
    const wasModerated = cleaned !== messageInput;
    
    if (wasModerated) {
      setWarnings(prev => prev + 1);
      if (warnings >= 2) {
        alert('Too many violations. One more and you will be banned.');
      }
    }
    
    // Send the message
    try {
      await supabase.channel(`chat:${streamId}`).send({
        type: 'broadcast',
        event: 'message',
        payload: {
          id: Date.now(),
          text: cleaned,
          user: username || 'Anonymous',
          timestamp: new Date().toISOString(),
          moderated: wasModerated
        }
      });
      
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // BANNED USER UI
  if (isBanned) {
    return (
      <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '2px solid #ef4444',
        borderRadius: '20px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#ef4444' }}>🚫 Account Banned</h3>
        <p style={{ color: '#f87171' }}>
          You have been permanently banned for violating our terms of service.
        </p>
        <p style={{ color: '#f87171', fontSize: '12px' }}>
          This action cannot be reversed.
        </p>
      </div>
    );
  }

  // NORMAL CHAT UI
  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '20px',
      padding: '20px',
      height: '400px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '15px',
        paddingBottom: '10px',
        borderBottom: '1px solid rgba(59, 130, 246, 0.1)'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'white',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          💬 Live Chat
          {isConnected && (
            <span style={{
              width: '8px',
              height: '8px',
              background: '#10b981',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
          )}
        </h3>
        
        {warnings > 0 && (
          <span style={{
            fontSize: '12px',
            color: '#f59e0b',
            background: 'rgba(245, 158, 11, 0.2)',
            padding: '4px 8px',
            borderRadius: '12px'
          }}>
            ⚠️ Warnings: {warnings}/3
          </span>
        )}
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: '15px',
        paddingRight: '5px'
      }}>
        {messages.length === 0 ? (
          <div style={{
            color: '#64748b',
            textAlign: 'center',
            padding: '40px 20px'
          }}>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>
              No messages yet
            </p>
            <p style={{ fontSize: '14px' }}>
              Be the first to say hello! 👋
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg.id || index}
              style={{
                marginBottom: '8px',
                padding: '10px 12px',
                background: msg.moderated
                  ? 'rgba(245, 158, 11, 0.1)'
                  : 'rgba(15, 23, 42, 0.5)',
                borderRadius: '12px',
                border: msg.moderated
                  ? '1px solid rgba(245, 158, 11, 0.2)'
                  : '1px solid transparent',
                animation: 'slideIn 0.3s ease'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px'
              }}>
                <span style={{
                  fontWeight: '600',
                  color: '#3b82f6',
                  fontSize: '14px'
                }}>
                  {msg.user}
                </span>
                {msg.moderated && (
                  <span
                    style={{
                      fontSize: '10px',
                      color: '#f59e0b',
                      background: 'rgba(245, 158, 11, 0.2)',
                      padding: '2px 6px',
                      borderRadius: '8px'
                    }}
                    title="Message was moderated"
                  >
                    moderated
                  </span>
                )}
                <span style={{
                  fontSize: '11px',
                  color: '#64748b',
                  marginLeft: 'auto'
                }}>
                  {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                margin: 0,
                fontSize: '14px',
                wordBreak: 'break-word',
                lineHeight: '1.4'
              }}>
                {msg.text}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value.slice(0, 200))}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={
            !isConnected 
              ? "Connecting..." 
              : warnings >= 2 
              ? "⚠️ Final warning - be respectful" 
              : "Type a message..."
          }
          disabled={!isConnected}
          maxLength={200}
          style={{
            flex: 1,
            padding: '10px 15px',
            background: 'rgba(15, 23, 42, 0.5)',
            border: warnings >= 2 
              ? '1px solid rgba(245, 158, 11, 0.5)'
              : '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '10px',
            color: 'white',
            fontSize: '14px',
            outline: 'none',
            transition: 'border 0.2s'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!messageInput.trim() || !isConnected}
          style={{
            padding: '10px 24px',
            background: !messageInput.trim() || !isConnected
              ? 'rgba(75, 85, 99, 0.5)'
              : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: !messageInput.trim() || !isConnected 
              ? 'not-allowed' 
              : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Send
        </button>
      </div>

      {/* Character count */}
      <div style={{
        marginTop: '5px',
        fontSize: '11px',
        color: '#64748b',
        textAlign: 'right'
      }}>
        {messageInput.length}/200
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}