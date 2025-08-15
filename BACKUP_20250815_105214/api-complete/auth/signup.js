// ===== /pages/api/auth/signup.js =====
import { createServerClient } from '../../../lib/supabase-server'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, password, userType, fullName, companyName } = req.body

  try {
    const supabase = createServerClient({ req, res })

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_type: userType,
        }
      }
    })

    if (authError) throw authError

    // Create profile based on user type
    if (authData.user) {
      if (userType === 'pilot') {
        const { error: profileError } = await supabase
          .from('pilot_profiles')
          .insert({
            user_id: authData.user.id,
            full_name: fullName,
            email: email,
            verification_status: 'pending'
          })

        if (profileError) throw profileError
      } else if (userType === 'client') {
        const { error: profileError } = await supabase
          .from('client_profiles')
          .insert({
            user_id: authData.user.id,
            company_name: companyName || fullName,
            email: email,
            verification_status: 'pending'
          })

        if (profileError) throw profileError
      }
    }

    return res.status(200).json({ 
      message: 'Signup successful! Please check your email to verify your account.',
      user: authData.user 
    })

  } catch (error) {
    console.error('Signup error:', error)
    return res.status(400).json({ error: error.message })
  }
}