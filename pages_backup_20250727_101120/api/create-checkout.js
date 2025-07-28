// pages/api/create-checkout.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { amount, pilotName } = req.body;
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Tip to ${pilotName}`,
            description: 'Support your favorite drone pilot on BlueTubeTV'
          },
          unit_amount: amount * 100, // Convert to cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?amount=${amount}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/live`,
    });
    
    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}