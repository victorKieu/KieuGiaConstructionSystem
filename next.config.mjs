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

    // Bỏ qua các API route trong quá trình build
    experimental: {
        // Các cấu hình experimental hiện tại của bạn

        // Bỏ qua các API route trong quá trình build
        skipMiddlewareUrlNormalize: true,
        skipTrailingSlashRedirect: true,
    },

    // Bỏ qua các API route trong quá trình build
    async rewrites() {
        return {
            beforeFiles: [
                // Chuyển hướng tất cả các API route đến API route bảo trì
                {
                    source: '/api/:path*',
                    destination: '/api/maintenance',
                    has: [
                        {
                            type: 'header',
                            key: 'x-vercel-deployment',
                            value: '.*',
                        },
                    ],
                },
            ],
        }
    },
}

export default nextConfig
