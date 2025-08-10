// pages/api/create-checkout.js

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    amount = 5, 
    pilotName = 'BlueTubeTV Pilot',
    message = 'Support the stream!',
    type = 'superchat' 
  } = req.body;

  try {
    // Get the correct base URL
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers['host'];
    const baseUrl = `${protocol}://${host}`;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: type === 'superchat' ? `SuperChat to ${pilotName}` : 'BlueTubeTV Purchase',
            description: message || 'Thank you for your support!'
          },
          unit_amount: Math.round(amount * 100)
        },
        quantity: 1
      }],
      mode: 'payment',
      // Use dynamic URLs that work in dev and production
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&amount=${amount}`,
      cancel_url: `${baseUrl}/live`,
      // Add metadata
      metadata: {
        type: type,
        amount: amount.toString(),
        pilotName: pilotName,
        message: message
      }
    });
    
    return res.status(200).json({ 
      url: session.url,
      sessionId: session.id 
    });
    
  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to create checkout session'
    });
  }
}
