import { getDb } from "@/lib/analytics";
import type {
  DailyViews,
  HourlyHeatmapRow,
  NewVsReturningRow,
} from "@/lib/analytics-types";

type OverviewSummaryRow = {
  total_views: number;
  unique_visitors: number;
  first_visit: string | null;
  last_visit: string | null;
};
type BounceRow = { single_page: number; total_visitors: number };

export interface OverviewData {
  newVsReturning: NewVsReturningRow[];
  dailyViews: DailyViews[];
  hourlyHeatmap: HourlyHeatmapRow[];
  summary: OverviewSummaryRow[];
  bounceData: BounceRow[];
}

export async function loadOverview(days: number): Promise<OverviewData> {
  const sql = getDb();

  const [summary, dailyViews, hourlyHeatmap, bounceData, newVsReturning] =
    await Promise.all([
      sql`
        SELECT
          COUNT(*)::int AS total_views,
          COUNT(DISTINCT ip_address)::int AS unique_visitors,
          MIN(visited_at) AS first_visit,
          MAX(visited_at) AS last_visit
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
      `,
      sql`
        SELECT
          DATE(visited_at)::text AS date,
          COUNT(*)::int AS views,
          COUNT(DISTINCT ip_address)::int AS unique_visitors
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY DATE(visited_at)
        ORDER BY date
      `,
      sql`
        SELECT
          EXTRACT(DOW FROM visited_at)::int AS day_of_week,
          EXTRACT(HOUR FROM visited_at)::int AS hour,
          COUNT(*)::int AS views
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY day_of_week, hour
      `.catch(() => []),
      sql`
        WITH visitor_pages AS (
          SELECT ip_address, COUNT(DISTINCT page_path)::int AS page_count
          FROM page_views
          WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
          GROUP BY ip_address
        )
        SELECT
          COUNT(*) FILTER (WHERE page_count = 1)::int AS single_page,
          COUNT(*)::int AS total_visitors
        FROM visitor_pages
      `.catch(() => [{ single_page: 0, total_visitors: 0 }]),
      sql`
        WITH daily_visitors AS (
          SELECT
            DATE(visited_at) AS visit_date,
            ip_address,
            MIN(visited_at) OVER (PARTITION BY ip_address) AS first_ever
          FROM page_views
          WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        )
        SELECT
          visit_date::text AS date,
          COUNT(DISTINCT CASE WHEN DATE(first_ever) = visit_date THEN ip_address END)::int AS new_visitors,
          COUNT(DISTINCT CASE WHEN DATE(first_ever) < visit_date THEN ip_address END)::int AS returning_visitors
        FROM daily_visitors
        GROUP BY visit_date
        ORDER BY visit_date
      `.catch(() => []),
    ]);

  return {
    newVsReturning: newVsReturning as unknown as NewVsReturningRow[],
    dailyViews: dailyViews as unknown as DailyViews[],
    hourlyHeatmap: hourlyHeatmap as unknown as HourlyHeatmapRow[],
    summary: summary as unknown as OverviewSummaryRow[],
    bounceData: bounceData as unknown as BounceRow[],
  };
}
