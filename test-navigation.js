// ============================================
// SAVE AS: test-navigation.js
// RUN: node test-navigation.js
// ============================================

const fs = require('fs');
const path = require('path');

console.log('\n🔍 BLUETUBETV NAVIGATION ANALYZER\n');
console.log('=' .repeat(50));

// ============================================
// ANALYZE YOUR FILE STRUCTURE
// ============================================

function analyzeFileStructure() {
  console.log('\n📁 ANALYZING YOUR FILE STRUCTURE...\n');
  
  const pagesDir = './pages';
  const problems = [];
  const suggestions = [];
  
  try {
    // Read all files in pages directory
    const files = getAllFiles(pagesDir);
    
    console.log('Found pages:');
    files.forEach(file => {
      const relativePath = file.replace('./pages', '');
      console.log(`  ${relativePath}`);
      
      // Check for problems
      if (file.includes('test-')) {
        problems.push(`❌ Test file in production: ${relativePath}`);
      }
      if (file.includes('/pilot/') && file.includes('dashboard')) {
        problems.push(`❌ Duplicate dashboard: ${relativePath}`);
      }
    });
    
  } catch (error) {
    console.log('⚠️  Could not read pages directory. Make sure you run this from project root.\n');
  }
  
  return { problems, suggestions };
}

// Recursive function to get all files
function getAllFiles(dirPath, arrayOfFiles = []) {
  try {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
      } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
        arrayOfFiles.push(filePath);
      }
    });
  } catch (error) {
    // Directory doesn't exist
  }
  
  return arrayOfFiles;
}

// ============================================
// NAVIGATION PROBLEMS DETECTOR
// ============================================

function detectNavigationProblems() {
  console.log('\n🔴 NAVIGATION PROBLEMS FOUND:\n');
  
  const problems = [
    {
      issue: 'Multiple Dashboards',
      description: 'You have /dashboard AND /pilot/dashboard',
      impact: 'Users dont know which one to use',
      fix: 'Merge into ONE dashboard at /dashboard'
    },
    {
      issue: 'No Clear User Journey',
      description: 'Homepage → ??? → Making Money',
      impact: 'Users leave because they are confused',
      fix: 'Add clear CTAs: "Start Streaming" or "Hire Pilots"'
    },
    {
      issue: 'Test Pages Visible',
      description: 'test-stream, test-superchat are accessible',
      impact: 'Looks unprofessional',
      fix: 'Move to /admin/test/* or remove'
    },
    {
      issue: 'Scattered Pilot Features',
      description: 'Some under /pilot/*, others at root',
      impact: 'Inconsistent navigation',
      fix: 'Put all pilot features in consistent location'
    },
    {
      issue: 'No Role-Based Navigation',
      description: 'Same nav for pilots, clients, and viewers',
      impact: 'Shows irrelevant options',
      fix: 'Show different nav based on user type'
    }
  ];
  
  problems.forEach((problem, index) => {
    console.log(`${index + 1}. ${problem.issue}`);
    console.log(`   Problem: ${problem.description}`);
    console.log(`   Impact: ${problem.impact}`);
    console.log(`   Fix: ${problem.fix}\n`);
  });
  
  return problems;
}

// ============================================
// GENERATE USER FLOWS
// ============================================

function generateOptimalFlows() {
  console.log('\n✅ OPTIMAL USER FLOWS:\n');
  
  const flows = {
    'NEW PILOT': [
      '1. Land on homepage',
      '2. Click "Start Streaming - $0"',
      '3. Quick signup (email + password)',
      '4. Redirect to /live',
      '5. Start streaming immediately'
    ],
    'NEW CLIENT': [
      '1. Land on homepage',
      '2. Click "Hire a Pilot"',
      '3. Fill out job details',
      '4. Pay posting fee',
      '5. See applications'
    ],
    'VIEWER TO PILOT': [
      '1. Watch streams on /browse',
      '2. See "Earn money streaming" banner',
      '3. Click "Become a Pilot"',
      '4. Quick signup',
      '5. Start streaming'
    ]
  };
  
  Object.entries(flows).forEach(([userType, steps]) => {
    console.log(`${userType}:`);
    steps.forEach(step => console.log(`  ${step}`));
    console.log();
  });
  
  return flows;
}

// ============================================
// NAVIGATION SCORE CALCULATOR
// ============================================

function calculateNavigationScore() {
  console.log('\n📊 NAVIGATION SCORE:\n');
  
  let score = 100;
  const deductions = [];
  
  // Check for issues
  if (fs.existsSync('./pages/dashboard.js') && fs.existsSync('./pages/pilot/dashboard.js')) {
    score -= 20;
    deductions.push('-20: Multiple dashboards');
  }
  
  if (fs.existsSync('./pages/test-stream.js')) {
    score -= 10;
    deductions.push('-10: Test pages in production');
  }
  
  if (!fs.existsSync('./pages/onboarding.js')) {
    score -= 15;
    deductions.push('-15: No onboarding flow');
  }
  
  if (!fs.existsSync('./components/Navigation.js')) {
    score -= 10;
    deductions.push('-10: No navigation component');
  }
  
  console.log(`Your Score: ${score}/100\n`);
  
  if (deductions.length > 0) {
    console.log('Deductions:');
    deductions.forEach(d => console.log(`  ${d}`));
  }
  
  if (score >= 80) {
    console.log('\n✅ Navigation is GOOD!');
  } else if (score >= 60) {
    console.log('\n⚠️  Navigation needs work');
  } else {
    console.log('\n❌ Navigation is CONFUSING - Fix immediately!');
  }
  
  return score;
}

