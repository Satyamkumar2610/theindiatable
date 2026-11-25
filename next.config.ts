import type { NextConfig } from "next";

// Tailwind runs through PostCSS (postcss.config.mjs).
const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
