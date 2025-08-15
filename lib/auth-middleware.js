// lib/auth-middleware.js - FIXED version
import { supabase } from './supabase'

export const withAuth = (handler) => {
  return async (req, res) => {
    // Get token from Authorization header
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' })
    }

    try {
      // Verify the token
      const { data: { user }, error } = await supabase.auth.getUser(token)
      
      if (error || !user) {
        return res.status(401).json({ error: 'Unauthorized - Invalid token' })
      }

      // Add user to request
      req.user = user
      
      return handler(req, res)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return res.status(401).json({ error: 'Unauthorized - Please login' })
    }
  }
}