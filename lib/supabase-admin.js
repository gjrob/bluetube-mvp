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
