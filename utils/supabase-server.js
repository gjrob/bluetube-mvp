// utils/supabase-server.js
import { createClient } from '@supabase/supabase-js'

/**
 * Create a Supabase client for server-side operations
 * This uses the service role key for admin privileges
 */
export function createServerClient(context) {
  // For server-side, we can use service role key for admin access
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables')
    // Return a mock client to prevent build failures
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: 'Supabase not configured' }),
        admin: {
          getUserById: async () => ({ data: null, error: 'Supabase not configured' })
        }
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: 'Supabase not configured' }),
            order: () => ({ data: [], error: null })
          })
        }),
        insert: async () => ({ data: null, error: 'Supabase not configured' }),
        update: async () => ({ data: null, error: 'Supabase not configured' }),
        delete: async () => ({ data: null, error: 'Supabase not configured' })
      })
    }
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Alternative export for compatibility
export function createServerSupabaseClient(context) {
  return createServerClient(context)
}

// Export default for some import styles
export default { createServerClient, createServerSupabaseClient }