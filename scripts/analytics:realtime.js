// scripts/analytics-realtime.js
// Real-time analytics for BlueTubeTV - See your money printing!

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log(`
🌊 =====================================
💎 BlueTubeTV REAL-TIME ANALYTICS
🚀 Money Printer Status: ACTIVE
=====================================
`);

async function getRealtimeStats() {
  try {
    // Get today's stats
    const today = new Date().toISOString().split('T')[0];
    
    // Get page views
    const { data: pageViews, error: pvError } = await supabase
      .from('page_views')
      .select('*')
      .gte('last_accessed', today);
    
    // Get user behavior
    const { data: activeUsers, error: uError } = await supabase
      .from('user_behavior')
      .select('*')
      .gte('created_at', today);
    
    // Get API activity
    const { data: apiCalls, error: apiError } = await supabase
      .from('api_logs')
      .select('*')
      .gte('created_at', today);
    
    // Calculate stats
    const stats = {
      timestamp: new Date().toLocaleString(),
      today: {
        pageViews: pageViews?.length || 0,
        activeUsers: activeUsers?.length || 0,
        apiCalls: apiCalls?.length || 0,
      },
      popular: {
        pages: getMostVisited(pageViews),
      },
      revenue: {
        estimatedSuperChats: Math.floor((activeUsers?.length || 0) * 0.1), // 10% conversion
        estimatedRevenue: `$${(Math.floor((activeUsers?.length || 0) * 0.1) * 5).toFixed(2)}`, // $5 avg
      }
    };
    
    // Display results
    console.log(`
📊 REAL-TIME STATS (${stats.timestamp})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 TODAY'S ACTIVITY:
   👀 Page Views: ${stats.today.pageViews}
   👤 Active Users: ${stats.today.activeUsers}
   🔌 API Calls: ${stats.today.apiCalls}

💰 REVENUE PROJECTION:
   🎯 Expected SuperChats: ${stats.revenue.estimatedSuperChats}
   💵 Estimated Revenue: ${stats.revenue.estimatedRevenue}

🔥 TRENDING:
   📱 Most Visited: ${stats.popular.pages}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
    
    // Check Stripe (if configured)
    if (process.env.STRIPE_SECRET_KEY) {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const balance = await stripe.balance.retrieve();
      console.log(`
💳 STRIPE BALANCE:
   Available: $${(balance.available[0]?.amount || 0) / 100}
   Pending: $${(balance.pending[0]?.amount || 0) / 100}
`);
    }
    
    // Live monitoring
    console.log('🔄 Refreshing every 5 seconds... (Press Ctrl+C to stop)\n');
    
  } catch (error) {
    console.error('❌ Error fetching stats:', error.message);
  }
}

function getMostVisited(pageViews) {
  if (!pageViews || pageViews.length === 0) return 'No data yet';
  
  const pageCounts = {};
  pageViews.forEach(pv => {
    pageCounts[pv.url] = (pageCounts[pv.url] || 0) + (pv.count || 1);
  });
  
  const sorted = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  return sorted.map(([url, count]) => `${url} (${count})`).join(', ');
}

// Run immediately
getRealtimeStats();

// Keep running every 5 seconds
setInterval(getRealtimeStats, 5000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Stopping real-time analytics...');
  process.exit();
});