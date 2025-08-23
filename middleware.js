// middleware.js (root)
import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// routes that require auth
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

// canonical host: use www in prod
function forceWww(req) {
  if (process.env.NODE_ENV !== 'production') return null;
  const url = req.nextUrl.clone();
  if (url.hostname === 'bluetubetv.live') {
    url.hostname = 'www.bluetubetv.live';
    return NextResponse.redirect(url, 308);
  }
  return null;
}

export async function middleware(req) {
  // 0) force canonical host (www) first
  const canonical = forceWww(req);
  if (canonical) return canonical;

  const { pathname } = req.nextUrl;
  // ignore if not protected
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // 1) DEMO bypass (cookie name 'demo', value '1' from /api/demo-login)
  const demo = req.cookies.get('demo')?.value === '1';
  if (demo) return NextResponse.next();

  // 2) Supabase session check (edge-safe)
  const res = NextResponse.next();
  try {
    const supabase = createMiddlewareClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();
  if (session) {
  const verified = !!session.user?.email_confirmed_at;
  if (!verified) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', req.nextUrl.pathname);
    url.searchParams.set('msg', 'verify');
    return NextResponse.redirect(url);
  }
  return res;
}

    // 3) not authed → redirect to login and preserve intended path
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  } catch {
    // on any error, be safe: send to login
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
}

// let next.js skip assets and api routes
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)',
  ],
};
