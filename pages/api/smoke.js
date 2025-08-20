import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { ethers } from 'ethers';

export default async function handler(req, res) {
  const ENV = process.env;
  const report = { ok: true, checks: {}, notes: [] };

  try {
    // Supabase
    const supabase = createClient(ENV.NEXT_PUBLIC_SUPABASE_URL, ENV.SUPABASE_SERVICE_KEY);
    await supabase.from('user_profiles').select('id').limit(1);
    report.checks.supabase = { ok: true };

    // Stripe
    try {
      const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
      const bal = await stripe.balance.retrieve();
      report.checks.stripe = { ok: true, currencies: bal.available.map(b => b.currency) };

      if (req.query.createPaymentLink === '1' && ENV.STRIPE_PRICE_ID) {
        const link = await stripe.paymentLinks.create({
          line_items: [{ price: ENV.STRIPE_PRICE_ID, quantity: 1 }],
          after_completion: { type: 'redirect', redirect: { url: `${req.headers.origin || ''}/dashboard` } }
        });
        report.paymentLink = link.url;
      }
    } catch (e) {
      report.checks.stripe = { ok: false, error: e.message };
      report.ok = false;
    }

    // RPC + contract
    try {
      const rpc = ENV.NEXT_PUBLIC_SEPOLIA_RPC || ENV.NEXT_PUBLIC_MAINNET_RPC || ENV.NEXT_PUBLIC_RPC_URL;
      const provider = new ethers.providers.JsonRpcProvider(rpc);
      const block = await provider.getBlockNumber();
      const addr =
        ENV.NEXT_PUBLIC_BLUETUBE_CONTRACT_SEPOLIA ||
        ENV.NEXT_PUBLIC_BLUETUBE_CONTRACT_MAINNET ||
        ENV.NEXT_PUBLIC_BLUETUBE_CONTRACT_POLYGON;
      let hasCode = null;
      if (addr) {
        const code = await provider.getCode(addr);
        hasCode = code && code !== '0x';
      }
      report.checks.blockchain = { ok: true, block, addr, hasCode };
    } catch (e) {
      report.checks.blockchain = { ok: false, error: e.message };
      report.ok = false;
    }

    // Optional: generate key for a given user
    if (req.query.genKey === '1' && req.query.userId) {
      const newKey = `live_${String(req.query.userId).slice(0, 8)}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}`;
      const candidates = [
        { table: 'streaming_keys', payload: { user_id: req.query.userId, stream_key: newKey, updated_at: new Date().toISOString() } },
        { table: 'users',         payload: { id: req.query.userId, stream_key: newKey, updated_at: new Date().toISOString() } },
        { table: 'user_profiles', payload: { id: req.query.userId, stream_key: newKey, updated_at: new Date().toISOString() } },
      ];
      let saved = false;
      for (const t of candidates) {
        const { error } = await supabase.from(t.table).upsert(t.payload, { onConflict: 'id' });
        if (!error) { saved = true; report.notes.push(`Stream key saved to ${t.table}`); break; }
      }
      report.checks.streamKey = { ok: saved, generated: true };
      if (!saved) report.ok = false;
    }

    res.status(report.ok ? 200 : 500).json(report);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
