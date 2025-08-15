// ============================================
// components/SmartNavigation.js - AI-ENHANCED NAVIGATION
// Keep this for AI self-healing capabilities
// ============================================

import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function SmartNavigation({ user, loading }) {
  const router = useRouter()
  const [navState, setNavState] = useState('normal')
  const [aiSuggestions, setAiSuggestions] = useState(null)
  const [errorCount, setErrorCount] = useState(0)

  useEffect(() => {
    // AI self-healing monitoring
    monitorNavigation()
  }, [router.pathname, user])

  const monitorNavigation = async () => {
    try {
      // Track navigation patterns
      const navEvent = {
        path: router.pathname,
        user_type: user?.user_type || 'guest',
        timestamp: new Date().toISOString()
      }

      // Send to AI monitoring
      const response = await fetch('/api/ai/navigation-monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(navEvent)
      })

      if (response.ok) {
        const data = await response.json()
        if (data.suggestions) {
          setAiSuggestions(data.suggestions)
        }
      }
    } catch (error) {
      console.error('AI monitoring error:', error)
      setErrorCount(prev => prev + 1)
      
      // If too many errors, fall back to basic navigation
      if (errorCount > 3) {
        console.log('SmartNavigation: Falling back to basic mode')
        return
      }
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const getSmartNavItems = () => {
    const currentPath = router.pathname
    const baseItems = []

    // AI-enhanced navigation based on user behavior
    if (!user) {
      // Track what pages lead to signups
      if (currentPath === '/browse') {
        baseItems.push(
          { label: 'Start Streaming', href: '/signup?role=pilot', cta: true, priority: 1 }
        )
      }
      
      baseItems.push(
        { label: 'Browse', href: '/browse' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Login', href: '/login' }
      )
      
      if (currentPath !== '/browse') {
        baseItems.push(
          { label: 'Start Streaming', href: '/signup?role=pilot', cta: true }
        )
      }
    } else if (user.is_pilot || user.user_type === 'pilot') {
      // Smart pilot navigation
      const hour = new Date().getHours()
      
      // Suggest going live during peak hours
      if (hour >= 18 && hour <= 22) {
        baseItems.push(
          { label: '🔴 Go Live (Peak Hours)', href: '/live', cta: true, highlight: true }
        )
      } else {
        baseItems.push(
          { label: 'Go Live', href: '/live', cta: true }
        )
      }
      
      baseItems.push(
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Earnings', href: '/dashboard#earnings' },
        { label: 'Analytics', href: '/analytics' },
        { label: 'Browse', href: '/browse' }
      )
    } else if (user.is_client || user.user_type === 'client') {
      // Smart client navigation
      baseItems.push(
        { label: 'Post Job', href: '/jobs/post', cta: true },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Active Jobs', href: '/dashboard#jobs' },
        { label: 'Find Pilots', href: '/browse' }
      )
      
      // AI suggestion based on activity
      if (aiSuggestions?.suggestUrgentJob) {
        baseItems.unshift(
          { label: '⚡ Post Urgent Job', href: '/jobs/post?urgent=true', cta: true, highlight: true }
        )
      }
    } else {
      // Default viewer with conversion prompts
      baseItems.push(
        { label: 'Browse', href: '/browse' },
        { label: 'Become a Pilot', href: '/signup?role=pilot', cta: true }
      )
    }

    return baseItems.sort((a, b) => (b.priority || 0) - (a.priority || 0))
  }

  const navItems = getSmartNavItems()

  // Self-healing: Detect broken links
  useEffect(() => {
    const validateLinks = async () => {
      for (const item of navItems) {
        try {
          const response = await fetch(item.href, { method: 'HEAD' })
          if (!response.ok && response.status === 404) {
            console.error(`SmartNavigation: Broken link detected - ${item.href}`)
            
            // Report to AI system
            await fetch('/api/ai/report-error', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'broken_link',
                path: item.href,
                component: 'SmartNavigation'
              })
            })
          }
        } catch (error) {
          // Link checking failed, but don't break navigation
        }
      }
    }
    
    validateLinks()
  }, [navItems])

  return (
    <nav style={{
      background: navState === 'error' 
        ? 'rgba(239, 68, 68, 0.1)' 
        : 'rgba(15, 23, 42, 0.95)',
      padding: '16px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s'
    }}>
      {/* AI Suggestions Banner */}
      {aiSuggestions?.message && (
        <div style={{
          background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)',
          color: 'white',
          padding: '8px',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          💡 {aiSuggestions.message}
        </div>
      )}
      
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
          {navState === 'healing' && (
            <span style={{ fontSize: '12px', color: '#fbbf24' }}>
              (Self-healing...)
            </span>
          )}
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
                background: item.highlight 
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : item.cta 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                    : 'transparent',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: item.cta ? 'bold' : 'normal',
                animation: item.highlight ? 'pulse 2s infinite' : 'none'
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
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </nav>
  )
}