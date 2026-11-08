/**
 * Nightly pre-enrichment: IPs seen recently in page_views that have no
 * ip_intel row, or one older than 30 days, enriched sequentially within the
 * provider's rate limit. The cleanup cron (task 11) calls it after the
 * classification loop.
 */
import type { getDb } from "@/lib/analytics";
import { enrichIp, type EnrichResult } from "./enrich";
import { isPrivateIp, isValidIp } from "./ip-validate";

export type SqlTag = ReturnType<typeof getDb>;

export interface BatchDeps {
  enrich: (sql: SqlTag, ip: string) => Promise<EnrichResult>;
  sleep: (ms: number) => Promise<void>;
  spacingMs: number;
}

const defaultDeps: BatchDeps = {
  enrich: (sql, ip) => enrichIp(sql, ip),
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  spacingMs: 1400,
};

export async function enrichPendingIps(
  sql: SqlTag,
  limit = 200,
  deps: BatchDeps = defaultDeps,
): Promise<number> {
  try {
    const rows = (await sql`
      SELECT DISTINCT pv.ip_address
      FROM page_views pv
      LEFT JOIN ip_intel i ON i.ip_address = pv.ip_address
      WHERE pv.visited_at > NOW() - INTERVAL '2 days'
        AND pv.ip_address IS NOT NULL
        AND pv.ip_address <> ''
        AND (i.ip_address IS NULL
             OR i.enriched_at IS NULL
             OR i.enriched_at < NOW() - INTERVAL '30 days')
      LIMIT ${limit}
    `) as Array<{ ip_address: string }>;

    const ips = rows
      .map((r) => r.ip_address)
      .filter((ip) => typeof ip === "string" && isValidIp(ip) && !isPrivateIp(ip));

    let enriched = 0;
    for (let i = 0; i < ips.length; i++) {
      if (i > 0) await deps.sleep(deps.spacingMs);
      const { enrichment, cached } = await deps.enrich(sql, ips[i]);
      if (!cached && enrichment.sources.length > 0) enriched++;
    }
    console.log(`ip-enrichment batch: ${enriched} of ${ips.length} pending IPs enriched`);
    return enriched;
  } catch (error) {
    console.error("ip-enrichment batch failed:", error instanceof Error ? error.message : "unknown");
    return 0;
  }
}
