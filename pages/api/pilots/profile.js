
// pages/api/pilot/profile.js
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    return getPilotProfile(req, res);
  } else if (method === 'PUT') {
    return updatePilotProfile(req, res);
  } else if (method === 'POST') {
    return createPilotProfile(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// GET pilot profile
async function getPilotProfile(req, res) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Get pilot from new drone_pilots table
    const { data: pilot, error } = await supabase
      .from('drone_pilots')
      .select('*')
      .eq('supabase_user_id', userId)
      .single();

    if (error || !pilot) {
      console.warn('Pilot not found, returning default profile');
      
      // Return default pilot profile
      const defaultPilot = {
        id: 'temp_' + userId,
        supabase_user_id: userId,
        pilot_name: 'New Pilot',
        certification_level: 'Part 107',
        equipment_owned: ['DJI Mini 4 Pro'],
        service_locations: ['Local Area'],
        hourly_rate: 150.00,
        completed_flights: 0,
        pilot_rating: 5.0,
        is_verified: false,
        created_at: new Date().toISOString(),
        stats: {
          totalEarnings: 0,
          totalFlightHours: 0,
          averageRating: 5.0,
          completedJobs: 0
        }
      };

      return res.status(200).json({ 
        success: true, 
        pilot: defaultPilot, 
        source: 'default' 
      });
    }

    // Get additional stats from other tables
    const stats = await getPilotStats(userId);

    res.status(200).json({ 
      success: true, 
      pilot: {
        ...pilot,
        stats
      }, 
      source: 'database' 
    });

  } catch (error) {
    console.error('Get pilot profile error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// CREATE new pilot profile
async function createPilotProfile(req, res) {
  try {
    const { 
      userId, 
      pilotName, 
      certificationLevel = 'Part 107',
      equipmentOwned = ['DJI Mini 4 Pro'],
      serviceLocations = ['Local Area'],
      hourlyRate = 150.00 
    } = req.body;

    if (!userId || !pilotName) {
      return res.status(400).json({ error: 'User ID and pilot name required' });
    }

    const newPilot = {
      supabase_user_id: userId,
      pilot_name: pilotName,
      certification_level: certificationLevel,
      equipment_owned: equipmentOwned,
      service_locations: serviceLocations,
      hourly_rate: hourlyRate,
      completed_flights: 0,
      pilot_rating: 5.0,
      is_verified: false
    };

    const { data: createdPilot, error } = await supabase
      .from('drone_pilots')
      .insert(newPilot)
      .select()
      .single();

    if (error) {
      console.error('Failed to create pilot profile:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    res.status(201).json({ 
      success: true, 
      pilot: createdPilot, 
      source: 'created' 
    });

  } catch (error) {
    console.error('Create pilot profile error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// UPDATE pilot profile
async function updatePilotProfile(req, res) {
  try {
    const { userId } = req.query;
    const updateData = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.supabase_user_id;
    delete updateData.created_at;

    const { data: updatedPilot, error } = await supabase
      .from('drone_pilots')
      .update(updateData)
      .eq('supabase_user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Failed to update pilot profile:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    res.status(200).json({ 
      success: true, 
      pilot: updatedPilot, 
      source: 'updated' 
    });

  } catch (error) {
    console.error('Update pilot profile error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// Helper function to get pilot stats
async function getPilotStats(userId) {
  try {
    // Get total earnings from payments table
    const { data: payments } = await supabase
      .from('pilot_payments')
      .select('payment_amount')
      .eq('recipient_pilot_id', userId)
      .eq('payment_status', 'completed');

    const totalEarnings = payments?.reduce((sum, payment) => sum + payment.payment_amount, 0) || 0;

    // Get completed jobs count
    const { data: jobs, count: completedJobs } = await supabase
      .from('jobs')
      .select('id', { count: 'exact' })
      .eq('assigned_pilot_id', userId);

    // Get streaming stats
    const { data: streams } = await supabase
      .from('streaming_sessions')
      .select('total_stream_time')
      .eq('pilot_user_id', userId);

    const totalStreamTime = streams?.reduce((sum, stream) => sum + (stream.total_stream_time || 0), 0) || 0;

    return {
      totalEarnings: totalEarnings,
      totalFlightHours: Math.floor(totalStreamTime / 60), // Convert minutes to hours
      averageRating: 5.0, // Calculate from reviews when implemented
      completedJobs: completedJobs || 0,
      totalStreamTime: totalStreamTime
    };

  } catch (error) {
    console.warn('Failed to get pilot stats:', error);
    return {
      totalEarnings: 0,
      totalFlightHours: 0,
      averageRating: 5.0,
      completedJobs: 0,
      totalStreamTime: 0
    };
  }
}
