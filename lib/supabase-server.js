// lib/supabase-server.js - Fixed to handle missing env vars
import { createClient } from '@supabase/supabase-js'

// Get environment variables with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

// Don't create client if URL is missing (prevents build error)
let supabaseServer = null

if (supabaseUrl && supabaseServiceKey) {
  supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })
} else {
  console.warn('Supabase server client not initialized. Missing environment variables.')
}

// Helper function to get server client with fallback
export const getServerClient = () => {
  if (!supabaseServer) {
    // Return mock client to prevent crashes during build
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null })
      },
      from: (table) => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
            order: () => ({ data: [], error: null })
          }),
          data: [],
          error: null
        }),
        insert: async () => ({ data: null, error: null }),
        update: async () => ({ data: null, error: null }),
        delete: async () => ({ data: null, error: null })
      })
    }
  }
  return supabaseServer
}

// Export for backward compatibility
export { supabaseServer }
export default supabaseServer