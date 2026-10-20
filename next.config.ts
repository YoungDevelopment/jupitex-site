import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev JS is blocked unless the page's host is allowlisted. Phones use the LAN IP.
  allowedDevOrigins: ["192.168.*.*"],
  cacheComponents: true,
  partialPrefetching: true,
  devIndicators: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
