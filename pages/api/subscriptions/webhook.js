// pages/api/subscriptions/webhook.js
import { buffer } from 'micro';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-06-30.basil' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrcGhuZnN1bGZ6aHJ6ZHN2aGxhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ0MjQ4OCwiZXhwIjoyMDY5MDE4NDg4fQ.zQc2GwZebHb7CJRxzPq8H9MLQV0vcw6t8RHnoSohhd4);

async function insertLedger(rec) {
  const { error } = await supabase.from('ledger_transactions').insert(rec);
  if (error) throw error;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Stripe sig verify failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object;
        await insertLedger({
          source: 'stripe',
          external_id: s.id,
          amount_cents: s.amount_total,
          currency: s.currency,
          payer_email: s.customer_details?.email ?? null,
          meta: { mode: s.mode }
        });
        break;
      }
      case 'invoice.paid': {
        const inv = event.data.object;
        await insertLedger({
          source: 'stripe',
          external_id: inv.id,
          amount_cents: inv.amount_paid,
          currency: inv.currency || 'usd',
          payer_email: inv.customer_email || null,
          meta: { subscription: inv.subscription }
        });
        break;
      }
      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        await insertLedger({
          source: 'stripe',
          external_id: pi.id,
          amount_cents: pi.amount_received,
          currency: pi.currency,
          payer_email: null,
          meta: { description: pi.description || null }
        });
        break;
      }
      default:
        // ignore others
        break;
    }
  } catch (e) {
    console.error('Ledger insert failed:', e);
    return res.status(500).send('Ledger error');
  }

  return res.json({ received: true });
}
