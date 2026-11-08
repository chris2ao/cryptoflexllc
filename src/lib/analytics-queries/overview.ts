import { getDb } from "@/lib/analytics";
import { getAllPosts } from "@/lib/blog";
import type {
  DailyViews,
  HourlyHeatmapRow,
  NewVsReturningRow,
} from "@/lib/analytics-types";
import { scopeClass, type TrafficScope } from "./shared";

type OverviewSummaryRow = {
  total_views: number;
  unique_visitors: number;
  first_visit: string | null;
  last_visit: string | null;
};

export type KpiWindow = { current: number; previous: number };

export type TrendPoint = {
  date: string;
  humans: number;
  bots: number;
  new: number;
  returning: number;
};

export interface OverviewData {
  newVsReturning: NewVsReturningRow[];
  dailyViews: DailyViews[];
  hourlyHeatmap: HourlyHeatmapRow[];
  summary: OverviewSummaryRow[];
  kpis: {
    views: KpiWindow;
    readers: KpiWindow;
    readThrough: KpiWindow;
    readerMinutes: KpiWindow;
    pending: number;
  };
  trend: TrendPoint[];
  publishDates: string[];
}

type Row = Record<string, unknown>;

function num(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function windowOf(rows: unknown, cur = "current", prev = "previous"): KpiWindow {
  const row = ((rows as Row[])?.[0] ?? {}) as Row;
  return { current: num(row[cur]), previous: num(row[prev]) };
}

function pct(done: number, views: number): number {
  return views > 0 ? Math.round((done / views) * 1000) / 10 : 0;
}

function publishDatesIn(days: number): string[] {
  const cutoff = Date.now() - days * 86_400_000;
  const now = Date.now();
  return getAllPosts()
    .filter((p) => {
      const t = new Date(p.date).getTime();
      return Number.isFinite(t) && t >= cutoff && t <= now;
    })
    .map((p) => new Date(p.date).toISOString().slice(0, 10))
    .sort();
}

export async function loadOverview(
  days: number,
  scope: TrafficScope = "humans"
): Promise<OverviewData> {
  const sql = getDb();
  const sc = scopeClass(scope);

  const [
    summary,
    dailyViews,
    hourlyHeatmap,
    newVsReturning,
    viewsWin,
    readersWin,
    readThroughWin,
    minutesWin,
    pendingRows,
    classTrend,
  ] = await Promise.all([
    sql`
      SELECT
        COUNT(*)::int AS total_views,
        COUNT(DISTINCT ip_address)::int AS unique_visitors,
        MIN(visited_at) AS first_visit,
        MAX(visited_at) AS last_visit
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        AND (${sc}::text IS NULL OR traffic_class = ${sc})
    `.catch(() => []),
    sql`
      SELECT
        DATE(visited_at)::text AS date,
        COUNT(*)::int AS views,
        COUNT(DISTINCT ip_address)::int AS unique_visitors
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        AND (${sc}::text IS NULL OR traffic_class = ${sc})
      GROUP BY DATE(visited_at)
      ORDER BY date
    `.catch(() => []),
    sql`
      SELECT
        EXTRACT(DOW FROM visited_at)::int AS day_of_week,
        EXTRACT(HOUR FROM visited_at)::int AS hour,
        COUNT(*)::int AS views
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        AND (${sc}::text IS NULL OR traffic_class = ${sc})
      GROUP BY day_of_week, hour
    `.catch(() => []),
    sql`
      WITH daily_visitors AS (
        SELECT
          DATE(visited_at) AS visit_date,
          ip_address,
          MIN(visited_at) OVER (PARTITION BY ip_address) AS first_ever
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
          AND (${sc}::text IS NULL OR traffic_class = ${sc})
      )
      SELECT
        visit_date::text AS date,
        COUNT(DISTINCT CASE WHEN DATE(first_ever) = visit_date THEN ip_address END)::int AS new_visitors,
        COUNT(DISTINCT CASE WHEN DATE(first_ever) < visit_date THEN ip_address END)::int AS returning_visitors
      FROM daily_visitors
      GROUP BY visit_date
      ORDER BY visit_date
    `.catch(() => []),
    // Views: current and previous window in one pass.
    sql`
      SELECT
        COUNT(*) FILTER (WHERE visited_at > NOW() - INTERVAL '1 day' * ${days})::int AS current,
        COUNT(*) FILTER (WHERE visited_at <= NOW() - INTERVAL '1 day' * ${days})::int AS previous
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '1 day' * (2 * ${days})
        AND (${sc}::text IS NULL OR traffic_class = ${sc})
    `.catch(() => []),
    // Readers: engagement ips that also have a scoped view in the same window.
    sql`
      WITH eng AS (
        SELECT ip_address, recorded_at FROM scroll_events
        WHERE recorded_at > NOW() - INTERVAL '1 day' * (2 * ${days})
        UNION ALL
        SELECT ip_address, recorded_at FROM page_engagement
        WHERE recorded_at > NOW() - INTERVAL '1 day' * (2 * ${days})
      ),
      pv AS (
        SELECT DISTINCT ip_address,
          (visited_at > NOW() - INTERVAL '1 day' * ${days}) AS is_current
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * (2 * ${days})
          AND (${sc}::text IS NULL OR traffic_class = ${sc})
      )
      SELECT
        COUNT(DISTINCT eng.ip_address) FILTER (
          WHERE pv.is_current AND eng.recorded_at > NOW() - INTERVAL '1 day' * ${days}
        )::int AS current,
        COUNT(DISTINCT eng.ip_address) FILTER (
          WHERE NOT pv.is_current AND eng.recorded_at <= NOW() - INTERVAL '1 day' * ${days}
        )::int AS previous
      FROM eng JOIN pv ON pv.ip_address = eng.ip_address
    `.catch(() => []),
    // Read-through: completed blog scrolls over scoped blog views.
    sql`
      SELECT
        (SELECT COUNT(*) FROM scroll_events
          WHERE depth = 100 AND page_path LIKE '/blog/%'
            AND recorded_at > NOW() - INTERVAL '1 day' * ${days})::int AS done_current,
        (SELECT COUNT(*) FROM scroll_events
          WHERE depth = 100 AND page_path LIKE '/blog/%'
            AND recorded_at > NOW() - INTERVAL '1 day' * (2 * ${days})
            AND recorded_at <= NOW() - INTERVAL '1 day' * ${days})::int AS done_previous,
        (SELECT COUNT(*) FROM page_views
          WHERE page_path LIKE '/blog/%'
            AND visited_at > NOW() - INTERVAL '1 day' * ${days}
            AND (${sc}::text IS NULL OR traffic_class = ${sc}))::int AS views_current,
        (SELECT COUNT(*) FROM page_views
          WHERE page_path LIKE '/blog/%'
            AND visited_at > NOW() - INTERVAL '1 day' * (2 * ${days})
            AND visited_at <= NOW() - INTERVAL '1 day' * ${days}
            AND (${sc}::text IS NULL OR traffic_class = ${sc}))::int AS views_previous
    `.catch(() => []),
    // Reader minutes: dwell time from ips with a scoped view in the window.
    sql`
      SELECT
        (SELECT COALESCE(SUM(pe.time_seconds), 0) FROM page_engagement pe
          WHERE pe.recorded_at > NOW() - INTERVAL '1 day' * ${days}
            AND EXISTS (
              SELECT 1 FROM page_views pv
              WHERE pv.ip_address = pe.ip_address
                AND pv.visited_at > NOW() - INTERVAL '1 day' * ${days}
                AND (${sc}::text IS NULL OR pv.traffic_class = ${sc})
            ))::float / 60 AS current,
        (SELECT COALESCE(SUM(pe.time_seconds), 0) FROM page_engagement pe
          WHERE pe.recorded_at > NOW() - INTERVAL '1 day' * (2 * ${days})
            AND pe.recorded_at <= NOW() - INTERVAL '1 day' * ${days}
            AND EXISTS (
              SELECT 1 FROM page_views pv
              WHERE pv.ip_address = pe.ip_address
                AND pv.visited_at > NOW() - INTERVAL '1 day' * (2 * ${days})
                AND pv.visited_at <= NOW() - INTERVAL '1 day' * ${days}
                AND (${sc}::text IS NULL OR pv.traffic_class = ${sc})
            ))::float / 60 AS previous
    `.catch(() => []),
    sql`
      SELECT COUNT(*)::int AS pending
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        AND traffic_class IS NULL
    `.catch(() => []),
    // Humans and bots per day, regardless of scope.
    sql`
      SELECT
        DATE(visited_at)::text AS date,
        COUNT(*) FILTER (WHERE traffic_class = 'human')::int AS humans,
        COUNT(*) FILTER (WHERE traffic_class = 'bot')::int AS bots
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
      GROUP BY DATE(visited_at)
      ORDER BY date
    `.catch(() => []),
  ]);

  const nvr = newVsReturning as unknown as NewVsReturningRow[];
  const rt = ((readThroughWin as Row[])?.[0] ?? {}) as Row;
  const minutes = windowOf(minutesWin);

  const trend: TrendPoint[] = (classTrend as Row[]).map((r) => {
    const date = String(r.date);
    const match = nvr.find((n) => n.date === date);
    return {
      date,
      humans: num(r.humans),
      bots: num(r.bots),
      new: match?.new_visitors ?? 0,
      returning: match?.returning_visitors ?? 0,
    };
  });

  return {
    newVsReturning: nvr,
    dailyViews: dailyViews as unknown as DailyViews[],
    hourlyHeatmap: hourlyHeatmap as unknown as HourlyHeatmapRow[],
    summary: summary as unknown as OverviewSummaryRow[],
    kpis: {
      views: windowOf(viewsWin),
      readers: windowOf(readersWin),
      readThrough: {
        current: pct(num(rt.done_current), num(rt.views_current)),
        previous: pct(num(rt.done_previous), num(rt.views_previous)),
      },
      readerMinutes: {
        current: Math.round(minutes.current),
        previous: Math.round(minutes.previous),
      },
      pending: num(((pendingRows as Row[])?.[0] ?? {}).pending),
    },
    trend,
    publishDates: publishDatesIn(days),
  };
}
