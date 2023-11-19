/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_HOST}/api/:path*`,
      },
    ];
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `@import "@/styles/_variables.scss"; @import "@/styles/_mixins.scss";`, // prependData 옵션 추가
  },
};

module.exports = nextConfig;
