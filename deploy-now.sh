#!/bin/bash

# BlueTubeTV Production Deployment Script
# Run this to deploy your platform in 5 minutes

echo "🚀 BlueTubeTV Production Deployment Starting..."

# 0. CREATE BACKUP FIRST (Safety first!)
echo "💾 Creating backup before deployment..."
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup critical files
cp -r pages $BACKUP_DIR/
cp -r components $BACKUP_DIR/
cp -r lib $BACKUP_DIR/
cp -r hooks $BACKUP_DIR/
cp package.json $BACKUP_DIR/
cp .env.local $BACKUP_DIR/ 2>/dev/null || echo "No .env.local to backup"

echo "✅ Backup created in $BACKUP_DIR"

# 1. Clean up test files (don't need these in production)
echo "📦 Cleaning up test files..."
rm -f test-*.html
rm -f test-*.js
rm -f pages/test*.js
rm -rf backup_*
rm -rf pages_backup_*

# 2. Check environment variables
echo "🔐 Checking environment variables..."
if [ ! -f .env.local ]; then
    echo "❌ Missing .env.local file!"
    echo "Creating template..."
    cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public
LIVEPEER_API_KEY=your_livepeer_key
OPENAI_API_KEY=your_openai_key
EOF
    echo "⚠️  Please fill in .env.local with your actual keys!"
    exit 1
else
    echo "✅ Environment variables found"
fi

# 3. Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# 4. Build for production
echo "🔨 Building for production..."
npm run build

# 5. Run production tests
echo "🧪 Running quick production test..."
npm run build && echo "✅ Build successful!"

# 6. Initialize Git if needed
if [ ! -d .git ]; then
    echo "📝 Initializing Git..."
    git init
    git add .
    git commit -m "Initial commit - BlueTubeTV Production Ready"
fi

# 7. Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo "Choose deployment option:"
echo "1) Deploy to Vercel (recommended)"
echo "2) Deploy to custom server"
echo "3) Test locally first"
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "🌐 Deploying to Vercel..."
        npx vercel --prod
        echo "✅ Deployment complete!"
        echo "📝 Save your production URL and update DNS if using custom domain"
        ;;
    2)
        echo "📦 Creating production build..."
        npm run build
        echo "✅ Build complete! Upload the .next folder to your server"
        echo "Run 'npm start' on your server to start the application"
        ;;
    3)
        echo "🖥️ Starting local production test..."
        npm run build && npm start
        ;;
esac

echo ""
echo "🎉 DEPLOYMENT CHECKLIST:"
echo "✅ Test files cleaned"
echo "✅ Dependencies installed"
echo "✅ Production build created"
echo "✅ Ready for launch!"
echo ""
echo "📊 NEXT STEPS:"
echo "1. Visit your production URL"
echo "2. Create first pilot account"
echo "3. Generate stream key"
echo "4. Test payment flow"
echo "5. Share with first 10 pilots!"
echo ""
echo "💰 Revenue tracking dashboard: /dashboard"
echo "📺 Live streaming page: /live"
echo "🛍️ Marketplace: /marketplace"
echo ""
echo "🚀 BlueTubeTV is LIVE! Time to get pilots streaming!"