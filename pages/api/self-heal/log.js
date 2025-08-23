import { supabaseAdmin } from '@lib/supabase-admin'; // service role client

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const payload = req.body || {};
  try {
    await supabaseAdmin.from('self_healing_logs').insert({
      issue: payload.kind || 'client_report',
      metrics: payload,
      status: 'noop',
      note: 'client-reported'
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
