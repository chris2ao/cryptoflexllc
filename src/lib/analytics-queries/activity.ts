import { getDb } from "@/lib/analytics";
import type {
  RecentVisit,
} from "@/lib/analytics-types";

export interface ActivityData {
  recent: RecentVisit[];
  topPages: Record<string, unknown>[];
  topCountries: Record<string, unknown>[];
  browsers: Record<string, unknown>[];
  devices: Record<string, unknown>[];
  osStats: Record<string, unknown>[];
  referrers: Record<string, unknown>[];
}

export async function loadActivity(days: number): Promise<ActivityData> {
  const sql = getDb();

  const [recent, topPages, topCountries, browsers, devices, osStats, referrers] =
    await Promise.all([
      sql`
        SELECT id, visited_at, page_path, ip_address, browser, os,
               device_type, referrer, country, city, region
        FROM page_views ORDER BY visited_at DESC LIMIT 50
      `,
      sql`
        SELECT page_path, COUNT(*)::int AS views, COUNT(DISTINCT ip_address)::int AS unique_views
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY page_path ORDER BY views DESC LIMIT 20
      `,
      sql`
        SELECT country, COUNT(*)::int AS views, COUNT(DISTINCT ip_address)::int AS unique_visitors
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY country ORDER BY views DESC LIMIT 20
      `,
      sql`
        SELECT browser, COUNT(*)::int AS count
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY browser ORDER BY count DESC LIMIT 15
      `,
      sql`
        SELECT device_type, COUNT(*)::int AS count
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY device_type ORDER BY count DESC
      `,
      sql`
        SELECT os, COUNT(*)::int AS count
        FROM page_views
        WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        GROUP BY os ORDER BY count DESC LIMIT 15
      `,
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
        GROUP BY referrer_domain
        ORDER BY views DESC LIMIT 15
      `.catch(() => []),
    ]);

  return {
    recent: recent as unknown as RecentVisit[],
    topPages: topPages as unknown as Record<string, unknown>[],
    topCountries: topCountries as unknown as Record<string, unknown>[],
    browsers: browsers as unknown as Record<string, unknown>[],
    devices: devices as unknown as Record<string, unknown>[],
    osStats: osStats as unknown as Record<string, unknown>[],
    referrers: referrers as unknown as Record<string, unknown>[],
  };
}
