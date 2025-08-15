// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// HARDCODE the correct values to override any environment variable issues
const supabaseUrl = 'https://akphnfsulfzhrzdsvhla.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrcGhuZnN1bGZ6aHJ6ZHN2aGxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDI0ODgsImV4cCI6MjA2OTAxODQ4OH0.6xIvXordNn4hI_I155bwT1zDfm1KqBQbyOkfsZa-FHY'

// Don't use process.env for now - just hardcode it
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit'
  }
})

console.log('Supabase initialized with URL:', supabaseUrl)