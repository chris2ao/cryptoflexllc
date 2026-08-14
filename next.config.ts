import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  /*
   * Stop `next dev` from generating AGENTS.md / CLAUDE.md at the repo
   * root. A generated CLAUDE.md would be auto-loaded as project
   * instructions by Claude Code; this repo intentionally has neither.
   */
  agentRules: false,
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
    // Portfolio detail pages were removed permanently; 301 transfers equity
    {
      source: "/portfolio/:slug",
      destination: "/portfolio",
      permanent: true,
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
    /*
     * Published post images do not change once shipped, so cached
     * transformations should be long-lived. Without this, entries expire
     * early and the same image is transformed again, spending quota to
     * reproduce a byte-identical result. 30 days is long enough to matter
     * while still letting a replaced asset roll over on its own.
     */
    minimumCacheTTL: 2592000,
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
          // Isolate the top-level browsing context. COEP `require-corp` was
          // deliberately NOT added: it would break the YouTube, GA, and Vercel
          // embeds. A global Cross-Origin-Resource-Policy was also omitted on
          // purpose because `same-origin` would stop link unfurlers from loading
          // the /api/og social images. Verify Vercel Analytics / Speed Insights
          // still report after deploying this header.
          key: "Cross-Origin-Opener-Policy",
          value: "same-origin",
        },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self'",
            "connect-src 'self' https://www.google-analytics.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
            // youtube-nocookie is required for the lazy YouTube embed (F-M7).
            "frame-src 'self' https://www.youtube-nocookie.com",
            "frame-ancestors 'self'",
            "base-uri 'self'",
            "form-action 'self'",
            // Free hardening (F-M2 rider). A nonce/hash CSP to drop
            // 'unsafe-inline' was assessed and declined: it would force
            // statically-generated routes into per-request rendering.
            "object-src 'none'",
            "upgrade-insecure-requests",
          ].join("; "),
        },
      ],
    },
  ],
};

export default nextConfig;