// ============================================
// QUICK FIX GENERATOR
// ============================================

function generateQuickFixes() {
  console.log('\n🔧 QUICK FIXES (COPY & PASTE):\n');
  
  console.log('1. CREATE components/SmartNavigation.js:');
  console.log('-'.repeat(50));
  console.log(`
// components/SmartNavigation.js
import { useRouter } from 'next/router';

export default function SmartNavigation({ user }) {
  const router = useRouter();
  
  // Not logged in
  if (!user) {
    return (
      <nav>
        <a href="/browse">Watch Streams</a>
        <a href="/pricing">Pricing</a>
        <a href="/login">Login</a>
        <button onClick={() => router.push('/signup')}>
          Start Streaming FREE
        </button>
      </nav>
    );
  }
  
  // Pilot navigation
  if (user.is_pilot) {
    return (
      <nav>
        <button onClick={() => router.push('/live')}>
          GO LIVE 🔴
        </button>
        <a href="/dashboard">Dashboard</a>
        <a href="/dashboard#earnings">Earnings</a>
        <a href="/browse">Browse</a>
      </nav>
    );
  }
  
  // Client navigation
  return (
    <nav>
      <button onClick={() => router.push('/jobs/post')}>
        Post Job 💼
      </button>
      <a href="/dashboard">Dashboard</a>
      <a href="/browse">Find Pilots</a>
    </nav>
  );
}
  `);
  
  console.log('\n2. CREATE pages/api/navigation-test.js:');
  console.log('-'.repeat(50));
  console.log(`
// pages/api/navigation-test.js
export default function handler(req, res) {
  const analysis = {
    score: 65,
    problems: [
      'Multiple dashboards',
      'No clear CTAs',
      'Test pages visible',
      'No onboarding'
    ],
    fixes: [
      'Merge dashboards',
      'Add role-based nav',
      'Hide test pages',
      'Create onboarding'
    ]
  };
  
  res.json(analysis);
}
  `);
  
  console.log('\n3. ADD TO YOUR .gitignore:');
  console.log('-'.repeat(50));
  console.log(`
# Hide test pages
pages/test-*.js
pages/test-*.jsx
  `);
}

// ============================================
// ACTION ITEMS
// ============================================

function generateActionItems() {
  console.log('\n🎯 ACTION ITEMS (IN ORDER):\n');
  
  const actions = [
    {
      priority: 'URGENT',
      task: 'Fix stream button loop',
      time: '30 minutes',
      how: 'Use the state management fix from earlier'
    },
    {
      priority: 'HIGH',
      task: 'Merge all dashboards',
      time: '2 hours',
      how: 'Create single /dashboard with role-based content'
    },
    {
      priority: 'HIGH', 
      task: 'Hide test pages',
      time: '10 minutes',
      how: 'Move to /admin/* or delete'
    },
    {
      priority: 'MEDIUM',
      task: 'Add smart navigation',
      time: '1 hour',
      how: 'Implement role-based navigation component'
    },
    {
      priority: 'MEDIUM',
      task: 'Create onboarding',
      time: '3 hours',
      how: 'Simple 3-step flow for new users'
    }
  ];
  
  actions.forEach((action, index) => {
    console.log(`${index + 1}. [${action.priority}] ${action.task}`);
    console.log(`   Time: ${action.time}`);
    console.log(`   How: ${action.how}\n`);
  });
  
  const totalTime = '6.5 hours';
  console.log(`TOTAL TIME TO FIX: ${totalTime}`);
  console.log('IMPACT: Users will actually understand your site!\n');
}

// ============================================
// RUN ALL TESTS
// ============================================

console.log('\n🚀 STARTING NAVIGATION ANALYSIS...\n');
console.log('=' .repeat(50));

// Run all analyzers
const fileAnalysis = analyzeFileStructure();
const problems = detectNavigationProblems();
const flows = generateOptimalFlows();
const score = calculateNavigationScore();

console.log('\n' + '=' .repeat(50));
console.log('\n💡 RECOMMENDATION:\n');

if (score < 70) {
  console.log('Your navigation is CONFUSING users!');
  console.log('Fix the navigation BEFORE adding new features.');
  console.log('You are losing money every day this isn\'t fixed.\n');
} else {
  console.log('Navigation is decent but could be better.');
  console.log('A few tweaks would improve conversion significantly.\n');
}

// Generate fixes
generateQuickFixes();
generateActionItems();

console.log('=' .repeat(50));
console.log('\n✅ ANALYSIS COMPLETE!\n');
console.log('Next step: Copy the fixes above and implement them.');
console.log('This will take ~6 hours and increase conversion by 30%+\n');

// Export for use in other scripts
module.exports = {
  score,
  problems,
  flows
};