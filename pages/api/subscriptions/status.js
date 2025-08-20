import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { pilotId } = req.query

  if (!pilotId) {
    return res.status(400).json({ error: 'pilotId required' })
  }

  try {
    const { data: pilot, error } = await supabase
      .from('pilot_certifications')
      .select(`
        pilot_id,
        listing_tier,
        listing_active,
        next_billing_date,
        completed_jobs,
        rating
      `)
      .eq('pilot_id', pilotId)
      .single()

    if (error || !pilot) {
      return res.status(404).json({ error: 'Pilot not found' })
    }

    // Get tier features
    const { data: tierData } = await supabase
      .from('listing_tiers')
      .select('features, price')
      .eq('name', pilot.listing_tier)
      .single()

    res.json({
      pilotId: pilot.pilot_id,
      currentTier: pilot.listing_tier,
      isActive: pilot.listing_active,
      nextBillingDate: pilot.next_billing_date,
      completedJobs: pilot.completed_jobs || 0,
      rating: pilot.rating || 0,
      tierFeatures: tierData?.features || {},
      tierPrice: tierData?.price || 0
    })

  } catch (error) {
    console.error('Status check error:', error)
    res.status(500).json({ error: 'Failed to get subscription status' })
  }
}