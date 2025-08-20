// utils/replaceMockData.js
// Utility to replace all mock data in your components

export const replaceMockData = {
  // Replace in pages/index.js
  homepage: {
    oldStats: [
      { number: '2,847', label: 'Active Pilots' },
      { number: '12.5K', label: 'Live Viewers' },
      { number: '$1.2M', label: 'Jobs Completed' },
      { number: '98%', label: 'Satisfaction' }
    ],
    newImplementation: 'Use useRealStats hook from useRealData.js'
  },

  // Replace in pages/live.js (Cloud Storage section)
  cloudStorage: {
    old: {
      totalFiles: '1,234',
      deliveries: '89',  
      downloads: '3,456',
      revenue: '$234'
    },
    implementation: 'Import useRealStats and use stats.totalFiles, stats.deliveries, etc.'
  },

  // Replace placeholder emails
  emails: {
    old: ['test@example.com', 'john@example.com', 'pilot@example.com'],
    new: 'user?.email || ""'
  },

  // Replace placeholder names
  names: {
    old: ['John Doe', 'Jane Doe', 'Test User'],
    new: 'user?.full_name || user?.email?.split("@")[0] || "User"'
  }
}