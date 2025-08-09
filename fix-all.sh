#!/bin/bash
echo "🔧 Fixing BlueTubeTV..."

# Create missing pages
echo "Creating missing pages..."
touch pages/careers.js pages/help.js pages/blog.js

# Fix build
echo "Fixing build..."
npm run fix-build

# Deploy
echo "Deploying..."
git add .
git commit -m "Fix navigation, super chat, and UI improvements"
git push

echo "✅ All fixed! Check https://bluetubetv.live"
