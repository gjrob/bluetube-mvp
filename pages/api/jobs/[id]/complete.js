// pages/api/jobs/[id]/complete.js
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  const { rating, review } = req.body
  
  const supabase = createPagesServerClient({ req, res })

  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    // Get job details with accepted bid
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select(`
        *,
        job_bids!inner (
          *,
          profiles:pilot_id (
            id,
            email,
            stripe_account_id
          )
        )
      `)
      .eq('id', id)
      .eq('job_bids.status', 'accepted')
      .single()

    if (jobError || !job) {
      return res.status(404).json({ error: 'Job not found or no accepted bid' })
    }

    // Verify the user is the job owner
    if (job.client_pilot_id !== user.id) {
      return res.status(403).json({ error: 'Only job owner can mark as complete' })
    }

    // Check if job is already completed
    if (job.status === 'completed') {
      return res.status(400).json({ error: 'Job is already completed' })
    }

    // Get the accepted bid
    const acceptedBid = job.job_bids[0]
    if (!acceptedBid) {
      return res.status(400).json({ error: 'No accepted bid found for this job' })
    }

    // Calculate platform fee (20% for regular, 25% for sponsored)
    const platformFeeRate = job.job_type === 'sponsored' ? 0.25 : 0.20
    const grossAmount = acceptedBid.bid_amount
    const platformFee = grossAmount * platformFeeRate
    const netAmount = grossAmount - platformFee

    // Start a Supabase transaction
    const { data: updatedJob, error: updateError } = await supabase
      .from('jobs')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    // Create payment transaction for pilot
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: acceptedBid.pilot_id,
        job_id: id,
        type: 'job_payment',
        amount: netAmount,
        description: `Payment for job: ${job.title}`,
        status: 'completed',
        metadata: {
          gross_amount: grossAmount,
          platform_fee: platformFee,
          platform_fee_rate: platformFeeRate,
          client_id: job.client_pilot_id
        }
      })
      .select()
      .single()

    if (txError) throw txError

    // Create a charge on the client's payment method
    // In production, you'd charge the client's saved payment method
    // For now, we'll assume the client has already paid into escrow

    // If pilot has Stripe account, initiate transfer (after 48 hour hold)
    if (acceptedBid.profiles?.stripe_account_id) {
      // Schedule transfer for 48 hours later
      const transferDate = new Date()
      transferDate.setHours(transferDate.getHours() + 48)

      // In production, use Stripe's transfer scheduling
      // For now, just record that it should happen
      await supabase
        .from('scheduled_transfers')
        .insert({
          pilot_id: acceptedBid.pilot_id,
          transaction_id: transaction.id,
          amount: netAmount,
          scheduled_for: transferDate.toISOString(),
          stripe_account_id: acceptedBid.profiles.stripe_account_id
        })
    }

    // Add review if provided
    if (rating) {
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          job_id: id,
          pilot_id: acceptedBid.pilot_id,
          client_id: user.id,
          rating: parseInt(rating),
          comment: review || null
        })

      if (reviewError) {
        console.error('Review error:', reviewError)
        // Don't fail the whole operation if review fails
      }

      // Update pilot's average rating
      await updatePilotRating(acceptedBid.pilot_id, supabase)
    }

    // Send notification to pilot (you can implement email/push notifications)
    // await sendPaymentNotification(acceptedBid.pilot_id, netAmount, job.title)

    return res.status(200).json({ 
      success: true,
      message: 'Job completed successfully!',
      payment: {
        gross_amount: grossAmount,
        platform_fee: platformFee,
        pilot_earnings: netAmount,
        payment_status: 'completed',
        available_after: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
      }
    })

  } catch (error) {
    console.error('Complete job error:', error)
    return res.status(500).json({ error: 'Failed to complete job' })
  }
}

// Helper function to update pilot rating
async function updatePilotRating(pilotId, supabase) {
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('pilot_id', pilotId)

  if (reviews && reviews.length > 0) {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    
    await supabase
      .from('profiles')
      .update({ 
        rating: avgRating,
        total_reviews: reviews.length
      })
      .eq('id', pilotId)
  }
}