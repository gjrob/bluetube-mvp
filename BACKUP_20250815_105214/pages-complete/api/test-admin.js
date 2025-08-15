export default function handler(req, res) {
  const { authorization } = req.headers;
  
  if (authorization === `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
    res.json({ success: true, message: 'Admin key works!' });
  } else {
    res.status(401).json({ error: 'Invalid admin key' });
  }
}