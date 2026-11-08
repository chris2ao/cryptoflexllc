/**
 * Nightly pre-enrichment: IPs seen recently in page_views that have no
 * ip_intel row, or one older than 30 days, enriched sequentially within the
 * provider's rate limit. Stub for the wave 3 seam; implemented by task 9.
 * The cleanup cron (task 11) calls it after the classification loop.
 */
import type { getDb } from "@/lib/analytics";

export type SqlTag = ReturnType<typeof getDb>;

export async function enrichPendingIps(
  _sql: SqlTag,
  _limit = 200,
): Promise<number> {
  return 0;
}
