import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_KEY
)

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  console.log('Stripe webhook event:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        const { pilotId, tier } = session.metadata

        // Update pilot subscription status
        const { error: updateError } = await supabase
          .from('pilot_certifications')
          .update({
            listing_tier: tier,
            listing_active: true,
            stripe_subscription_id: session.subscription,
            next_billing_date: new Date(Date.now() + 30*24*60*60*1000) // 30 days from now
          })
          .eq('pilot_id', pilotId)

        if (updateError) {
          console.error('Failed to update pilot subscription:', updateError)
        } else {
          console.log(`Pilot ${pilotId} upgraded to ${tier} plan`)
        }
        break

      case 'invoice.payment_succeeded':
        // Handle successful recurring payment
        const invoice = event.data.object
        const subscriptionId = invoice.subscription

        // Update next billing date
        const { error: renewError } = await supabase
          .from('pilot_certifications')
          .update({
            next_billing_date: new Date(Date.now() + 30*24*60*60*1000),
            listing_active: true
          })
          .eq('stripe_subscription_id', subscriptionId)

        if (!renewError) {
          console.log(`Subscription ${subscriptionId} renewed successfully`)
        }
        break

      case 'invoice.payment_failed':
        // Handle failed payment
        const failedInvoice = event.data.object
        const failedSubscriptionId = failedInvoice.subscription

        const { error: failError } = await supabase
          .from('pilot_certifications')
          .update({
            listing_active: false
          })
          .eq('stripe_subscription_id', failedSubscriptionId)

        if (!failError) {
          console.log(`Subscription ${failedSubscriptionId} deactivated due to payment failure`)
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
}