// pages/api/faa/analytics.js
import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { pilotId, startDate, endDate } = req.query;

    // Get flight analytics
    const { data: flights, error: flightError } = await supabase
      .from('flight_logs')
      .select(`
        *,
        compliance_checks (
          is_compliant,
          warnings
        )
      `)
      .eq('pilot_id', pilotId)
      .gte('timestamp', startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .lte('timestamp', endDate || new Date().toISOString())
      .order('timestamp', { ascending: false });

    if (flightError) throw flightError;

    // Calculate compliance statistics
    const totalFlights = flights?.length || 0;
    const compliantFlights = flights?.filter(f => 
      f.compliance_checks?.[0]?.is_compliant
    ).length || 0;
    
    const complianceRate = totalFlights > 0 ? 
      Math.round((compliantFlights / totalFlights) * 100) : 100;

    // Aggregate altitude data
    const altitudeData = flights?.map(f => ({
      timestamp: f.timestamp,
      altitude: f.altitude
    })) || [];

    // Count warnings by type
    const warningCounts = {};
    flights?.forEach(f => {
      f.compliance_checks?.[0]?.warnings?.forEach(warning => {
        warningCounts[warning] = (warningCounts[warning] || 0) + 1;
      });
    });

    // Get streaming analytics
    const { data: streams, error: streamError } = await supabase
      .from('streams')
      .select('id, viewer_count, tips_received, duration')
      .eq('pilot_id', pilotId)
      .gte('created_at', startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .lte('created_at', endDate || new Date().toISOString());

    if (streamError) throw streamError;

    const totalViewers = streams?.reduce((sum, s) => sum + (s.viewer_count || 0), 0) || 0;
    const totalTips = streams?.reduce((sum, s) => sum + (s.tips_received || 0), 0) || 0;
    const totalStreamTime = streams?.reduce((sum, s) => sum + (s.duration || 0), 0) || 0;

    // Training progress
    const { data: training } = await supabase
      .from('pilot_training')
      .select('module_id, passed')
      .eq('pilot_id', pilotId);

    const { data: modules } = await supabase
      .from('training_modules')
      .select('id')
      .eq('active', true);

    const trainingProgress = modules?.length ? 
      Math.round((training?.filter(t => t.passed).length / modules.length) * 100) : 0;

    res.status(200).json({
      flightAnalytics: {
        totalFlights,
        compliantFlights,
        complianceRate,
        altitudeData,
        warningCounts,
        averageAltitude: altitudeData.length ? 
          Math.round(altitudeData.reduce((sum, d) => sum + d.altitude, 0) / altitudeData.length) : 0
      },
      streamingAnalytics: {
        totalStreams: streams?.length || 0,
        totalViewers,
        totalTips,
        totalStreamTime,
        averageViewersPerStream: streams?.length ? 
          Math.round(totalViewers / streams.length) : 0
      },
      trainingAnalytics: {
        trainingProgress,
        modulesCompleted: training?.filter(t => t.passed).length || 0,
        totalModules: modules?.length || 0,
        certificationStatus: trainingProgress === 100 ? 'certified' : 'in-progress'
      },
      summary: {
        pilotScore: Math.round((complianceRate + trainingProgress) / 2),
        rank: calculatePilotRank(complianceRate, totalFlights, trainingProgress),
        recommendations: generateRecommendations(complianceRate, warningCounts, trainingProgress)
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}

function calculatePilotRank(complianceRate, totalFlights, trainingProgress) {
  const score = (complianceRate * 0.5) + (trainingProgress * 0.3) + (Math.min(totalFlights / 100, 1) * 20);
  
  if (score >= 90) return 'Expert Pilot';
  if (score >= 70) return 'Advanced Pilot';
  if (score >= 50) return 'Intermediate Pilot';
  return 'Novice Pilot';
}

function generateRecommendations(complianceRate, warningCounts, trainingProgress) {
  const recommendations = [];
  
  if (complianceRate < 80) {
    recommendations.push('Review FAA Part 107 altitude restrictions');
  }
  
  if (warningCounts['Altitude exceeds 400ft AGL limit'] > 0) {
    recommendations.push('Set altitude alerts in your drone app');
  }
  
  if (trainingProgress < 100) {
    recommendations.push('Complete remaining training modules for certification');
  }
  
  return recommendations;
}