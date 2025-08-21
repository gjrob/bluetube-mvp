// Safe for browser imports (only NEXT_PUBLIC_*).
export const envClient = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  NETWORK: process.env.NEXT_PUBLIC_NETWORK || 'SEPOLIA',
  NETWORK_NAME: process.env.NEXT_PUBLIC_NETWORK_NAME || 'Sepolia',
  CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID || '11155111',
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || '',
  SUPERCHAT_CONTRACT: process.env.NEXT_PUBLIC_SUPERCHAT_CONTRACT || '',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || '',
  LIVEPEER_API_KEY: process.env.NEXT_PUBLIC_LIVEPEER_API_KEY || '',
  LIVE_INPUT_ID: process.env.NEXT_PUBLIC_LIVE_INPUT_ID || '',
};
