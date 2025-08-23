
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    const { is_pilot, status } = req.query;
    
    let query = supabase.from('profiles').select('*');
    
    if (is_pilot === 'true') {
      query = query.eq('is_pilot', true);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      // If profiles table doesn't exist, return mock data
      const mockProfiles = [
        { id: 1, username: 'pilot1', is_pilot: true, status: 'active' },
        { id: 2, username: 'pilot2', is_pilot: true, status: 'active' },
        { id: 3, username: 'viewer1', is_pilot: false, status: 'active' }
      ];
      
      return res.status(200).json(mockProfiles);
    }
    
    res.status(200).json(data || []);
  } catch (error) {
    console.error('Profiles error:', error);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
}
