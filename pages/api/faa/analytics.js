import { supabase } from '../../../utils/supabase-server';

export default async function handler(req, res) {
  const { stream_key } = req.query;
  
  if (!stream_key) {
    return res.status(400).json({ error: 'Stream key required' });
  }

  if (req.method === 'GET') {
    try {
      // Get telemetry count
      const { count: totalFlights } = await supabase
        .from('flight_telemetry')
        .select('*', { count: 'exact', head: true })
        .eq('stream_key', stream_key);
      
      // Get telemetry data for calculations
      const { data: telemetryData } = await supabase
        .from('flight_telemetry')
        .select('altitude, flight_time')
        .eq('stream_key', stream_key)
        .order('timestamp', { ascending: false })  // Changed from created_at to timestamp
        .limit(100);
      
      // Get violations
      const { data: violations, count: violationCount } = await supabase
        .from('compliance_violations')
        .select('*', { count: 'exact' })
        .eq('stream_key', stream_key)
        .order('timestamp', { ascending: false })  // Changed from created_at to timestamp
        .limit(10);
      
      // Calculate analytics
      const avgAltitude = telemetryData?.length > 0
        ? telemetryData.reduce((sum, t) => sum + (t.altitude || 0), 0) / telemetryData.length
        : 0;
      
      const totalFlightTime = telemetryData?.length > 0
        ? telemetryData.reduce((sum, t) => sum + (t.flight_time || 0), 0)
        : 0;
      
      const complianceRate = totalFlights > 0
        ? ((totalFlights - (violationCount || 0)) / totalFlights * 100)
        : 100;
      
      const analytics = {
        totalFlights: totalFlights || 0,
        violations: violationCount || 0,
        averageAltitude: avgAltitude,
        totalFlightTime: totalFlightTime,
        complianceRate: complianceRate,
        recentViolations: violations || [],
        airspaceTypes: ['Class G', 'Class E', 'Class D'],
        weatherConditions: ['VFR', 'MVFR', 'IFR']
      };
      
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ error: 'Failed to fetch analytics', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
