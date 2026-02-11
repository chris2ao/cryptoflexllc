export function VercelAnalyticsCard({
  totalViews,
  uniqueVisitors,
  topPage,
  topCountry,
}: {
  totalViews: number;
  uniqueVisitors: number;
  topPage: string | null;
  topCountry: string | null;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Web Analytics</h2>
        <span className="inline-block px-2.5 py-1 text-xs rounded-full font-medium bg-green-500/20 text-green-400">
          Active
        </span>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-md border border-border bg-muted/30 p-3">
          <span className="block text-2xl font-bold">
            {totalViews.toLocaleString()}
          </span>
          <span className="block text-xs text-muted-foreground">
            Page Views
          </span>
        </div>
        <div className="rounded-md border border-border bg-muted/30 p-3">
          <span className="block text-2xl font-bold">
            {uniqueVisitors.toLocaleString()}
          </span>
          <span className="block text-xs text-muted-foreground">
            Unique Visitors
          </span>
        </div>
        <div className="rounded-md border border-border bg-muted/30 p-3">
          <span className="block text-sm font-semibold truncate">
            {topPage || "—"}
          </span>
          <span className="block text-xs text-muted-foreground">Top Page</span>
        </div>
        <div className="rounded-md border border-border bg-muted/30 p-3">
          <span className="block text-sm font-semibold truncate">
            {topCountry || "—"}
          </span>
          <span className="block text-xs text-muted-foreground">
            Top Country
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          <span className="text-muted-foreground">
            Dual tracking: custom + Vercel{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">
              @vercel/analytics
            </code>
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          <span className="text-muted-foreground">
            Privacy-friendly, cookie-free collection
          </span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-border">
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
      </div>
    </div>
  );
}
