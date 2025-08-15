export default async function handler(req, res) {
  // Check if stream is live
  
  return res.json({ 
    isLive: false,
    viewers: 0,
    duration: 0
  });
}