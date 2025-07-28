import { supabase } from '../../../utils/supabase-server';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { telemetry, stream_key } = req.body;
    
    if (!stream_key || !telemetry) {
      return res.status(400).json({ error: 'Stream key and telemetry required' });
    }
    
    try {
      // Store telemetry data
      const { data: telemetryData, error: telemetryError } = await supabase
        .from('flight_telemetry')
        .insert({
          stream_key,
          altitude: telemetry.altitude,
          speed: telemetry.speed,
          battery: telemetry.battery,
          signal_strength: telemetry.signalStrength,
          flight_time: telemetry.flightTime,
          heading: telemetry.heading,
          location: telemetry.location
        });
      
      if (telemetryError) throw telemetryError;
      
      // Check for violations
      const violations = [];
      
      // Altitude violation check
      if (telemetry.altitude > 400) {
        const violation = {
          stream_key,
          violation_type: 'ALTITUDE_VIOLATION',
          severity: 'HIGH',
          message: `Altitude ${telemetry.altitude.toFixed(0)}ft exceeds FAA limit of 400ft`,
          location: telemetry.location,
          telemetry: telemetry
        };
        
        violations.push(violation);
        
        // Store violation
        const { error: violationError } = await supabase
          .from('compliance_violations')
          .insert(violation);
        
        if (violationError) console.error('Error storing violation:', violationError);
      }
      
      // Battery warning
      if (telemetry.battery < 20) {
        const violation = {
          stream_key,
          violation_type: 'LOW_BATTERY',
          severity: 'MEDIUM',
          message: `Battery level critical: ${telemetry.battery.toFixed(0)}%`,
          location: telemetry.location,
          telemetry: telemetry
        };
        
        violations.push(violation);
        
        const { error: violationError } = await supabase
          .from('compliance_violations')
          .insert(violation);
      }
      
      // Update drone status
      const { error: statusError } = await supabase
        .from('drone_status')
        .update({ 
          telemetry,
          updated_at: new Date().toISOString()
        })
        .eq('stream_key', stream_key);
      
      res.json({ 
        success: true, 
        message: 'Telemetry data submitted',
        violations: violations.length
      });
    } catch (error) {
      console.error('Error submitting telemetry:', error);
      res.status(500).json({ error: 'Failed to submit telemetry' });
    }
  } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }