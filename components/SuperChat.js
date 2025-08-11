import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Zap, Gift, Star, Crown } from 'lucide-react';

const SuperChat = ({ streamId, creatorAddress, currentUser, isLive }) => {
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [recentSuperChats, setRecentSuperChats] = useState([]);
    const [mounted, setMounted] = useState(false);

    // Tier thresholds for different visual effects
    const tiers = [
        { min: 0, max: 5, color: '#3b82f6', icon: DollarSign, name: 'Support' },
        { min: 5, max: 20, color: '#10b981', icon: Zap, name: 'Power' },
        { min: 20, max: 50, color: '#8b5cf6', icon: Gift, name: 'Premium' },
        { min: 50, max: 100, color: '#f59e0b', icon: Star, name: 'Elite' },
        { min: 100, max: Infinity, color: '#ef4444', icon: Crown, name: 'Legend' }
    ];
    
    // Check if we're in the browser
    const isClient = typeof window !== 'undefined';
    
    // User configuration - safe for SSR
    const [currentPilotName, setCurrentPilotName] = useState('BlueTubeTV Pilot');
    const [userId, setUserId] = useState('');
    
    // Handle client-side operations after mount
    useEffect(() => {
        setMounted(true);
        if (isClient) {
            const storedPilotName = localStorage.getItem('pilotName');
            if (storedPilotName) {
                setCurrentPilotName(storedPilotName);
            } else {
                localStorage.setItem('pilotName', 'BlueTubeTV Pilot');
            }
            
            const storedUserId = localStorage.getItem('userId');
            if (storedUserId) {
                setUserId(storedUserId);
            } else {
                const newUserId = `user-${Date.now()}`;
                localStorage.setItem('userId', newUserId);
                setUserId(newUserId);
            }
        }
    }, [isClient]);
    
    const getTier = (amountValue) => {
        const numAmount = parseFloat(amountValue);
        return tiers.find(tier => numAmount >= tier.min && numAmount < tier.max) || tiers[0];
    };

    const checkCritical = (text) => {
        const violations = ['spam', 'hate', 'violence'];
        const isCritical = violations.some(word => text.toLowerCase().includes(word));
        return { isCritical };
    };
    
    const sendSuperChat = async () => {
        if (!amount || parseFloat(amount) <= 0 || !message.trim()) {
            alert('Please enter a valid amount and message');
            return;
        }

        // Check for critical content
        const criticalCheck = checkCritical(message);
        if (criticalCheck.isCritical) {
            alert('Content violation detected. Transaction cancelled.');
            return;
        }
        
        setIsProcessing(true);
        
        try {
            // Process payment via API
            const res = await fetch('/api/super-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    message,
                    streamId,
                    pilotName: currentUser?.email || currentPilotName
                })
            });

            const result = await res.json();

            if (result.success) {
                const superChatData = {
                    id: Date.now(),
                    pilotName: currentPilotName,
                    userId: userId || `user-${Date.now()}`,
                    amount: parseFloat(amount),
                    message: message,
                    streamId: streamId,
                    creatorAddress: creatorAddress,
                    timestamp: new Date().toISOString(),
                    tier: getTier(amount)
                };
                
                await broadcastSuperChat(superChatData);
                
                setRecentSuperChats(prev => [superChatData, ...prev].slice(0, 5));
                
                // Clear form
                setAmount('');
                setMessage('');
                
                triggerCelebration(superChatData.tier);
            } else {
                throw new Error(result.error || 'Payment failed');
            }
        } catch (error) {
            console.error('SuperChat failed:', error);
            alert('Failed to send SuperChat. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };
    
    const processPayment = async (paymentAmount) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, transactionId: `tx-${Date.now()}` });
            }, 1000);
        });
    };
    
    const broadcastSuperChat = async (data) => {
        console.log('Broadcasting SuperChat:', data);
    };
    
    const triggerCelebration = (tier) => {
        console.log(`Celebrating ${tier.name} tier SuperChat!`);
        if (!mounted) {
            return;
        }
    };

    // Show loading state if not mounted yet
    if (!mounted) {
        return (
            <div style={{
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '20px',
                padding: '20px',
                color: 'white'
            }}>
                <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold', 
                    color: 'white', 
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <Zap style={{ marginRight: '8px', color: '#fbbf24' }} />
                    Loading SuperChat...
                </h3>
            </div>
        );
    }
    
    return (
        <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '20px',
            padding: '20px',
            color: 'white'
        }}>
            <h3 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: 'white', 
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Zap style={{ marginRight: '8px', color: '#fbbf24' }} />
                Send SuperChat
            </h3>
            
            {/* Amount Selection */}
            <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    color: '#94a3b8', 
                    marginBottom: '8px' 
                }}>
                    Amount ($)
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    {[5, 10, 20, 50, 100].map(preset => (
                        <button
                            key={preset}
                            onClick={() => setAmount(preset.toString())}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                background: amount === preset.toString() 
                                    ? 'linear-gradient(135deg, #3b82f6, #60a5fa)' 
                                    : 'rgba(30, 41, 59, 0.5)',
                                color: 'white',
                                border: amount === preset.toString()
                                    ? 'none'
                                    : '1px solid rgba(59, 130, 246, 0.3)',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.2s'
                            }}
                        >
                            ${preset}
                        </button>
                    ))}
                </div>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Custom amount"
                    style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(15, 23, 42, 0.5)',
                        color: 'white',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                    }}
                    min="1"
                    step="0.01"
                />
            </div>
            
            {/* Message Input */}
            <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    color: '#94a3b8', 
                    marginBottom: '8px' 
                }}>
                    Message (max 200 chars)
                </label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 200))}
                    placeholder="Say something awesome..."
                    style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(15, 23, 42, 0.5)',
                        color: 'white',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        resize: 'none',
                        outline: 'none',
                        fontFamily: 'inherit'
                    }}
                    rows="3"
                />
                <div style={{ 
                    fontSize: '12px', 
                    color: '#64748b', 
                    marginTop: '4px' 
                }}>
                    {message.length}/200 characters
                </div>
            </div>
            
            {/* Preview */}
            {amount && message && (
                <div style={{
                    marginBottom: '16px',
                    padding: '12px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                    <div style={{ 
                        fontSize: '12px', 
                        color: '#94a3b8', 
                        marginBottom: '8px' 
                    }}>
                        Preview
                    </div>
                    <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                        <div style={{ marginTop: '2px', color: getTier(amount).color }}>
                            {React.createElement(getTier(amount).icon, { size: 20 })}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ 
                                fontWeight: '600', 
                                color: 'white',
                                marginBottom: '4px'
                            }}>
                                {currentPilotName} - ${amount}
                            </div>
                            <div style={{ 
                                fontSize: '14px', 
                                color: '#94a3b8' 
                            }}>
                                {message}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Send Button */}
            <button 
                onClick={sendSuperChat} 
                disabled={isProcessing || !amount || !message} 
                style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '50px',
                    fontWeight: '600',
                    fontSize: '16px',
                    border: 'none',
                    cursor: isProcessing || !amount || !message ? 'not-allowed' : 'pointer',
                    background: isProcessing || !amount || !message
                        ? 'rgba(75, 85, 99, 0.5)'
                        : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    color: isProcessing || !amount || !message
                        ? '#94a3b8'
                        : 'white',
                    transition: 'all 0.3s',
                    opacity: isProcessing || !amount || !message ? 0.7 : 1
                }}
            >
                {isProcessing ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg 
                            style={{ 
                                animation: 'spin 1s linear infinite', 
                                height: '20px', 
                                width: '20px', 
                                marginRight: '8px' 
                            }} 
                            viewBox="0 0 24 24"
                        >
                            <circle 
                                style={{ opacity: 0.25 }} 
                                cx="12" cy="12" r="10" 
                                stroke="currentColor" 
                                strokeWidth="4" 
                                fill="none"
                            />
                            <path 
                                style={{ opacity: 0.75 }} 
                                fill="currentColor" 
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                        Processing...
                    </span>
                ) : (
                    `Send SuperChat - $${amount || '0'}`
                )}
            </button>
            
            {/* Recent SuperChats */}
            {recentSuperChats.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                    <h4 style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#94a3b8', 
                        marginBottom: '12px' 
                    }}>
                        Recent SuperChats
                    </h4>
                    <AnimatePresence>
                        {recentSuperChats.map((chat) => (
                            <motion.div
                                key={chat.id}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                style={{
                                    marginBottom: '8px',
                                    padding: '8px',
                                    background: 'rgba(15, 23, 42, 0.5)',
                                    borderRadius: '8px'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                                    <div style={{ marginTop: '2px', color: chat.tier.color }}>
                                        {React.createElement(chat.tier.icon, { size: 16 })}
                                    </div>
                                    <div style={{ flex: 1, fontSize: '14px' }}>
                                        <span style={{ fontWeight: '600', color: 'white' }}>
                                            {chat.pilotName}
                                        </span>
                                        <span style={{ color: '#10b981', marginLeft: '8px' }}>
                                            ${chat.amount}
                                        </span>
                                        <div style={{ 
                                            color: '#94a3b8', 
                                            fontSize: '12px', 
                                            marginTop: '4px' 
                                        }}>
                                            {chat.message}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <style jsx>{`
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
};

export default SuperChat;