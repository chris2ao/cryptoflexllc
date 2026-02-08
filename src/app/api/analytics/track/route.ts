/**
 * POST /api/analytics/track
 * -----------------------------------------------
 * Receives page-view events from the client-side tracker component
 * and stores them in Neon Postgres with full visitor metadata.
 *
 * TECHNICAL NOTES (for blog post):
 * --------------------------------
 * HOW IP DETECTION WORKS ON VERCEL:
 *   When a request hits Vercel's edge network, Vercel injects
 *   several headers before forwarding to your serverless function:
 *
 *   - x-forwarded-for:       Client IP (may be comma-separated if
 *                             there are proxies in the chain; the
 *                             first IP is the original client)
 *   - x-real-ip:             Single client IP (Vercel-specific)
 *   - x-vercel-ip-country:   ISO 3166-1 alpha-2 country code (e.g. "US")
 *   - x-vercel-ip-country-region: Region/state code (e.g. "FL")
 *   - x-vercel-ip-city:      City name (URL-encoded, e.g. "San%20Francisco")
 *   - x-vercel-ip-latitude:  Latitude as a string
 *   - x-vercel-ip-longitude: Longitude as a string
 *
 *   These headers are ONLY present when deployed to Vercel.
 *   In local development, they won't exist (you'll see "127.0.0.1"
 *   and "Unknown" for geo fields).
 *
 * HOW THE TRACKING BEACON WORKS:
 *   The client sends a POST with JSON body: { path: "/blog/..." }
 *   We extract everything else from headers — the client doesn't
 *   need to (and shouldn't) send sensitive data like IP.
 *
 * RATE LIMITING:
 *   We don't implement rate limiting here to keep things simple,
 *   but in production you might add:
 *   - Vercel's built-in rate limiting (vercel.json)
 *   - IP-based deduplication (e.g. one record per IP per page per hour)
 *   - A WAF rule to block automated traffic
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

    // ---- 2. Extract IP address ----
    // x-forwarded-for may contain multiple IPs: "client, proxy1, proxy2"
    // The first one is the original client IP.
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : realIp || "127.0.0.1";

    // ---- 3. Extract User-Agent and parse it ----
    const userAgent = request.headers.get("user-agent") || "";
    const browser = parseBrowser(userAgent);
    const os = parseOS(userAgent);
    const deviceType = parseDeviceType(userAgent);

    // ---- 4. Extract referrer ----
    const referrer = request.headers.get("referer") || "(direct)";

    // ---- 5. Extract Vercel geolocation headers ----
    // These are URL-encoded, so we decode them.
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

    // ---- 6. Insert into database ----
    const sql = getDb();
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

    // Return 204 No Content — the client doesn't need a response body
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    // Log the error server-side but don't expose details to the client
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { error: "Failed to record visit" },
      { status: 500 }
    );
  }
}
