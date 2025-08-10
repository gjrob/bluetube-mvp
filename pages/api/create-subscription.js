// pages/api/create-subscription.js - Stripe Subscription
import Stripe from 'stripe'
import { supabase } from '../../lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Create these products in Stripe Dashboard first!
const PRICES = {
  pro: process.env.STRIPE_PRICE_PRO || 'price_pro_monthly',
  elite: process.env.STRIPE_PRICE_ELITE || 'price_elite_monthly'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { tier, userId } = req.body

  try {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    // Create or get Stripe customer
    let customerId = profile.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email,
        metadata: {
          userId: userId,
          userType: 'pilot'
        }
      })
      customerId = customer.id

      // Save customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: PRICES[tier],
        quantity: 1
      }],
      metadata: {
        userId: userId,
        tier: tier
      },
      subscription_data: {
        metadata: {
          userId: userId,
          tier: tier
        },
        trial_period_days: 14 // Free trial
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/pilot/dashboard?subscription=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pilot/dashboard?subscription=cancelled`,
      
      // Apply founder discount
      discounts: profile.is_founder ? [{
        coupon: 'FOUNDER50' // Create this in Stripe
      }] : []
    })

    return res.status(200).json({ checkoutUrl: session.url })

  } catch (error) {
    console.error('Subscription error:', error)
    return res.status(500).json({ error: error.message })
  }
}

