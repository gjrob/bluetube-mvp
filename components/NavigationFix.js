import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import SmartNavigation from './SmartNavigation'
import { navigationFixes } from './NavigationFix' 

export default function Navigation() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [useSmartNav, setUseSmartNav] = useState(true)

  useEffect(() => {
    checkUser()
    fixBrokenButtons() // <-- ADD THIS
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setUser(null)
      }
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  // ADD THIS NEW FUNCTION
  const fixBrokenButtons = () => {
    // Fix buttons based on current page
    const currentPath = router.pathname
    
    if (currentPath === '/') {
      // Fix homepage buttons
      fixHomePageButtons()
    } else if (currentPath === '/live') {
      // Fix live page buttons
      fixLivePageButtons()
    } else if (currentPath === '/dashboard') {
      // Fix dashboard buttons
      fixDashboardButtons()
    }
  }

  // ADD: Fix homepage buttons
  const fixHomePageButtons = () => {
    setTimeout(() => {
      // Fix "Start Streaming FREE" button
      const startStreamBtn = document.querySelector('button:contains("Start Streaming FREE")')
      if (startStreamBtn) {
        startStreamBtn.onclick = () => {
          window.location.href = navigationFixes.homepage['Start Streaming FREE']
        }
      }

      // Fix "Start Registration Now" button
      const regBtn = document.querySelector('button:contains("Start Registration Now")')
      if (regBtn) {
        regBtn.onclick = () => {
          window.location.href = navigationFixes.homepage['Start Registration Now']
        }
      }
    }, 100)
  }

  // ADD: Fix live page buttons
  const fixLivePageButtons = () => {
    setTimeout(() => {
      const broadcastBtn = document.querySelector('button:contains("Start Broadcasting")')
      if (broadcastBtn) {
        broadcastBtn.onclick = navigationFixes.livePage['Start Broadcasting']
      }
    }, 100)
  }

  // ADD: Fix dashboard buttons
  const fixDashboardButtons = () => {
    setTimeout(() => {
      Object.entries(navigationFixes.dashboard).forEach(([label, href]) => {
        const btn = document.querySelector(`button:contains("${label}")`)
        if (btn) {
          btn.onclick = () => {
            window.location.href = href
          }
        }
      })
    }, 100)
  }

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProfile = async (userId) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profile) {
        setUser(profile)
        // Store userId for NavigationFix helper functions
        localStorage.setItem('userId', userId) // <-- ADD THIS
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  // If SmartNavigation is available and working, use it
  if (useSmartNav && SmartNavigation) {
    return <SmartNavigation user={user} loading={loading} />
  }

  // Fallback to basic navigation if SmartNavigation fails
    return <BasicNavigation user={user} loading={loading} />
  }