/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        // pathname: "/api/portraits/**",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**", // allow all paths
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**", // optional, covers normal Unsplash URLs
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
