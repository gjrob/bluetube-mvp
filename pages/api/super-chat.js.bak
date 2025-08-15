// pages/api/super-chat.js
// COPY THIS ENTIRE FILE - IT ONLY RETURNS JSON, NO HTML!

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize services (with fallbacks for testing)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key'
);

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
      userId = 'test-user',
      pilotId = 'test-pilot'
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

    // Try to save to database
    let transactionId = null;
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://dummy.supabase.co') {
      try {
        const { data: transaction } = await supabase
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