import supabase from './supabase'

export const withAuth = (handler) => {
  return async (req, res) => {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return res.status(500).json({ error: 'Auth unavailable' });
  }
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
