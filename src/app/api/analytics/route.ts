/**
 * GET /api/analytics
 * -----------------------------------------------
 * Returns analytics data for the dashboard. Protected by
 * httpOnly cookie or Authorization header.
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/analytics";
import { verifyApiAuth } from "@/lib/analytics-auth";
import { recordApiMetric } from "@/lib/api-timing";

export async function GET(request: NextRequest) {
  const t0 = Date.now();
  // ---- Auth check (cookie or Authorization header) ----
  if (!verifyApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDb();

    // Validate and clamp days parameter (1-365)
    const daysParam = request.nextUrl.searchParams.get("days");
    const parsedDays = daysParam ? parseInt(daysParam, 10) : 30;
    const days = Math.max(1, Math.min(365, isNaN(parsedDays) ? 30 : parsedDays));

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

    recordApiMetric("/api/analytics", "GET", 200, Date.now() - t0);
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
    }, {
      headers: {
        "Cache-Control": "private, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    recordApiMetric("/api/analytics", "GET", 500, Date.now() - t0);
    console.error("Analytics query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
