// pages/api/tip.js - THIS FILE MAKES YOU MONEY!
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, streamerName } = req.body;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Tip for ${streamerName}`,
            description: 'Support your favorite drone pilot!',
            images: ['https://i.imgur.com/EHyR2nP.png'], // Add your logo
          },
          unit_amount: amount * 100, // Stripe uses cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?amount=${amount}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}`,
      metadata: {
        streamerName,
        tipAmount: amount
      },
      // TODO: Add this later when you have connected accounts
      // payment_intent_data: {
      //   application_fee_amount: Math.floor(amount * 100 * 0.20), // Your 20% cut
      //   transfer_data: {
      //     destination: 'STREAMER_STRIPE_ACCOUNT_ID',
      //   },
      // },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}