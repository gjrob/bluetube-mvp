// Default export is required for Next.js API routes
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { streamKey, platform, streamId } = req.body || {};
  try {
    let isActive = false;
    let viewerCount = 0;

    if (platform === 'livepeer' && process.env.LIVEPEER_API_KEY && streamId) {
      // Best: check by streamId
      const r = await fetch(`https://livepeer.studio/api/stream/${streamId}`, {
        headers: { Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}` },
      });
      if (r.ok) {
        const s = await r.json();
        isActive = !!s?.isActive;
        viewerCount = s?.viewerCount || 0;
      }
    } else if (platform === 'mux' && process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET && streamId) {
      // You can add Mux status check here if needed
      isActive = true; // placeholder
    } else {
      // Manual / demo
      isActive = Math.random() > 0.5;
      viewerCount = Math.floor(Math.random() * 100);
    }

    return res.status(200).json({
      success: true,
      platform,
      streamKey,
      streamId: streamId || null,
      isActive,
      viewerCount,
      checkedAt: new Date().toISOString(),
    });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
