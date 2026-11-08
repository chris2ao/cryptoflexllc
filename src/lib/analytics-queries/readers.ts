import { getDb } from "@/lib/analytics";
import { scopeClass, type TrafficScope } from "./shared";
import type {
  BrowserRow,
  CountryRow,
  DeviceRow,
  MapLocation,
  NewVsReturningRow,
  OsRow,
} from "@/lib/analytics-types";

export interface ReadersData {
  mapLocations: MapLocation[];
  topCountries: CountryRow[];
  newVsReturning: NewVsReturningRow[];
  browsers: BrowserRow[];
  devices: DeviceRow[];
  osStats: OsRow[];
}

export async function loadReaders(
  days: number,
  scope: TrafficScope = "humans"
): Promise<ReadersData> {
  const sql = getDb();
  const sc = scopeClass(scope);

  const [
    mapLocations,
    topCountries,
    newVsReturning,
    browsers,
    devices,
    osStats,
  ] = await Promise.all([
    sql`
      SELECT
        latitude, longitude,
        COUNT(*)::int AS views,
        MAX(city) AS city, MAX(country) AS country
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        AND (${sc}::text IS NULL OR traffic_class = ${sc})
        AND latitude IS NOT NULL AND latitude != ''
        AND longitude IS NOT NULL AND longitude != ''
      GROUP BY latitude, longitude
      ORDER BY views DESC LIMIT 200
    `.catch(() => []),
    sql`
      SELECT country, COUNT(*)::int AS views, COUNT(DISTINCT ip_address)::int AS unique_visitors
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        AND (${sc}::text IS NULL OR traffic_class = ${sc})
      GROUP BY country ORDER BY views DESC LIMIT 20
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

    sql`
      SELECT browser, COUNT(*)::int AS count
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        AND (${sc}::text IS NULL OR traffic_class = ${sc})
      GROUP BY browser ORDER BY count DESC LIMIT 15
    `.catch(() => []),
    sql`
      SELECT device_type, COUNT(*)::int AS count
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        AND (${sc}::text IS NULL OR traffic_class = ${sc})
      GROUP BY device_type ORDER BY count DESC
    `.catch(() => []),
    sql`
      SELECT os, COUNT(*)::int AS count
      FROM page_views
      WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        AND (${sc}::text IS NULL OR traffic_class = ${sc})
      GROUP BY os ORDER BY count DESC LIMIT 15
    `.catch(() => []),
  ]);

  return {
    mapLocations: mapLocations as unknown as MapLocation[],
    topCountries: topCountries as unknown as CountryRow[],
    newVsReturning: newVsReturning as unknown as NewVsReturningRow[],
    browsers: browsers as unknown as BrowserRow[],
    devices: devices as unknown as DeviceRow[],
    osStats: osStats as unknown as OsRow[],
  };
}
