import { getDb } from "@/lib/analytics";
import type {
  BrowserRow,
  DeviceRow,
  OsRow,
} from "@/lib/analytics-types";

export interface TechnologyData {
  browsers: BrowserRow[];
  devices: DeviceRow[];
  osStats: OsRow[];
}

export async function loadTechnology(days: number): Promise<TechnologyData> {
  const sql = getDb();

  const [browsers, devices, osStats] = await Promise.all([
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
  ]);

  return {
    browsers: browsers as unknown as BrowserRow[],
    devices: devices as unknown as DeviceRow[],
    osStats: osStats as unknown as OsRow[],
  };
}
