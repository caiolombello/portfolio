import bundleAnalyzer from "@next/bundle-analyzer";
import { SECURITY_HEADERS } from "./lib/security-headers.mjs";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

let userConfig = undefined;
try {
  // try to import ESM first
  userConfig = await import("./v0-user-next.config.mjs");
} catch (e) {
  try {
    // fallback to CJS import
    userConfig = await import("./v0-user-next.config");
  } catch (innerError) {
    // ignore error
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow development origins
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.15.2:3000",
    "http://127.0.0.1:3000",
    "192.168.15.2:3000",
    "localhost:3000",
  ],

  // Enable Turbopack configuration
  turbopack: {
    // Configure loaders for SVG and other file types
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
    // Configure resolve aliases for common paths
    resolveAlias: {
      "@": ".",
      "@/components": "./components",
      "@/lib": "./lib",
      "@/styles": "./styles",
      "@/public": "./public",
    },
    // Configure extensions for module resolution
    resolveExtensions: [
      ".tsx",
      ".ts",
      ".jsx",
      ".js",
      ".json",
      ".css",
      ".scss",
      ".mdx",
    ],
  },

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.credly.com",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable image optimization for better performance
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 dias
  },

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Enable experimental features
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "192.168.15.2:3000"],
    },
  },

  // Security headers are global; APIs remain same-origin by default.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },

  // Redirects configuration
  redirects: async () => {
    return [];
  },

};

if (userConfig) {
  const config = userConfig.default || userConfig;

  for (const key in config) {
    if (
      typeof nextConfig[key] === "object" &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      };
    } else {
      nextConfig[key] = config[key];
    }
  }
}

export default withBundleAnalyzer(nextConfig);
