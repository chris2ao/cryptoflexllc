import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  redirects: async () => [
    // Renamed blog post (old slug 404s in GSC)
    {
      source: "/blog/adding-blog-comments-likes-and-a-belated-welcome-email",
      destination: "/blog/adding-comments-likes-and-subscriber-welcome-emails",
      permanent: true,
    },
    // Common bot probes and garbage URLs from GSC 404 report
    {
      source: "/blog-post",
      destination: "/blog",
      permanent: true,
    },
    // Literal template bracket leaked to crawlers
    {
      source: "/resources/%5Bslug%5D",
      destination: "/resources",
      permanent: true,
    },
    {
      source: "/resources/[slug]",
      destination: "/resources",
      permanent: true,
    },
    // Portfolio detail pages don't exist yet; redirect crawled 404s
    {
      source: "/portfolio/:slug",
      destination: "/portfolio",
      permanent: false,
    },
  ],
  outputFileTracingIncludes: {
    "/*": ["src/content/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "cryptoflexllc.com",
      },
    ],
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: [
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
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "X-DNS-Prefetch-Control",
          value: "on",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self'",
            "connect-src 'self' https://www.google-analytics.com",
            "frame-src 'self'",
            "frame-ancestors 'self'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join("; "),
        },
      ],
    },
  ],
};

export default nextConfig;
