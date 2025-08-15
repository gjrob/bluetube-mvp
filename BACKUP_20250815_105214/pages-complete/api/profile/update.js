import { withAuth } from '../../../lib/auth-middleware'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default withAuth(async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = createServerSupabaseClient({ req, res })
  const userId = req.user.id

  try {
    const updates = req.body

    // Determine which table to update
    const { data: pilotProfile } = await supabase
      .from('pilot_profiles')
      .select('id')
      .eq('user_id', userId)
      .single()

    let result
    if (pilotProfile) {
      // Update pilot profile
      result = await supabase
        .from('pilot_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()
    } else {
      // Update client profile
      result = await supabase
        .from('client_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()
    }

    if (result.error) throw result.error

    return res.status(200).json({ profile: result.data })

  } catch (error) {
    console.error('Profile update error:', error)
    return res.status(400).json({ error: error.message })
  }
})