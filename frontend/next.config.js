/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/api/:path*/',
                destination: `${process.env.DB_HOST}/api/:path*/`, // 외부 API 주소
            },
        ];
    },
    // trailingSlash: true,
}

module.exports = nextConfig
