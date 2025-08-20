// pages/api/health.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseServerClient, assertSupabaseEnv } from '../../lib/supabase-safe';
import { getSupabaseServer } from '../../utils/supabase-server';
export default async function handler(req, res) {
  try {
    const supabase = getSupabaseServer();
    const { error } = await supabase.from('user_profiles').select('count').limit(1);
    res.status(200).json({
      ok: !error,
      database: error ? 'ERROR' : 'CONNECTED',
      error: error?.message ?? null,
      routing: 'pages-router',
      ts: new Date().toISOString(),
    });
  } catch (e) {
    res.status(200).json({ ok: false, error: e.message });
  }
}
