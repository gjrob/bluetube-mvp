// ===== /pages/api/jobs/complete.js =====
// Mark job as completed and release payment
import { withAuth } from '../../../lib/auth-middleware'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default withAuth(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { jobId, rating, review } = req.body
  const supabase = createServerSupabaseClient({ req, res })
  const userId = req.user.id

  try {
    // Get job details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select(`
        *,
        proposals (
          *,
          pilot_id
        )
      `)
      .eq('id', jobId)
      .single()

    if (jobError) throw jobError

    // Verify the user is the job owner
    if (job.client_id !== userId) {
      return res.status(403).json({ error: 'Forbidden - Not job owner' })
    }

    // Get accepted proposal
    const acceptedProposal = job.proposals.find(p => p.status === 'accepted')
    if (!acceptedProposal) {
      return res.status(400).json({ error: 'No accepted proposal found' })
    }

    // Update job status
    const { error: updateJobError } = await supabase
      .from('jobs')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId)

    if (updateJobError) throw updateJobError

    // Create payment transaction for pilot
    const { error: pilotPaymentError } = await supabase
      .from('transactions')
      .insert({
        user_id: acceptedProposal.pilot_id,
        type: 'job_payment',
        amount: acceptedProposal.bid_amount * 0.85, // 15% platform fee
        description: `Payment for job: ${job.title}`,
        job_id: jobId,
        status: 'completed'
      })

    if (pilotPaymentError) throw pilotPaymentError

    // Update pilot earnings
    const { error: updatePilotError } = await supabase.rpc(
      'increment_pilot_earnings',
      { 
        pilot_id: acceptedProposal.pilot_id,
        amount: acceptedProposal.bid_amount * 0.85
      }
    )

    if (updatePilotError) throw updatePilotError

    // Add review if provided
    if (rating) {
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          job_id: jobId,
          pilot_id: acceptedProposal.pilot_id,
          client_id: userId,
          rating,
          comment: review || null
        })

      if (reviewError) throw reviewError

      // Update pilot rating
      await updatePilotRating(acceptedProposal.pilot_id, supabase)
    }

    return res.status(200).json({ 
      message: 'Job completed successfully!',
      payment: acceptedProposal.bid_amount * 0.85
    })

  } catch (error) {
    console.error('Complete job error:', error)
    return res.status(400).json({ error: error.message })
  }
})

// Helper function to update pilot rating
async function updatePilotRating(pilotId, supabase) {
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('pilot_id', pilotId)

  if (reviews && reviews.length > 0) {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    
    await supabase
      .from('pilot_profiles')
      .update({ 
        rating: avgRating,
        total_reviews: reviews.length
      })
      .eq('user_id', pilotId)
  }
}
