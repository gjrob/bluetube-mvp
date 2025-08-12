#!/bin/bash
# fix-icons.sh - Automatically fix Lucide icons in index.js

echo "🔧 Fixing Lucide icons in pages/index.js"
echo "========================================="

# Backup first
cp pages/index.js pages/index.js.backup
echo "✅ Backup created: pages/index.js.backup"

# Fix the icons using sed
echo "🔄 Replacing icons..."

# Fix Upload icons (lines 370, 423)
sed -i '' 's/<Upload size={18} \/>/<span style={{ fontSize: "18px" }}>📤<\/span>/g' pages/index.js

# Fix Menu/X icons (line 394)
sed -i '' 's/{mobileMenuOpen ? <X size={24} \/> : <Menu size={24} \/>}/{mobileMenuOpen ? <span style={{ fontSize: "24px" }}>✕<\/span> : <span style={{ fontSize: "24px" }}>☰<\/span>}/g' pages/index.js

# Fix standalone X icon (line 410)
sed -i '' 's/<X size={24} \/>/<span style={{ fontSize: "24px" }}>✕<\/span>/g' pages/index.js

# Fix ChevronRight icon (line 481)
sed -i '' 's/<ChevronRight size={20} \/>/<span style={{ fontSize: "20px" }}>→<\/span>/g' pages/index.js

echo "✅ Icons replaced with emojis"

# Remove the Lucide import if it exists
sed -i '' "/import.*from 'lucide-react'/d" pages/index.js
echo "✅ Removed Lucide import"

echo ""
echo "🎉 Done! Your index.js should now work."
echo "Run: npm run dev"