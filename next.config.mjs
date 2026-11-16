/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/dragon-news.png",
        destination: "/images/dragon-news.webp",
      },
      {
        source: "/images/:path*.png",
        destination: "/images/:path*.webp",
      },
    ];
  },
};

export default nextConfig;
