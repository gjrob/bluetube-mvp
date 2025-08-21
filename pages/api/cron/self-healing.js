// pages/api/cron/self-healing.js
import { supabaseAdmin } from '../../../lib/supabase-admin.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // lightweight heartbeat so you can see cron is alive
  await supabaseAdmin.from('self_healing_logs').insert({
    issue: 'cron_kick',
    metrics: { source: 'vercel_cron' },
    status: 'noop'
  });

  // Don’t block; you can shell out to node if on a VM,
  // or simply duplicate a minimal on-request check here if needed.
  return res.json({ ok: true });
}
