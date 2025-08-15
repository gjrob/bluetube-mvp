// pages/api/jobs/featured.js
import supabase from '../../../lib/supabase'  // Fixed import

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch featured/sponsored jobs
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select(`
          *,
          client_profiles (
            company_name,
            email,
            verification_status
          )
        `)
        .eq('is_featured', true)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error

      return res.status(200).json({ jobs: jobs || [] })

    } catch (error) {
      console.error('Featured jobs error:', error)
      return res.status(500).json({ error: error.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}