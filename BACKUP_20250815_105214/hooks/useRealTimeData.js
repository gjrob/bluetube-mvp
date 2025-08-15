// hooks/useRealTimeData.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Hook for real-time stream data
export function useStreamData(streamId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!streamId) return

    // Fetch initial data
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('streams')
        .select('*')
        .eq('id', streamId)
        .single()

      if (!error) setData(data)
      setLoading(false)
    }

    fetchData()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`stream-${streamId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'streams',
        filter: `id=eq.${streamId}`
      }, (payload) => {
        setData(payload.new)
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [streamId])

  return { data, loading }
}

// Hook for real-time analytics
export function useAnalytics(userId) {
  const [analytics, setAnalytics] = useState({
    totalEarnings: 0,
    totalStreams: 0,
    totalViews: 0,
    avgRating: 0,
    recentActivity: []
  })

  useEffect(() => {
    if (!userId) return

    const fetchAnalytics = async () => {
      // Fetch earnings
      const { data: earnings } = await supabase
        .from('earnings')
        .select('amount')
        .eq('user_id', userId)

      // Fetch streams
      const { data: streams } = await supabase
        .from('streams')
        .select('*')
        .eq('pilot_id', userId)

      // Fetch views
      const { data: views } = await supabase
        .from('stream_views')
        .select('count')
        .eq('pilot_id', userId)

      // Calculate totals
      const totalEarnings = earnings?.reduce((sum, e) => sum + e.amount, 0) || 0
      const totalStreams = streams?.length || 0
      const totalViews = views?.reduce((sum, v) => sum + v.count, 0) || 0

      setAnalytics({
        totalEarnings,
        totalStreams,
        totalViews,
        avgRating: 4.5, // Calculate from ratings table
        recentActivity: streams?.slice(0, 5) || []
      })
    }

    fetchAnalytics()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`analytics-${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'earnings',
        filter: `user_id=eq.${userId}`
      }, () => {
        fetchAnalytics() // Refetch on new earnings
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  return analytics
}

// Hook for marketplace data
export function useMarketplaceData() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from('marketplace_videos')
        .select(`
          *,
          pilot:pilot_id (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      if (!error) setVideos(data)
      setLoading(false)
    }

    fetchVideos()

    // Subscribe to new videos
    const subscription = supabase
      .channel('marketplace')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'marketplace_videos'
      }, (payload) => {
        setVideos(prev => [payload.new, ...prev])
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { videos, loading }
}