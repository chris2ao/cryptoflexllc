import type { WebVitalsSummary } from "@/lib/analytics-types";

/** Thresholds per Google's Web Vitals guidance */
const THRESHOLDS: Record<string, { good: number; poor: number; unit: string }> = {
  LCP: { good: 2500, poor: 4000, unit: "ms" },
  INP: { good: 200, poor: 500, unit: "ms" },
  CLS: { good: 0.1, poor: 0.25, unit: "" },
  FCP: { good: 1800, poor: 3000, unit: "ms" },
  TTFB: { good: 800, poor: 1800, unit: "ms" },
};

const METRIC_INFO: Record<string, { full: string; desc: string }> = {
  LCP: { full: "Largest Contentful Paint", desc: "Loading performance" },
  INP: { full: "Interaction to Next Paint", desc: "Interactivity" },
  CLS: { full: "Cumulative Layout Shift", desc: "Visual stability" },
  FCP: { full: "First Contentful Paint", desc: "Initial render" },
  TTFB: { full: "Time to First Byte", desc: "Server response" },
};

function formatValue(name: string, value: number): string {
  if (name === "CLS") return value.toFixed(3);
  return `${Math.round(value)}ms`;
}

function getRatingColor(name: string, p75: number): string {
  const t = THRESHOLDS[name];
  if (!t) return "text-muted-foreground";
  if (p75 <= t.good) return "text-green-400";
  if (p75 <= t.poor) return "text-yellow-400";
  return "text-red-400";
}

function getRatingBorder(name: string, p75: number): string {
  const t = THRESHOLDS[name];
  if (!t) return "border-border";
  if (p75 <= t.good) return "border-green-500/30 bg-green-500/5";
  if (p75 <= t.poor) return "border-yellow-500/30 bg-yellow-500/5";
  return "border-red-500/30 bg-red-500/5";
}

function getRatingLabel(name: string, p75: number): string {
  const t = THRESHOLDS[name];
  if (!t) return "—";
  if (p75 <= t.good) return "Good";
  if (p75 <= t.poor) return "Needs Improvement";
  return "Poor";
}

export function VercelSpeedInsightsCard({
  data,
}: {
  data: WebVitalsSummary[];
}) {
  const hasData = data.length > 0;
  const metricMap = new Map(data.map((d) => [d.metric_name, d]));

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Speed Insights</h2>
        <span className="inline-block px-2.5 py-1 text-xs rounded-full font-medium bg-green-500/20 text-green-400">
          Active
        </span>
      </div>

      {hasData ? (
        <>
          {/* Metric cards with real data */}
          <div className="space-y-3 mb-4">
            {["LCP", "INP", "CLS", "FCP", "TTFB"].map((name) => {
              const metric = metricMap.get(name);
              const info = METRIC_INFO[name];
              if (!metric) {
                return (
                  <div
                    key={name}
                    className="rounded-md border border-border bg-muted/30 p-3 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-sm font-semibold">{name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {info?.desc}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      No data yet
                    </span>
                  </div>
                );
              }

              const ratingColor = getRatingColor(name, metric.p75);
              const ratingBorder = getRatingBorder(name, metric.p75);
              const total = metric.total_samples;
              const goodPct =
                total > 0
                  ? Math.round((metric.good_count / total) * 100)
                  : 0;
              const niPct =
                total > 0
                  ? Math.round(
                      (metric.needs_improvement_count / total) * 100
                    )
                  : 0;
              const poorPct =
                total > 0
                  ? Math.round((metric.poor_count / total) * 100)
                  : 0;

              return (
                <div
                  key={name}
                  className={`rounded-md border p-3 ${ratingBorder}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-semibold">{name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {info?.desc}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-bold ${ratingColor}`}>
                        {formatValue(name, metric.p75)}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        p75
                      </span>
                    </div>
                  </div>

                  {/* Rating distribution bar */}
                  <div className="flex h-2 rounded-full overflow-hidden bg-muted mb-1.5">
                    {goodPct > 0 && (
                      <div
                        className="bg-green-500 transition-all"
                        style={{ width: `${goodPct}%` }}
                      />
                    )}
                    {niPct > 0 && (
                      <div
                        className="bg-yellow-500 transition-all"
                        style={{ width: `${niPct}%` }}
                      />
                    )}
                    {poorPct > 0 && (
                      <div
                        className="bg-red-500 transition-all"
                        style={{ width: `${poorPct}%` }}
                      />
                    )}
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {getRatingLabel(name, metric.p75)} &middot;{" "}
                      {total.toLocaleString()} samples
                    </span>
                    <span>
                      <span className="text-green-400">{goodPct}%</span>
                      {" / "}
                      <span className="text-yellow-400">{niPct}%</span>
                      {" / "}
                      <span className="text-red-400">{poorPct}%</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="py-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            No Web Vitals data collected yet
          </p>
          <p className="text-xs text-muted-foreground">
            Metrics will appear here as visitors browse the site. Core Web
            Vitals (LCP, INP, CLS, FCP, TTFB) are collected automatically from
            real visitor sessions.
          </p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border">
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
      </div>
    </div>
  );
}
