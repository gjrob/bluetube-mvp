// utils/supabase-server.js
import { createClient } from '@supabase/supabase-js';

let _serverClient = null;

export function getSupabaseServer() {
  // Hard guard: never used client-side
  if (typeof window !== 'undefined') {
    throw new Error('getSupabaseServer() must only be called on the server');
  }

  if (_serverClient) return _serverClient;

  // Prefer non-public env names for server code
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  const anon =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Use service role if present (server only), else anon
  const key = serviceKey || anon;

  if (!url || !key) {
    // In production: throw. In dev you can choose to return a harmless stub.
    throw new Error('Supabase env missing: SUPABASE_URL and a key (SERVICE or ANON) are required on the server');
  }

  _serverClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: { fetch }, // default fetch is fine on Node 18+/Vercel
  });

  return _serverClient;
}
