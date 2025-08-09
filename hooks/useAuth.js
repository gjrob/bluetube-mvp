// ===== Create /hooks/useAuth.js =====
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [userType, setUserType] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      
      if (data.user) {
        setUser(data.user)
        setProfile(data.profile)
        setUserType(data.userType)
      }
    } catch (error) {
      console.error('Session check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    const data = await response.json()
    
    if (!response.ok) throw new Error(data.error)
    
    setUser(data.user)
    setProfile(data.profile)
    setUserType(data.userType)
    
    return data
  }

  const signUp = async (userData) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    
    const data = await response.json()
    
    if (!response.ok) throw new Error(data.error)
    
    return data
  }

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setProfile(null)
    setUserType(null)
    router.push('/')
  }

  const value = {
    user,
    profile,
    userType,
    loading,
    signIn,
    signUp,
    signOut,
    checkSession
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
