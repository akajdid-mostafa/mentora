import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Only the two hosts the demo's photographs come from, and only the paths
    // they serve photographs under. A pattern left open to a whole host, or
    // to any host, turns this deployment's image optimiser into one that
    // anybody can point at any URL and bill the transforms to you.
    //
    // Your own images: add the host they live on, as narrowly, e.g.
    //   { protocol: "https", hostname: "cdn.example.com", pathname: "/uploads/**" },
    // and delete the two below once the demo's photographs are replaced.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", port: "", pathname: "/photo-*" },
      { protocol: "https", hostname: "assets.lummi.ai", port: "", pathname: "/assets/*" },
    ],
  },
};

export default nextConfig;
