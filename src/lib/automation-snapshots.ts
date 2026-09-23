/**
 * Automation Snapshots: Data Access
 * -------------------------------------------------
 * Generic named-row storage for automation telemetry pushed by local
 * agents. Two rows are used today, "gmail-metrics" and "session-archive",
 * replacing the JSON files that used to live in src/data/ and trigger a
 * full Vercel rebuild on every gmail-agent run (see
 * docs/plans/deployment-storage-reduction-plan.md, section C).
 *
 * Table (created lazily by putSnapshot on first ingest, and also by
 * /api/analytics/setup, the repo's existing CREATE TABLE IF NOT EXISTS
 * migration pattern):
 *   automation_snapshots (
 *     name       TEXT        PRIMARY KEY,
 *     payload    JSONB       NOT NULL,
 *     updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 *   )
 */

import type { NeonQueryFunction } from "@neondatabase/serverless";
import type { z } from "zod";
import type { GmailRun, SessionEntry } from "@/lib/analytics-types";
import { gmailRunSchema, sessionEntrySchema } from "@/lib/gmail-metrics-schemas";

export interface SnapshotRow {
  name: string;
  payload: unknown;
  updated_at: string;
}

export interface GmailMetricsSnapshots {
  gmailRuns: GmailRun[];
  sessions: SessionEntry[];
}

function isMissingTableError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "42P01"
  );
}

function toISOString(value: Date | string): string {
  return typeof value === "string" ? value : value.toISOString();
}

/**
 * Reads one named snapshot row. Returns null when the row does not exist,
 * or when the automation_snapshots table has not been created yet
 * (Postgres 42P01, matching the pattern in gmail-unsubscribe.ts); any
 * other error propagates to the caller.
 */
export async function getSnapshot(
  sql: NeonQueryFunction<false, false>,
  name: string
): Promise<SnapshotRow | null> {
  try {
    const rows = (await sql`
      SELECT name, payload, updated_at
      FROM automation_snapshots
      WHERE name = ${name}
    `) as unknown as { name: string; payload: unknown; updated_at: Date | string }[];

    const row = rows[0];
    if (!row) return null;

    return {
      name: row.name,
      payload: row.payload,
      updated_at: toISOString(row.updated_at),
    };
  } catch (error) {
    if (isMissingTableError(error)) return null;
    throw error;
  }
}

/**
 * Upserts one named snapshot row with the given payload. The payload is
 * JSON-serialized before it reaches the query so the neon driver sends a
 * plain string parameter (cast to jsonb in SQL) instead of relying on
 * implicit object serialization.
 */
export async function putSnapshot(
  sql: NeonQueryFunction<false, false>,
  name: string,
  payload: unknown
): Promise<void> {
  const payloadJson = JSON.stringify(payload);

  // Created lazily so the first ingest works without enabling the
  // /api/analytics/setup route (which also creates it) and redeploying.
  await sql`
    CREATE TABLE IF NOT EXISTS automation_snapshots (
      name TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    INSERT INTO automation_snapshots (name, payload, updated_at)
    VALUES (${name}, ${payloadJson}::jsonb, NOW())
    ON CONFLICT (name) DO UPDATE SET
      payload = EXCLUDED.payload,
      updated_at = NOW()
  `;
}

/**
 * Loads and validates one named snapshot array against a zod item schema.
 * Never throws: a missing row, missing table, database error, or a stored
 * payload that fails schema validation all fall back to an empty array so
 * the caller can render its existing empty/zero state. Failures are
 * logged server-side only, never the payload.
 */
async function loadSnapshotArray<T>(
  sql: NeonQueryFunction<false, false>,
  name: string,
  itemSchema: z.ZodType<T>
): Promise<T[]> {
  let row: SnapshotRow | null;
  try {
    row = await getSnapshot(sql, name);
  } catch (error) {
    console.error(`automation-snapshots: failed to load "${name}"`, error);
    return [];
  }

  if (!row) return [];

  const parsed = itemSchema.array().safeParse(row.payload);
  if (!parsed.success) {
    console.error(`automation-snapshots: invalid stored payload for "${name}"`);
    return [];
  }

  return parsed.data;
}

/**
 * Loads the gmail-metrics and session-archive snapshots consumed by the
 * /analytics "Automation" section. See loadSnapshotArray for the
 * never-throws fallback behavior applied to each row independently.
 */
export async function loadGmailMetricsSnapshots(
  sql: NeonQueryFunction<false, false>
): Promise<GmailMetricsSnapshots> {
  const [gmailRuns, sessions] = await Promise.all([
    loadSnapshotArray(sql, "gmail-metrics", gmailRunSchema),
    loadSnapshotArray(sql, "session-archive", sessionEntrySchema),
  ]);

  return { gmailRuns, sessions };
}
