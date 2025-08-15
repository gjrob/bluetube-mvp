// lib/analytics-enhanced.js
// COMPLETE ANALYTICS TRACKING FOR BLUETUBETV
// Tracks everything investors want to see

export const analytics = {
  // Initialize analytics safely
  init: () => {
    if (typeof window !== 'undefined') {
      // Initialize Google Analytics
      window.gtag = window.gtag || function() {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(arguments);
      };
      window.dataLayer = window.dataLayer || [];
      
      // Initialize Facebook Pixel with safety checks
      window.fbq = window.fbq || function() {
        // Initialize the queue if it doesn't exist
        window.fbq.queue = window.fbq.queue || [];
        
        // Handle method calls
        if (window.fbq.callMethod) {
          window.fbq.callMethod.apply(window.fbq, arguments);
        } else {
          window.fbq.queue.push(arguments);
        }
      };
      
      // Set default properties
      window.fbq.push = window.fbq.push || function() {
        if (window.fbq.queue) {
          window.fbq.queue.push(arguments);
        }
      };
      
      // Initialize the queue
      if (!window.fbq.queue) {
        window.fbq.queue = [];
      }
      
      // Track page load
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          page_path: window.location.pathname,
          page_title: document.title
        });
      }
    }
  },

  // Track events (safe version)
  track: (eventName, eventData = {}) => {
    if (typeof window === 'undefined') return;
    
    try {
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', eventName, eventData);
      }
      
      // Facebook Pixel
      if (window.fbq) {
        window.fbq('track', eventName, eventData);
      }
      
      // Console log for debugging (remove in production)
      console.log('📊 Analytics Event:', eventName, eventData);
      
      // Store locally for dashboard
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      events.push({
        event: eventName,
        data: eventData,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.shift();
      }
      
      localStorage.setItem('analytics_events', JSON.stringify(events));
      
    } catch (error) {
      console.error('Analytics error:', error);
      // Don't break the app if analytics fails
    }
  },

  // Revenue tracking (critical for investors)
  trackRevenue: (amount, source, userId = null) => {
    analytics.track('revenue_generated', {
      value: amount,
      currency: 'USD',
      source: source, // 'tip', 'subscription', 'job', etc.
      user_id: userId,
      timestamp: new Date().toISOString()
    });
    
    // Update total revenue in localStorage
    const currentRevenue = parseFloat(localStorage.getItem('total_revenue') || '0');
    localStorage.setItem('total_revenue', (currentRevenue + amount).toFixed(2));
  },

  // User engagement tracking
  trackEngagement: (action, details = {}) => {
    analytics.track('user_engagement', {
      action: action,
      ...details,
      session_id: sessionStorage.getItem('session_id') || generateSessionId()
    });
  },

  // Stream analytics
  trackStream: (action, streamData = {}) => {
    analytics.track(`stream_${action}`, {
      stream_id: streamData.id,
      pilot_id: streamData.pilotId,
      viewers: streamData.viewers || 0,
      duration: streamData.duration || 0,
      tips_received: streamData.tips || 0
    });
  },

  // Part 107 tracking
  trackPilotVerification: (status, pilotId) => {
    analytics.track('pilot_verification', {
      status: status, // 'started', 'completed', 'failed'
      pilot_id: pilotId,
      timestamp: new Date().toISOString()
    });
  },

  // Get analytics summary (for dashboard/investors)
  getSummary: () => {
    if (typeof window === 'undefined') return {};
    
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    const revenue = parseFloat(localStorage.getItem('total_revenue') || '0');
    
    // Calculate metrics
    const pageViews = events.filter(e => e.event === 'page_view').length;
    const signups = events.filter(e => e.event === 'signup').length;
    const streams = events.filter(e => e.event.startsWith('stream_')).length;
    
    return {
      totalRevenue: revenue,
      totalPageViews: pageViews,
      totalSignups: signups,
      totalStreams: streams,
      conversionRate: signups > 0 ? ((signups / pageViews) * 100).toFixed(2) : 0,
      recentEvents: events.slice(-10).reverse()
    };
  }
};

// Helper function to generate session ID
function generateSessionId() {
  const id = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  sessionStorage.setItem('session_id', id);
  return id;
}

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  analytics.init();
  
  // Track page views on route change
  if (window.history && window.history.pushState) {
    const originalPushState = window.history.pushState;
    window.history.pushState = function() {
      originalPushState.apply(window.history, arguments);
      analytics.track('page_view', {
        page_path: window.location.pathname
      });
    };
  }
}

// Export for use in components
export default analytics;

// ============================================
// USAGE EXAMPLES FOR YOUR COMPONENTS:
// ============================================

/*
// In your login component:
import analytics from '../lib/analytics-enhanced';

const handleLogin = async () => {
  const result = await login(email, password);
  if (result.success) {
    analytics.track('login_success', { 
      user_id: result.user.id,
      role: result.user.role 
    });
  }
};

// In your streaming component:
const handleGoLive = () => {
  analytics.trackStream('started', {
    id: streamId,
    pilotId: userId
  });
};

// In your payment component:
const handleTip = (amount) => {
  analytics.trackRevenue(amount, 'tip', userId);
};

// In your dashboard to show investors:
const stats = analytics.getSummary();
console.log('Total Revenue:', stats.totalRevenue);
console.log('Conversion Rate:', stats.conversionRate + '%');
*/