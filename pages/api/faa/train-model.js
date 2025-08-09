// pages/api/faa/train-model.js
import { supabase } from '../../../lib/supabase'
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { flightData, location, altitude, droneModel, pilotId } = req.body;

    // Store flight data in Supabase for training
    const { data: flightRecord, error: insertError } = await supabase
      .from('flight_logs')
      .insert({
        pilot_id: pilotId,
        drone_model: droneModel,
        altitude: altitude,
        location: location,
        timestamp: new Date().toISOString(),
        stream_id: flightData?.streamId
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Check compliance against stored rules
    const { data: complianceRules, error: rulesError } = await supabase
      .from('faa_compliance_rules')
      .select('*')
      .eq('active', true);

    if (rulesError) throw rulesError;

    // Perform compliance checks
    const warnings = [];
    let isCompliant = true;

    // Check altitude
    if (altitude > 400) {
      warnings.push('Altitude exceeds 400ft AGL limit');
      isCompliant = false;
    }

    // Check restricted airspace from database
    const { data: restrictedZones, error: zoneError } = await supabase
      .from('restricted_airspace')
      .select('*')
      .gte('lat', location.lat - 0.1)
      .lte('lat', location.lat + 0.1)
      .gte('lng', location.lng - 0.1)
      .lte('lng', location.lng + 0.1);

    if (!zoneError && restrictedZones) {
      restrictedZones.forEach(zone => {
        const distance = calculateDistance(
          location.lat, 
          location.lng, 
          zone.lat, 
          zone.lng
        );
        if (distance < zone.radius_miles) {
          warnings.push(`Within ${zone.name} restricted airspace`);
          isCompliant = false;
        }
      });
    }

    // Store compliance result
    const { data: complianceRecord, error: complianceError } = await supabase
      .from('compliance_checks')
      .insert({
        flight_log_id: flightRecord.id,
        is_compliant: isCompliant,
        warnings: warnings,
        checked_at: new Date().toISOString()
      })
      .select()
      .single();

    if (complianceError) throw complianceError;

    // Update training data for ML model
    await supabase
      .from('training_data')
      .insert({
        flight_data: flightRecord,
        compliance_result: complianceRecord,
        features: {
          altitude,
          time_of_day: new Date().getHours(),
          day_of_week: new Date().getDay(),
          drone_model: droneModel
        }
      });

    res.status(200).json({
      compliance: {
        isCompliant,
        warnings,
        checkId: complianceRecord.id
      },
      flightLogId: flightRecord.id,
      recommendations: [
        'Keep altitude below 400ft AGL',
        'Maintain visual line of sight',
        'Check NOTAMs before flight',
        'Register drone with FAA'
      ],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('FAA compliance check error:', error);
    res.status(500).json({ error: 'Failed to check compliance' });
  }
}

// Helper function
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI/180);
}