import { supabase } from '../../../utils/supabase-server';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { stream_key } = req.query;
    
    try {
      // Fetch last 1000 telemetry records for training
      const { data: telemetryData, error } = await supabase
        .from('flight_telemetry')
        .select('*')
        .eq('stream_key', stream_key)
        .order('timestamp', { ascending: false })
        .limit(1000);

      if (error) throw error;

      res.json({
        success: true,
        trainingData: telemetryData,
        count: telemetryData.length
      });
    } catch (error) {
      console.error('Error fetching training data:', error);
      res.status(500).json({ error: 'Failed to fetch training data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}