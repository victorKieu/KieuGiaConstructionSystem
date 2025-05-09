/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost', 'placehold.co'],
    unoptimized: true,
  },
  experimental: {
    // Tắt tính năng static generation cho các API routes
    serverComponentsExternalPackages: ['@supabase/ssr', '@supabase/supabase-js'],
  },
}

export default nextConfig
