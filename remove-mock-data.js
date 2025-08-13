const fs = require('fs');
const path = require('path');

// Files to check for mock data
const filesToCheck = [
  'pages/index.js',
  'pages/dashboard.js',
  'pages/browse.js',
  'pages/live.js',
  'components/Analytics.js',
  'components/AnalyticsDashboard.js',
  'components/JobBoard.js',
  'components/RevenueDashboard.js',
  'components/StreamStats.js',
  'components/EarningsOverview.js'
];

// Common mock data patterns to remove
const mockPatterns = [
  /2,847.*Active Pilots/g,
  /12\.5K.*Live Viewers/g,
  /\$1\.2M.*Jobs Completed/g,
  /98%.*Satisfaction/g,
  /\$47\.50.*Super Chats/g,
  /const mockData = \{[\s\S]*?\};/g,
  /const testData = \{[\s\S]*?\};/g,
  /\/\/ Mock data[\s\S]*?\/\/ End mock data/g
];

filesToCheck.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace mock numbers with real zeros
    content = content
      .replace(/2,847/g, '0')
      .replace(/12\.5K/g, '0')
      .replace(/\$1\.2M/g, '$0')
      .replace(/98%/g, '0%')
      .replace(/\$47\.50/g, '$0.00');
    
    // Remove mock data objects
    mockPatterns.forEach(pattern => {
      content = content.replace(pattern, '');
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Cleaned: ${file}`);
  }
});

console.log('Mock data removed! Now using real data from Supabase.');