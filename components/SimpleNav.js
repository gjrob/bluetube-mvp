// components/SimpleNav.js
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function SimpleNav() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    checkUser()
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const goLiveButton = (
    <button
      onClick={() => router.push('/live')}
      style={{
        padding: '10px 20px',
        background: 'linear-gradient(135deg, #FF0000 0%, #FF4444 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 12px rgba(255,0,0,0.3)',
        transition: 'transform 0.2s'
      }}
      onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
    >
      <span style={{ fontSize: '20px' }}>🔴</span>
      GO LIVE
    </button>
  )

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0,0,0,0.1)',
      zIndex: 1000,
      padding: '15px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <div 
          onClick={() => router.push('/')}
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#333'
          }}
        >
          <span style={{ fontSize: '28px' }}>📺</span>
          BlueTubeTV
        </div>

        {/* Desktop Menu */}
        <div style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          '@media (max-width: 768px)': {
            display: 'none'
          }
        }}>
          <button
            onClick={() => router.push('/marketplace')}
            style={{
              background: 'none',
              border: 'none',
              color: '#333',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(0,0,0,0.05)'}
            onMouseOut={(e) => e.target.style.background = 'none'}
          >
            Marketplace
          </button>
          
          <button
            onClick={() => router.push('/jobs')}
            style={{
              background: 'none',
              border: 'none',
              color: '#333',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(0,0,0,0.05)'}
            onMouseOut={(e) => e.target.style.background = 'none'}
          >
            Jobs
          </button>

          <button
            onClick={() => router.push('/pricing')}
            style={{
              background: 'none',
              border: 'none',
              color: '#333',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(0,0,0,0.05)'}
            onMouseOut={(e) => e.target.style.background = 'none'}
          >
            Pricing
          </button>

          {user ? (
            <>
              <button
                onClick={() => router.push('/dashboard')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#333',
                  fontSize: '16px',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(0,0,0,0.05)'}
                onMouseOut={(e) => e.target.style.background = 'none'}
              >
                Dashboard
              </button>
              
              {goLiveButton}
              
              <button
                onClick={handleSignOut}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  color: '#666',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push('/login')}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  color: '#667eea',
                  border: '1px solid #667eea',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Log In
              </button>
              
              <button
                onClick={() => router.push('/signup')}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            '@media (max-width: 768px)': {
              display: 'block'
            }
          }}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          borderBottom: '1px solid #ddd',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <button
              onClick={() => {
                router.push('/marketplace')
                setShowMobileMenu(false)
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#333',
                fontSize: '16px',
                cursor: 'pointer',
                padding: '10px',
                textAlign: 'left'
              }}
            >
              Marketplace
            </button>
            
            <button
              onClick={() => {
                router.push('/jobs')
                setShowMobileMenu(false)
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#333',
                fontSize: '16px',
                cursor: 'pointer',
                padding: '10px',
                textAlign: 'left'
              }}
            >
              Jobs
            </button>

            {user && goLiveButton}
          </div>
        </div>
      )}
    </nav>
  )
}