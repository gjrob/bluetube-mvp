// lib/supabase-server.js
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export const createServerClient = ({ req, res }) => {
  return createPagesServerClient({ req, res })
}