import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { payment_intent_id, job_id } = req.body

    if (!payment_intent_id || !job_id) {
      return res.status(400).json({ error: 'payment_intent_id and job_id required' })
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id)
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' })
    }

    // Update job status to active
    const { data: updatedJob, error: updateError } = await supabase
      .from('jobs')
      .update({
        status: 'open',
        posting_fee_paid: true
      })
      .eq('id', job_id)
      .select()
      .single()

    if (updateError) throw updateError

    // Record the transaction
    await supabase
      .from('transactions')
      .insert({
        transaction_type: 'job_posting_fee',
        client_pilot_id: updatedJob.client_pilot_id,
        total_amount: paymentIntent.amount / 100,
        platform_fee: paymentIntent.amount / 100,
        pilot_payout: 0,
        commission_rate: 1.00, // 100% to platform for posting fees
        stripe_payment_intent_id: payment_intent_id,
        payment_status: 'completed',
        description: `Job posting fee for: ${updatedJob.title}`
      })

    res.json({
      success: true,
      job: updatedJob,
      message: 'Job posted successfully and is now live!'
    })

  } catch (error) {
    console.error('Job confirmation error:', error)
    res.status(500).json({ error: 'Failed to confirm job posting' })
  }
}