import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,  // ✅ Supabase project URL
  process.env.SUPABASE_SERVICE_KEY,      // ✅ service_role secret from .env
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export default supabaseAdmin;
