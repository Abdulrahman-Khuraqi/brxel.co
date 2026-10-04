/** @type {import('next').NextConfig} */
const nextConfig = {
  // Runs as a Node.js server (`next start`), so the dashboard and the public site share one app.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Native modules stay outside the server bundle and load from node_modules at runtime.
  serverExternalPackages: ["sharp", "mysql2"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
    serverActions: {
      // Image uploads go through Server Actions; files are capped at 10 MB in src/server/media.js.
      bodySizeLimit: "12mb",
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn", "info"] } : false,
  },
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
