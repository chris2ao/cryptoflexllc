/**
 * API Timing Utility
 * -----------------------------------------------
 * Records response time metrics for API routes into the
 * api_metrics table. Uses fire-and-forget writes so timing
 * never blocks or breaks the actual response.
 */

import { getDb } from "@/lib/analytics";

/**
 * Record an API call's duration. This is intentionally
 * fire-and-forget — we don't await the DB write so it
 * cannot slow down or fail the response.
 */
export function recordApiMetric(
  endpoint: string,
  method: string,
  statusCode: number,
  durationMs: number,
) {
  try {
    const sql = getDb();
    // Fire-and-forget: don't await, don't let errors propagate
    sql`
      INSERT INTO api_metrics (endpoint, method, status_code, duration_ms)
      VALUES (${endpoint}, ${method}, ${statusCode}, ${durationMs})
    `.catch(() => {
      // Silently fail — telemetry should never break the app
    });
  } catch {
    // getDb() might throw if DB is not configured — ignore
  }
}
