/**
 * GET /api/cron/cleanup-page-views
 * -----------------------------------------------
 * Triggered by Vercel Cron daily. Anonymizes the stored client IP on page_views
 * older than the retention window, keeping the analytics rows but dropping the
 * PII (F-L11). Uses an UPDATE (not DELETE) so historical analytics survive.
 *
 * Required env vars:
 *   CRON_SECRET   - Vercel cron secret for auth
 *   DATABASE_URL  - Neon Postgres connection string
 */

import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { getDb } from "@/lib/analytics";

// Retain raw IPs for this many days, then blank them.
const RETENTION_DAYS = 90;

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

    // Blank the IP on rows older than the retention window. Parameterized day
    // count via make_interval keeps this a bounded, injection-safe UPDATE.
    const result = await sql`
      UPDATE page_views
      SET ip_address = ''
      WHERE visited_at < NOW() - make_interval(days => ${RETENTION_DAYS})
        AND ip_address <> ''
    `;

    const anonymized = (result as unknown as { count: number }).count ?? 0;
    console.log(`Page view retention: anonymized ${anonymized} old IP(s)`);

    return NextResponse.json({
      ok: true,
      anonymized,
      retentionDays: RETENTION_DAYS,
    });
  } catch (error) {
    console.error("Page view retention cleanup error:", error);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
