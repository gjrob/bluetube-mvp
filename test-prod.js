const https = require('https');

const tests = [
  'https://bluetubetv.live/',
  'https://bluetubetv.live/api/generate-stream-key',
  'https://bluetubetv.live/api/super-chat',
  'https://bluetubetv.live/api/pilot/verify-part107',
  'https://bluetubetv.live/dashboard',
  'https://bluetubetv.live/live',
  'https://bluetubetv.live/pilot-setup',
  'https://bluetubetv.live/browse',
  'https://bluetubetv.live/marketplace'
];

console.log('Testing BlueTubeTV Production...\n');

tests.forEach(url => {
  https.get(url, (res) => {
    const status = res.statusCode;
    const icon = (status >= 200 && status < 400) ? '✅' : '❌';
    console.log(`${icon} ${url.replace('https://bluetubetv.live', '')} - Status: ${status}`);
  }).on('error', (err) => {
    console.log(`❌ ${url} - Error: ${err.message}`);
  });
});