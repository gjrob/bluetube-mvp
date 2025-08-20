export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { platform, streamId } = req.body || {};
  if (!platform || !streamId) return res.status(400).json({ error: 'platform and streamId required' });

  try {
    if (platform === 'livepeer') {
      if (!process.env.LIVEPEER_API_KEY) return res.status(400).json({ error: 'LIVEPEER_API_KEY not set' });
      const r = await fetch(`https://livepeer.studio/api/stream/${streamId}`, {
        headers: { Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}` },
      });
      if (!r.ok) return res.status(r.status).json({ error: `Livepeer ${r.status}` });
      const s = await r.json();
      return res.status(200).json({
        success: true,
        platform,
        streamId,
        isActive: !!s?.isActive,
        viewerCount: s?.viewerCount || 0,
        lastSeen: s?.lastSeen || null,
        playbackId: s?.playbackId || null,
        checkedAt: new Date().toISOString(),
      });
    }

    if (platform === 'mux') {
      if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
        return res.status(400).json({ error: 'MUX TOKEN env not set' });
      }
      const auth = Buffer.from(`${process.env.MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET}`).toString('base64');
      const r = await fetch(`https://api.mux.com/video/v1/live-streams/${streamId}`, {
        headers: { Authorization: `Basic ${auth}` },
      });
      if (!r.ok) return res.status(r.status).json({ error: `Mux ${r.status}` });
      const { data } = await r.json();
      return res.status(200).json({
        success: true,
        platform,
        streamId,
        isActive: data.status === 'active',
        viewerCount: 0, // Mux doesn’t expose live viewer count directly
        playbackId: data.playback_ids?.[0]?.id || null,
        checkedAt: new Date().toISOString(),
      });
    }

    if (platform === 'cloudflare') {
      if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_API_TOKEN) {
        return res.status(400).json({ error: 'Cloudflare env not set' });
      }
      const r = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs/${streamId}`,
        { headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}` } }
      );
      if (!r.ok) return res.status(r.status).json({ error: `Cloudflare ${r.status}` });
      const { result } = await r.json();
      return res.status(200).json({
        success: true,
        platform,
        streamId,
        isActive: !!result?.status?.state && result.status.state !== 'ended',
        viewerCount: 0,
        checkedAt: new Date().toISOString(),
      });
    }

    return res.status(400).json({ error: 'Unsupported platform' });
  } catch (e) {
    console.error('status error:', e);
    return res.status(500).json({ error: 'internal_error' });
  }
}
