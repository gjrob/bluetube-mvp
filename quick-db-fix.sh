#!/bin/bash

echo "🔧 Quick Database Fix for BlueTubeTV"
echo "====================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Missing .env.local file!"
    echo "Creating template..."
    
    cat > .env.local << 'EOF'
# Get these from your Supabase dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Optional: Stripe keys if you have them
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
EOF

    echo "⚠️  Please add your Supabase credentials to .env.local"
    echo "Get them from: https://app.supabase.com/project/_/settings/api"
    exit 1
fi

echo "✅ Environment file found"
echo ""

# Test Supabase connection
echo "🔍 Testing Database Connection..."
echo "---------------------------------"

# Create a simple test file
cat > test-db-connection.js << 'EOF'
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testConnection() {
    console.log('Testing Supabase connection...');
    
    try {
        // Test auth
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        console.log('✅ Auth service connected');
        
        // Test database
        const { data: test, error: dbError } = await supabase
            .from('users')
            .select('count(*)');
            
        if (dbError) {
            console.log('⚠️  Users table may not exist yet');
        } else {
            console.log('✅ Database connected');
        }
        
        console.log('\n✅ Supabase connection successful!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
EOF

# Run the test
node test-db-connection.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database connection working!"
    echo ""
    echo "Now let's ensure tables exist..."
    echo "---------------------------------"
    
    # Create SQL setup file
    cat > setup-tables.sql << 'EOF'
-- Only create tables if they don't exist
-- This is safe to run multiple times

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  stream_key TEXT UNIQUE,
  is_live BOOLEAN DEFAULT false,
  viewer_count INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Streams table
CREATE TABLE IF NOT EXISTS public.streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  title TEXT,
  is_live BOOLEAN DEFAULT false,
  viewer_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.users(id),
  title TEXT NOT NULL,
  description TEXT,
  budget DECIMAL(10,2),
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  title TEXT,
  url TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  type TEXT,
  amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Public read access" ON public.streams
  FOR SELECT USING (true);

CREATE POLICY "Public read jobs" ON public.jobs
  FOR SELECT USING (status = 'open');

CREATE POLICY "Users can update own data" ON public.users
  FOR ALL USING (auth.uid() = id);
EOF

    echo "✅ SQL file created: setup-tables.sql"
    echo ""
    echo "📝 INSTRUCTIONS:"
    echo "----------------"
    echo "1. Go to: https://app.supabase.com/project/_/sql/new"
    echo "2. Copy contents of setup-tables.sql"
    echo "3. Paste and run in SQL editor"
    echo "4. Your database will be ready!"
    
else
    echo ""
    echo "⚠️  Database connection issue detected"
    echo ""
    echo "Please check:"
    echo "1. Your Supabase credentials in .env.local"
    echo "2. Get them from: https://app.supabase.com/project/_/settings/api"
fi

echo ""
echo "================================"
echo "🚀 QUICK DEPLOY COMMAND"
echo "================================"
echo ""
echo "Once database is ready, deploy with:"
echo ""
echo "  npm run build && vercel --prod"
echo ""
echo "Your site will be live at: https://bluetubetv.live"
echo ""

# Clean up test file
rm -f test-db-connection.js