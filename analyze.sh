#!/bin/bash
echo "🔍 BLUETUBETV STACK ANALYSIS"
echo "============================"
echo ""
echo "📁 Project Structure:"
find . -type f -name "*.js" -o -name "*.jsx" | head -20
echo ""
echo "📦 Dependencies:"
cat package.json | grep -A 20 "dependencies"
echo ""
echo "🔐 Environment Variables Configured:"
cat .env.local | grep -E "STRIPE|SUPABASE" | sed 's/=.*/=✓/'
echo ""
echo "💰 Stripe Products:"
cat .env.local | grep "STRIPE.*PRICE" | sed 's/.*=//'
echo ""
echo "🚀 API Routes:"
ls -la pages/api/
echo ""
echo "⚠️  Potential Issues:"
grep -r "TODO\|FIXME\|XXX" --include="*.js" . 2>/dev/null | head -5
echo ""
echo "✅ Ready Features:"
ls pages/ | grep -E "marketplace|pricing|streaming|live"
