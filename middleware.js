// middleware.js (root)
import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Routes that require auth (extend as needed)
const PROTECTED = [
  '/dashboard',
  '/upload',
  '/live',
  '/pilot-setup',
  '/profile',
  '/settings',
  '/billing',
  '/jobs/post-job',
];

export async function middleware(req) {
  const { pathname, origin } = req.nextUrl;

  // Only guard protected routes
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // 1) DEMO bypass (fast path; no Supabase call)
  const demo = req.cookies.get('DEMO_MODE')?.value === '1';
  if (demo) return NextResponse.next();

  // 2) Supabase session check
  const res = NextResponse.next(); // must pass the same response to the client
  try {
    const supabase = createMiddlewareClient({ req, res });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) return res;

    // 3) Not authed → redirect to login (preserve intended path)
    const url = new URL('/login', origin);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  } catch (e) {
    // On any error, fall back to redirect (safer than silently allowing)
    const url = new URL('/login', origin);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
}

// Let Next.js ignore static assets & APIs automatically
export const config = {
  matcher: [
    // everything except:
    // - /api/*, /_next/static/*, /_next/image/*, /favicon.ico, /public/*
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
