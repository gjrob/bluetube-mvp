// /lib/supabase.js
import { createClient } from '@supabase/supabase-js';
import { supabase as browserSingleton } from './supabaseClient';

const URL     = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON    = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

const isBrowser = () => typeof window !== 'undefined';

/** Browser/client factory — returns the shared singleton browser client */
export function getSupabaseBrowserClient() {
  return browserSingleton;
}

/** Server/API factory (no session persistence; prefer SERVICE key if present) */
export function getSupabaseServerClient() {
  if (!URL || !(SERVICE || ANON)) {
    console.warn('Missing Supabase server env (URL or keys)');
    return null;
  }
  const key = SERVICE || ANON;
  return createClient(URL, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/** Admin client (only if SERVICE key exists). NEVER import this in client code. */
export const supabaseAdmin = SERVICE ? createClient(URL, SERVICE) : null;

/** Legacy convenience export for client code */
export const supabase = isBrowser() ? browserSingleton : null;

/** Default export kept for compatibility with `import supabase from 'lib/supabase'` */
export default supabase;

