import bundleAnalyzer from "@next/bundle-analyzer";

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
        protocol: "http",
        hostname: "192.168.15.2",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Enable experimental features
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "192.168.15.2:3000"],
    },
  },

  // Configure headers for CORS and security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, Content-Type, Authorization",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },

  // Redirects configuration
  redirects: async () => {
    return [
      {
        source: "/blog",
        destination: "/blog/page/1",
        permanent: true,
      },
      {
        source: "/portfolio",
        destination: "/portfolio/page/1",
        permanent: true,
      },
    ];
  },

  // Rewrites configuration
  rewrites: async () => {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
      {
        source: "/admin",
        destination: "/admin/index.html",
        has: [
          {
            type: 'query',
            key: 'provider',
            value: undefined
          }
        ]
      },
      {
        source: "/admin/",
        destination: "/admin/index.html",
        has: [
          {
            type: 'query',
            key: 'provider',
            value: undefined
          }
        ]
      }
    ];
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
