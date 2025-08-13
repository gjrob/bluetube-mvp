// lib/analytics-enhanced.js - Complete Analytics with Social Login Tracking
// This file should ONLY contain the analytics functions, no example code

export const analytics = {
  // Initialize analytics
  init: () => {
    if (typeof window !== 'undefined') {
      // Google Analytics
      window.gtag = window.gtag || function() {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push(arguments)
      }
      
      // Facebook Pixel
      window.fbq = window.fbq || function() {
        window.fbq.callMethod ? 
          window.fbq.callMethod.apply(window.fbq, arguments) : 
          window.fbq.queue.push(arguments)
      }
    }
  },

  // Track page views
  pageView: (url, title) => {
    if (typeof window !== 'undefined') {
      // Google Analytics 4
      if (window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || 'G-SXBZSEKTL4', {
          page_path: url,
          page_title: title
        })
      }
      
      // Facebook Pixel
      if (window.fbq) {
        window.fbq('track', 'PageView')
      }

      // Microsoft Clarity
      if (window.clarity) {
        window.clarity('set', 'page', url)
      }
    }
  },

  // Track custom events
  event: (action, parameters = {}) => {
    if (typeof window !== 'undefined') {
      // Google Analytics 4
      if (window.gtag) {
        window.gtag('event', action, {
          ...parameters,
          event_timestamp: new Date().toISOString()
        })
      }
      
      // Facebook Pixel
      if (window.fbq) {
        const fbEvent = fbPixelEventMap[action] || 'CustomEvent'
        window.fbq('track', fbEvent, parameters)
      }

      // Console log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics Event:', {
          action,
          parameters,
          timestamp: new Date().toISOString()
        })
      }
    }
  },

  // Track user identification
  identify: (userId, traits = {}) => {
    if (typeof window !== 'undefined') {
      // Google Analytics 4
      if (window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || 'G-SXBZSEKTL4', {
          user_id: userId,
          user_properties: traits
        })
      }
      
      // Facebook Pixel
      if (window.fbq) {
        window.fbq('init', process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID, {
          external_id: userId,
          em: traits.email,
          fn: traits.firstName,
          ln: traits.lastName
        })
      }
    }
  },

  // Track social login attempts
  trackLoginAttempt: (provider) => {
    analytics.event('login_attempt', {
      method: provider,
      event_category: 'authentication',
      event_label: `${provider}_login_attempt`
    })
  },

  // Track successful social login
  trackLoginSuccess: (provider, userId, email) => {
    // Main login event
    analytics.event('login', {
      method: provider,
      event_category: 'authentication',
      event_label: `${provider}_login_success`,
      user_id: userId,
      user_email: email,
      engagement_time_msec: 100
    })

    // Provider-specific event
    analytics.event(`${provider}_login`, {
      user_id: userId,
      user_email: email,
      login_time: new Date().toISOString()
    })

    // Set user properties
    analytics.identify(userId, {
      email: email,
      login_method: provider,
      last_login: new Date().toISOString()
    })

    // Track as conversion
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': `${process.env.NEXT_PUBLIC_GA_ID || 'G-SXBZSEKTL4'}/login`,
        'value': 1.0,
        'currency': 'USD'
      })
    }
  },

  // Track login failures
  trackLoginFailure: (provider, error) => {
    analytics.event('login_failed', {
      method: provider,
      event_category: 'authentication',
      event_label: `${provider}_login_failed`,
      error_message: error,
      error_code: error.code || 'unknown'
    })
  },

  // Track signup
  trackSignup: (provider, userId, email) => {
    analytics.event('sign_up', {
      method: provider,
      event_category: 'authentication',
      event_label: `${provider}_signup`,
      user_id: userId,
      user_email: email
    })

    // Facebook Pixel signup
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'CompleteRegistration', {
        content_name: 'BlueTubeTV Account',
        status: true,
        value: 0,
        currency: 'USD'
      })
    }
  },

  // Track logout
  trackLogout: (userId) => {
    analytics.event('logout', {
      event_category: 'authentication',
      user_id: userId,
      session_duration: typeof window !== 'undefined' ? 
        Date.now() - (window.sessionStart || Date.now()) : 0
    })
  }
}

// Facebook Pixel event mapping
const fbPixelEventMap = {
  'login': 'CustomLogin',
  'sign_up': 'CompleteRegistration',
  'login_attempt': 'InitiateCheckout',
  'login_failed': 'CustomError',
  'logout': 'CustomLogout',
  'purchase': 'Purchase',
  'stream_start': 'ViewContent',
  'video_upload': 'AddToCart',
  'job_posted': 'Lead',
  'tip_sent': 'Purchase'
}

// Dashboard query helpers
export const analyticsQueries = {
  // Get login methods breakdown
  getLoginMethodBreakdown: () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        custom_map: {
          'dimension1': 'login_method'
        }
      })
    }
  },

  // Track conversion funnel
  trackFunnel: (step) => {
    const funnelSteps = {
      'view_login': 1,
      'attempt_login': 2,
      'complete_login': 3,
      'view_dashboard': 4,
      'first_action': 5
    }
    
    analytics.event('funnel_step', {
      funnel_name: 'user_onboarding',
      step_number: funnelSteps[step],
      step_name: step
    })
  },

  // Track user engagement
  trackEngagement: (action, value) => {
    analytics.event('user_engagement', {
      engagement_type: action,
      engagement_value: value,
      engagement_time_msec: Date.now()
    })
  }
}

// Convenient event tracking functions
export const trackEvent = {
  // Authentication Events
  login: (method) => analytics.trackLoginSuccess(method, null, null),
  loginWithDetails: (method, userId, email) => analytics.trackLoginSuccess(method, userId, email),
  signup: (method) => analytics.trackSignup(method, null, null),
  logout: () => analytics.trackLogout(null),
  
  // Streaming Events
  streamStart: (streamId) => analytics.event('stream_start', { 
    stream_id: streamId,
    timestamp: new Date().toISOString()
  }),
  streamEnd: (streamId, duration) => analytics.event('stream_end', { 
    stream_id: streamId,
    duration_seconds: duration
  }),
  streamView: (streamId) => analytics.event('stream_view', { stream_id: streamId }),
  
  // Engagement Events
  videoUpload: (videoId, fileSize) => analytics.event('video_upload', {
    video_id: videoId,
    file_size_mb: fileSize
  }),
  tipSent: (amount, streamerId) => analytics.event('tip_sent', {
    value: amount,
    currency: 'USD',
    streamer_id: streamerId
  }),
  
  // Job Marketplace Events
  jobPosted: (jobId, budget) => analytics.event('job_posted', {
    job_id: jobId,
    budget: budget
  }),
  jobApplied: (jobId) => analytics.event('job_applied', { job_id: jobId }),
  jobCompleted: (jobId, rating) => analytics.event('job_completed', {
    job_id: jobId,
    rating: rating
  }),
  
  // Revenue Events
  purchase: (item, amount) => analytics.event('purchase', {
    value: amount,
    currency: 'USD',
    item_name: item
  }),
  subscriptionStarted: (plan, price) => analytics.event('subscription_started', {
    plan: plan,
    value: price,
    currency: 'USD'
  }),
  
  // User Behavior
  searchPerformed: (query, results) => analytics.event('search', {
    search_term: query,
    results_count: results
  }),
  filterApplied: (filterType, value) => analytics.event('filter_applied', {
    filter_type: filterType,
    filter_value: value
  })
}

