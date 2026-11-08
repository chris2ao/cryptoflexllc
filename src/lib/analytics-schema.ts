/**
 * Analytics schema (lazy, idempotent)
 * -------------------------------------------------
 * Every statement here is a constant and safe to run repeatedly. The track
 * route awaits ensureAnalyticsSchema() before its first query so a deploy
 * works without a manual migration. The result is memoised per process; a
 * failed run is logged and retried on the next call. Never throws.
 *
 * traffic_class is nullable on purpose: NULL means "pending classification".
 */

import type { getDb } from "@/lib/analytics";

export type SqlTag = ReturnType<typeof getDb>;

export const SCHEMA_STATEMENTS: readonly string[] = [
  "ALTER TABLE page_views ADD COLUMN IF NOT EXISTS referrer_host TEXT NOT NULL DEFAULT ''",
  "ALTER TABLE page_views ADD COLUMN IF NOT EXISTS referrer_class VARCHAR(16) NOT NULL DEFAULT 'direct'",
  "ALTER TABLE page_views ADD COLUMN IF NOT EXISTS traffic_class VARCHAR(8)",
  "CREATE INDEX IF NOT EXISTS idx_page_views_traffic_class ON page_views (traffic_class)",
  "CREATE INDEX IF NOT EXISTS idx_page_views_legacy_referrer ON page_views (id) WHERE referrer_host = ''",
  "CREATE TABLE IF NOT EXISTS server_events (id SERIAL PRIMARY KEY, occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), route TEXT NOT NULL, kind VARCHAR(40) NOT NULL, message TEXT NOT NULL DEFAULT '')",
  "CREATE TABLE IF NOT EXISTS cron_runs (id SERIAL PRIMARY KEY, ran_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), name VARCHAR(60) NOT NULL, ok BOOLEAN NOT NULL, duration_ms INTEGER NOT NULL DEFAULT 0, note TEXT NOT NULL DEFAULT '')",
  "CREATE TABLE IF NOT EXISTS digest_runs (id SERIAL PRIMARY KEY, ran_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), recipients INTEGER NOT NULL, sent INTEGER NOT NULL, failed INTEGER NOT NULL, duration_ms INTEGER NOT NULL DEFAULT 0)",
  "CREATE TABLE IF NOT EXISTS threat_lists (name VARCHAR(40) PRIMARY KEY, entries TEXT NOT NULL, fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW())",
  "CREATE TABLE IF NOT EXISTS ip_intel (ip_address VARCHAR(45) PRIMARY KEY, isp TEXT DEFAULT '', org TEXT DEFAULT '', as_number TEXT DEFAULT '', as_name TEXT DEFAULT '', is_proxy BOOLEAN DEFAULT FALSE, is_hosting BOOLEAN DEFAULT FALSE, is_mobile BOOLEAN DEFAULT FALSE, country VARCHAR(100) DEFAULT '', city VARCHAR(100) DEFAULT '', region VARCHAR(100) DEFAULT '', whois_org TEXT DEFAULT '', whois_address TEXT DEFAULT '', reverse_address TEXT DEFAULT '', reverse_county VARCHAR(100) DEFAULT '', reverse_state VARCHAR(10) DEFAULT '', latitude VARCHAR(20) DEFAULT '', longitude VARCHAR(20) DEFAULT '', cached_at TIMESTAMPTZ NOT NULL DEFAULT NOW())",
  "ALTER TABLE ip_intel ADD COLUMN IF NOT EXISTS company TEXT NOT NULL DEFAULT ''",
  "ALTER TABLE ip_intel ADD COLUMN IF NOT EXISTS is_datacenter BOOLEAN",
  "ALTER TABLE ip_intel ADD COLUMN IF NOT EXISTS is_tor BOOLEAN NOT NULL DEFAULT FALSE",
  "ALTER TABLE ip_intel ADD COLUMN IF NOT EXISTS is_vpn BOOLEAN",
  "ALTER TABLE ip_intel ADD COLUMN IF NOT EXISTS is_abuser BOOLEAN",
  "ALTER TABLE ip_intel ADD COLUMN IF NOT EXISTS abuser_score VARCHAR(20) NOT NULL DEFAULT ''",
  "ALTER TABLE ip_intel ADD COLUMN IF NOT EXISTS on_drop BOOLEAN NOT NULL DEFAULT FALSE",
  "ALTER TABLE ip_intel ADD COLUMN IF NOT EXISTS sources TEXT NOT NULL DEFAULT ''",
  "ALTER TABLE ip_intel ADD COLUMN IF NOT EXISTS enriched_at TIMESTAMPTZ",
];

type QueryCapable = { query?: (text: string) => Promise<unknown> };

/** Run one constant statement via sql.query when exposed, else the raw tag. */
async function runStatement(sql: SqlTag, statement: string): Promise<unknown> {
  const withQuery = sql as unknown as QueryCapable;
  if (typeof withQuery.query === "function") {
    return withQuery.query(statement);
  }
  const strings = Object.assign([statement], { raw: [statement] });
  return (sql as unknown as (s: TemplateStringsArray) => Promise<unknown>)(
    strings as unknown as TemplateStringsArray,
  );
}

/**
 * One cheap read decides whether the chain has to run at all. The last
 * column of each ALTER group is the marker, so a process never takes the
 * ALTER TABLE locks on page_views when the columns already exist.
 */
const PRESENCE_CHECK =
  "SELECT column_name AS marker FROM information_schema.columns WHERE (table_name = 'page_views' AND column_name = 'traffic_class') OR (table_name = 'ip_intel' AND column_name = 'enriched_at') UNION ALL SELECT indexname FROM pg_indexes WHERE indexname = 'idx_page_views_legacy_referrer'";

/** Three markers: the two newest columns and the newest index. A new statement needs a new marker here. */
const PRESENCE_MARKERS = 3;

async function columnsPresent(sql: SqlTag): Promise<boolean> {
  const rows = await runStatement(sql, PRESENCE_CHECK);
  return Array.isArray(rows) && rows.length >= PRESENCE_MARKERS;
}

/** After a failure, wait this long before any request tries the chain again. */
export const SCHEMA_RETRY_AFTER_MS = 5 * 60 * 1000;

let inFlight: Promise<void> | null = null;
let lastFailureAt = 0;

export function ensureAnalyticsSchema(
  sql: SqlTag,
  now: number = Date.now(),
): Promise<void> {
  if (inFlight) return inFlight;
  if (lastFailureAt && now - lastFailureAt < SCHEMA_RETRY_AFTER_MS) {
    return Promise.resolve();
  }
  const run = (async () => {
    try {
      if (await columnsPresent(sql)) return;
      for (const statement of SCHEMA_STATEMENTS) {
        await runStatement(sql, statement);
      }
      lastFailureAt = 0;
    } catch (error) {
      console.error("Analytics schema ensure failed:", error);
      lastFailureAt = now;
      inFlight = null;
    }
  })();
  // The async body only reaches the catch after an await, so this
  // assignment always precedes the reset above.
  inFlight = run;
  return run;
}

export function resetSchemaMemoForTests(): void {
  inFlight = null;
  lastFailureAt = 0;
}
