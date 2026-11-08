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
 *
 * Referrer: the client sends document.referrer in the body. The Referer
 * header is never read (it is always our own page for a beacon). The route
 * classifies the referrer and the hit at insert time (referrer_host,
 * referrer_class, traffic_class; NULL traffic_class means pending). Paths
 * under the untracked prefixes (dashboard, backlog) are dropped with 204.
 */

import { recordServerEvent } from "@/lib/server-events";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getDb,
  parseBrowser,
  parseOS,
  parseDeviceType,
} from "@/lib/analytics";
import { recordApiMetric } from "@/lib/api-timing";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import { ensureAnalyticsSchema } from "@/lib/analytics-schema";
import { isTrackedPath } from "@/lib/analytics-tracking-rules";
import { isSitePath } from "@/lib/site-path";
import { classifyReferrer, referrerForStorage } from "@/lib/traffic/referrer";
import { classifyAtInsert } from "@/lib/traffic/classify";

// Zod schema for input validation
const trackSchema = z.object({
  path: z.string().min(1).max(500).optional().default("/"),
  referrer: z.string().max(2000).optional().default(""),
});

// In-memory on purpose: no database query per beacon. Per instance, so the
// limit is approximate on serverless, which is enough to blunt a flood.
const trackLimiter = createRateLimiter({
  name: "track",
  windowMs: 60_000,
  maxRequests: 60,
  backend: "memory",
});

const LEGACY_WARN_INTERVAL_MS = 5 * 60 * 1000;
let lastLegacyWarnAt = 0;

function warnLegacyFallback(): void {
  const now = Date.now();
  if (lastLegacyWarnAt && now - lastLegacyWarnAt < LEGACY_WARN_INTERVAL_MS) return;
  lastLegacyWarnAt = now;
  console.warn("Analytics schema not ready, recording the beacon with legacy columns");
}

export async function POST(request: NextRequest) {
  const t0 = Date.now();
  try {
    // ---- 1. Content-Type validation ----
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415 }
      );
    }

    // ---- 1b. Resolve the trusted client IP (F-H3). ----
    const ipAddress = getClientIp(request) || "127.0.0.1";
    const limit = await trackLimiter.checkRateLimit(ipAddress);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfter ?? 60) },
        },
      );
    }

    // ---- 2. Parse and validate the request body ----
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const parsed = trackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const rawPath = parsed.data.path;

    // ---- 3. Additional path validation ----
    if (!rawPath.startsWith("/") || !isSitePath(rawPath.split("?")[0])) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // ---- 3b. Parse UTM parameters and strip them from the stored path ----
    // The client may send pathname + search (e.g. /blog/foo?utm_source=newsletter).
    // We parse UTMs here and store the clean path without query params.
    let pagePath = rawPath;
    let utmSource: string | null = null;
    let utmMedium: string | null = null;
    let utmCampaign: string | null = null;

    const qIndex = rawPath.indexOf("?");
    if (qIndex !== -1) {
      pagePath = rawPath.slice(0, qIndex);
      const searchParams = new URLSearchParams(rawPath.slice(qIndex + 1));
      utmSource = searchParams.get("utm_source");
      utmMedium = searchParams.get("utm_medium");
      utmCampaign = searchParams.get("utm_campaign");
    }

    // ---- 4. Untracked paths are never recorded ----
    if (!isTrackedPath(pagePath)) {
      return new NextResponse(null, { status: 204 });
    }

    // ---- 5. Extract User-Agent and parse it ----
    // (ipAddress was resolved above via getClientIp for the rate-limit check.)
    const userAgent = request.headers.get("user-agent") || "";
    const browser = parseBrowser(userAgent);
    const os = parseOS(userAgent);
    const deviceType = parseDeviceType(userAgent);

    // ---- 6. Classify the client-supplied referrer and the hit ----
    // Classification sees the full client value; storage keeps origin and path only.
    const referrer = referrerForStorage(parsed.data.referrer);
    const ref = classifyReferrer(parsed.data.referrer, {
      source: utmSource,
      medium: utmMedium,
    });
    const trafficClass = classifyAtInsert({
      userAgent,
      referrerClass: ref.cls,
      pagePath,
    });

    // ---- 7. Extract Vercel geolocation headers ----
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

    // ---- 8. Rate limiting: IP+path dedup (1 per hour) ----
    const sql = getDb();
    const schemaReady = await ensureAnalyticsSchema(sql);
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

    // ---- 9. Insert into database ----
    if (schemaReady) {
      await sql`
        INSERT INTO page_views (
          page_path, ip_address, user_agent, browser, os,
          device_type, referrer, country, city, region,
          latitude, longitude, utm_source, utm_medium, utm_campaign,
          referrer_host, referrer_class, traffic_class
        ) VALUES (
          ${pagePath}, ${ipAddress}, ${userAgent}, ${browser}, ${os},
          ${deviceType}, ${referrer}, ${country}, ${city}, ${region},
          ${latitude}, ${longitude}, ${utmSource}, ${utmMedium}, ${utmCampaign},
          ${ref.host}, ${ref.cls}, ${trafficClass}
        )
      `;
    } else {
      warnLegacyFallback();
      // Schema not confirmed: record the beacon with the legacy columns only.
      // The nightly backfill derives referrer_host, referrer_class and
      // traffic_class later.
      await sql`
        INSERT INTO page_views (
          page_path, ip_address, user_agent, browser, os,
          device_type, referrer, country, city, region,
          latitude, longitude, utm_source, utm_medium, utm_campaign
        ) VALUES (
          ${pagePath}, ${ipAddress}, ${userAgent}, ${browser}, ${os},
          ${deviceType}, ${referrer}, ${country}, ${city}, ${region},
          ${latitude}, ${longitude}, ${utmSource}, ${utmMedium}, ${utmCampaign}
        )
      `;
    }

    recordApiMetric("/api/analytics/track", "POST", 204, Date.now() - t0);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    recordServerEvent("/api/analytics/track", "db-error", error instanceof Error ? error.message : "unknown");
    recordApiMetric("/api/analytics/track", "POST", 500, Date.now() - t0);
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { error: "Failed to record visit" },
      { status: 500 }
    );
  }
}
