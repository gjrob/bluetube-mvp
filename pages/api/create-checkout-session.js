// pages/api/create-checkout-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-06-30.basil' });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body || {}; // optional when user not logged in
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID_PRO, quantity: 1 }],
      // collect email in Checkout if you don't have login:
      customer_email: email || undefined,
      // Always set local success/cancel when testing locally:
      success_url: appUrl ? `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}` : `/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: appUrl ? `${appUrl}/pricing` : `/pricing`,
      automatic_tax: { enabled: true },
    });

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (e) {
    console.error('create-checkout-session error', e);
    return res.status(400).json({ error: e.message });
  }
}
