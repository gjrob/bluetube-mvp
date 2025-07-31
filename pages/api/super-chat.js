// pages/api/super-chat.js
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, username, message, streamId } = req.body;
    
    // Validate amount (min $1, max $500)
    if (amount < 100 || amount > 50000) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Super Chat from ${username}`,
            description: message.substring(0, 200) || 'Support the pilot!'
          },
          unit_amount: amount
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/live?success=true&amount=${amount/100}`,
      cancel_url: `${req.headers.origin}/live?canceled=true`,
      metadata: {
        type: 'super_chat',
        streamId,
        username,
        message: message.substring(0, 200)
      }
    });

    res.json({
      checkoutUrl: session.url
    });

  } catch (error) {
    console.error('Super chat payment error:', error);
    res.status(500).json({ error: 'Payment failed' });
  }
}