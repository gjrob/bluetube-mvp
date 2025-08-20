// pages/api/proposals/index.js
import { createServerClient } from '../../../lib/supabase-server'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
        console.log('Raw request body:', req.body)

    const supabase = createServerClient({ req, res })

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const {

      job_id,
      bid_amount,
      cover_letter,
      estimated_duration,
      availability_date
    } = req.body
     console.log('Received data:', req.body)

    // Validate required fields
    if (!job_id || !bid_amount || !cover_letter) {
      return res.status(400).json({ error: 'Missing required fields: job_id, bid_amount, cover_letter' })
    }
    console.log('About to insert proposal:', cover_letter)

    // Check if pilot has already submitted a proposal
    const { data: existing } = await supabase
      .from('proposals')
      .select('id')
      .eq('job_id', job_id)
      .eq('pilot_id', user.id)
      .single()

    if (existing) {
      return res.status(400).json({ error: 'You have already submitted a proposal for this job' })
    }

    // Get job details to validate bid
    const { data: job } = await supabase
      .from('jobs')
      .select('budget, status')
      .eq('id', job_id)
      .single()

    if (!job || job.status !== 'open') {
      return res.status(400).json({ error: 'Job is not available for proposals' })
    }

    // Create proposal - using the correct table name
const { data: proposal, error } = await supabase
  .from('job_bids')
  .insert({
    job_id,
    pilot_id: user.id,
    bid_amount: parseFloat(bid_amount),
    proposal: cover_letter,  // ✅ ADD THIS LINE!
    status: 'pending'
  })
  .select()
  .single()

    if (error) throw error

    return res.status(201).json({ 
      proposal,
      message: 'Proposal submitted successfully!' 
    })

  } catch (error) {
    console.error('Create proposal error:', error)
    return res.status(400).json({ error: error.message })
  }
}