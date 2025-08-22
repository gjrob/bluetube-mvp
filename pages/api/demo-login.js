// pages/api/demo-login.js
export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  res.setHeader('Set-Cookie', 'demo=1; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax; Secure');
  res.status(200).json({ ok: true });
}  
        
