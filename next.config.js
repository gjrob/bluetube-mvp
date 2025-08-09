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
  
  // Add CSP headers for Stripe
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; frame-src 'self' https://js.stripe.com https://hooks.stripe.com; connect-src 'self' https://api.stripe.com"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig