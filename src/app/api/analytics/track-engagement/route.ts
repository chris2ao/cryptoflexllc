/**
 * POST /api/analytics/track-engagement
 * -----------------------------------------------
 * Receives scroll depth and time-on-page data from the client.
 * Fired on page unload via sendBeacon.
 *
 * Security:
 *   - No auth required (public endpoint for tracking beacons)
 *   - IP+path deduplication (1 record per IP per page per hour)
 *   - Input validation via Zod
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/analytics";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  path: z.string().min(1).max(500),
  scroll_depth: z
    .number()
    .int()
    .refine((v) => [25, 50, 75, 100].includes(v))
    .optional(),
  time_seconds: z.number().int().min(1).max(3600).optional(),
});

// Rate limiter: 30 requests per IP per minute
const engagementRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30,
});

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415 },
      );
    }

    // Rate limit check
    const clientIp = getClientIp(request);
    const rateLimit = await engagementRateLimiter.checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return new NextResponse(null, {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfter || 60) },
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { path, scroll_depth, time_seconds } = parsed.data;

    if (!path.startsWith("/")) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Extract IP
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : realIp || "127.0.0.1";

    const sql = getDb();

    // Record scroll depth (dedup: 1 per depth level per IP per page per hour)
    if (scroll_depth) {
      const existingScroll = await sql`
        SELECT 1 FROM scroll_events
        WHERE ip_address = ${ipAddress}
          AND page_path = ${path}
          AND depth = ${scroll_depth}
          AND recorded_at > NOW() - INTERVAL '1 hour'
        LIMIT 1
      `;

      if (existingScroll.length === 0) {
        await sql`
          INSERT INTO scroll_events (page_path, depth, ip_address)
          VALUES (${path}, ${scroll_depth}, ${ipAddress})
        `;
      }
    }

    // Record time on page (dedup: 1 per IP per page per hour, keep the longest)
    if (time_seconds) {
      const existingTime = await sql`
        SELECT id, time_seconds FROM page_engagement
        WHERE ip_address = ${ipAddress}
          AND page_path = ${path}
          AND recorded_at > NOW() - INTERVAL '1 hour'
        ORDER BY time_seconds DESC
        LIMIT 1
      `;

      if (existingTime.length === 0) {
        await sql`
          INSERT INTO page_engagement (page_path, time_seconds, ip_address)
          VALUES (${path}, ${time_seconds}, ${ipAddress})
        `;
      } else if (time_seconds > existingTime[0].time_seconds) {
        // Update with the longer duration
        await sql`
          UPDATE page_engagement
          SET time_seconds = ${time_seconds}, recorded_at = NOW()
          WHERE id = ${existingTime[0].id}
        `;
      }
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Engagement tracking error:", error);
    return NextResponse.json(
      { error: "Failed to record engagement" },
      { status: 500 },
    );
  }
}
