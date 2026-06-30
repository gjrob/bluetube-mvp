// utils/supabase-browser.js
import { supabase } from '../lib/supabaseClient';

export function getSupabaseBrowser() {
  if (typeof window === 'undefined') return null; // only in the browser
  return supabase;
}
