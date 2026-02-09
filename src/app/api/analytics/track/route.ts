/**
 * POST /api/analytics/track
 * -----------------------------------------------
 * Receives page-view events from the client-side tracker component
 * and stores them in Neon Postgres with full visitor metadata.
 *
 * Security:
 *   - No auth required (public endpoint for tracking beacons)
 *   - IP+path deduplication (1 record per IP per page per hour)
 *   - Page path validation (max 500 chars, must start with /)
 *   - Error messages are generic (no internal details leaked)
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getDb,
  parseBrowser,
  parseOS,
  parseDeviceType,
} from "@/lib/analytics";

export async function POST(request: NextRequest) {
  try {
    // ---- 1. Parse the request body ----
    const body = await request.json();
    const pagePath: string = body.path || "/";

    // ---- 2. Validate page path ----
    if (
      typeof pagePath !== "string" ||
      pagePath.length > 500 ||
      !pagePath.startsWith("/")
    ) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    // ---- 3. Extract IP address ----
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : realIp || "127.0.0.1";

    // ---- 4. Extract User-Agent and parse it ----
    const userAgent = request.headers.get("user-agent") || "";
    const browser = parseBrowser(userAgent);
    const os = parseOS(userAgent);
    const deviceType = parseDeviceType(userAgent);

    // ---- 5. Extract referrer ----
    const referrer = request.headers.get("referer") || "(direct)";

    // ---- 6. Extract Vercel geolocation headers ----
    const country = decodeURIComponent(
      request.headers.get("x-vercel-ip-country") || "Unknown"
    );
    const city = decodeURIComponent(
      request.headers.get("x-vercel-ip-city") || "Unknown"
    );
    const region = decodeURIComponent(
      request.headers.get("x-vercel-ip-country-region") || "Unknown"
    );
    const latitude = request.headers.get("x-vercel-ip-latitude") || "";
    const longitude = request.headers.get("x-vercel-ip-longitude") || "";

    // ---- 7. Rate limiting: IP+path dedup (1 per hour) ----
    const sql = getDb();
    const existing = await sql`
      SELECT 1 FROM page_views
      WHERE ip_address = ${ipAddress}
        AND page_path = ${pagePath}
        AND visited_at > NOW() - INTERVAL '1 hour'
      LIMIT 1
    `;

    if (existing.length > 0) {
      // Already recorded this visit recently - silently succeed
      return new NextResponse(null, { status: 204 });
    }

    // ---- 8. Insert into database ----
    await sql`
      INSERT INTO page_views (
        page_path, ip_address, user_agent, browser, os,
        device_type, referrer, country, city, region,
        latitude, longitude
      ) VALUES (
        ${pagePath}, ${ipAddress}, ${userAgent}, ${browser}, ${os},
        ${deviceType}, ${referrer}, ${country}, ${city}, ${region},
        ${latitude}, ${longitude}
      )
    `;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { error: "Failed to record visit" },
      { status: 500 }
    );
  }
}
