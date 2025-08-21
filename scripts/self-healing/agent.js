// scripts/self-healing/agent.js
// One-pass self-healing agent. Run via cron or PM2.
// Uses your existing Supabase admin client.

import 'dotenv/config.js';
import fetch from 'node-fetch';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabaseAdmin } from '../../lib/supabase-admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getFlag(key, defaultOn = true) {
  const { data, error } = await supabaseAdmin
    .from('feature_flags')
    .select('value')
    .eq('key', key)
    .single();
  if (error) return defaultOn;
  return data?.value?.on ?? defaultOn;
}

async function logIncident({ rule_id = null, issue, metrics = {}, action_taken = {}, status = 'noop', note = '' }) {
  await supabaseAdmin.from('self_healing_logs').insert({
    rule_id,
    issue,
    metrics,
    action_taken,
    status,
    note
  });
}

async function getMetrics() {
  const metrics = {
    host: os.hostname(),
    cpu_load_1m: os.loadavg()[0],
    mem_used_ratio: 1 - os.freemem() / os.totalmem(),
    ts: Date.now()
  };

  // API health
  try {
    const r = await fetch(process.env.SELF_HEALING_HEALTH_URL || 'https://www.bluetubetv.live/api/health', { timeout: 8000 });
    metrics.api_ok = r.ok;
    metrics.api_status = (await r.json().catch(() => null)) || null;
  } catch {
    metrics.api_ok = false;
    metrics.api_status = null;
  }

  // (Optional) RTMP stats endpoint if enabled on your box
  // You can parse XML stats from nginx-rtmp if you’ve enabled the stat module
  // We'll keep this minimal; you can expand later.
  return metrics;
}

function compare(val, op, threshold) {
  switch (op) {
    case '>': return val > threshold;
    case '<': return val < threshold;
    case '>=': return val >= threshold;
    case '<=': return val <= threshold;
    case '==': return val == threshold; // eslint-disable-line eqeqeq
    case '!=': return val != threshold; // eslint-disable-line eqeqeq
    default: return false;
  }
}

// ACTION STUBS — keep harmless while in DRY_RUN
async function pm2Restart(processName) {
  // implement when ready: e.g., spawn('pm2', ['restart', processName])
  return { type: 'pm2_restart', ok: true, process: processName };
}
async function purgeCache(tag) {
  // call your CDN purge function if you want
  return { type: 'cache_purge', ok: true, tag };
}

async function executeActions(actions = [], snapshot = {}, dryRun = true) {
  const results = [];
  for (const action of actions) {
    const { type, args = {} } = action;
    if (dryRun) {
      results.push({ type, args, dryRun: true, ok: true });
      continue;
    }
    if (type === 'pm2_restart') results.push(await pm2Restart(args.process || 'api'));
    else if (type === 'cache_purge') results.push(await purgeCache(args.tag || 'all'));
    else results.push({ type, args, ok: false, note: 'unknown action' });
  }
  return results;
}

async function runOnce() {
  const enabled = (process.env.SELF_HEALING_ENABLED || 'true') === 'true' && await getFlag('self_healing_enabled', true);
  if (!enabled) return;

  const dryRun = (process.env.SELF_HEALING_DRY_RUN || 'true') === 'true' || await getFlag('self_healing_dry_run', true);
  const snapshot = await getMetrics();

  // Load active rules
  const { data: rules, error } = await supabaseAdmin.from('self_healing_rules').select('*').eq('enabled', true);
  if (error) {
    await logIncident({ issue: 'Failed to load rules', metrics: { error }, status: 'failed' });
    return;
  }

  for (const rule of rules || []) {
    const cond = rule.condition || {};
    const val = snapshot[cond.metric];
    if (typeof val === 'undefined') continue;

    if (compare(val, cond.op, cond.value)) {
      const actionsTaken = await executeActions(rule.actions || [], snapshot, dryRun);
      await logIncident({
        rule_id: rule.id,
        issue: `Triggered: ${rule.name}`,
        metrics: { observed: { [cond.metric]: val }, snapshot },
        action_taken: actionsTaken,
        status: dryRun ? 'noop' : 'resolved',
        note: dryRun ? 'dry-run' : ''
      });
    }
  }
}

runOnce()
  .then(() => process.exit(0))
  .catch(async (e) => {
    await logIncident({ issue: 'Agent crash', metrics: { error: String(e) }, status: 'failed' });
    process.exit(1);
  });
