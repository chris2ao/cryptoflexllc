/**
 * Retention for operational tables. Every DELETE binds its day count as a
 * parameter through make_interval and is isolated: a failure is logged and
 * counts as 0 so the next delete (and the calling cron) still runs.
 */

import type { SqlTag } from "@/lib/analytics-schema";

export interface RetentionWindows {
  serverEventsDays: number;
  cronRunsDays: number;
  digestRunsDays: number;
}

export interface PruneCounts {
  serverEvents: number;
  cronRuns: number;
  digestRuns: number;
}

const DEFAULT_WINDOWS: RetentionWindows = {
  serverEventsDays: 90,
  cronRunsDays: 90,
  digestRunsDays: 365,
};

/** Runs a counting CTE (`... SELECT COUNT(*)::int AS n FROM d`) and reads n. */
async function counted(label: string, run: () => Promise<unknown>): Promise<number> {
  try {
    const rows = (await run()) as Array<{ n?: number | string }> | null;
    return Number(rows?.[0]?.n ?? 0);
  } catch (error) {
    console.error(`Retention prune failed (${label}):`, error);
    return 0;
  }
}

export async function pruneOperationalRecords(
  sql: SqlTag,
  opts: RetentionWindows = DEFAULT_WINDOWS,
): Promise<PruneCounts> {
  const serverEvents = await counted("server_events", () => sql`
    WITH d AS (
      DELETE FROM server_events
      WHERE occurred_at < NOW() - make_interval(days => ${opts.serverEventsDays})
      RETURNING 1
    ) SELECT COUNT(*)::int AS n FROM d
  `);
  const cronRuns = await counted("cron_runs", () => sql`
    WITH d AS (
      DELETE FROM cron_runs
      WHERE ran_at < NOW() - make_interval(days => ${opts.cronRunsDays})
      RETURNING 1
    ) SELECT COUNT(*)::int AS n FROM d
  `);
  const digestRuns = await counted("digest_runs", () => sql`
    WITH d AS (
      DELETE FROM digest_runs
      WHERE ran_at < NOW() - make_interval(days => ${opts.digestRunsDays})
      RETURNING 1
    ) SELECT COUNT(*)::int AS n FROM d
  `);
  return { serverEvents, cronRuns, digestRuns };
}

/** Drops cached intel older than `days` for IPs that no page_views row references. */
export async function pruneStaleIntel(sql: SqlTag, days: number = 90): Promise<number> {
  return counted("ip_intel", () => sql`
    WITH d AS (
      DELETE FROM ip_intel i
      WHERE i.cached_at < NOW() - make_interval(days => ${days})
        AND NOT EXISTS (SELECT 1 FROM page_views pv WHERE pv.ip_address = i.ip_address)
      RETURNING 1
    ) SELECT COUNT(*)::int AS n FROM d
  `);
}

/** Blanks raw IPs on engagement tables so they cannot be re-linked to anonymised page views. */
export async function anonymizeEngagementIps(
  sql: SqlTag,
  days: number = 90,
): Promise<{ scrollEvents: number; pageEngagement: number }> {
  const scrollEvents = await counted("scroll_events", () => sql`
    WITH u AS (
      UPDATE scroll_events SET ip_address = ''
      WHERE recorded_at < NOW() - make_interval(days => ${days})
        AND ip_address <> ''
      RETURNING 1
    ) SELECT COUNT(*)::int AS n FROM u
  `);
  const pageEngagement = await counted("page_engagement", () => sql`
    WITH u AS (
      UPDATE page_engagement SET ip_address = ''
      WHERE recorded_at < NOW() - make_interval(days => ${days})
        AND ip_address <> ''
      RETURNING 1
    ) SELECT COUNT(*)::int AS n FROM u
  `);
  return { scrollEvents, pageEngagement };
}
