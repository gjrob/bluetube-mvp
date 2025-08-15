// pages/api/jobs/[id].js
// API ROUTE - NO REACT COMPONENTS ALLOWED!
import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const { data: job, error } = await supabase
        .from('jobs')
        .select(`
          *,
          client_profiles (
            company_name,
            email,
            verification_status
          ),
          proposals (
            *,
            pilot_profiles (
              full_name,
              email,
              hourly_rate,
              certifications,
              rating
            )
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      if (!job) return res.status(404).json({ error: 'Job not found' })

      return res.status(200).json({ job })

    } catch (error) {
      console.error('Get job error:', error)
      return res.status(400).json({ error: error.message })
    }
  }

  if (req.method === 'PUT') {
    try {
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      // Verify ownership
      const { data: existingJob } = await supabase
        .from('jobs')
        .select('client_id')
        .eq('id', id)
        .single()

      if (!existingJob || existingJob.client_id !== user.id) {
        return res.status(403).json({ error: 'Forbidden' })
      }

      // Update job
      const updates = req.body
      const { data: job, error } = await supabase
        .from('jobs')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return res.status(200).json({ job })

    } catch (error) {
      console.error('Update job error:', error)
      return res.status(400).json({ error: error.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}