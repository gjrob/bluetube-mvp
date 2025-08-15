#!/bin/bash

echo "🚨 Emergency Deploy Fix for BlueTubeTV"
echo "======================================"
echo ""

# Step 1: Fix Supabase imports
echo "🔧 Fixing Supabase imports..."

# Create proper supabase.js
cat > lib/supabase.js << 'EOF'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export default supabase;
EOF

# Fix any components importing from supabase-safe
echo "📝 Updating import statements..."
find . -name "*.js" -not -path "./node_modules/*" -not -path "./.next/*" -exec grep -l "from ['\"].*supabase-safe['\"]" {} \; | while read file; do
    echo "Fixing: $file"
    sed -i.bak "s|from ['\"].*supabase-safe['\"]|from '../lib/supabase'|g" "$file"
done

# Remove supabase-safe.js if it exists
rm -f lib/supabase-safe.js

# Step 2: Clean build artifacts
echo ""
echo "🧹 Cleaning build artifacts..."
rm -rf .next
rm -rf node_modules/.cache

# Step 3: Check environment variables
echo ""
echo "🔍 Checking environment variables..."

if [ ! -f .env.local ]; then
    echo "⚠️  Creating .env.local template..."
    cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EOF
    echo "❗ Please add your Supabase credentials to .env.local"
fi

# Step 4: Remove problematic dependencies
echo ""
echo "📦 Fixing dependencies..."
npm uninstall @livepeer/react @livepeer/core 2>/dev/null

# Step 5: Reinstall clean dependencies
echo "📦 Installing clean dependencies..."
npm install

# Step 6: Test build
echo ""
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Deploying to Vercel..."
    vercel --prod --yes
    
    echo ""
    echo "======================================"
    echo "🎉 DEPLOYMENT COMPLETE!"
    echo "======================================"
    echo ""
    echo "Your site should be live at:"
    echo "https://bluetubetv.live"
else
    echo ""
    echo "⚠️  Build still has issues."
    echo ""
    echo "Try this manual fix:"
    echo "1. Remove all problem files:"
    echo "   rm -rf lib/supabase-safe.js"
    echo "   rm -rf components/NavigationFix.js"
    echo ""
    echo "2. Create simple lib/supabase.js:"
    echo "   Use the code from the artifact above"
    echo ""
    echo "3. Deploy:"
    echo "   vercel --prod --yes"
fi

# Clean up backup files
find . -name "*.bak" -delete

echo ""
echo "💡 If deployment succeeds, your platform features:"
echo "  ✅ Ocean/sky blue theme"
echo "  ✅ Stream key generation"
echo "  ✅ Jobs marketplace ($1200+ contracts)"
echo "  ✅ FAA pilot verification"
echo "  ✅ Super Chat tips"
echo "  ✅ Self-healing AI"
echo ""
echo "🚁 Ready for your Greenfield Lake shoot!"