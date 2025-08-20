// simple-test.js
// BlueTubeTV Simple Test - ACTUALLY WORKS
// No external dependencies, just checks what you have

const fs = require('fs');
const path = require('path');

console.log('\n🚁 BlueTubeTV Platform Test\n');
console.log('================================\n');

let passed = 0;
let failed = 0;

// Simple test function
function test(name, condition) {
  if (condition) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    console.log(`❌ ${name}`);
    failed++;
  }
}

// 1. Check Critical Files
console.log('📁 Checking Critical Files:\n');

const criticalFiles = [
  'package.json',
  'next.config.js',
  'pages/index.js',
  'pages/_app.js'
];

criticalFiles.forEach(file => {
  test(`${file} exists`, fs.existsSync(file));
});

// 2. Check Components
console.log('\n🧩 Checking Components:\n');

const components = [
  'components/Analytics.js',
  'components/LivepeerStream.js',
  'components/NFTMinting.js',
  'components/JobBoard.js',
  'components/RevenueDashboard.js',
  'components/SuperChat.js',
  'components/Upload.js',
  'components/ContentManager.js'
];

components.forEach(file => {
  test(`${file}`, fs.existsSync(file));
});

// 3. Check API Routes
console.log('\n🔌 Checking API Routes:\n');

const apiDir = 'pages/api';
if (fs.existsSync(apiDir)) {
  const apiFiles = fs.readdirSync(apiDir);
  test(`API directory has ${apiFiles.length} files`, apiFiles.length > 0);
  
  // Check for specific important APIs
  ['tip.js', 'super-chat.js', 'upload-video.js'].forEach(api => {
    test(`${api} exists`, fs.existsSync(path.join(apiDir, api)));
  });
}

// 4. Check Database Config
console.log('\n🗄️ Checking Database:\n');

const dbFiles = [
  'lib/supabase.js',
  'lib/supabaseClient.js'
];

dbFiles.forEach(file => {
  test(`${file}`, fs.existsSync(file));
});

// 5. Check Environment File
console.log('\n🔐 Checking Environment:\n');

test('.env.local exists', fs.existsSync('.env.local'));

if (fs.existsSync('.env.local')) {
  const env = fs.readFileSync('.env.local', 'utf8');
  test('Has Supabase URL', env.includes('SUPABASE_URL'));
  test('Has Supabase Key', env.includes('SUPABASE_ANON_KEY'));
}

// 6. Check Payment Files
console.log('\n💰 Checking Payment System:\n');

test('Stripe checkout API', fs.existsSync('pages/api/create-checkout-session.js'));
test('Tip API', fs.existsSync('pages/api/tip.js'));
test('SuperChat component', fs.existsSync('components/SuperChat.js'));

// 7. Check Web3 Files
console.log('\n🌐 Checking Web3:\n');

test('web3.html', fs.existsSync('pages/web3.html'));
test('Contract displayed', fs.existsSync('pages/web3.html') && 
  fs.readFileSync('pages/web3.html', 'utf8').includes('0xD699d61Ce1554d4f7ef4b853283845F354f8a9Db'));

// Summary
console.log('\n================================');
console.log('📊 RESULTS:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Success Rate: ${Math.round((passed/(passed+failed))*100)}%`);

if (failed === 0) {
  console.log('\n🎉 Everything looks good!');
} else {
  console.log('\n⚠️  Some files are missing. Check the ❌ items above.');
}

console.log('\n💡 To test if buttons work:');
console.log('1. Run: npm run dev');
console.log('2. Open: http://localhost:3000');
console.log('3. Click buttons manually');
console.log('\n');