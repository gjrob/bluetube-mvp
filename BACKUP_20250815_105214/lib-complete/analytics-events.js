// lib/analytics-events.js - Event tracking utility functions

// Helper function for analytics
const analytics = {
  event: (eventName, parameters = {}) => {
    if (typeof window !== 'undefined') {
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', eventName, parameters)
      }
      
      // Facebook Pixel
      if (window.fbq) {
        window.fbq('track', eventName, parameters)
      }
      
      // Console log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Event:', eventName, parameters)
      }
    }
  }
}

// Export trackEvent object with all tracking methods
export const trackEvent = {
  // Authentication Events
  login: (method) => {
    analytics.event('login', { 
      method,
      event_category: 'authentication',
      event_label: `${method}_login`
    })
  },
  
  signup: (method) => {
    analytics.event('sign_up', { 
      method,
      event_category: 'authentication',
      event_label: `${method}_signup`
    })
  },
  
  logout: () => {
    analytics.event('logout', {
      event_category: 'authentication'
    })
  },
  
  // Streaming Events
  streamStart: (streamId) => {
    analytics.event('stream_start', { 
      stream_id: streamId,
      event_category: 'streaming',
      timestamp: new Date().toISOString()
    })
  },
  
  streamEnd: (streamId, duration) => {
    analytics.event('stream_end', { 
      stream_id: streamId,
      duration_seconds: duration,
      event_category: 'streaming'
    })
  },
  
  streamView: (streamId) => {
    analytics.event('stream_view', { 
      stream_id: streamId,
      event_category: 'engagement'
    })
  },
  
  // Engagement Events
  videoUpload: (videoId, fileSize) => {
    analytics.event('video_upload', {
      video_id: videoId,
      file_size_mb: fileSize,
      event_category: 'content'
    })
  },
  
  tipSent: (amount, streamerId) => {
    analytics.event('tip_sent', {
      value: amount,
      currency: 'USD',
      streamer_id: streamerId,
      event_category: 'monetization'
    })
  },
  
  // Job Marketplace Events
  jobPosted: (jobId, budget) => {
    analytics.event('job_posted', {
      job_id: jobId,
      budget: budget,
      currency: 'USD',
      event_category: 'marketplace'
    })
  },
  
  jobApplied: (jobId) => {
    analytics.event('job_applied', { 
      job_id: jobId,
      event_category: 'marketplace'
    })
  },
  
  jobCompleted: (jobId, rating) => {
    analytics.event('job_completed', {
      job_id: jobId,
      rating: rating,
      event_category: 'marketplace'
    })
  },
  
  // Revenue Events
  purchase: (item, amount) => {
    analytics.event('purchase', {
      value: amount,
      currency: 'USD',
      item_name: item,
      event_category: 'revenue'
    })
    
    // Also send to Facebook Pixel as Purchase event
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value: amount,
        currency: 'USD',
        content_name: item
      })
    }
  },
  
  subscriptionStarted: (plan, price) => {
    analytics.event('subscription_started', {
      plan: plan,
      value: price,
      currency: 'USD',
      event_category: 'revenue'
    })
  },
  
  // User Behavior
  searchPerformed: (query, results) => {
    analytics.event('search', {
      search_term: query,
      results_count: results,
      event_category: 'engagement'
    })
  },
  
  filterApplied: (filterType, value) => {
    analytics.event('filter_applied', {
      filter_type: filterType,
      filter_value: value,
      event_category: 'engagement'
    })
  },
  
  // Page Events
  pageView: (pageName) => {
    analytics.event('page_view', {
      page_title: pageName,
      page_location: window.location.href,
      page_path: window.location.pathname
    })
  },
  
  // Error Events
  errorOccurred: (errorType, errorMessage) => {
    analytics.event('error', {
      error_type: errorType,
      error_message: errorMessage,
      event_category: 'errors'
    })
  },
  
  // Custom Events
  custom: (eventName, parameters = {}) => {
    analytics.event(eventName, parameters)
  }
}

// Export analytics helper for direct use
export { analytics }