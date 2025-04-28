/** @type {import('next').NextConfig} */
const nextConfig = {
    // Loại bỏ swcMinify vì nó không được hỗ trợ trong Next.js 15
    // swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        domains: ['images.unsplash.com'],
        unoptimized: true,
    },
}

export default nextConfig
