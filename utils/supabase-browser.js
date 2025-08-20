// utils/supabase-browser.js
import { createClient } from '@supabase/supabase-js';

let _browserClient = null;

export function getSupabaseBrowser() {
  if (typeof window === 'undefined') return null; // only in the browser

  if (_browserClient) return _browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    console.warn('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY for browser client');
    return null;
  }

  _browserClient = createClient(url, anon);
  return _browserClient;
}
