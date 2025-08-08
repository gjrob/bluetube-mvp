// next.config.js
module.exports = {
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
}
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // ⚠️ This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Your existing config below...
}

module.exports = nextConfig