// pages/api/pilots/earnings.js
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = createPagesServerClient({ req, res })

  try {
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Get pilot profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return res.status(400).json({ error: 'Profile not found' })
    }

    // Get earnings from transactions
    const { data: transactions, error: transError } = await supabase
      .from('transactions')
      .select(`
        *,
        jobs (
          id,
          title,
          client_pilot_id
        )
      `)
      .eq('pilot_id', user.id)
      .order('created_at', { ascending: false })

    if (transError) throw transError

    // Calculate totals
    const totalEarnings = transactions?.reduce((sum, t) => {
      if (t.status === 'completed') {
        return sum + (t.amount || 0)
      }
      return sum
    }, 0) || 0

    const pendingEarnings = transactions?.reduce((sum, t) => {
      if (t.status === 'pending' || t.status === 'pending_release') {
        return sum + (t.amount || 0)
      }
      return sum
    }, 0) || 0

    const availableBalance = profile.available_balance || 0

    // Get Stripe account status if they have one
    let stripeAccount = null
    if (profile.stripe_account_id) {
      try {
        stripeAccount = await stripe.accounts.retrieve(profile.stripe_account_id)
      } catch (stripeError) {
        console.error('Error fetching Stripe account:', stripeError)
      }
    }

    return res.status(200).json({
      earnings: {
        total: totalEarnings,
        pending: pendingEarnings,
        available: availableBalance
      },
      transactions: transactions || [],
      stripeAccount: stripeAccount ? {
        id: stripeAccount.id,
        charges_enabled: stripeAccount.charges_enabled,
        payouts_enabled: stripeAccount.payouts_enabled,
        details_submitted: stripeAccount.details_submitted
      } : null,
      profile
    })

  } catch (error) {
    console.error('Earnings API error:', error)
    return res.status(500).json({ error: error.message })
  }
}