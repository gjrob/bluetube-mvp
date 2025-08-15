// components/Navigation.js - BASIC NAVIGATION
// This handles the core navigation functionality
// ============================================

import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import SmartNavigation from './SmartNavigation'

export default function Navigation() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [useSmartNav, setUseSmartNav] = useState(true)

  useEffect(() => {
    checkUser()
    
    // Listen for auth changes
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

// Basic fallback navigation
function BasicNavigation({ user, loading }) {
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const getNavItems = () => {
    if (!user) {
      return [
        { label: 'Browse', href: '/browse' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Login', href: '/login' },
        { label: 'Start Streaming', href: '/signup?role=pilot', cta: true }
      ]
    }
    
    if (user.is_pilot || user.user_type === 'pilot') {
      return [
        { label: 'Go Live', href: '/live', cta: true },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Earnings', href: '/dashboard#earnings' },
        { label: 'Browse', href: '/browse' }
      ]
    }
    
    if (user.is_client || user.user_type === 'client') {
      return [
        { label: 'Post Job', href: '/jobs/post', cta: true },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Find Pilots', href: '/browse' },
        { label: 'My Jobs', href: '/dashboard#jobs' }
      ]
    }
    
    return [
      { label: 'Browse', href: '/browse' },
      { label: 'Become a Pilot', href: '/signup?role=pilot', cta: true }
    ]
  }

  const navItems = getNavItems()

  return (
    <nav style={{
      background: 'rgba(15, 23, 42, 0.95)',
      padding: '16px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🚁 BlueTubeTV
        </Link>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: item.cta ? '10px 20px' : '8px 12px',
                background: item.cta 
                  ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                  : 'transparent',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: item.cta ? 'bold' : 'normal'
              }}
            >
              {item.label}
            </Link>
          ))}
          
          {user && (
            <button
              onClick={handleSignOut}
              style={{
                padding: '8px 12px',
                background: 'transparent',
                color: '#ef4444',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
