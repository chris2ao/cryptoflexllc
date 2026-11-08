import { getDb } from "@/lib/analytics";
import { scopeClass, type TrafficScope } from "./shared";
import {
  fetchDeployments,
  fetchWebAnalyticsCount,
  fetchWebAnalyticsDaily,
  isVercelApiConfigured,
  type DeploymentSummary,
  type WebAnalyticsState,
} from "@/lib/vercel-api";
import type {
  ApiMetricDailyRow,
  ApiMetricRow,
  WebVitalsSummary,
} from "@/lib/analytics-types";

export interface PerformanceData {
  apiMetricsEndpoints: ApiMetricRow[];
  apiMetricsDaily: ApiMetricDailyRow[];
  webVitalsRaw: WebVitalsSummary[];
  webAnalytics: {
    state: WebAnalyticsState;
    ours: { pageviews: number; visitors: number };
    theirs: { pageviews: number; visitors: number } | null;
    daily: Array<{ date: string; pageviews: number; visitors: number }>;
  };
  deployments: DeploymentSummary[];
}

type Counts = { pageviews: number; visitors: number };

function isoDay(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

function oursFrom(rows: unknown): Counts {
  const row = ((rows as Array<Record<string, unknown>>)?.[0] ?? {}) as Record<string, unknown>;
  return {
    pageviews: Number(row.pageviews) || 0,
    visitors: Number(row.visitors) || 0,
  };
}

const UNAVAILABLE = { state: "unavailable" as WebAnalyticsState, rows: [] };

async function loadVercelSignals(days: number) {
  if (!isVercelApiConfigured()) {
    return { state: "unavailable" as WebAnalyticsState, theirs: null, daily: [], deployments: [] };
  }
  const windowDays = Math.min(days, 30);
  const until = isoDay(Date.now());
  const since = isoDay(Date.now() - windowDays * 86_400_000);
  const [count, daily, deployments] = await Promise.all([
    fetchWebAnalyticsCount(since, until).catch(() => ({ ...UNAVAILABLE, pageviews: 0, visitors: 0 })),
    fetchWebAnalyticsDaily(since, until).catch(() => UNAVAILABLE),
    fetchDeployments(10).catch(() => []),
  ]);
  return {
    state: count.state,
    theirs:
      count.state === "ok"
        ? { pageviews: count.pageviews, visitors: count.visitors }
        : null,
    daily: daily.rows,
    deployments,
  };
}

export async function loadPerformance(
  days: number,
  scope: TrafficScope = "humans"
): Promise<PerformanceData> {
  const sql = getDb();
  const sc = scopeClass(scope);
  const windowDays = Math.min(days, 30);

  const [apiMetricsEndpoints, apiMetricsDaily, webVitalsRaw, oursRows, vercel] =
    await Promise.all([
      sql`
        SELECT
          endpoint,
          method,
          ROUND(AVG(duration_ms)::numeric, 1) AS avg_ms,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY duration_ms) AS p50,
          PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY duration_ms) AS p75,
          PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration_ms) AS p95,
          COUNT(*) FILTER (WHERE status_code >= 400)::int AS error_count,
          COUNT(*)::int AS total_count
        FROM api_metrics
        WHERE recorded_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY endpoint, method
        ORDER BY total_count DESC
      `.catch(() => []),
      sql`
        SELECT
          DATE(recorded_at)::text AS date,
          ROUND(AVG(duration_ms)::numeric, 1) AS avg_ms,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY duration_ms) AS p50,
          PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY duration_ms) AS p75,
          PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration_ms) AS p95,
          COUNT(*) FILTER (WHERE status_code >= 400)::int AS error_count,
          COUNT(*)::int AS total_count
        FROM api_metrics
        WHERE recorded_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY DATE(recorded_at)
        ORDER BY date
      `.catch(() => []),
      sql`
        SELECT
          metric_name,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY metric_value) AS p50,
          PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY metric_value) AS p75,
          PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY metric_value) AS p95,
          AVG(metric_value) AS avg,
          COUNT(*)::int AS total_samples,
          COUNT(*) FILTER (WHERE rating = 'good')::int AS good_count,
          COUNT(*) FILTER (WHERE rating = 'needs-improvement')::int AS needs_improvement_count,
          COUNT(*) FILTER (WHERE rating = 'poor')::int AS poor_count
        FROM web_vitals
        WHERE recorded_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY metric_name
      `.catch(() => []),
      sql`
        SELECT
          COUNT(*)::int AS pageviews,
          COUNT(DISTINCT ip_address)::int AS visitors
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${windowDays}
          AND (${sc}::text IS NULL OR traffic_class = ${sc})
      `.catch(() => []),
      loadVercelSignals(days),
    ]);

  return {
    apiMetricsEndpoints: apiMetricsEndpoints as unknown as ApiMetricRow[],
    apiMetricsDaily: apiMetricsDaily as unknown as ApiMetricDailyRow[],
    webVitalsRaw: webVitalsRaw as unknown as WebVitalsSummary[],
    webAnalytics: {
      state: vercel.state,
      ours: oursFrom(oursRows),
      theirs: vercel.theirs,
      daily: vercel.daily,
    },
    deployments: vercel.deployments,
  };
}
