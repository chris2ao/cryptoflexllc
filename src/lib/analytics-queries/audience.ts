import { getDb } from "@/lib/analytics";
import type {
  CountryRow,
  MapLocation,
  NewVsReturningRow,
} from "@/lib/analytics-types";

export interface AudienceData {
  mapLocations: MapLocation[];
  topCountries: CountryRow[];
  newVsReturning: NewVsReturningRow[];
}

export async function loadAudience(days: number): Promise<AudienceData> {
  const sql = getDb();

  const [mapLocations, topCountries, newVsReturning] = await Promise.all([
    sql`
      SELECT
        latitude, longitude,
        COUNT(*)::int AS views,
        MAX(city) AS city, MAX(country) AS country
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        AND latitude IS NOT NULL AND latitude != ''
        AND longitude IS NOT NULL AND longitude != ''
      GROUP BY latitude, longitude
      ORDER BY views DESC LIMIT 200
    `,
    sql`
      SELECT country, COUNT(*)::int AS views, COUNT(DISTINCT ip_address)::int AS unique_visitors
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
      GROUP BY country ORDER BY views DESC LIMIT 20
    `,
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
    mapLocations: mapLocations as unknown as MapLocation[],
    topCountries: topCountries as unknown as CountryRow[],
    newVsReturning: newVsReturning as unknown as NewVsReturningRow[],
  };
}
