import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { id: jobId } = req.query
    const { bid_id, client_pilot_id } = req.body

    if (!bid_id || !client_pilot_id) {
      return res.status(400).json({ error: 'bid_id and client_pilot_id required' })
    }

    // Verify client owns this job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('client_pilot_id, status, title, budget')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      return res.status(404).json({ error: 'Job not found' })
    }

    if (job.client_pilot_id !== client_pilot_id) {
      return res.status(403).json({ error: 'Unauthorized - not your job' })
    }

    if (job.status !== 'open') {
      return res.status(400).json({ error: 'Job is no longer accepting bids' })
    }

    // Get the accepted bid details
    const { data: acceptedBid, error: bidError } = await supabase
      .from('job_bids')
      .select('pilot_id, bid_amount, proposal')
      .eq('id', bid_id)
      .eq('job_id', jobId)
      .single()

    if (bidError || !acceptedBid) {
      return res.status(404).json({ error: 'Bid not found' })
    }

    // Update the accepted bid status
    const { error: updateBidError } = await supabase
      .from('job_bids')
      .update({ status: 'accepted' })
      .eq('id', bid_id)

    if (updateBidError) throw updateBidError

    // Reject all other bids
    const { error: rejectBidsError } = await supabase
      .from('job_bids')
      .update({ status: 'rejected' })
      .eq('job_id', jobId)
      .neq('id', bid_id)

    if (rejectBidsError) throw rejectBidsError

    // Update job status and assign pilot
    const { data: updatedJob, error: updateJobError } = await supabase
      .from('jobs')
      .update({
        status: 'in_progress',
        assigned_pilot_id: acceptedBid.pilot_id
      })
      .eq('id', jobId)
      .select()
      .single()

    if (updateJobError) throw updateJobError

    res.json({
      success: true,
      job: updatedJob,
      accepted_bid: acceptedBid,
      message: `Bid accepted! ${acceptedBid.pilot_id} is now assigned to this job.`
    })

  } catch (error) {
    console.error('Accept bid error:', error)
    res.status(500).json({ error: 'Failed to accept bid' })
  }
}