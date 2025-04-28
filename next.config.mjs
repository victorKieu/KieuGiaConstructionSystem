/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost', 'vercel.app', 'oshquiqzokyyawgoemql.supabase.co'],
        unoptimized: true,
    },
    // Loại bỏ swcMinify vì không được hỗ trợ trong Next.js 15
    // swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    // Thêm cấu hình experimental để hỗ trợ serverActions
    experimental: {
        serverActions: {
            allowedOrigins: ['localhost:3000', '*.vercel.app'],
        },
    },
}

export default nextConfig
