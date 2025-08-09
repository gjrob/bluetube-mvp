// pages/api/featured.js or pages/api/jobs/featured.js
import { createServerClient } from '../../lib/supabase-server'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = createServerClient({ req, res })

  try {
    // Get featured/sponsored jobs
    const { data: featuredJobs, error } = await supabase
      .from('jobs')
      .select(`
        *,
        client_profiles (
          company_name,
          verification_status
        ),
        job_bids(count)
      `)
      .eq('status', 'open')
      .in('job_type', ['sponsored', 'featured', 'premium', 'urgent'])
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error

    return res.status(200).json({ featuredJobs })

  } catch (error) {
    console.error('Get featured jobs error:', error)
    return res.status(400).json({ error: error.message })
  }
}