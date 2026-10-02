/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static output: the site can be hosted on any static host.
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  compress: true,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
