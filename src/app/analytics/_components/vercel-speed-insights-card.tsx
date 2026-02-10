export function VercelSpeedInsightsCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Vercel Speed Insights</h2>
        <span className="inline-block px-2.5 py-1 text-xs rounded-full font-medium bg-green-500/20 text-green-400">
          Active
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Vercel Speed Insights monitors real-user Core Web Vitals performance
        via the{" "}
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
          @vercel/speed-insights
        </code>{" "}
        SDK. Metrics are collected from real visitor sessions in production.
      </p>

      {/* Web Vitals overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {[
          {
            label: "LCP",
            full: "Largest Contentful Paint",
            desc: "Loading performance",
          },
          {
            label: "INP",
            full: "Interaction to Next Paint",
            desc: "Interactivity",
          },
          {
            label: "CLS",
            full: "Cumulative Layout Shift",
            desc: "Visual stability",
          },
          {
            label: "FCP",
            full: "First Contentful Paint",
            desc: "Initial render",
          },
          {
            label: "TTFB",
            full: "Time to First Byte",
            desc: "Server response",
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-md border border-border bg-muted/30 p-3"
          >
            <span className="block text-sm font-semibold">{metric.label}</span>
            <span className="block text-xs text-muted-foreground mt-0.5">
              {metric.desc}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          <span className="text-muted-foreground">
            Real-user monitoring active in production
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-muted-foreground">
            Scores and trends viewable in Vercel Dashboard
          </span>
        </div>
      </div>

      <div className="mt-5">
        <a
          href="https://vercel.com/dashboard/speed-insights"
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
          Vercel does not currently expose Speed Insights data via REST API.
        </p>
      </div>
    </div>
  );
}
