/**
 * Cron run records
 * -----------------------------------------------
 * Writes one cron_runs row per cron execution so the ops panel can show
 * what ran, how long it took and whether it failed. Recording never throws.
 */

import type { SqlTag } from "@/lib/analytics-schema";

const NOTE_MAX = 500;

export async function recordCronRun(
  sql: SqlTag,
  name: string,
  ok: boolean,
  durationMs: number,
  note = "",
): Promise<void> {
  try {
    await sql`
      INSERT INTO cron_runs (name, ok, duration_ms, note)
      VALUES (${name}, ${ok}, ${Math.max(0, Math.round(durationMs))}, ${note.slice(0, NOTE_MAX)})
    `;
  } catch (error) {
    console.error(
      `[cron-runs] could not record ${name}:`,
      error instanceof Error ? error.message : "unknown",
    );
  }
}

/**
 * Time fn, record the outcome and rethrow on failure. The optional describe
 * callback turns a successful result into the note.
 */
export async function withCronRun<T>(
  sql: SqlTag,
  name: string,
  fn: () => Promise<T>,
  describe?: (result: T) => string,
): Promise<T> {
  const started = Date.now();
  let result: T;
  try {
    result = await fn();
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    await recordCronRun(sql, name, false, Date.now() - started, message);
    throw error;
  }
  let note = "";
  try {
    note = describe ? describe(result) : "";
  } catch {
    note = "";
  }
  await recordCronRun(sql, name, true, Date.now() - started, note);
  return result;
}
