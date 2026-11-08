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
  "CREATE TABLE IF NOT EXISTS server_events (id SERIAL PRIMARY KEY, occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), route TEXT NOT NULL, kind VARCHAR(40) NOT NULL, message TEXT NOT NULL DEFAULT '')",
  "CREATE TABLE IF NOT EXISTS cron_runs (id SERIAL PRIMARY KEY, ran_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), name VARCHAR(60) NOT NULL, ok BOOLEAN NOT NULL, duration_ms INTEGER NOT NULL DEFAULT 0, note TEXT NOT NULL DEFAULT '')",
  "CREATE TABLE IF NOT EXISTS digest_runs (id SERIAL PRIMARY KEY, ran_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), recipients INTEGER NOT NULL, sent INTEGER NOT NULL, failed INTEGER NOT NULL, duration_ms INTEGER NOT NULL DEFAULT 0)",
  "CREATE TABLE IF NOT EXISTS threat_lists (name VARCHAR(40) PRIMARY KEY, entries TEXT NOT NULL, fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW())",
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
async function runStatement(sql: SqlTag, statement: string): Promise<void> {
  const withQuery = sql as unknown as QueryCapable;
  if (typeof withQuery.query === "function") {
    await withQuery.query(statement);
    return;
  }
  const strings = Object.assign([statement], { raw: [statement] });
  await (sql as unknown as (s: TemplateStringsArray) => Promise<unknown>)(
    strings as unknown as TemplateStringsArray,
  );
}

let inFlight: Promise<void> | null = null;

export function ensureAnalyticsSchema(sql: SqlTag): Promise<void> {
  if (inFlight) return inFlight;
  const run = (async () => {
    try {
      for (const statement of SCHEMA_STATEMENTS) {
        await runStatement(sql, statement);
      }
    } catch (error) {
      console.error("Analytics schema ensure failed:", error);
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
}
