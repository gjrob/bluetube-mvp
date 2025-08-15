// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// CORRECT URL - Fixed the typo!
const supabaseUrl = 'https://akphnfsulfzhrzdsvhla.supabase.co'  // <-- This is correct now!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrcGhuZnN1bGZ6aHJ6ZHN2aGxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDI0ODgsImV4cCI6MjA2OTAxODQ4OH0.6xIvXordNn4hI_I155bwT1zDfm1KqBQbyOkfsZa-FHY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit'
  }
})