import { getDb } from "@/lib/analytics";

export async function loadLiveSummary() {
  const queryStart = Date.now();
  // Best-effort count of distinct visitors in the last 5 minutes for the live pill.
  let activeSessions = 0;
  try {
    const sql = getDb();
    const rows = (await sql`
      SELECT COUNT(DISTINCT ip_address)::int AS active
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '5 minutes'
    `) as Array<{ active: number }>;
    activeSessions = rows[0]?.active ?? 0;
  } catch {
    activeSessions = 0;
  }

  const queryTimeMs = Date.now() - queryStart;
  return { activeSessions, generatedAt: new Date(), queryTimeMs };
}
