import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, description, budget, location } = req.body;

  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        title,
        description,
        budget,
        location,
        status: 'open'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ success: true, job: data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
