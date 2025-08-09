import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ===== STEP 2: Create /lib/auth-middleware.js =====
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export const withAuth = (handler) => {
  return async (req, res) => {
    const supabase = createServerSupabaseClient({ req, res })
    
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized - Please login' })
    }

    // Add user to request
    req.user = session.user
    
    return handler(req, res)
  }
}