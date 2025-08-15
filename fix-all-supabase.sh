#!/bin/bash
# fix-all-supabase.sh - Run this to fix all Supabase files

# 1. Fix lib/supabase.js
cat > lib/supabase.js << 'EOF'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://akphnfsulfzhrzdsvhla.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrcGhuZnN1bGZ6aHJ6ZHN2aGxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDI0ODgsImV4cCI6MjA2OTAxODQ4OH0.6xIvXordNn4hI_I155bwT1zDfm1KqBQbyOkfsZa-FHY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export default supabase
EOF

# 2. Fix lib/supabaseClient.js  
cat > lib/supabaseClient.js << 'EOF'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://akphnfsulfzhrzdsvhla.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrcGhuZnN1bGZ6aHJ6ZHN2aGxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDI0ODgsImV4cCI6MjA2OTAxODQ4OH0.6xIvXordNn4hI_I155bwT1zDfm1KqBQbyOkfsZa-FHY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export default supabase
EOF

# 3. Fix lib/supabase-server.js with createServerClient export
cat > lib/supabase-server.js << 'EOF'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://akphnfsulfzhrzdsvhla.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrcGhuZnN1bGZ6aHJ6ZHN2aGxhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ0MjQ4OCwiZXhwIjoyMDY5MDE4NDg4fQ.zQc2GwZebHb7CJRxzPq8H9MLQV0vcw6t8RHnoSohhd4'

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Export createServerClient function for compatibility
export function createServerClient(context) {
  return supabaseServer
}

// Export all variations for compatibility
export const getServerClient = () => supabaseServer
export default supabaseServer
EOF

# 4. Fix lib/supabase-admin.js
cat > lib/supabase-admin.js << 'EOF'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://akphnfsulfzhrzdsvhla.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrcGhuZnN1bGZ6aHJ6ZHN2aGxhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ0MjQ4OCwiZXhwIjoyMDY5MDE4NDg4fQ.zQc2GwZebHb7CJRxzPq8H9MLQV0vcw6t8RHnoSohhd4'

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export default supabaseAdmin
EOF

# 5. Also check if there's a lib/auth-middleware.js that needs fixing
if [ -f "lib/auth-middleware.js" ]; then
cat > lib/auth-middleware.js << 'EOF'
import { supabase } from './supabase'

export const withAuth = (handler) => {
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' })
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser(token)
      
      if (error || !user) {
        return res.status(401).json({ error: 'Unauthorized - Invalid token' })
      }

      req.user = user
      return handler(req, res)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }
}
EOF
fi

echo "✅ All Supabase files fixed with hardcoded values!"
echo "Now run: git add . && git commit -m 'Fix all Supabase files' && git push && vercel --prod --force"