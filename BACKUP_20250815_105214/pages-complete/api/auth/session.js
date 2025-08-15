// pages/api/auth/session.js
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = createServerSupabaseClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return res.status(200).json({ user: null })
  }

  // Get user profile
  let profile = null
  let userType = null

  // Check pilot profile
  const { data: pilotProfile } = await supabase
    .from('pilot_profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  if (pilotProfile) {
    profile = pilotProfile
    userType = 'pilot'
  } else {
    // Check client profile
    const { data: clientProfile } = await supabase
      .from('client_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (clientProfile) {
      profile = clientProfile
      userType = 'client'
    }
  }

  return res.status(200).json({
    user: session.user,
    profile,
    userType,
    session
  })
}