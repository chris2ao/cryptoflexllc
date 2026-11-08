import { getDb } from "@/lib/analytics";
import { ensureAnalyticsSchema } from "@/lib/analytics-schema";

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
    pending = await sql`
      SELECT COUNT(*)::int AS pending
      FROM page_views
      WHERE visited_at > NOW() - make_interval(days => ${days})
        AND traffic_class IS NULL
    `
      .then((r) => (r as Array<{ pending: number }>)[0]?.pending ?? 0)
      .catch(() => 0);
  } catch {
    activeSessions = 0;
  }

  const queryTimeMs = Date.now() - queryStart;
  return { activeSessions, pending, generatedAt: new Date(), queryTimeMs };
}
