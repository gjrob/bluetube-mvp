#!/bin/bash
# debug-index.sh - Find what's undefined in index.js

echo "🔍 Debugging pages/index.js (586 lines)"
echo "========================================"

# Check imports in index.js
echo ""
echo "📦 All imports in index.js:"
grep -n "^import\|^const.*require" pages/index.js | head -20

echo ""
echo "🔍 Checking for React import:"
if grep -q "import React" pages/index.js; then
  echo "✅ React is imported"
else
  echo "❌ React import missing!"
fi

echo ""
echo "🔍 Checking Lucide imports:"
grep -n "from 'lucide-react'" pages/index.js

echo ""
echo "🔍 Checking for other component imports:"
grep -n "from ['\"]\.\.?/components/" pages/index.js

echo ""
echo "🔍 Checking export at end of file:"
tail -5 pages/index.js

echo ""
echo "🔍 Looking for JSX that might use undefined components:"
grep -n "<[A-Z][a-zA-Z]*" pages/index.js | grep -v "</" | head -20

echo ""
echo "📝 Common Issues to Check:"
echo "1. Is there a Layout component being used?"
grep -n "<Layout" pages/index.js

echo "2. Any custom components imported?"
grep -oE "import [A-Za-z]+ from" pages/index.js | sort | uniq

echo "3. Check if file ends with export:"
if grep -q "export default" pages/index.js; then
  echo "✅ Has default export"
  grep "export default" pages/index.js
else
  echo "❌ Missing default export!"
fi