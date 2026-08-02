const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self' https://formspree.io",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://giscus.app https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://github.com https://avatars.githubusercontent.com https://media.licdn.com https://images.credly.com",
  "connect-src 'self' https://formspree.io https://challenges.cloudflare.com https://ryvtguwxbf.execute-api.us-east-1.amazonaws.com https://*.vercel-insights.com",
  "frame-src https://challenges.cloudflare.com https://giscus.app",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

export const SECURITY_HEADERS = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  {
    key: "Content-Security-Policy-Report-Only",
    value: contentSecurityPolicy,
  },
];
