import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { pilotId, tierId } = req.body

  if (!pilotId || !tierId) {
    return res.status(400).json({ error: 'pilotId and tierId required' })
  }

  const tiers = {
    1: { price: 35, name: 'basic' },
    2: { price: 75, name: 'pro' }, 
    3: { price: 150, name: 'premium' }
  }
  
  const tier = tiers[tierId]
  if (!tier) {
    return res.status(400).json({ error: 'Invalid tier ID' })
  }
  
  try {
    // Get pilot info from your existing table
    const { data: pilot, error: pilotError } = await supabase
      .from('pilot_certifications')
      .select('id, pilot_id')
      .eq('pilot_id', pilotId)
      .single()

    if (pilotError || !pilot) {
      return res.status(404).json({ error: 'Pilot not found' })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { 
            name: `BlueTubeTV ${tier.name.toUpperCase()} Plan`,
            description: `${tier.name} listing subscription for drone pilots` 
          },
          unit_amount: tier.price * 100,
          recurring: { interval: 'month' }
        },
        quantity: 1
      }],
      success_url: `${req.headers.origin}/dashboard?upgraded=true&tier=${tier.name}`,
      cancel_url: `${req.headers.origin}/pricing`,
      metadata: { 
        pilotId: pilotId,
        tier: tier.name,
        userId: pilot.id
      }
    })
    
    console.log(`Subscription session created for pilot ${pilotId}:`, session.id)
    
    res.json({ 
      sessionId: session.id,
      checkoutUrl: session.url,
      tier: tier.name,
      price: tier.price
    })
    
  } catch (error) {
    console.error('Subscription creation error:', error)
    res.status(500).json({ 
      error: 'Failed to create subscription session',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}