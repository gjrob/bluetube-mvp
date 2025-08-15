// pages/api/analytics/vault.js - The master analytics endpoint
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // Only YOU can access this
  const { authorization } = req.headers;
  if (authorization !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Fetch EVERYTHING in parallel
  const [
    users,
    streams,
    revenue,
    engagement,
    performance,
    predictions
  ] = await Promise.all([
    getUserMetrics(),
    getStreamMetrics(),
    getRevenueMetrics(),
    getEngagementMetrics(),
    getPerformanceMetrics(),
    getPredictiveAnalytics()
  ]);

  async function getUserMetrics() {
    const { data: totalUsers } = await supabase
      .from('auth.users')
      .select('*', { count: 'exact' });

    const { data: activeToday } = await supabase
      .from('user_activity')
      .select('user_id')
      .gte('last_active', todayStart)
      .limit(1000);

    const { data: newToday } = await supabase
      .from('auth.users')
      .select('*', { count: 'exact' })
      .gte('created_at', todayStart);

    const { data: churned } = await supabase
      .from('user_activity')
      .select('*')
      .lt('last_active', weekStart)
      .not('subscription_status', 'eq', 'active');

    return {
      total: totalUsers?.length || 0,
      active_today: activeToday?.length || 0,
      new_today: newToday?.length || 0,
      churned_week: churned?.length || 0,
      retention_rate: ((activeToday?.length || 0) / (totalUsers?.length || 1) * 100).toFixed(2)
    };
  }

  async function getStreamMetrics() {
    const { data: activeStreams } = await supabase
      .from('active_streams')
      .select('*')
      .eq('status', 'live');

    const { data: todayStreams } = await supabase
      .from('active_streams')
      .select('viewer_count')
      .gte('created_at', todayStart);

    const totalViewers = todayStreams?.reduce((sum, s) => sum + (s.viewer_count || 0), 0) || 0;
    const avgViewers = todayStreams?.length ? totalViewers / todayStreams.length : 0;

    return {
      live_now: activeStreams?.length || 0,
      total_today: todayStreams?.length || 0,
      total_viewers: totalViewers,
      avg_viewers: avgViewers.toFixed(0),
      peak_concurrent: Math.max(...(activeStreams?.map(s => s.viewer_count) || [0]))
    };
  }

  async function getRevenueMetrics() {
    const { data: todayRev } = await supabase
      .from('platform_revenue')
      .select('amount, type')
      .gte('created_at', todayStart);

    const { data: yesterdayRev } = await supabase
      .from('platform_revenue')
      .select('amount')
      .gte('created_at', yesterdayStart)
      .lt('created_at', todayStart);

    const { data: monthRev } = await supabase
      .from('platform_revenue')
      .select('amount, type')
      .gte('created_at', monthStart);

    const todayTotal = todayRev?.reduce((sum, r) => sum + r.amount, 0) || 0;
    const yesterdayTotal = yesterdayRev?.reduce((sum, r) => sum + r.amount, 0) || 0;
    const monthTotal = monthRev?.reduce((sum, r) => sum + r.amount, 0) || 0;

    // Revenue by type
    const byType = todayRev?.reduce((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + r.amount;
      return acc;
    }, {}) || {};

    // Calculate growth
    const growth = yesterdayTotal > 0 
      ? ((todayTotal - yesterdayTotal) / yesterdayTotal * 100).toFixed(2)
      : 0;

    // Project monthly
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed = now.getDate();
    const projection = (monthTotal / daysPassed) * daysInMonth;

    return {
      today: todayTotal,
      yesterday: yesterdayTotal,
      month: monthTotal,
      growth_percent: growth,
      projection: projection.toFixed(0),
      by_type: byType,
      hourly_rate: (todayTotal / ((now - todayStart) / (1000 * 60 * 60))).toFixed(2),
      per_user: (todayTotal / (users.active_today || 1)).toFixed(2)
    };
  }

  async function getEngagementMetrics() {
    const { data: superchats } = await supabase
      .from('super_chats')
      .select('amount')
      .gte('created_at', todayStart);

    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact' })
      .gte('created_at', todayStart);

    const { data: jobApps } = await supabase
      .from('job_applications')
      .select('*', { count: 'exact' })
      .gte('created_at', todayStart);

    return {
      superchats: {
        count: superchats?.length || 0,
        total: superchats?.reduce((sum, s) => sum + s.amount, 0) || 0,
        average: superchats?.length ? 
          (superchats.reduce((sum, s) => sum + s.amount, 0) / superchats.length).toFixed(2) : 0
      },
      chat_messages: messages?.length || 0,
      job_applications: jobApps?.length || 0
    };
  }

  async function getPerformanceMetrics() {
    // API response times
    const { data: apiLogs } = await supabase
      .from('api_logs')
      .select('response_time')
      .gte('created_at', todayStart)
      .order('response_time', { ascending: false })
      .limit(1000);

    const responseTimes = apiLogs?.map(l => l.response_time) || [];
    const p95 = responseTimes[Math.floor(responseTimes.length * 0.95)] || 0;
    const p99 = responseTimes[Math.floor(responseTimes.length * 0.99)] || 0;

    // Error rate
    const { data: errors } = await supabase
      .from('error_logs')
      .select('*', { count: 'exact' })
      .gte('created_at', todayStart);

    return {
      api_p95: p95,
      api_p99: p99,
      error_count: errors?.length || 0,
      error_rate: ((errors?.length || 0) / (apiLogs?.length || 1) * 100).toFixed(2),
      uptime: '99.9%' // Calculate from monitoring
    };
  }

  async function getPredictiveAnalytics() {
    // Simple predictions based on trends
    const { data: lastWeekRev } = await supabase
      .from('platform_revenue')
      .select('amount, created_at')
      .gte('created_at', weekStart)
      .order('created_at');

    // Calculate trend
    const dailyRevs = {};
    lastWeekRev?.forEach(r => {
      const day = new Date(r.created_at).toDateString();
      dailyRevs[day] = (dailyRevs[day] || 0) + r.amount;
    });

    const revValues = Object.values(dailyRevs);
    const avgDailyRev = revValues.reduce((a, b) => a + b, 0) / revValues.length;
    const trend = revValues.length > 1 
      ? (revValues[revValues.length - 1] - revValues[0]) / revValues[0] * 100
      : 0;

    return {
      tomorrow_revenue: (avgDailyRev * (1 + trend / 100)).toFixed(0),
      week_revenue: (avgDailyRev * 7 * (1 + trend / 100)).toFixed(0),
      month_end_revenue: (avgDailyRev * 30 * (1 + trend / 100)).toFixed(0),
      trend_direction: trend > 0 ? 'up' : trend < 0 ? 'down' : 'flat',
      trend_percent: trend.toFixed(2)
    };
  }

  const vault = {
    timestamp: now.toISOString(),
    users,
    streams,
    revenue,
    engagement,
    performance,
    predictions,
    alerts: generateAlerts(users, streams, revenue, performance)
  };

  res.json(vault);
}

function generateAlerts(users, streams, revenue, performance) {
  const alerts = [];

  if (revenue.today < 5000) {
    alerts.push({
      level: 'warning',
      message: `Revenue at $${revenue.today} - need $${5000 - revenue.today} to hit daily goal`,
      action: 'Boost SuperChat campaigns'
    });
  }

  if (users.retention_rate < 80) {
    alerts.push({
      level: 'warning',
      message: `Retention at ${users.retention_rate}% - below 80% threshold`,
      action: 'Launch re-engagement campaign'
    });
  }

  if (performance.error_rate > 1) {
    alerts.push({
      level: 'critical',
      message: `Error rate at ${performance.error_rate}% - investigate immediately`,
      action: 'Check error logs'
    });
  }

  if (streams.live_now === 0) {
    alerts.push({
      level: 'info',
      message: 'No active streams - opportunity for featured content',
      action: 'Promote streaming incentives'
    });
  }

  return alerts;
}