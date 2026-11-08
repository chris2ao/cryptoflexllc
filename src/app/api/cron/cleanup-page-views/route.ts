/**
 * GET /api/cron/cleanup-page-views
 * -----------------------------------------------
 * Triggered by Vercel Cron daily. Anonymizes the stored client IP on page_views
 * older than the retention window, keeping the analytics rows but dropping the
 * PII (F-L11). Uses an UPDATE (not DELETE) so historical analytics survive.
 * Also prunes old operational rows (server events, cron and digest runs, stale IP intel).
 *
 * Required env vars:
 *   CRON_SECRET   - Vercel cron secret for auth
 *   DATABASE_URL  - Neon Postgres connection string
 */

import { NextRequest, NextResponse } from "next/server";

import { timingSafeEqual } from "crypto";
import { getDb } from "@/lib/analytics";
import { withCronRun } from "@/lib/cron-runs";
import { ensureAnalyticsSchema } from "@/lib/analytics-schema";
import { backfillLegacyReferrers, classifyPendingPageViews } from "@/lib/traffic/backfill";
import { pruneOperationalRecords, pruneStaleIntel } from "@/lib/analytics-retention";
import { enrichPendingIps } from "@/lib/ip-enrichment/batch";

// Classification loops plus up to 60 sequential enrichment lookups at 1.4s spacing.
export const maxDuration = 300;

// Retain raw IPs for this many days, then blank them.
const RETENTION_DAYS = 90;
const CLASSIFY_BATCH = 5000;
/** Wall-clock budget for the enrichment and classification stages together. */
const DEADLINE_MS = 240_000;
const CLASSIFY_MAX_ITERATIONS = 20;
const ENRICH_LIMIT = 60;

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
    await ensureAnalyticsSchema(sql);

    const summary = await withCronRun(
      sql,
      "cleanup-page-views",
      async () => {
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

        // Retention for operational tables; each delete is isolated inside.
        let pruned = { serverEvents: 0, cronRuns: 0, digestRuns: 0, intel: 0 };
        try {
          const ops = await pruneOperationalRecords(sql);
          const intel = await pruneStaleIntel(sql);
          pruned = { ...ops, intel };
        } catch (error) {
          console.error("Retention prune stage error:", error);
        }

        // Each stage is isolated: a failure is logged and the next stage still runs.
        // Enrichment goes first so the classifier sees tonight's hosting flags;
        // both stages stop at the deadline so the function never hits maxDuration.
        const deadline = Date.now() + DEADLINE_MS;

        // Rows from before the referrer columns existed get their host and
        // class derived from the raw referrer so the classifier can see
        // forged referrers; a no-op once the history is done.
        let legacyReferrers = 0;
        try {
          legacyReferrers = await backfillLegacyReferrers(sql, 200);
        } catch (error) {
          console.error("Legacy referrer backfill error:", error);
        }

        let enriched = 0;
        try {
          enriched = await enrichPendingIps(sql, ENRICH_LIMIT, { deadline });
        } catch (error) {
          console.error("IP enrichment batch error:", error);
        }

        let classified = 0;
        try {
          for (let i = 0; i < CLASSIFY_MAX_ITERATIONS; i++) {
            if (Date.now() > deadline) break;
            const n = await classifyPendingPageViews(sql, CLASSIFY_BATCH);
            if (!n) break;
            classified += n;
          }
        } catch (error) {
          console.error("Page view classification batch error:", error);
        }

        return { ok: true, anonymized, retentionDays: RETENTION_DAYS, legacyReferrers, classified, enriched, pruned };
      },
      (r) =>
        `anonymized ${r.anonymized}, legacy referrers ${r.legacyReferrers}, classified ${r.classified}, enriched ${r.enriched}, pruned events ${r.pruned.serverEvents}, runs ${r.pruned.cronRuns}, digests ${r.pruned.digestRuns}, intel ${r.pruned.intel}`,
    );
    return NextResponse.json(summary);
  } catch (error) {
    console.error("Page view retention cleanup error:", error);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
