import { getDb } from "@/lib/analytics";
import { getAllPosts } from "@/lib/blog";
import { scopeClass, type TrafficScope } from "./shared";

export type PostPerformanceRow = {
  page_path: string;
  title: string;
  views: number;
  readers: number;
  read_through_pct: number;
  median_seconds: number;
  subscribes: number;
  comments: number;
};

export async function loadPostPerformance(
  days: number,
  scope: TrafficScope,
  limit = 25
): Promise<PostPerformanceRow[]> {
  const sql = getDb();
  const sc = scopeClass(scope);

  const rows = await sql`
    WITH v AS (
      SELECT page_path, COUNT(*)::int AS views
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        AND page_path LIKE '/blog/%'
        AND page_path NOT LIKE '/blog/series/%'
        AND (${sc}::text IS NULL OR traffic_class = ${sc})
      GROUP BY page_path
      ORDER BY views DESC
      LIMIT ${limit}
    )
    SELECT
      v.page_path,
      v.views,
      (SELECT COUNT(DISTINCT pe.ip_address) FROM page_engagement pe
        WHERE pe.page_path = v.page_path
          AND pe.recorded_at > NOW() - INTERVAL '1 day' * ${days})::int AS readers,
      COALESCE(ROUND(100.0 * (SELECT COUNT(*) FROM scroll_events se
        WHERE se.page_path = v.page_path AND se.depth = 100
          AND se.recorded_at > NOW() - INTERVAL '1 day' * ${days}) / NULLIF(v.views, 0), 1), 0)::float AS read_through_pct,
      COALESCE((SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY pe.time_seconds)
        FROM page_engagement pe
        WHERE pe.page_path = v.page_path
          AND pe.recorded_at > NOW() - INTERVAL '1 day' * ${days}), 0)::float AS median_seconds,
      (SELECT COUNT(*) FROM subscribers s WHERE s.source_page = v.page_path
          AND s.subscribed_at > NOW() - INTERVAL '1 day' * ${days})::int AS subscribes,
      (SELECT COUNT(*) FROM blog_comments c
        WHERE c.slug = SUBSTRING(v.page_path FROM 7)
          AND c.created_at > NOW() - INTERVAL '1 day' * ${days})::int AS comments
    FROM v
    ORDER BY v.views DESC
  `.catch(() => []);

  const titles = new Map(getAllPosts().map((p) => [p.slug, p.title]));
  return (rows as Array<Record<string, unknown>>).map((r) => {
    const path = String(r.page_path);
    return {
      page_path: path,
      title: titles.get(path.replace(/^\/blog\//, "")) ?? path,
      views: Number(r.views) || 0,
      readers: Number(r.readers) || 0,
      read_through_pct: Number(r.read_through_pct) || 0,
      median_seconds: Number(r.median_seconds) || 0,
      subscribes: Number(r.subscribes) || 0,
      comments: Number(r.comments) || 0,
    };
  });
}
