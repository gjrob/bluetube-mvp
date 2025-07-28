// next.config.js
module.exports = {
  reactStrictMode: false,
  experimental: {
    forceSwcTransforms: true,
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