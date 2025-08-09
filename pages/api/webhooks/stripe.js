// pages/api/webhooks/stripe.js
import { buffer } from 'micro'
import Stripe from 'stripe'
import { supabaseAdmin } from '../../../lib/supabase-admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Disable body parsing, we need raw body for webhook verification
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    const buf = await buffer(req)
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object)
      break
    
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object)
      break
    
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.json({ received: true })
}

async function handlePaymentSuccess(paymentIntent) {
  const { metadata } = paymentIntent
  
  try {
    if (metadata.type === 'job_posting_fee') {
      // Update job status to 'open'
      const { data: jobs, error: jobError } = await supabaseAdmin
        .from('jobs')
        .update({ 
          status: 'open',
          posting_fee_paid: true,
          updated_at: new Date().toISOString()
        })
        .eq('client_pilot_id', metadata.client_pilot_id)
        .eq('status', 'pending_payment')
        .order('created_at', { ascending: false })
        .limit(1)
        .select()

      if (jobError) {
        console.error('Error updating job status:', jobError)
        return
      }

      console.log('Job activated:', jobs[0]?.id)

      // Update transaction if you're tracking them
      /*
      await supabaseAdmin
        .from('transactions')
        .update({ status: 'completed' })
        .eq('stripe_payment_intent_id', paymentIntent.id)
      */
    }
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailed(paymentIntent) {
  console.log('Payment failed:', paymentIntent.id)
  // Handle failed payments - maybe delete the job or notify user
}