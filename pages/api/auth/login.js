// pages/api/auth/login.js
import { createServerClient } from '../../../lib/supabase-server'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, password } = req.body

  try {
    const supabase = createServerClient({ req, res })

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Fetch user profile from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    // Determine user type from the profile
    let userType = null

    if (profile) {
      // Option 1: If you have a user_type column
      userType = profile.user_type || 'pilot' // Default to pilot if not set
      
      // Option 2: If you determine by other fields (e.g., is_pilot boolean)
      // userType = profile.is_pilot ? 'pilot' : 'client'
      
      // Option 3: Check metadata from auth
      // userType = data.user.user_metadata?.user_type || 'pilot'
    }

    return res.status(200).json({ 
      user: data.user,
      session: data.session,
      profile,
      userType
    })

  } catch (error) {
    console.error('Login error:', error)
    return res.status(400).json({ error: error.message })
  }
}