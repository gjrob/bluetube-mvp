// middleware.js
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  // Create response first
  const res = NextResponse.next()
  
  // List of paths to completely skip
  const skipPaths = [
    '/api',
    '/_next',
    '/favicon.ico',
    '/public',
    '.png',
    '.jpg',
    '.jpeg',
    '.svg',
    '.gif',
    '.css',
    '.js'
  ]
  
  // Check if we should skip this path
  const shouldSkip = skipPaths.some(path => 
    req.nextUrl.pathname.includes(path)
  )
  
  if (shouldSkip) {
    return res
  }

  // Only check auth for protected routes
  const protectedPaths = [
    '/dashboard',
    '/upload',
    '/live',
    '/pilot-setup',
    '/profile',
    '/settings'
  ]
  
  const isProtectedRoute = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )

  // If it's not a protected route, just continue
  if (!isProtectedRoute) {
    return res
  }

  try {
    // Only create Supabase client for protected routes
    const supabase = createMiddlewareClient({ req, res })
    
    // Check if we have a session
    const { data: { session }, error } = await supabase.auth.getSession()
    
    // If error, log it but don't block
    if (error) {
      console.log('Session check error:', error.message)
      // Don't block, let the page handle auth
      return res
    }
    
    // If no session and trying to access protected route, redirect to login
    if (!session && isProtectedRoute) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    
  } catch (error) {
    // If anything fails, just continue without blocking
    console.log('Middleware exception, continuing:', error.message)
    return res
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}