import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { 
      period = '30',  // days
      pilot_id = null // optional: get analytics for specific pilot
    } = req.query

    const periodInt = parseInt(period)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - periodInt)

    // Platform Revenue Analytics
    if (!pilot_id) {
      // Daily revenue breakdown
      const { data: dailyRevenue, error: dailyError } = await supabase.rpc('get_daily_revenue', {
        days_back: periodInt
      })

      if (dailyError) throw dailyError

      // Total platform metrics
      const { data: platformMetrics, error: metricsError } = await supabase.rpc('get_platform_metrics', {
        start_date: startDate.toISOString()
      })

      if (metricsError) throw metricsError

      // Top performing job types
      const { data: jobTypeBreakdown, error: jobTypeError } = await supabase
        .from('transactions')
        .select(`
          platform_fee,
          jobs!inner(job_type)
        `)
        .gte('created_at', startDate.toISOString())
        .eq('transaction_type', 'job_completion')

      if (jobTypeError) throw jobTypeError

      const jobTypeStats = jobTypeBreakdown.reduce((acc, transaction) => {
        const type = transaction.jobs.job_type
        acc[type] = (acc[type] || 0) + transaction.platform_fee
        return acc
      }, {})

      res.json({
        period_days: periodInt,
        daily_revenue: dailyRevenue || [],
        platform_metrics: platformMetrics?.[0] || {},
        job_type_revenue: jobTypeStats,
        start_date: startDate.toISOString()
      })
    } else {
      // Pilot-specific analytics
      const { data: pilotTransactions, error: pilotError } = await supabase
        .from('transactions')
        .select(`
          *,
          jobs(title, job_type)
        `)
        .eq('pilot_id', pilot_id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })

      if (pilotError) throw pilotError

      const totalEarnings = pilotTransactions.reduce((sum, t) => sum + (t.pilot_payout || 0), 0)
      const avgCommissionRate = pilotTransactions.length > 0 
        ? pilotTransactions.reduce((sum, t) => sum + (t.commission_rate || 0), 0) / pilotTransactions.length
        : 0

      res.json({
        pilot_id,
        period_days: periodInt,
        total_earnings: totalEarnings,
        transaction_count: pilotTransactions.length,
        average_commission_rate: Math.round(avgCommissionRate * 100),
        transactions: pilotTransactions,
        start_date: startDate.toISOString()
      })
    }

  } catch (error) {
    console.error('Analytics error:', error)
    res.status(500).json({ error: 'Failed to fetch analytics' })
  }
}