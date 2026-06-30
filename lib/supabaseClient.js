import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

function makeClient() {
  return createClient(supabaseUrl || '', supabaseAnonKey || '', {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
}

let supabase;
if (typeof window === 'undefined') {
  supabase = makeClient();
} else {
  if (!window.__btvSupabase) window.__btvSupabase = makeClient();
  supabase = window.__btvSupabase;
}

export { supabase };
export default supabase;
