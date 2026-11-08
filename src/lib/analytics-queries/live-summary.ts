import { after } from "next/server";
import { getDb } from "@/lib/analytics";
import { ensureAnalyticsSchema } from "@/lib/analytics-schema";
import { backfillLegacyReferrers, classifyPendingPageViews } from "@/lib/traffic/backfill";

export async function loadLiveSummary(days = 30) {
  const queryStart = Date.now();
  // Best-effort count of distinct visitors in the last 5 minutes for the live pill.
  let activeSessions = 0;
  let pending = 0;
  try {
    const sql = getDb();
    // The dashboard is untracked, so its own load has to make sure the new
    // columns exist before any section queries them.
    await ensureAnalyticsSchema(sql);
    const rows = (await sql`
      SELECT COUNT(DISTINCT ip_address)::int AS active
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '5 minutes'
    `) as Array<{ active: number }>;
    activeSessions = rows[0]?.active ?? 0;
    const countPending = () =>
      sql`
        SELECT COUNT(*)::int AS pending
        FROM page_views
        WHERE visited_at > NOW() - make_interval(days => ${days})
          AND traffic_class IS NULL
      `
        .then((r) => (r as Array<{ pending: number }>)[0]?.pending ?? 0)
        .catch(() => 0);
    pending = await countPending();
    // Rows from before the referrer columns existed; the partial index makes
    // this an instant probe once the backfill is done.
    const legacy = await sql`
      SELECT EXISTS (
        SELECT 1 FROM page_views
        WHERE referrer_host = '' AND referrer_class = 'direct'
          AND referrer <> '' AND referrer <> '(direct)'
      ) AS legacy
    `
      .then((r) => Boolean((r as Array<{ legacy: boolean }>)[0]?.legacy))
      .catch(() => false);
    // The daily cron does the bulk of the classification; an owner load with
    // rows still pending clears a bounded batch after the response is sent,
    // so the dashboard converges within a few loads without paying for the
    // UPDATE in its own time to first byte.
    if (pending > 0 || legacy) {
      after(async () => {
        try {
          await backfillLegacyReferrers(sql, 50);
          await classifyPendingPageViews(sql, 2000);
        } catch (error) {
          console.error("Pending classification kick failed:", error);
        }
      });
    }
  } catch (error) {
    console.error("Live summary error:", error);
    activeSessions = 0;
  }

  const queryTimeMs = Date.now() - queryStart;
  return { activeSessions, pending, generatedAt: new Date(), queryTimeMs };
}
