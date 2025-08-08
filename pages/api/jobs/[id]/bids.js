import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  const { id: jobId } = req.query

  if (req.method === 'GET') {
    return handleGetBids(req, res, jobId)
  }
  
  if (req.method === 'POST') {
    return handleCreateBid(req, res, jobId)
  }
  
  return res.status(405).json({ error: 'Method not allowed' })
}

// GET /api/jobs/[id]/bids - Get all bids for a job
async function handleGetBids(req, res, jobId) {
  try {
    const { data: bids, error } = await supabase
      .from('job_bids')
      .select(`
        id,
        proposal,
        bid_amount,
        estimated_completion_days,
        portfolio_links,
        status,
        created_at,
        pilot_id
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Get pilot info for each bid (without sensitive data)
    const bidsWithPilotInfo = await Promise.all(
      (bids || []).map(async (bid) => {
        const { data: pilot } = await supabase
          .from('pilot_certifications')
          .select('pilot_id, rating, completed_jobs')
          .eq('pilot_id', bid.pilot_id)
          .single()

        return {
          ...bid,
          pilot_info: pilot || { rating: 0, completed_jobs: 0 }
        }
      })
    )

    res.json({ bids: bidsWithPilotInfo })

  } catch (error) {
    console.error('Get bids error:', error)
    res.status(500).json({ error: 'Failed to fetch bids' })
  }
}

// POST /api/jobs/[id]/bids - Submit a bid
async function handleCreateBid(req, res, jobId) {
  try {
    const {
      pilot_id,
      proposal,
      bid_amount,
      estimated_completion_days,
      portfolio_links = []
    } = req.body

    // Validation
    if (!pilot_id || !proposal || !bid_amount) {
      return res.status(400).json({ 
        error: 'Missing required fields: pilot_id, proposal, bid_amount' 
      })
    }

    if (bid_amount < 25) {
      return res.status(400).json({ error: 'Minimum bid amount is $25' })
    }

    // Check if job exists and is open
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id, status, client_pilot_id, budget')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      return res.status(404).json({ error: 'Job not found' })
    }

    if (job.status !== 'open') {
      return res.status(400).json({ error: 'Job is not accepting bids' })
    }

    // Prevent client from bidding on their own job
    if (job.client_pilot_id === pilot_id) {
      return res.status(400).json({ error: 'Cannot bid on your own job' })
    }

    // Check if pilot already has a bid on this job
    const { data: existingBid } = await supabase
      .from('job_bids')
      .select('id')
      .eq('job_id', jobId)
      .eq('pilot_id', pilot_id)
      .single()

    if (existingBid) {
      return res.status(400).json({ error: 'You have already submitted a bid for this job' })
    }

    // Verify pilot exists and has active subscription
    const { data: pilot, error: pilotError } = await supabase
      .from('pilot_certifications')
      .select('pilot_id, listing_tier, listing_active')
      .eq('pilot_id', pilot_id)
      .single()

    if (pilotError || !pilot) {
      return res.status(404).json({ error: 'Pilot not found' })
    }

    if (!pilot.listing_active && pilot.listing_tier === 'free') {
      return res.status(403).json({ 
        error: 'Active subscription required to bid on jobs. Please upgrade your plan.' 
      })
    }

    // Create the bid
    const { data: newBid, error: bidError } = await supabase
      .from('job_bids')
      .insert({
        job_id: parseInt(jobId),
        pilot_id,
        proposal,
        bid_amount: parseFloat(bid_amount),
        estimated_completion_days: estimated_completion_days ? parseInt(estimated_completion_days) : null,
        portfolio_links: Array.isArray(portfolio_links) ? portfolio_links : []
      })
      .select()
      .single()

    if (bidError) throw bidError

    res.json({
      success: true,
      bid: newBid,
      message: 'Bid submitted successfully!'
    })

  } catch (error) {
    console.error('Create bid error:', error)
    res.status(500).json({ error: 'Failed to submit bid' })
  }
}