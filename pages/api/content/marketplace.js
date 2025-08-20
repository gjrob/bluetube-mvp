
// pages/api/content/marketplace.js
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    return getMarketplaceContent(req, res);
  } else if (method === 'POST') {
    return createContent(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// GET marketplace content
async function getMarketplaceContent(req, res) {
  try {
    const { 
      featured, 
      category = 'all', 
      priceRange,
      droneModel,
      location,
      sortBy = 'newest',
      limit = 12,
      offset = 0 
    } = req.query;

    // Build query for drone_content table
    let query = supabase.from('drone_content').select('*');

    // Apply filters
    if (featured === 'true') {
      query = query.eq('is_featured_content', true);
    }

    if (category && category !== 'all') {
      query = query.eq('content_category', category);
    }

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split('-').map(p => parseFloat(p));
      if (minPrice !== undefined) query = query.gte('selling_price', minPrice);
      if (maxPrice !== undefined) query = query.lte('selling_price', maxPrice);
    }

    if (droneModel) {
      query = query.ilike('drone_used', `%${droneModel}%`);
    }

    if (location) {
      query = query.contains('capture_location', { location: location });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        query = query.order('selling_price', { ascending: true });
        break;
      case 'price_high':
        query = query.order('selling_price', { ascending: false });
        break;
      case 'popular':
        query = query.order('download_purchases', { ascending: false });
        break;
      case 'rating':
        query = query.order('content_rating', { ascending: false });
        break;
      default: // newest
        query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data: content, error } = await query;

    if (error) {
      console.warn('Marketplace database query failed:', error.message);
      
      // Fallback to sample content
      const sampleContent = [
        {
          id: 1,
          creator_pilot_id: 'demo_pilot_1',
          content_title: 'Sunset Beach Flyover 4K',
          content_description: 'Beautiful 4K aerial footage of sunset over pristine beach. Perfect for travel vlogs, documentaries, or commercial use.',
          content_category: 'video',
          file_storage_url: '/sample/sunset_beach_4k.mp4',
          thumbnail_image_url: '/sample/thumbs/sunset_beach.jpg',
          selling_price: 25.00,
          drone_used: 'DJI Mini 4 Pro',
          capture_location: { location: 'Malibu, CA', coordinates: [34.0259, -118.7798] },
          content_tags: ['sunset', 'beach', 'ocean', '4k', 'cinematic'],
          download_purchases: 47,
          is_featured_content: true,
          content_rating: 4.8,
          created_at: '2024-08-15T18:30:00Z'
        },
        {
          id: 2,
          creator_pilot_id: 'demo_pilot_2',
          content_title: 'Mountain Range Survey',
          content_description: 'Epic cinematic shots of snow-capped mountain ranges. Includes multiple angles and altitudes.',
          content_category: 'video',
          file_storage_url: '/sample/mountain_range.mp4',
          thumbnail_image_url: '/sample/thumbs/mountains.jpg',
          selling_price: 35.00,
          drone_used: 'DJI Mavic 3',
          capture_location: { location: 'Rocky Mountains, CO', coordinates: [39.7392, -104.9903] },
          content_tags: ['mountains', 'landscape', 'snow', 'cinematic', 'nature'],
          download_purchases: 32,
          is_featured_content: true,
          content_rating: 4.9,
          created_at: '2024-08-14T14:20:00Z'
        },
        {
          id: 3,
          creator_pilot_id: 'demo_pilot_3',
          content_title: 'Urban Architecture Tour',
          content_description: 'Professional building and cityscape footage. Great for real estate, corporate videos, or urban documentaries.',
          content_category: 'video',
          file_storage_url: '/sample/urban_architecture.mp4',
          thumbnail_image_url: '/sample/thumbs/urban.jpg',
          selling_price: 50.00,
          drone_used: 'DJI Inspire 2',
          capture_location: { location: 'Downtown Miami, FL', coordinates: [25.7617, -80.1918] },
          content_tags: ['urban', 'architecture', 'cityscape', 'professional', 'buildings'],
          download_purchases: 28,
          is_featured_content: false,
          content_rating: 4.7,
          created_at: '2024-08-13T10:15:00Z'
        },
        {
          id: 4,
          creator_pilot_id: 'demo_pilot_1',
          content_title: 'Agricultural Drone Survey Package',
          content_description: 'Complete agricultural survey footage including crop health assessment and field mapping data.',
          content_category: 'package',
          file_storage_url: '/sample/agricultural_survey.zip',
          thumbnail_image_url: '/sample/thumbs/agriculture.jpg',
          selling_price: 75.00,
          drone_used: 'DJI Phantom 4 Multispectral',
          capture_location: { location: 'Iowa Farmland', coordinates: [41.8780, -93.0977] },
          content_tags: ['agriculture', 'survey', 'mapping', 'crops', 'data'],
          download_purchases: 15,
          is_featured_content: false,
          content_rating: 4.6,
          created_at: '2024-08-12T08:45:00Z'
        },
        {
          id: 5,
          creator_pilot_id: 'demo_pilot_2',
          content_title: 'Wedding Ceremony Aerial Highlights',
          content_description: 'Romantic aerial shots perfect for wedding videographers. Multiple ceremony moments captured.',
          content_category: 'video',
          file_storage_url: '/sample/wedding_aerial.mp4',
          thumbnail_image_url: '/sample/thumbs/wedding.jpg',
          selling_price: 40.00,
          drone_used: 'DJI Air 2S',
          capture_location: { location: 'Napa Valley, CA', coordinates: [38.2975, -122.2869] },
          content_tags: ['wedding', 'ceremony', 'romantic', 'celebration', 'events'],
          download_purchases: 23,
          is_featured_content: false,
          content_rating: 4.5,
          created_at: '2024-08-11T16:30:00Z'
        }
      ];

      // Apply filters to sample data
      let filteredContent = sampleContent;

      if (featured === 'true') {
        filteredContent = filteredContent.filter(item => item.is_featured_content);
      }

      if (category && category !== 'all') {
        filteredContent = filteredContent.filter(item => item.content_category === category);
      }

      if (priceRange) {
        const [minPrice, maxPrice] = priceRange.split('-').map(p => parseFloat(p));
        filteredContent = filteredContent.filter(item => {
          const price = item.selling_price;
          return (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice);
        });
      }

      if (droneModel) {
        filteredContent = filteredContent.filter(item => 
          item.drone_used.toLowerCase().includes(droneModel.toLowerCase())
        );
      }

      // Apply sorting
      switch (sortBy) {
        case 'price_low':
          filteredContent.sort((a, b) => a.selling_price - b.selling_price);
          break;
        case 'price_high':
          filteredContent.sort((a, b) => b.selling_price - a.selling_price);
          break;
        case 'popular':
          filteredContent.sort((a, b) => b.download_purchases - a.download_purchases);
          break;
        case 'rating':
          filteredContent.sort((a, b) => b.content_rating - a.content_rating);
          break;
      }

      return res.status(200).json({
        success: true,
        content: filteredContent.slice(parseInt(offset), parseInt(offset) + parseInt(limit)),
        count: filteredContent.length,
        totalValue: filteredContent.reduce((sum, item) => sum + item.selling_price, 0),
        categories: ['video', 'photo', 'package', 'nft'],
        source: 'sample_data',
        filters: { featured, category, priceRange, droneModel, location, sortBy }
      });
    }

    // Calculate total value
    const totalValue = content?.reduce((sum, item) => sum + (item.selling_price || 0), 0) || 0;

    res.status(200).json({
      success: true,
      content: content || [],
      count: content?.length || 0,
      totalValue: totalValue,
      source: 'database',
      filters: { featured, category, priceRange, droneModel, location, sortBy }
    });

  } catch (error) {
    console.error('Marketplace API error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to fetch marketplace content'
    });
  }
}

// CREATE new content
async function createContent(req, res) {
  try {
    const {
      creatorPilotId,
      title,
      description,
      category = 'video',
      fileUrl,
      thumbnailUrl,
      price = 0,
      droneUsed,
      location,
      tags = []
    } = req.body;

    if (!creatorPilotId || !title) {
      return res.status(400).json({ error: 'Creator ID and title required' });
    }

    const newContent = {
      creator_pilot_id: creatorPilotId,
      content_title: title,
      content_description: description,
      content_category: category,
      file_storage_url: fileUrl,
      thumbnail_image_url: thumbnailUrl,
      selling_price: price,
      drone_used: droneUsed,
      capture_location: location,
      content_tags: tags,
      download_purchases: 0,
      is_featured_content: false,
      content_rating: 5.0
    };

    const { data: createdContent, error } = await supabase
      .from('drone_content')
      .insert(newContent)
      .select()
      .single();

    if (error) {
      console.error('Failed to create content:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    res.status(201).json({
      success: true,
      content: createdContent,
      message: 'Content uploaded successfully'
    });

  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
