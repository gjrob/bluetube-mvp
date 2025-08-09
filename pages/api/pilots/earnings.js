// pages/api/pilot/earnings.js
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = createPagesServerClient({ req, res })

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    // Get pilot's earnings summary
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select(`
        *,
        jobs (
          title,
          budget,
          commission_rate
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Calculate earnings
    let available = 0
    let pending = 0
    let total = 0

    const now = new Date()
    
    transactions.forEach(tx => {
      if (tx.type === 'job_payment') {
        total += tx.amount
        
        // Check if payment is cleared (48 hours old)
        const txDate = new Date(tx.created_at)
        const hoursSince = (now - txDate) / (1000 * 60 * 60)
        
        if (tx.status === 'completed' && hoursSince > 48) {
          available += tx.amount
        } else if (tx.status === 'completed') {
          pending += tx.amount
        }
      } else if (tx.type === 'payout') {
        available += tx.amount // Negative amount for payouts
      }
    })

    return res.status(200).json({
      earnings: {
        available: Math.max(0, available),
        pending: Math.max(0, pending),
        total: Math.max(0, total)
      },
      transactions: transactions.map(tx => ({
        id: tx.id,
        created_at: tx.created_at,
        type: tx.type,
        amount: tx.amount,
        gross_amount: tx.type === 'job_payment' && tx.jobs ? tx.jobs.budget : null,
        platform_fee: tx.type === 'job_payment' && tx.jobs ? 
          tx.jobs.budget - tx.amount : null,
        status: tx.status,
        job_title: tx.jobs?.title || tx.description
      }))
    })

  } catch (error) {
    console.error('Earnings error:', error)
    return res.status(500).json({ error: 'Failed to fetch earnings' })
  }
}

// pages/api/pilot/create-connect-account.js
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = createPagesServerClient({ req, res })

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    // Check if pilot already has a Stripe account
    const { data: pilot } = await supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', user.id)
      .single()

    let accountId = pilot?.stripe_account_id

    if (!accountId) {
      // Create new Stripe Connect account
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: user.email,
        capabilities: {
          transfers: { requested: true }
        },
        business_type: 'individual',
      })

      accountId = account.id

      // Save account ID
      await supabase
        .from('profiles')
        .update({ stripe_account_id: accountId })
        .eq('id', user.id)
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pilot/earnings`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pilot/earnings?setup=complete`,
      type: 'account_onboarding',
    })

    return res.status(200).json({ url: accountLink.url })

  } catch (error) {
    console.error('Stripe Connect error:', error)
    return res.status(500).json({ error: 'Failed to create Stripe account' })
  }
}

// pages/api/pilot/request-payout.js
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import Stripe from 'stripe'

// 'stripe' is already declared above, so do not redeclare it here

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { amount } = req.body
  const supabase = createPagesServerClient({ req, res })

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    // Validate amount
    if (!amount || amount < 50) {
      return res.status(400).json({ error: 'Minimum payout amount is $50' })
    }

    // Get pilot's Stripe account
    const { data: pilot } = await supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', user.id)
      .single()

    if (!pilot?.stripe_account_id) {
      return res.status(400).json({ error: 'Please connect your bank account first' })
    }

    // Verify available balance
    // (In production, calculate this from transactions)
    
    // Create payout
    const transfer = await stripe.transfers.create({
      amount: Math.floor(amount * 100), // Convert to cents
      currency: 'usd',
      destination: pilot.stripe_account_id,
      description: `Payout for pilot ${user.id}`
    })

    // Record payout transaction
    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'payout',
        amount: -amount, // Negative for payout
        description: 'Payout to bank account',
        status: 'completed',
        stripe_transfer_id: transfer.id
      })

    if (txError) throw txError

    return res.status(200).json({ 
      success: true,
      transfer_id: transfer.id,
      message: 'Payout initiated. Funds will arrive in 2-3 business days.'
    })

  } catch (error) {
    console.error('Payout error:', error)
    return res.status(500).json({ error: 'Failed to process payout' })
  }
}

// pages/api/pilot/bank-account.js
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import Stripe from 'stripe'

// 'stripe' is already declared above, so do not redeclare it here

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = createPagesServerClient({ req, res })

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    // Get pilot's Stripe account
    const { data: pilot } = await supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', user.id)
      .single()

    if (!pilot?.stripe_account_id) {
      return res.status(200).json({ bankAccount: null })
    }

    // Get account details from Stripe
    const account = await stripe.accounts.retrieve(pilot.stripe_account_id)

    if (!account.external_accounts?.data?.[0]) {
      return res.status(200).json({ bankAccount: null })
    }

    const bankAccount = account.external_accounts.data[0]

    return res.status(200).json({
      bankAccount: {
        bank_name: bankAccount.bank_name,
        last4: bankAccount.last4,
        account_holder_name: bankAccount.account_holder_name,
        currency: bankAccount.currency,
        country: bankAccount.country
      }
    })

  } catch (error) {
    console.error('Bank account error:', error)
    return res.status(500).json({ error: 'Failed to fetch bank account' })
  }
}