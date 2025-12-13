import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // We render the legacy DOM-driven app entirely on the client.
  experimental: {
    optimizePackageImports: ["chart.js", "d3-delaunay", "@supabase/supabase-js", "framer-motion"]
  }
};

export default nextConfig;


