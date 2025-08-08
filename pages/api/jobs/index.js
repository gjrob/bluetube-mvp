import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_KEY
)

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
  try {
    const {
      client_pilot_id,
      title,
      description,
      budget,
      location,
      deadline,
      requirements,
      job_type = 'custom' // 'custom' or 'sponsored'
    } = req.body

    // Validation
    if (!client_pilot_id || !title || !description || !budget) {
      return res.status(400).json({ 
        error: 'Missing required fields: client_pilot_id, title, description, budget' 
      })
    }

    if (budget < 50) {
      return res.status(400).json({ 
        error: 'Minimum job budget is $50' 
      })
    }

    // Verify pilot exists
    const { data: pilot, error: pilotError } = await supabase
      .from('pilot_certifications')
      .select('pilot_id, listing_tier, listing_active')
      .eq('pilot_id', client_pilot_id)
      .single()

    if (pilotError || !pilot) {
      return res.status(404).json({ error: 'Client pilot not found' })
    }

    // Check if pilot has active listing
    if (!pilot.listing_active && pilot.listing_tier === 'free') {
      return res.status(403).json({ 
        error: 'Active subscription required to post jobs. Please upgrade your plan.' 
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