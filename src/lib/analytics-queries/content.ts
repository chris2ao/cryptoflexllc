import { getDb } from "@/lib/analytics";
import type { ReferrerClass } from "@/lib/traffic/referrer";
import { scopeClass, type TrafficScope } from "./shared";
import type {
  CampaignRow,
  ReferrerRow,
  ScrollDepthRow,
  SearchQueryRow,
  TimeOnPageRow,
  TopPageRow,
} from "@/lib/analytics-types";

export interface ContentData {
  topPages: TopPageRow[];
  referrers: ReferrerRow[];
  scrollDepth: ScrollDepthRow[];
  timeOnPage: TimeOnPageRow[];
  campaignData: CampaignRow[];
  searchQueries: SearchQueryRow[];
}

export async function loadContent(
  days: number,
  scope: TrafficScope = "humans"
): Promise<ContentData> {
  const sql = getDb();
  const sc = scopeClass(scope);

  const [topPages, referrers, scrollDepth, timeOnPage, campaignData, searchQueries] =
    await Promise.all([
      sql`
        SELECT page_path, COUNT(*)::int AS views, COUNT(DISTINCT ip_address)::int AS unique_views
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
          AND (${sc}::text IS NULL OR traffic_class = ${sc})
        GROUP BY page_path ORDER BY views DESC LIMIT 20
      `.catch(() => []),
      sql`
        SELECT
          CASE
            WHEN referrer = '(direct)' OR referrer = '' THEN '(direct)'
            ELSE SPLIT_PART(SPLIT_PART(referrer, '://', 2), '/', 1)
          END AS referrer_domain,
          COUNT(*)::int AS views,
          COUNT(DISTINCT ip_address)::int AS unique_visitors
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
          AND (${sc}::text IS NULL OR traffic_class = ${sc})
        GROUP BY referrer_domain
        ORDER BY views DESC LIMIT 15
      `.catch(() => []),
      sql`
        SELECT
          page_path,
          COUNT(*) FILTER (WHERE depth = 25)::int AS depth_25,
          COUNT(*) FILTER (WHERE depth = 50)::int AS depth_50,
          COUNT(*) FILTER (WHERE depth = 75)::int AS depth_75,
          COUNT(*) FILTER (WHERE depth = 100)::int AS depth_100
        FROM scroll_events
        WHERE recorded_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY page_path
        ORDER BY (COUNT(*) FILTER (WHERE depth = 100)) DESC
        LIMIT 10
      `.catch(() => []),
      sql`
        SELECT
          page_path,
          ROUND(AVG(time_seconds))::int AS avg_seconds,
          COUNT(*)::int AS sample_count
        FROM page_engagement
        WHERE recorded_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY page_path
        ORDER BY avg_seconds DESC
        LIMIT 10
      `.catch(() => []),
      sql`
        SELECT
          utm_source,
          utm_medium,
          utm_campaign,
          COUNT(*)::int AS visit_count
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
          AND utm_source IS NOT NULL
          AND (${sc}::text IS NULL OR traffic_class = ${sc})
        GROUP BY utm_source, utm_medium, utm_campaign
        ORDER BY visit_count DESC
        LIMIT 20
      `.catch(() => []),
      sql`
        SELECT
          query,
          COUNT(*)::int AS search_count
        FROM search_queries
        WHERE recorded_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY query
        ORDER BY search_count DESC
        LIMIT 20
      `.catch(() => []),
    ]);

  return {
    topPages: topPages as unknown as TopPageRow[],
    referrers: referrers as unknown as ReferrerRow[],
    scrollDepth: scrollDepth as unknown as ScrollDepthRow[],
    timeOnPage: timeOnPage as unknown as TimeOnPageRow[],
    campaignData: campaignData as unknown as CampaignRow[],
    searchQueries: searchQueries as unknown as SearchQueryRow[],
  };
}

export type ReferrerClassRow = {
  cls: ReferrerClass;
  views: number;
  visitors: number;
};

export type ReferrerHostRow = {
  host: string;
  cls: ReferrerClass;
  views: number;
};

export async function loadReferrerClasses(
  days: number,
  scope: TrafficScope
): Promise<{ classes: ReferrerClassRow[]; hosts: ReferrerHostRow[] }> {
  const sql = getDb();
  const sc = scopeClass(scope);

  try {
    const [classes, hosts] = await Promise.all([
      sql`
        SELECT
          referrer_class AS cls,
          COUNT(*)::int AS views,
          COUNT(DISTINCT ip_address)::int AS visitors
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
          AND referrer_class IS NOT NULL
          AND (${sc}::text IS NULL OR traffic_class = ${sc})
        GROUP BY referrer_class
        ORDER BY views DESC
      `,
      sql`
        SELECT
          referrer_host AS host,
          MAX(referrer_class) AS cls,
          COUNT(*)::int AS views
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
          AND referrer_host IS NOT NULL AND referrer_host != ''
          AND (${sc}::text IS NULL OR traffic_class = ${sc})
        GROUP BY referrer_host
        ORDER BY views DESC
        LIMIT 15
      `,
    ]);
    return {
      classes: (classes as Array<Record<string, unknown>>).map((r) => ({
        cls: r.cls as ReferrerClass,
        views: Number(r.views) || 0,
        visitors: Number(r.visitors) || 0,
      })),
      hosts: (hosts as Array<Record<string, unknown>>).map((r) => ({
        host: String(r.host),
        cls: r.cls as ReferrerClass,
        views: Number(r.views) || 0,
      })),
    };
  } catch {
    return { classes: [], hosts: [] };
  }
}
