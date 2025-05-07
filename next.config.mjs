/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cấu hình Next.js
  reactStrictMode: true,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Tắt tính năng tạo trang tĩnh
  output: 'standalone',
  
  // Cấu hình image domains
  images: {
    domains: ['localhost', 'via.placeholder.com'],
    unoptimized: true,
  },
  
  // Cấu hình experimental
  experimental: {
    // Các cấu hình experimental hợp lệ với Next.js 15
    serverActions: true,
  },
  
  // Cấu hình external packages
  serverExternalPackages: ['@prisma/client'],
  
  // Cấu hình webpack
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    }
    return config
  },
  
  // Cấu hình headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
  
  // Cấu hình redirects
  async redirects() {
    return []
  },
  
  // Cấu hình rewrites
  async rewrites() {
    return {
      beforeFiles: [
        // Chuyển hướng tất cả các API route không được cho phép đến route status
        {
          source: '/api/:path*',
          has: [
            {
              type: 'header',
              key: 'x-vercel-skip-middleware',
              value: 'true',
            },
          ],
          destination: '/api/status',
        },
      ],
      afterFiles: [],
      fallback: [],
    }
  },
}

export default nextConfig
