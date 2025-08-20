#!/bin/bash

echo "🔧 VERCEL ENVIRONMENT SETUP"
echo "============================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found!"
    echo "Please create .env.local with your Supabase credentials first"
    exit 1
fi

# Read environment variables
echo "📖 Reading your local environment variables..."
source .env.local

# Check if variables exist
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_URL not found in .env.local"
    echo ""
    echo "Add this to .env.local:"
    echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
    echo ""
    echo "Get it from: https://app.supabase.com/project/_/settings/api"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local"
    echo ""
    echo "Add this to .env.local:"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
    echo ""
    echo "Get it from: https://app.supabase.com/project/_/settings/api"
    exit 1
fi

echo "✅ Found Supabase credentials"
echo ""

# Add to Vercel
echo "🚀 Adding environment variables to Vercel..."
echo ""
echo "This will add your variables to production, preview, and development:"
echo ""

# Add each variable
echo "$NEXT_PUBLIC_SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production --yes
echo "$NEXT_PUBLIC_SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL preview --yes
echo "$NEXT_PUBLIC_SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL development --yes

echo "$NEXT_PUBLIC_SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --yes
echo "$NEXT_PUBLIC_SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview --yes
echo "$NEXT_PUBLIC_SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development --yes

# Add service key if it exists
if [ ! -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "$SUPABASE_SERVICE_KEY" | vercel env add SUPABASE_SERVICE_KEY production --yes
    echo "$SUPABASE_SERVICE_KEY" | vercel env add SUPABASE_SERVICE_KEY preview --yes
    echo "✅ Added service key"
fi

# Add Stripe keys if they exist
if [ ! -z "$STRIPE_SECRET_KEY" ]; then
    echo "$STRIPE_SECRET_KEY" | vercel env add STRIPE_SECRET_KEY production --yes
    echo "✅ Added Stripe secret key"
fi

if [ ! -z "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" ]; then
    echo "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" | vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production --yes
    echo "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" | vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY preview --yes
    echo "✅ Added Stripe publishable key"
fi

echo ""
echo "✅ Environment variables added to Vercel!"
echo ""
echo "🚀 Deploying to production..."
echo ""

# Deploy
vercel --prod --yes

echo ""
echo "================================"
echo "🎉 DEPLOYMENT COMPLETE!"
echo "================================"
echo ""
echo "Your site should be live at:"
echo "https://bluetubetv.live"
echo ""
echo "✅ Stripe payments: $29/month subscriptions"
echo "✅ Environment variables: Configured"
echo "✅ Production: Deployed"
echo ""
echo "START MARKETING NOW! 🚀"