import { supabase } from '../../../utils/supabase-server';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { action, stream_key } = req.body;
    
    if (!stream_key) {
      return res.status(400).json({ error: 'Stream key required' });
    }
    
    try {
      const droneData = {
        stream_key,
        connected: action === 'connect',
        telemetry: {
          connected: action === 'connect',
          altitude: 0,
          speed: 0,
          location: { lat: 34.2257, lng: -77.9447 },
          battery: 100,
          signalStrength: 100,
          flightTime: 0,
          heading: 0
        },
        updated_at: new Date().toISOString()
      };
      
      // Upsert drone status in Supabase
      const { data, error } = await supabase
        .from('drone_status')
        .upsert(droneData, { onConflict: 'stream_key' })
        .select()
        .single();
      
      if (error) throw error;
      
      res.json({ 
        success: true, 
        message: action === 'connect' ? 'Drone connected' : 'Drone disconnected',
        data 
      });
    } catch (error) {
      console.error('Error updating drone connection:', error);
      res.status(500).json({ error: 'Failed to update connection' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}