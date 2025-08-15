// utils/supabase-server.js - Fixed version
import { createClient } from '@supabase/supabase-js'

// Ensure environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://akphnfsulfzhrzdsvhla.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || ''

// Only create client if we have a URL
let supabase = null

if (supabaseUrl) {
  // For server-side, use service key if available, otherwise use anon key
  const supabaseKey = supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  if (supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
}

// Export a function to get the client
export const getSupabaseServer = () => {
  if (!supabase) {
    console.warn('Supabase server client not initialized. Check environment variables.')
    // Return a mock object to prevent crashes
    return {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null })
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null })
      }
    }
  }
  return supabase
}

// For backward compatibility
export { supabase }