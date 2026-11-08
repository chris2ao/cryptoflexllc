import { getDb } from "@/lib/analytics";
import type { TrafficScope } from "./shared";
import type {
  ApiMetricDailyRow,
  ApiMetricRow,
  WebVitalsSummary,
} from "@/lib/analytics-types";

export interface PerformanceData {
  apiMetricsEndpoints: ApiMetricRow[];
  apiMetricsDaily: ApiMetricDailyRow[];
  webVitalsRaw: WebVitalsSummary[];
}

export async function loadPerformance(
  days: number,
  _scope: TrafficScope = "humans"
): Promise<PerformanceData> {
  const sql = getDb();

  const [apiMetricsEndpoints, apiMetricsDaily, webVitalsRaw] =
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
    ]);

  return {
    apiMetricsEndpoints: apiMetricsEndpoints as unknown as ApiMetricRow[],
    apiMetricsDaily: apiMetricsDaily as unknown as ApiMetricDailyRow[],
    webVitalsRaw: webVitalsRaw as unknown as WebVitalsSummary[],
  };
}
