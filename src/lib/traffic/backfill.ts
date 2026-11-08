/**
 * Pending-row classification batch for page_views.
 *
 * Rows inserted with `traffic_class IS NULL` (see `classifyAtInsert`) are
 * resolved here using signals unavailable at insert time: the owner's recent
 * logins, hosting/datacenter flags from ip_intel, and engagement beacons.
 *
 * Callers run the schema ensure first; this batch does not. In particular
 * `ip_intel.is_datacenter` is added by `src/lib/analytics-schema.ts`.
 */

import type { getDb } from "@/lib/analytics";
import { BOT_UA_PATTERN_SOURCE } from "./classify";
import { classifyReferrer } from "./referrer";

type SqlTag = ReturnType<typeof getDb>;

/** Classify up to `limit` pending rows; returns how many were updated (0 when none pending). */
export async function classifyPendingPageViews(
  sql: SqlTag,
  limit = 5000,
): Promise<number> {
  const rows = await sql`
    WITH pending AS (
      -- Newest first: the dashboard's visible window clears before the historical backlog.
      SELECT id FROM page_views WHERE traffic_class IS NULL ORDER BY id DESC LIMIT ${limit}
    ),
    owner_ips AS (
      SELECT DISTINCT ip_address FROM auth_attempts
      WHERE success = TRUE AND attempted_at > NOW() - INTERVAL '30 days'
    ),
    classified AS (
      SELECT pv.id,
        CASE
          WHEN pv.page_path = '/analytics' OR pv.page_path LIKE '/analytics/%'
            OR pv.page_path = '/backlog' OR pv.page_path LIKE '/backlog/%' THEN 'self'
          WHEN o.ip_address IS NOT NULL THEN 'owner'
          WHEN pv.device_type = 'Bot' OR pv.referrer_class = 'forged' OR pv.user_agent ~* ${BOT_UA_PATTERN_SOURCE} THEN 'bot'
          WHEN COALESCE(ii.is_hosting, FALSE) OR COALESCE(ii.is_datacenter, FALSE) THEN
            CASE WHEN EXISTS (
              SELECT 1 FROM scroll_events se WHERE se.ip_address = pv.ip_address AND se.page_path = pv.page_path AND se.recorded_at BETWEEN pv.visited_at - INTERVAL '1 hour' AND pv.visited_at + INTERVAL '1 day'
            ) OR EXISTS (
              SELECT 1 FROM page_engagement pe WHERE pe.ip_address = pv.ip_address AND pe.page_path = pv.page_path AND pe.recorded_at BETWEEN pv.visited_at - INTERVAL '1 hour' AND pv.visited_at + INTERVAL '1 day'
            ) THEN 'human' ELSE 'bot' END
          ELSE 'human'
        END AS cls
      FROM page_views pv
      JOIN pending p ON p.id = pv.id
      LEFT JOIN owner_ips o ON o.ip_address = pv.ip_address
      LEFT JOIN ip_intel ii ON ii.ip_address = pv.ip_address
    ),
    upd AS (
      UPDATE page_views SET traffic_class = c.cls FROM classified c
      WHERE page_views.id = c.id AND page_views.traffic_class IS NULL RETURNING 1
    )
    SELECT COUNT(*)::int AS updated FROM upd
  `;
  const first = (rows as Array<{ updated?: number }>)[0];
  return first?.updated ?? 0;
}

/**
 * Rows written before the referrer columns existed carry the raw referrer
 * string with referrer_host '' and referrer_class 'direct' (the column
 * default). This derives host and class for them, one distinct referrer and
 * UTM pair at a time (busiest first), marks processed rows with a host of
 * "none" when the raw value is not a URL so they are never selected again,
 * and re-marks forged-referrer hits as bots. Returns the number of distinct
 * referrer groups processed.
 */
export async function backfillLegacyReferrers(
  sql: SqlTag,
  limit = 200,
): Promise<number> {
  const groups = (await sql`
    SELECT referrer, utm_source, utm_medium, COUNT(*)::int AS n
    FROM page_views
    WHERE referrer_host = ''
      AND referrer_class = 'direct'
      AND referrer <> ''
      AND referrer <> '(direct)'
    GROUP BY referrer, utm_source, utm_medium
    ORDER BY n DESC
    LIMIT ${limit}
  `) as Array<{ referrer: string; utm_source: string | null; utm_medium: string | null }>;

  for (const g of groups) {
    const { host, cls } = classifyReferrer(g.referrer, {
      source: g.utm_source,
      medium: g.utm_medium,
    });
    await sql`
      UPDATE page_views
      SET referrer_host = ${host || "none"}, referrer_class = ${cls}
      WHERE referrer = ${g.referrer}
        AND utm_source IS NOT DISTINCT FROM ${g.utm_source}
        AND utm_medium IS NOT DISTINCT FROM ${g.utm_medium}
        AND referrer_host = ''
        AND referrer_class = 'direct'
    `;
  }

  if (groups.length > 0) {
    await sql`
      UPDATE page_views SET traffic_class = 'bot'
      WHERE referrer_class = 'forged' AND traffic_class IS DISTINCT FROM 'bot'
    `;
  }
  return groups.length;
}
