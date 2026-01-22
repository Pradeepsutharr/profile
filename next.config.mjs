/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  reactCompiler: true,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pradeepsutharr.github.io",
      },
      {
        protocol: "https",
        hostname: "fcecfevebdgozzlzladp.supabase.co",
      },
    ],
    qualities: [10, 20, 30, 40, 50, 60, 65, 70, 75, 80, 85, 90, 95, 100],
  },
};

export default nextConfig;
