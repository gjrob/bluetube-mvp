import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { streamId } = req.body;
  
  // Get current viewer count
  const { data: stream } = await supabase
    .from('active_streams')
    .select('viewer_count')
    .eq('id', streamId)
    .single();
  
  // Dynamic pricing based on popularity
  const pricing = {
    minimum: stream?.viewer_count > 100 ? 10 : 5,
    suggested: stream?.viewer_count > 100 
      ? [20, 50, 100, 500] 
      : [5, 10, 25, 50],
    multiplier: stream?.viewer_count > 500 ? 2 : 1,
    spotlight_duration: {
      5: 30,    // 30 seconds
      10: 60,   // 1 minute
      25: 180,  // 3 minutes
      50: 300,  // 5 minutes
      100: 600  // 10 minutes spotlight
    }
  };
  
  res.json(pricing);
}