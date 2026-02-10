export function VercelAnalyticsCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Vercel Web Analytics</h2>
        <span className="inline-block px-2.5 py-1 text-xs rounded-full font-medium bg-green-500/20 text-green-400">
          Active
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Vercel Web Analytics is collecting page view and visitor data via the{" "}
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
          @vercel/analytics
        </code>{" "}
        SDK integrated in the root layout. This data includes page views,
        unique visitors, top referrers, and demographic breakdowns.
      </p>
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          <span className="text-muted-foreground">
            Client-side tracking active on all pages
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          <span className="text-muted-foreground">
            Privacy-friendly, cookie-free collection
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-muted-foreground">
            Detailed data viewable in Vercel Dashboard
          </span>
        </div>
      </div>
      <div className="mt-5">
        <a
          href="https://vercel.com/dashboard/analytics"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          View in Vercel Dashboard
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
        <p className="mt-2 text-xs text-muted-foreground">
          Vercel does not currently expose Web Analytics data via REST API.
        </p>
      </div>
    </div>
  );
}
