import supabase from '../../../utils/supabase-server';

export default async function handler(req, res) {
  const { stream_key } = req.query;
  
  if (!stream_key) {
    return res.status(400).json({ error: 'Stream key required' });
  }

  if (req.method === 'GET') {
    try {
      // Get drone status
      const { data, error } = await supabase
        .from('drone_status')
        .select('*')
        .eq('stream_key', stream_key)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }
      
      // Return default if no status found
      if (!data) {
        return res.json({
          connected: false,
          telemetry: {
            connected: false,
            altitude: 0,
            speed: 0,
            location: { lat: 34.2257, lng: -77.9447 }, // Wilmington
            battery: 100,
            signalStrength: 100,
            flightTime: 0,
            heading: 0
          }
        });
      }
      
      return res.json(data);
    } catch (error) {
      console.error('Error fetching drone status:', error);
      return res.status(500).json({ error: 'Failed to fetch drone status' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}