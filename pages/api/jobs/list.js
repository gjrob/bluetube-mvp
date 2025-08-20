// pages/api/jobs/list.js
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  try {
    const { 
      status = 'all', 
      location, 
      minBudget, 
      maxBudget, 
      limit = 20,
      offset = 0 
    } = req.query;

    // Build query for your existing jobs table
    let query = supabase
      .from('jobs')
      .select('*');

    // Apply filters
    if (status !== 'all') {
      if (status === 'open') {
        query = query.is('assigned_pilot_id', null);
      } else if (status === 'assigned') {
        query = query.not('assigned_pilot_id', 'is', null);
      }
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (minBudget) {
      query = query.gte('budget', parseFloat(minBudget));
    }

    if (maxBudget) {
      query = query.lte('budget', parseFloat(maxBudget));
    }

    // Apply pagination and ordering
    query = query
      .order('id', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data: jobs, error, count } = await query;

    if (error) {
      console.warn('Jobs database query failed:', error.message);
      
      // Fallback to sample jobs data
      const sampleJobs = [
        {
          id: 1,
          title: 'Wedding Aerial Photography',
          description: 'Capture stunning aerial shots of outdoor wedding ceremony and reception. Need someone with experience in wedding videography and Part 107 certification.',
          budget: 500.00,
          location: 'Charlotte, NC',
          client_pilot_id: 'enterprise_client_1',
          assigned_pilot_id: null,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Construction Progress Documentation',
          description: 'Weekly aerial documentation of building construction progress. Long-term contract opportunity for reliable pilot.',
          budget: 1200.00,
          location: 'Dallas, TX',
          client_pilot_id: 'enterprise_client_2',
          assigned_pilot_id: null,
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          title: 'Real Estate Marketing Video',
          description: 'Professional aerial tour for luxury home listing. Must deliver 4K footage and edited final video.',
          budget: 800.00,
          location: 'Miami, FL',
          client_pilot_id: 'realtor_client_1',
          assigned_pilot_id: 'demo_pilot_1',
          created_at: new Date().toISOString()
        },
        {
          id: 4,
          title: 'Agricultural Survey',
          description: 'Crop health assessment using drone imaging. Experience with agricultural surveys required.',
          budget: 900.00,
          location: 'Kansas City, KS',
          client_pilot_id: 'farm_client_1',
          assigned_pilot_id: null,
          created_at: new Date().toISOString()
        },
        {
          id: 5,
          title: 'Infrastructure Inspection',
          description: 'Bridge and tower inspection for maintenance planning. Must have commercial insurance.',
          budget: 1500.00,
          location: 'Denver, CO',
          client_pilot_id: 'government_client_1',
          assigned_pilot_id: null,
          created_at: new Date().toISOString()
        }
      ];

      // Apply filters to sample data
      let filteredJobs = sampleJobs;
      
      if (status === 'open') {
        filteredJobs = filteredJobs.filter(job => !job.assigned_pilot_id);
      } else if (status === 'assigned') {
        filteredJobs = filteredJobs.filter(job => job.assigned_pilot_id);
      }

      if (location) {
        filteredJobs = filteredJobs.filter(job => 
          job.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      if (minBudget) {
        filteredJobs = filteredJobs.filter(job => job.budget >= parseFloat(minBudget));
      }

      if (maxBudget) {
        filteredJobs = filteredJobs.filter(job => job.budget <= parseFloat(maxBudget));
      }

      return res.status(200).json({
        success: true,
        jobs: filteredJobs.slice(parseInt(offset), parseInt(offset) + parseInt(limit)),
        count: filteredJobs.length,
        totalBudget: filteredJobs.reduce((sum, job) => sum + job.budget, 0),
        source: 'sample_data',
        filters: { status, location, minBudget, maxBudget }
      });
    }

    // Calculate total budget
    const totalBudget = jobs?.reduce((sum, job) => sum + (job.budget || 0), 0) || 0;

    res.status(200).json({
      success: true,
      jobs: jobs || [],
      count: jobs?.length || 0,
      totalBudget: totalBudget,
      source: 'database',
      filters: { status, location, minBudget, maxBudget }
    });

  } catch (error) {
    console.error('Jobs API error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to fetch jobs'
    });
  }
}