// lib/supabase.js - FIXED with hardcoded values
import { createClient } from '@supabase/supabase-js'

// HARDCODE these values to fix the build
const supabaseUrl = 'https://akphnfsulfzhrzdsvhla.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrcGhuZnN1bGZ6aHJ6ZHN2aGxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDI0ODgsImV4cCI6MjA2OTAxODQ4OH0.6xIvXordNn4hI_I155bwT1zDfm1KqBQbyOkfsZa-FHY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export default as well for different import styles
export default supabase