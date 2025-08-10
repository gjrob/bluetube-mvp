/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  
  // Disable error overlay
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
  
  // Add these for better performance
  images: {
    domains: ['localhost'],
  },
  
  // Suppress hydration warnings in development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Add CSP headers for Stripe AND Supabase
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
              // THIS IS THE FIX - Added Supabase URLs to connect-src:
              "connect-src 'self' https://api.stripe.com https://*.supabase.co https://*.supabase.in wss://*.supabase.co wss://*.supabase.in https://akphnfsulfzhrzdsvhla.supabase.co http://localhost:* ws://localhost:*"
            ].join('; ')
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig