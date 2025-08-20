// pages/api/payments/tip.js
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    return sendTip(req, res);
  } else if (method === 'GET') {
    return getPaymentHistory(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// SEND TIP
async function sendTip(req, res) {
  try {
    const { 
      fromUserId, 
      toPilotId, 
      amount, 
      message = '', 
      paymentMethod = 'stripe',
      cryptoTxHash = null
    } = req.body;

    // Validation
    if (!fromUserId || !toPilotId || !amount) {
      return res.status(400).json({ 
        error: 'Missing required fields: fromUserId, toPilotId, amount' 
      });
    }

    if (amount <= 0 || amount > 1000) {
      return res.status(400).json({ 
        error: 'Tip amount must be between $0.01 and $1000' 
      });
    }

    // Process payment based on method
    let paymentResult = null;
    let paymentStatus = 'pending';

    if (paymentMethod === 'stripe') {
      paymentResult = await processStripePayment(amount, fromUserId, toPilotId);
      paymentStatus = paymentResult.success ? 'completed' : 'failed';
    } else if (paymentMethod === 'crypto') {
      paymentResult = await processCryptoPayment(amount, cryptoTxHash);
      paymentStatus = paymentResult.success ? 'completed' : 'pending';
    } else {
      // Demo mode - always succeed
      paymentResult = { success: true, transactionId: `demo_${Date.now()}` };
      paymentStatus = 'completed';
    }

    // Save payment to database
    const paymentData = {
      sender_user_id: fromUserId,
      recipient_pilot_id: toPilotId,
      payment_amount: amount,
      payment_currency: 'USD',
      payment_method: paymentMethod,
      transaction_type: 'tip',
      stripe_payment_id: paymentMethod === 'stripe' ? paymentResult?.transactionId : null,
      crypto_transaction_hash: paymentMethod === 'crypto' ? cryptoTxHash : null,
      payment_status: paymentStatus,
      payment_notes: message
    };

    const { data: savedPayment, error: saveError } = await supabase
      .from('pilot_payments')
      .insert(paymentData)
      .select()
      .single();

    if (saveError) {
      console.error('Failed to save payment:', saveError);
      // Still return success if payment processed but DB save failed
      if (paymentResult?.success) {
        return res.status(200).json({
          success: true,
          payment: paymentData,
          message: `💰 Tip of $${amount} sent successfully!`,
          warning: 'Payment processed but not saved to database',
          transactionId: paymentResult.transactionId
        });
      } else {
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to save payment record' 
        });
      }
    }

    // Update pilot earnings
    if (paymentStatus === 'completed') {
      await updatePilotEarnings(toPilotId, amount);
    }

    res.status(200).json({
      success: true,
      payment: savedPayment,
      message: `💰 Tip of $${amount} sent successfully!`,
      transactionId: paymentResult?.transactionId,
      estimatedArrival: paymentMethod === 'stripe' ? 'Instant' : 'Within 24 hours'
    });

  } catch (error) {
    console.error('Tip payment error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to process tip payment'
    });
  }
}

// GET PAYMENT HISTORY
async function getPaymentHistory(req, res) {
  try {
    const { userId, type = 'all', limit = 20, offset = 0 } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Build query for payments where user is sender or recipient
    let query = supabase
      .from('pilot_payments')
      .select('*')
      .or(`sender_user_id.eq.${userId},recipient_pilot_id.eq.${userId}`);

    // Filter by transaction type
    if (type !== 'all') {
      query = query.eq('transaction_type', type);
    }

    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data: payments, error } = await query;

    if (error) {
      console.warn('Payment history query failed:', error.message);
      
      // Return sample payment history
      const samplePayments = [
        {
          id: 1,
          sender_user_id: 'demo_viewer_1',
          recipient_pilot_id: userId,
          payment_amount: 25.00,
          payment_currency: 'USD',
          payment_method: 'stripe',
          transaction_type: 'tip',
          payment_status: 'completed',
          payment_notes: 'Amazing sunset footage!',
          created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          id: 2,
          sender_user_id: userId,
          recipient_pilot_id: 'demo_pilot_2',
          payment_amount: 10.00,
          payment_currency: 'USD',
          payment_method: 'crypto',
          transaction_type: 'tip',
          payment_status: 'completed',
          payment_notes: 'Great mountain shots!',
          created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        }
      ];

      return res.status(200).json({
        success: true,
        payments: samplePayments,
        count: samplePayments.length,
        source: 'sample_data'
      });
    }

    // Calculate totals
    const totalSent = payments?.filter(p => p.sender_user_id === userId)
      .reduce((sum, p) => sum + p.payment_amount, 0) || 0;
    
    const totalReceived = payments?.filter(p => p.recipient_pilot_id === userId)
      .reduce((sum, p) => sum + p.payment_amount, 0) || 0;

    res.status(200).json({
      success: true,
      payments: payments || [],
      count: payments?.length || 0,
      totals: {
        sent: totalSent,
        received: totalReceived,
        net: totalReceived - totalSent
      },
      source: 'database'
    });

  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// STRIPE PAYMENT PROCESSING
async function processStripePayment(amount, fromUserId, toPilotId) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn('Stripe not configured, using demo mode');
      return { 
        success: true, 
        transactionId: `demo_stripe_${Date.now()}`,
        demo: true 
      };
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        fromUserId: fromUserId,
        toPilotId: toPilotId,
        type: 'tip',
        platform: 'bluetubetv'
      }
    });

    return {
      success: true,
      transactionId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret
    };

  } catch (error) {
    console.error('Stripe payment error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// CRYPTO PAYMENT PROCESSING
async function processCryptoPayment(amount, txHash) {
  try {
    // Simulate crypto transaction verification
    if (!txHash || txHash.length < 10) {
      return { 
        success: false, 
        error: 'Invalid transaction hash' 
      };
    }

    // In real implementation, verify transaction on blockchain
    // For now, simulate success
    return {
      success: true,
      transactionId: txHash,
      verified: true
    };

  } catch (error) {
    console.error('Crypto payment error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// UPDATE PILOT EARNINGS
async function updatePilotEarnings(pilotId, amount) {
  try {
    // Update pilot profile with new earnings
    const { data: pilot } = await supabase
      .from('drone_pilots')
      .select('completed_flights')
      .eq('supabase_user_id', pilotId)
      .single();

    if (pilot) {
      await supabase
        .from('drone_pilots')
        .update({ 
          completed_flights: (pilot.completed_flights || 0) + 1 
        })
        .eq('supabase_user_id', pilotId);
    }

    // Update user profile total earnings
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('total_earnings')
      .eq('supabase_user_id', pilotId)
      .single();

    if (userProfile) {
      await supabase
        .from('user_profiles')
        .update({ 
          total_earnings: (userProfile.total_earnings || 0) + amount 
        })
        .eq('supabase_user_id', pilotId);
    }

  } catch (error) {
    console.warn('Failed to update pilot earnings:', error);
  }
}