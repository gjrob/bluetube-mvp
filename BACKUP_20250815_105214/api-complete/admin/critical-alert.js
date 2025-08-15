// pages/api/admin/critical-alert.js
export default async function handler(req, res) {
  const { userId, content, severity } = req.body;
  
  if (severity === 'CRITICAL') {
    // Send immediate notification to admin
    // Email, SMS, Slack, whatever you use
    
    // Log to permanent record
    console.error('🚨 CRITICAL VIOLATION DETECTED:', {
      userId,
      content: '[REDACTED]',
      timestamp: new Date()
    });
  }
  
  res.json({ reported: true });
}