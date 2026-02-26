/**
 * POST /api/analytics/track-search
 * -----------------------------------------------
 * Receives blog search query data from the client.
 * Fired after the user has stopped typing for 1 second.
 *
 * Security:
 *   - No auth required (public endpoint for tracking beacons)
 *   - IP+query deduplication (1 record per IP per query per hour)
 *   - Rate limited to 20 requests per IP per minute
 *   - Input validation via Zod
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/analytics";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  query: z.string().min(1).max(200),
  path: z.string().min(1).max(500),
});

// Rate limiter: 20 requests per IP per minute
const searchRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 20,
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
    const rateLimit = await searchRateLimiter.checkRateLimit(clientIp);
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

    const { query, path } = parsed.data;

    if (!path.startsWith("/")) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Extract IP the same way as other endpoints
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : realIp || "127.0.0.1";

    const sql = getDb();

    // Dedup: 1 record per query per IP per hour
    const existing = await sql`
      SELECT 1 FROM search_queries
      WHERE ip_address = ${ipAddress}
        AND query = ${query}
        AND recorded_at > NOW() - INTERVAL '1 hour'
      LIMIT 1
    `;

    if (existing.length === 0) {
      await sql`
        INSERT INTO search_queries (query, page_path, ip_address)
        VALUES (${query}, ${path}, ${ipAddress})
      `;
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Search tracking error:", error);
    return NextResponse.json(
      { error: "Failed to record search query" },
      { status: 500 },
    );
  }
}
