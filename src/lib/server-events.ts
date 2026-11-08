/**
 * Server event log
 * -----------------------------------------------
 * Fire-and-forget writes into server_events from route catch blocks. Like
 * recordApiMetric, it never awaits and never lets an error escape. Callers
 * pass an error message only, never environment values.
 */

import { getDb } from "@/lib/analytics";

const MESSAGE_MAX = 500;

export function recordServerEvent(route: string, kind: string, message: string): void {
  try {
    const sql = getDb();
    Promise.resolve(
      sql`
        INSERT INTO server_events (route, kind, message)
        VALUES (${route}, ${kind.slice(0, 40)}, ${message.slice(0, MESSAGE_MAX)})
      `,
    ).catch(() => {
      // Telemetry must never break the app.
    });
  } catch {
    // getDb() throws when the database is not configured.
  }
}
