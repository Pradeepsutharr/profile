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
  },
};

export default nextConfig;
