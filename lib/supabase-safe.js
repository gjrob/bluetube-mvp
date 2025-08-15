import { createClient } from '@supabase/supabase-js';

// Fallback values to prevent build errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Only create client if we have real values
let supabase = null;

if (supabaseUrl !== 'https://placeholder.supabase.co') {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase not configured - using placeholder');
  // Create a mock client to prevent errors
  supabase = {
    auth: {
      signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signIn: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signOut: async () => ({ data: null, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: new Error('Supabase not configured') }),
      update: () => ({ data: null, error: new Error('Supabase not configured') }),
      delete: () => ({ data: null, error: new Error('Supabase not configured') }),
    }),
  };
}

export default supabase;
