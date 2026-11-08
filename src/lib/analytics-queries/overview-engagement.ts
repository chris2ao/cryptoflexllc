import type { SqlTag } from "@/lib/analytics-schema";

export type DailyEngagementRow = {
  date: string;
  readers: number;
  read_through_pct: number;
  reader_minutes: number;
};

function num(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Per-day readers, read-through and minutes, scoped like the KPI windows.
 * Days come from scoped page views, so a day with views but no engagement
 * rows reads 0 for all three. Readers match the KPI (scroll_events plus
 * page_engagement); minutes use page_engagement only.
 */
export async function loadDailyEngagement(
  sql: SqlTag,
  days: number,
  sc: string | null
): Promise<DailyEngagementRow[]> {
  const rows = (await sql`
    WITH days AS (
      SELECT DISTINCT DATE(visited_at) AS d
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        AND (${sc}::text IS NULL OR traffic_class = ${sc})
    ),
    reads AS (
      SELECT DATE(u.recorded_at) AS d, COUNT(DISTINCT u.ip_address) AS readers
      FROM (
        SELECT ip_address, recorded_at FROM scroll_events
        WHERE recorded_at > NOW() - INTERVAL '1 day' * ${days}
        UNION ALL
        SELECT ip_address, recorded_at FROM page_engagement
        WHERE recorded_at > NOW() - INTERVAL '1 day' * ${days}
      ) u
      WHERE EXISTS (
        SELECT 1 FROM page_views pv
        WHERE pv.ip_address = u.ip_address
          AND pv.visited_at > NOW() - INTERVAL '1 day' * ${days}
          AND (${sc}::text IS NULL OR pv.traffic_class = ${sc})
      )
      GROUP BY DATE(u.recorded_at)
    ),
    mins AS (
      SELECT DATE(pe.recorded_at) AS d, SUM(pe.time_seconds) AS seconds
      FROM page_engagement pe
      WHERE pe.recorded_at > NOW() - INTERVAL '1 day' * ${days}
        AND EXISTS (
          SELECT 1 FROM page_views pv
          WHERE pv.ip_address = pe.ip_address
            AND pv.visited_at > NOW() - INTERVAL '1 day' * ${days}
            AND (${sc}::text IS NULL OR pv.traffic_class = ${sc})
        )
      GROUP BY DATE(pe.recorded_at)
    ),
    done AS (
      SELECT DATE(se.recorded_at) AS d,
        COUNT(DISTINCT se.ip_address || ' ' || se.page_path) AS done
      FROM scroll_events se
      WHERE se.depth = 100 AND se.page_path LIKE '/blog/%'
        AND se.recorded_at > NOW() - INTERVAL '1 day' * ${days}
        AND (${sc}::text IS NULL OR EXISTS (
          SELECT 1 FROM page_views pv
          WHERE pv.ip_address = se.ip_address AND pv.traffic_class = ${sc}
            AND pv.visited_at > NOW() - INTERVAL '1 day' * ${days}))
      GROUP BY DATE(se.recorded_at)
    ),
    blog AS (
      SELECT DATE(visited_at) AS d, COUNT(*) AS views
      FROM page_views
      WHERE page_path LIKE '/blog/%'
        AND visited_at > NOW() - INTERVAL '1 day' * ${days}
        AND (${sc}::text IS NULL OR traffic_class = ${sc})
      GROUP BY DATE(visited_at)
    )
    SELECT
      days.d::text AS date,
      COALESCE(reads.readers, 0)::int AS readers,
      (CASE WHEN COALESCE(blog.views, 0) = 0 THEN 0
          ELSE LEAST(100, ROUND(100.0 * COALESCE(done.done, 0) / blog.views, 1)) END)::float AS read_through_pct,
      COALESCE(ROUND(mins.seconds / 60.0), 0)::int AS reader_minutes
    FROM days
    LEFT JOIN reads ON reads.d = days.d
    LEFT JOIN mins ON mins.d = days.d
    LEFT JOIN done ON done.d = days.d
    LEFT JOIN blog ON blog.d = days.d
    ORDER BY days.d
  `.catch(() => [])) as Array<Record<string, unknown>>;
  return rows.map((r) => ({
    date: String(r.date),
    readers: num(r.readers),
    read_through_pct: num(r.read_through_pct),
    reader_minutes: num(r.reader_minutes),
  }));
}
