// pages/api/create-subscription.js
// BlueTubeTV Subscription API with Coupon Support

import Stripe from 'stripe';
import supabase from '../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tier, userId, couponCode } = req.body;

  const tiers = {
    hobby: {
      price: 0,
      product_id: null,
      features: ['720p streaming', '10% platform fee', 'Basic analytics']
    },
    pro: {
      price: 2900, // $29 in cents
      product_id: process.env.STRIPE_PRO_PRODUCT,
      features: ['1080p streaming', '5% platform fee', 'Advanced analytics', 'Priority support']
    },
    enterprise: {
      price: 29900, // $299 in cents
      product_id: process.env.STRIPE_ENTERPRISE_PRODUCT,
      features: ['4K streaming', '2% platform fee', 'API access', 'White label', 'Dedicated manager']
    }
  };

  try {
    // Handle free hobby tier
    if (tier === 'hobby') {
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { subscription_tier: 'hobby' }
      });
      return res.json({ success: true });
    }

    // Get user profile for Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Create or get Stripe customer
    let customerId = profile?.stripe_customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email,
        metadata: { userId }
      });
      customerId = customer.id;

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }

    // Build checkout session config
    const sessionConfig = {
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: tiers[tier].product_id,
        quantity: 1
      }],
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
      metadata: {
        userId,
        tier
      },
      subscription_data: {
        trial_period_days: 7,
        metadata: { userId, tier }
      }
    };

    // Apply coupon if provided
    if (couponCode) {
      // Validate coupon exists
      try {
        await stripe.coupons.retrieve(couponCode);
        sessionConfig.discounts = [{
          coupon: couponCode
        }];
      } catch (error) {
        // If coupon doesn't exist, create common ones
        const commonCoupons = {
          'FOUNDER50': { percent_off: 50, duration: 'forever' },
          'EARLY30': { percent_off: 30, duration: 'repeating', duration_in_months: 3 },
          'LAUNCH25': { percent_off: 25, duration: 'once' }
        };

        if (commonCoupons[couponCode.toUpperCase()]) {
          const config = commonCoupons[couponCode.toUpperCase()];
          try {
            await stripe.coupons.create({
              id: couponCode.toUpperCase(),
              ...config
            });
            sessionConfig.discounts = [{
              coupon: couponCode.toUpperCase()
            }];
          } catch (createError) {
            // Coupon might already exist or invalid
            console.log('Coupon issue:', createError.message);
          }
        }
      }
    }

    // Check for automatic discounts
    if (profile?.is_founder && !couponCode) {
      sessionConfig.discounts = [{
        coupon: 'FOUNDER50'
      }];
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({ url: session.url });

  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: error.message });
  }
}