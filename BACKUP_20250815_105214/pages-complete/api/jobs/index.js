// /pages/api/jobs/index.js
import { createServerClient } from '../../../lib/supabase-server'
import { supabaseAdmin } from '../../../lib/supabase-admin'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGetJobs(req, res)
  }
  
  if (req.method === 'POST') {
    return handleCreateJob(req, res)
  }
  
  return res.status(405).json({ error: 'Method not allowed' })
}

// GET /api/jobs - List all available jobs
async function handleGetJobs(req, res) {
  // Use regular client for public reads
  const supabase = createServerClient({ req, res })
  
  try {
    const { 
      status = 'open', 
      location, 
      job_type, 
      min_budget, 
      max_budget,
      sort = 'featured_first',
      page = 1,
      limit = 20
    } = req.query

    let query = supabase
      .from('jobs')
      .select(`
        id,
        title,
        description,
        budget,
        location,
        deadline,
        job_type,
        status,
        brand_name,
        commission_rate,
        created_at,
        client_pilot_id,
        job_bids(count)
      `)
      .eq('status', status)

    // Add filters
    if (location) {
      query = query.ilike('location', `%${location}%`)
    }
    
    if (job_type) {
      query = query.eq('job_type', job_type)
    }
    
    if (min_budget) {
      query = query.gte('budget', parseFloat(min_budget))
    }
    
    if (max_budget) {
      query = query.lte('budget', parseFloat(max_budget))
    }

    // Add sorting
    if (sort === 'featured_first') {
      query = query.order('job_type', { ascending: false }) // sponsored first
                   .order('created_at', { ascending: false })
    } else if (sort === 'budget_high') {
      query = query.order('budget', { ascending: false })
    } else if (sort === 'deadline') {
      query = query.order('deadline', { ascending: true })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit)
    query = query.range(offset, offset + parseInt(limit) - 1)

    const { data: jobs, error } = await query

    if (error) throw error

    // Get total count for pagination
    const { count } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('status', status)

    res.json({
      jobs: jobs || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / parseInt(limit))
      }
    })

  } catch (error) {
    console.error('Get jobs error:', error)
    res.status(500).json({ error: 'Failed to fetch jobs' })
  }
}

// POST /api/jobs - Create new job (with posting fee)
async function handleCreateJob(req, res) {
  const supabase = createServerClient({ req, res })
  
  try {
    // First check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const {
      title,
      description,
      budget,
      location,
      deadline,
      requirements,
      job_type = 'custom' // 'custom' or 'sponsored'
    } = req.body

    // Use the authenticated user's ID as client_pilot_id
    const client_pilot_id = user.id

    // Validation
    if (!title || !description || !budget) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, description, budget' 
      })
    }

    if (budget < 50) {
      return res.status(400).json({ 
        error: 'Minimum job budget is $50' 
      })
    }

    // Calculate posting fee
    const postingFee = job_type === 'sponsored' ? 5000 : 2500 // $50 for sponsored, $25 for custom
    const commissionRate = job_type === 'sponsored' ? 0.30 : 0.25 // 30% vs 25%

    // Create Stripe payment intent for posting fee
    const paymentIntent = await stripe.paymentIntents.create({
      amount: postingFee,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        type: 'job_posting_fee',
        client_pilot_id,
        job_type,
        budget: budget.toString()
      }
    })

    // Create job in pending state (will be activated after payment)
    const { data: newJob, error: jobError } = await supabase
      .from('jobs')
      .insert({
        client_pilot_id,
        title,
        description,
        budget: parseFloat(budget),
        location,
        deadline,
        requirements,
        job_type,
        status: 'pending_payment',
        commission_rate: commissionRate,
        posting_fee_paid: false
      })
      .select()
      .single()

    if (jobError) throw jobError

    // Create transaction record for tracking
   /*
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: client_pilot_id,
        type: 'job_posting_fee',
        amount: -(postingFee / 100), // Negative for charge
        description: `Posting fee for job: ${title}`,
        job_id: newJob.id,
        status: 'pending',
        stripe_payment_intent_id: paymentIntent.id
      })

    if (transactionError) {
      console.error('Transaction record error:', transactionError)
    }
    */


    res.json({
      job: newJob,
      payment: {
        client_secret: paymentIntent.client_secret,
        posting_fee: postingFee / 100, // Convert to dollars
        commission_rate: `${commissionRate * 100}%`
      }
    })

  } catch (error) {
    console.error('Create job error:', error)
    res.status(500).json({ 
      error: 'Failed to create job',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}