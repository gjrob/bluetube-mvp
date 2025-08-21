// Server-only secrets. Do NOT import this in client components.
const required = (key) => {
  const v = process.env[key];
  if (!v) throw new Error(`Missing required server env: ${key}`);
  return v;
};

export const envServer = {
  // Supabase (admin)
  SUPABASE_SERVICE_ROLE_KEY: required('SUPABASE_SERVICE_ROLE_KEY'),

  // Database
  DATABASE_URL: required('DATABASE_URL'),

  // Stripe (server)
  STRIPE_SECRET_KEY: required('STRIPE_SECRET_KEY'),
  STRIPE_WEBHOOK_SECRET: required('STRIPE_WEBHOOK_SECRET'),

  // OpenAI
  OPENAI_API_KEY: required('OPENAI_API_KEY'),

  // Cloudflare
  CLOUDFLARE_ACCOUNT_ID: required('CLOUDFLARE_ACCOUNT_ID'),
  CLOUDFLARE_API_TOKEN: required('CLOUDFLARE_API_TOKEN'),
  CLOUDFLARE_STREAM_API_TOKEN: required('CLOUDFLARE_STREAM_API_TOKEN'),

  // JWT / Admin
  JWT_SECRET: required('JWT_SECRET'),
  ADMIN_SECRET_KEY: required('ADMIN_SECRET_KEY'),
  CRON_SECRET: required('CRON_SECRET'),

  // Optional (won’t crash if absent)
  LIVEPEER_API_KEY: process.env.LIVEPEER_API_KEY || null,
  ETHEREUM_RPC_URL: process.env.ETHEREUM_RPC_URL || null,
  PRIVATE_KEY: process.env.PRIVATE_KEY || null,
  PINATA_API_KEY: process.env.PINATA_API_KEY || null,
  PINATA_SECRET_KEY: process.env.PINATA_SECRET_KEY || null,

  // Self-healing
  SELF_HEALING_HEALTH_URL: process.env.SELF_HEALING_HEALTH_URL || null,
  SELF_HEALING_RTMP_STATS_URL: process.env.SELF_HEALING_RTMP_STATS_URL || null,
  SELF_HEALING_ENABLED: (process.env.SELF_HEALING_ENABLED || 'true') === 'true',
  SELF_HEALING_DRY_RUN: (process.env.SELF_HEALING_DRY_RUN || 'true') === 'true',
};
