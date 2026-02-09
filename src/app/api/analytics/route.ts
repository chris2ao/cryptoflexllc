/**
 * GET /api/analytics
 * -----------------------------------------------
 * Returns analytics data for the dashboard. Protected by
 * ANALYTICS_SECRET to prevent public access to visitor data.
 *
 * TECHNICAL NOTES (for blog post):
 * --------------------------------
 * QUERY DESIGN:
 *   We run multiple queries in parallel using Promise.all() to
 *   build the dashboard data. Each query is focused on one metric:
 *
 *   1. summary     — Total views, unique IPs, date range
 *   2. top_pages   — Most visited pages
 *   3. top_countries — Geographic breakdown
 *   4. browsers    — Browser usage stats
 *   5. devices     — Device type breakdown (Desktop/Mobile/Tablet)
 *   6. os_stats    — Operating system breakdown
 *   7. recent      — Last 50 individual visits (for the raw log view)
 *
 * WHY PARALLEL QUERIES?
 *   Each query is independent, so running them in parallel with
 *   Promise.all() is faster than running them sequentially.
 *   Neon's HTTP-based driver handles each query as a separate
 *   HTTP request, so there's no connection-sharing conflict.
 *
 * FILTERING:
 *   Supports optional ?days=N query parameter to filter visits
 *   to the last N days (default: 30).
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  // ---- Auth check ----
  const secret = request.nextUrl.searchParams.get("secret");
  const expectedSecret = process.env.ANALYTICS_SECRET;

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json(
      { error: "Unauthorized. Pass ?secret=YOUR_ANALYTICS_SECRET" },
      { status: 401 }
    );
  }

  try {
    const sql = getDb();

    // Optional time filter: ?days=7, ?days=30, etc.
    const daysParam = request.nextUrl.searchParams.get("days");
    const days = daysParam ? parseInt(daysParam, 10) : 30;

    // Run all analytics queries in parallel
    const [summary, topPages, topCountries, browsers, devices, osStats, recent, dailyViews, mapLocations] =
      await Promise.all([
        // 1. Summary stats
        sql`
          SELECT
            COUNT(*)::int                                   AS total_views,
            COUNT(DISTINCT ip_address)::int                 AS unique_visitors,
            MIN(visited_at)                                 AS first_visit,
            MAX(visited_at)                                 AS last_visit
          FROM page_views
          WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
        `,

        // 2. Top pages
        sql`
          SELECT page_path, COUNT(*)::int AS views, COUNT(DISTINCT ip_address)::int AS unique_views
          FROM page_views
          WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
          GROUP BY page_path
          ORDER BY views DESC
          LIMIT 20
        `,

        // 3. Top countries
        sql`
          SELECT country, COUNT(*)::int AS views, COUNT(DISTINCT ip_address)::int AS unique_visitors
          FROM page_views
          WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
          GROUP BY country
          ORDER BY views DESC
          LIMIT 20
        `,

        // 4. Browser breakdown
        sql`
          SELECT browser, COUNT(*)::int AS count
          FROM page_views
          WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
          GROUP BY browser
          ORDER BY count DESC
          LIMIT 15
        `,

        // 5. Device type breakdown
        sql`
          SELECT device_type, COUNT(*)::int AS count
          FROM page_views
          WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
          GROUP BY device_type
          ORDER BY count DESC
        `,

        // 6. OS breakdown
        sql`
          SELECT os, COUNT(*)::int AS count
          FROM page_views
          WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
          GROUP BY os
          ORDER BY count DESC
          LIMIT 15
        `,

        // 7. Recent visits (raw log)
        sql`
          SELECT id, visited_at, page_path, ip_address, browser, os,
                 device_type, referrer, country, city, region
          FROM page_views
          ORDER BY visited_at DESC
          LIMIT 50
        `,

        // 8. Daily views (for area chart)
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

        // 9. Map locations (for Leaflet map)
        sql`
          SELECT
            latitude,
            longitude,
            COUNT(*)::int AS views,
            MAX(city) AS city,
            MAX(country) AS country
          FROM page_views
          WHERE visited_at > NOW() - INTERVAL '1 day' * ${days}
            AND latitude IS NOT NULL
            AND latitude != ''
            AND longitude IS NOT NULL
            AND longitude != ''
          GROUP BY latitude, longitude
          ORDER BY views DESC
          LIMIT 200
        `,
      ]);

    return NextResponse.json({
      days,
      summary: summary[0],
      top_pages: topPages,
      top_countries: topCountries,
      browsers,
      devices,
      os_stats: osStats,
      recent,
      daily_views: dailyViews,
      map_locations: mapLocations,
    });
  } catch (error) {
    console.error("Analytics query error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch analytics",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
