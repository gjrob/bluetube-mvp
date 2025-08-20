/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
const { ethers } = require('ethers');

const ENV = process.env;

// Flags you can toggle when running:
// BACKUP=1        -> dump tables to /backups
// CLEAN_MOCK=1    -> delete mock rows (if your schema has is_mock=true)
// GEN_KEY=1       -> generate & store a stream key for TEST_USER_ID
// CREATE_PAYMENT_LINK=1 -> create Stripe Payment Link from STRIPE_PRICE_ID
const BACKUP = ENV.BACKUP === '1';
const CLEAN_MOCK = ENV.CLEAN_MOCK === '1';
const GEN_KEY = ENV.GEN_KEY === '1';
const CREATE_PAYMENT_LINK = ENV.CREATE_PAYMENT_LINK === '1';

// Optional: set a specific user to attach the stream key to
const TEST_USER_ID = ENV.TEST_USER_ID || ''; // supply your Supabase auth user_id when using GEN_KEY

const report = { ok: true, checks: {}, notes: [] };

(async () => {
  try {
    // ---------- Supabase (server key) ----------
    const supabaseUrl = ENV.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = ENV.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error('Missing Supabase env');

    const supabase = createClient(supabaseUrl, supabaseKey);

    // quick table check against your new "safe" tables
    let sErr = null;
    try {
      await supabase.from('user_profiles').select('id').limit(1);
      report.checks.supabase = { ok: true };
    } catch (e) {
      sErr = e;
      report.checks.supabase = { ok: false, error: e.message };
      report.ok = false;
    }

    // ---------- Stripe ----------
    try {
      const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
      const bal = await stripe.balance.retrieve();
      report.checks.stripe = { ok: true, currencies: bal.available.map(b => b.currency) };

      if (CREATE_PAYMENT_LINK) {
        if (!ENV.STRIPE_PRICE_ID) throw new Error('Set STRIPE_PRICE_ID to create a payment link');
        const link = await stripe.paymentLinks.create({
          line_items: [{ price: ENV.STRIPE_PRICE_ID, quantity: 1 }],
          after_completion: { type: 'redirect', redirect: { url: 'https://www.bluetubetv.live/dashboard' } },
          metadata: { source: 'smoke-script' },
        });
        report.notes.push(`Payment Link ready: ${link.url}`);
        report.paymentLink = link.url;
      }
    } catch (e) {
      report.checks.stripe = { ok: false, error: e.message };
      report.ok = false;
    }

    // ---------- RPC / Contract ----------
    try {
      const rpc =
        ENV.NEXT_PUBLIC_SEPOLIA_RPC ||
        ENV.NEXT_PUBLIC_MAINNET_RPC ||
        ENV.NEXT_PUBLIC_RPC_URL;

      if (!rpc) throw new Error('Missing RPC URL');
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

    // ---------- Generate & store stream key ----------
    if (GEN_KEY) {
      if (!TEST_USER_ID) throw new Error('Set TEST_USER_ID to use GEN_KEY=1');

      const newKey = `live_${TEST_USER_ID.slice(0, 8)}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}`;

      // prefer a dedicated table if you have one; fall back to users/user_profiles
      const tryTables = [
        { table: 'streaming_keys', payload: { user_id: TEST_USER_ID, stream_key: newKey, updated_at: new Date().toISOString() } },
        { table: 'users',         payload: { id: TEST_USER_ID, stream_key: newKey, updated_at: new Date().toISOString() } },
        { table: 'user_profiles', payload: { id: TEST_USER_ID, stream_key: newKey, updated_at: new Date().toISOString() } },
      ];

      let saved = false;
      for (const t of tryTables) {
        const { error } = await supabase.from(t.table).upsert(t.payload, { onConflict: 'id' });
        if (!error) { saved = true; report.notes.push(`Stream key saved to ${t.table}`); break; }
      }
      report.checks.streamKey = { ok: saved, generated: true };
      if (!saved) report.ok = false;
    }

    // ---------- Clean mock data ----------
    if (CLEAN_MOCK) {
      const mockTables = ['streams', 'jobs', 'nfts', 'tips'];
      for (const table of mockTables) {
        try {
          await supabase.from(table).delete().eq('is_mock', true);
          report.notes.push(`Mock rows removed from ${table}`);
        } catch (e) {
          // ignore missing tables
        }
      }
    }

    // ---------- Backup selected tables ----------
    if (BACKUP) {
      const outDir = path.join(process.cwd(), 'backups');
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');

      const tables = ['user_profiles', 'streams', 'jobs', 'tips', 'subscription_tiers'];
      const dump = {};

      for (const t of tables) {
        try {
          const { data } = await supabase.from(t).select('*').limit(1000);
          dump[t] = data || [];
        } catch {
          dump[t] = [];
        }
      }

      fs.writeFileSync(path.join(outDir, `backup-${stamp}.json`), JSON.stringify(dump, null, 2));
      report.notes.push(`Backup written: backups/backup-${stamp}.json`);
    }

    // Final output
    console.log(JSON.stringify(report, null, 2));
    process.exit(report.ok ? 0 : 1);
  } catch (e) {
    console.error(JSON.stringify({ ok: false, error: e.message }, null, 2));
    process.exit(1);
  }
})();
