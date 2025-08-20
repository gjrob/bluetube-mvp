// pages/api/earnings.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { authorization } = req.headers
  
  if (!authorization) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Get user from token
    const token = authorization.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Get earnings data - simplified for quick launch
    const earnings = {
      total: 1234.56,
      pending: 456.78,
      available: 777.78,
      lastPayout: '2025-01-15',
      transactions: [
        {
          id: 1,
          type: 'stream_tip',
          amount: 25.00,
          date: '2025-01-20',
          status: 'completed',
          description: 'Super Chat from viewer'
        },
        {
          id: 2,
          type: 'job_completion',
          amount: 150.00,
          date: '2025-01-19',
          status: 'pending',
          description: 'Aerial survey job #1234'
        },
        {
          id: 3,
          type: 'nft_sale',
          amount: 75.00,
          date: '2025-01-18',
          status: 'completed',
          description: 'NFT mint - Sunset Flight'
        }
      ],
      chartData: [
        { day: 'Mon', amount: 120 },
        { day: 'Tue', amount: 85 },
        { day: 'Wed', amount: 200 },
        { day: 'Thu', amount: 150 },
        { day: 'Fri', amount: 300 },
        { day: 'Sat', amount: 250 },
        { day: 'Sun', amount: 180 }
      ]
    }

    // TODO: Replace with real Supabase query after launch
    // const { data: earnings, error } = await supabase
    //   .from('earnings')
    //   .select('*')
    //   .eq('user_id', user.id)
    //   .single()

    return res.status(200).json(earnings)
    
  } catch (error) {
    console.error('Earnings API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}