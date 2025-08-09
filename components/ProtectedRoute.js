import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function ProtectedRoute({ children, allowedUserTypes }) {
  const { user, userType, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }

    if (!loading && user && allowedUserTypes && !allowedUserTypes.includes(userType)) {
      router.push('/dashboard')
    }
  }, [user, userType, loading, router, allowedUserTypes])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0F172A'
      }}>
        <div style={{ color: '#3B82F6', fontSize: '18px' }}>Loading...</div>
      </div>
    )
  }

  return user ? children : null
}