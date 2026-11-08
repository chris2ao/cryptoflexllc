import { getDb } from "@/lib/analytics";
import { scopeClass, type TrafficScope } from "./shared";
import type {
  ApiMetricDailyRow,
  ApiMetricRow,
  CountryRow,
  TopPageRow,
  WebVitalsSummary,
} from "@/lib/analytics-types";

type PerformanceSummaryRow = { total_views: number; unique_visitors: number };

export interface PerformanceData {
  apiMetricsEndpoints: ApiMetricRow[];
  apiMetricsDaily: ApiMetricDailyRow[];
  webVitalsRaw: WebVitalsSummary[];
  topPages: TopPageRow[];
  topCountries: CountryRow[];
  summaryRow: PerformanceSummaryRow[];
}

export async function loadPerformance(
  days: number,
  scope: TrafficScope = "humans"
): Promise<PerformanceData> {
  const sql = getDb();
  const sc = scopeClass(scope);

  const [apiMetricsEndpoints, apiMetricsDaily, webVitalsRaw, topPages, topCountries] =
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
        SELECT page_path, COUNT(*)::int AS views, COUNT(DISTINCT ip_address)::int AS unique_views
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
          AND (${sc}::text IS NULL OR traffic_class = ${sc})
        GROUP BY page_path ORDER BY views DESC LIMIT 1
      `.catch(() => []),
      sql`
        SELECT country, COUNT(*)::int AS views
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
          AND (${sc}::text IS NULL OR traffic_class = ${sc})
        GROUP BY country ORDER BY views DESC LIMIT 1
      `.catch(() => []),
    ]);

  // Need total_views for VercelAnalyticsCard -- fetch inline
  const summaryRow = await sql`
    SELECT
      COUNT(*)::int AS total_views,
      COUNT(DISTINCT ip_address)::int AS unique_visitors
    FROM page_views
    WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
      AND (${sc}::text IS NULL OR traffic_class = ${sc})
  `;

  return {
    apiMetricsEndpoints: apiMetricsEndpoints as unknown as ApiMetricRow[],
    apiMetricsDaily: apiMetricsDaily as unknown as ApiMetricDailyRow[],
    webVitalsRaw: webVitalsRaw as unknown as WebVitalsSummary[],
    topPages: topPages as unknown as TopPageRow[],
    topCountries: topCountries as unknown as CountryRow[],
    summaryRow: summaryRow as unknown as PerformanceSummaryRow[],
  };
}
