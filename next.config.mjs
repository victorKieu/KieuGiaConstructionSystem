/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cấu hình hiện tại của bạn
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // Thêm transpilePackages để giải quyết vấn đề với các dependencies
  transpilePackages: [
    'react-hook-form',
    '@hookform/resolvers',
    'zod'
  ],
  
  // Vô hiệu hóa static generation cho toàn bộ dự án
  output: 'standalone',
  
  // Thêm cấu hình bảo mật
  poweredByHeader: false, // Ẩn header X-Powered-By
  
  // Cấu hình Content Security Policy
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
}

export default nextConfig
