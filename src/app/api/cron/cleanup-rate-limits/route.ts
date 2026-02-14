/**
 * GET /api/cron/cleanup-rate-limits
 * -----------------------------------------------
 * Triggered by Vercel Cron every 6 hours.
 * Purges expired rate limit entries older than 24 hours
 * to prevent the rate_limits table from growing unbounded.
 *
 * Required env vars:
 *   CRON_SECRET   - Vercel cron secret for auth
 *   DATABASE_URL  - Neon Postgres connection string
 */

import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { getDb } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  // ---- Auth: Vercel Cron sends this header automatically ----
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization") ?? "";
  const expectedHeader = `Bearer ${cronSecret}`;
  let cronAuthed = false;
  if (cronSecret && authHeader.length === expectedHeader.length) {
    try {
      cronAuthed = timingSafeEqual(
        Buffer.from(authHeader),
        Buffer.from(expectedHeader)
      );
    } catch {
      cronAuthed = false;
    }
  }
  if (!cronAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDb();

    // Delete rate limit entries older than 24 hours
    const result = await sql`
      DELETE FROM rate_limits
      WHERE window_start < EXTRACT(EPOCH FROM NOW() - INTERVAL '24 hours') * 1000
    `;

    const deleted = (result as unknown as { count: number }).count ?? 0;
    console.log(`Rate limit cleanup: purged ${deleted} expired entries`);

    return NextResponse.json({ ok: true, deleted });
  } catch (error) {
    console.error("Rate limit cleanup error:", error);
    return NextResponse.json(
      { error: "Cleanup failed" },
      { status: 500 }
    );
  }
}
