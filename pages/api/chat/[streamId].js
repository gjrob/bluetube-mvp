// pages/api/chat/[streamId].js
// In production, you'd use WebSockets or Server-Sent Events

const chatMessages = {};

export default function handler(req, res) {
  const { streamId } = req.query;
  
  if (req.method === 'GET') {
    // Get chat messages for stream
    const messages = chatMessages[streamId] || [];
    return res.status(200).json({ messages });
  }
  
  if (req.method === 'POST') {
    // Add new message
    const { user, message, isTip, amount } = req.body;
    
    if (!chatMessages[streamId]) {
      chatMessages[streamId] = [];
    }
    
    const newMessage = {
      id: Date.now(),
      user,
      message,
      isTip: isTip || false,
      amount: amount || 0,
      timestamp: new Date()
    };
    
    chatMessages[streamId].push(newMessage);
    
    // Keep only last 100 messages
    if (chatMessages[streamId].length > 100) {
      chatMessages[streamId] = chatMessages[streamId].slice(-100);
    }
    
    return res.status(200).json({ 
      success: true, 
      message: newMessage 
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}