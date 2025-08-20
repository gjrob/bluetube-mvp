// lib/supabase-safe.js
import { createClient } from '@supabase/supabase-js';

let _server = null;
let _browser = null;
let _publicShim = null;

/** Server-only client (API routes, getServerSideProps). 
 *  Uses SERVICE role if provided, otherwise ANON. */
export function getSupabaseServer() {
  if (typeof window !== 'undefined') {
    throw new Error('getSupabaseServer() must be called on the server');
  }
  if (_server) return _server;

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  const anon =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = service || anon;

  if (!url || !key) {
    throw new Error(
      'Supabase server env missing: need SUPABASE_URL (+ SERVICE or ANON key)',
    );
  }

  _server = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _server;
}

/** Back-compat alias (your older code may import this name). */
export function getSupabaseServerClient() {
  return getSupabaseServer();
}

/** Browser-only client (React components). */
export function getSupabaseBrowser() {
  if (typeof window === 'undefined') return null;
  if (_browser) return _browser;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    console.warn(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY for browser client',
    );
    return null;
  }

  _browser = createClient(url, anon);
  return _browser;
}

/** Public anon shim for legacy imports: `import supabase from '.../supabase-safe'` */
function makePublicClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error(
      'Supabase public env missing: NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY',
    );
  }

  return createClient(url, anon, {
    auth: {
      persistSession: typeof window !== 'undefined',
      autoRefreshToken: typeof window !== 'undefined',
    },
  });
}

const supabase = new Proxy(
  {},
  {
    get(_t, prop) {
      if (!_publicShim) _publicShim = makePublicClient();
      return _publicShim[prop];
    },
  },
);

// Quick env probe (no secrets)
export function assertSupabaseEnv() {
  return {
    urlPresent:
      !!process.env.NEXT_PUBLIC_SUPABASE_URL || !!process.env.SUPABASE_URL,
    anonPresent:
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      !!process.env.SUPABASE_ANON_KEY,
    servicePresent:
      !!process.env.SUPABASE_SERVICE_ROLE_KEY ||
      !!process.env.SUPABASE_SERVICE_KEY,
  };
}

// Legacy named + default exports
export { supabase };
export default supabase;
