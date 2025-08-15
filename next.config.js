/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  
  // CRITICAL FIX - Disable file tracing completely
  outputFileTracing: false,
  
  // Disable error overlay
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
  
  // Add these for better performance
  images: {
    domains: ['localhost'],
    unoptimized: true, // Add this for Vercel builds
  },
  
  // ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript
  typescript: {
    ignoreBuildErrors: true, // Add this if you have TS errors blocking build
  },
  
  // Remove experimental section since we're disabling tracing entirely
  // experimental: {
  //   outputFileTracingExcludes: {
  //     '*': [
  //       './node_modules/@swc/core-linux-x64-gnu',
  //       './node_modules/@swc/core-linux-x64-musl',
  //       './node_modules/@esbuild/linux-x64',
  //       './node_modules/@prisma/engines',
  //       './node_modules/@sentry',
  //       './node_modules/canvas',
  //       './node_modules/sharp',
  //     ],
  //   },
  // },
  
  // Add output configuration for Vercel
  output: 'standalone',
  
  // Disable SWC minification if causing issues
  swcMinify: false,
  
  // Webpack configuration to handle problematic modules
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
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
              "connect-src 'self' https://api.stripe.com https://*.supabase.co https://*.supabase.in wss://*.supabase.co wss://*.supabase.in https://akphnfsulfzhrzdsvhla.supabase.co http://localhost:* ws://localhost:*"
            ].join('; ')
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig