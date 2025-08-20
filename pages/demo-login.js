export const runtime = 'nodejs';

export default function handler(req, res) {
  // 2 hours demo window
  const twoHours = 2 * 60 * 60;
  res.setHeader('Set-Cookie', [
    `DEMO_MODE=1; Path=/; Max-Age=${twoHours}; SameSite=Lax; HttpOnly`,
  ]);
  res.status(200).json({ ok: true });
}
