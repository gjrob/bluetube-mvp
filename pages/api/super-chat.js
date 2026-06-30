// pages/api/super-chat.js
// COPY THIS ENTIRE FILE - IT ONLY RETURNS JSON, NO HTML!

import Stripe from 'stripe';
// Server-side money route: writes the RLS-protected transactions table, so it
// must use the service-role client (anon is blocked by RLS).
import supabaseAdmin from '../../lib/supabase-admin';

// Initialize services (with fallbacks for testing)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

// UUID guard — pilot_id / client_pilot_id are now uuid FKs to auth.users(id)
const isUuid = (s) =>
  typeof s === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

// Tier helper
function getTier(amount) {
  if (amount >= 1000) return 'red';
  if (amount >= 500) return 'orange';
  if (amount >= 100) return 'yellow';
  if (amount >= 50) return 'green';
  return 'blue';
}

// MAIN HANDLER - ONLY JSON RESPONSES!
export default async function handler(req, res) {
  // Set JSON content type
  res.setHeader('Content-Type', 'application/json');
  
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests accepted' 
    });
  }

  try {
    // Parse request body
    const { 
      amount = 25, 
      message = '', 
      streamId = 'test-stream',
      userId = null,
      pilotId = null
    } = req.body;

    // Validate amount
    if (amount < 5 || amount > 10000) {
      return res.status(400).json({ 
        error: 'Invalid amount',
        message: 'Amount must be between $5 and $10,000' 
      });
    }

    // Create Stripe payment intent
    let paymentIntent = null;
    let clientSecret = null;
    
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_dummy') {
      try {
        paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          metadata: {
            type: 'superchat',
            streamId: streamId,
            userId: userId,
            message: message,
            tier: getTier(amount)
          }
        });
        clientSecret = paymentIntent.client_secret;
      } catch (stripeError) {
        console.error('Stripe error:', stripeError);
        // Continue without Stripe in test mode
      }
    }

    // Try to save to database — only when we have real user/pilot UUIDs
    // (pilot_id / client_pilot_id are uuid FKs -> auth.users(id)).
    let transactionId = null;
    const canPersist = isUuid(userId) && isUuid(pilotId);
    if (!canPersist) {
      console.warn('super-chat: skipping DB save — userId/pilotId not valid UUIDs');
    }
    if (canPersist && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://dummy.supabase.co') {
      try {
        const { data: transaction } = await supabaseAdmin
          .from('transactions')
          .insert({
            transaction_type: 'superchat',
            total_amount: amount,
            platform_fee: amount * 0.30,
            pilot_payout: amount * 0.70,
            payment_status: paymentIntent ? 'pending' : 'test',
            description: message || `SuperChat $${amount}`,
            stripe_payment_intent_id: paymentIntent?.id || 'test_' + Date.now(),
            pilot_id: pilotId,
            client_pilot_id: userId,
            metadata: {
              tier: getTier(amount),
              streamId: streamId
            }
          })
          .select()
          .single();
        
        if (transaction) {
          transactionId = transaction.id;
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue without database
      }
    }

    // ALWAYS return JSON success
    return res.status(200).json({
      success: true,
      clientSecret: clientSecret,
      transactionId: transactionId,
      tier: getTier(amount),
      amount: amount,
      message: clientSecret 
        ? 'Payment intent created successfully!' 
        : 'Test mode - no payment processed',
      paymentIntentId: paymentIntent?.id || null
    });

  } catch (error) {
    console.error('SuperChat API error:', error);
    
    // ALWAYS return JSON for errors
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message || 'Failed to process SuperChat'
    });
  }
}

// NO MORE CODE AFTER THIS LINE!
// NO JSX!
// NO HTML!
// NO REACT COMPONENTS!
// ONLY THE HANDLER ABOVE!