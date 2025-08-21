// pages/api/stream/upload-url.js
import { envServer } from '../../lib/env-server';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const url = `https://api.cloudflare.com/client/v4/accounts/${envServer.CLOUDFLARE_ACCOUNT_ID}/stream/direct_upload`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${envServer.CLOUDFLARE_STREAM_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ maxDurationSeconds: 10800, timeoutSeconds: 600 }),
  });
  const j = await r.json();
  return j.success ? res.json({ uploadURL: j.result.uploadURL, uid: j.result.uid }) : res.status(500).json(j);
}
