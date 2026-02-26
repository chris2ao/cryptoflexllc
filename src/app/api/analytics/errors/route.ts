/**
 * POST /api/analytics/errors
 * -----------------------------------------------
 * Receives client-side JavaScript errors from the browser.
 * Fired by the global error handler component.
 *
 * Security:
 *   - No auth required (public endpoint for error beacons)
 *   - Rate limited: 10 requests per IP per minute
 *   - Deduplication: 1 per error message per IP per hour
 *   - Input validation via Zod
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/analytics";
import { parseBrowser, parseOS } from "@/lib/analytics";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";

// Rate limiter: 10 errors per IP per minute
const errorRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 10,
});

const schema = z.object({
  path: z.string().min(1).max(500),
  message: z.string().min(1).max(2000),
  type: z.string().min(1).max(100).default("Error"),
  stack: z.string().max(5000).optional(),
  source: z.enum(["onerror", "unhandledrejection", "react"]).default("onerror"),
});

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return new NextResponse(null, { status: 415 });
    }

    // Rate limit check
    const clientIp = getClientIp(request);
    const rateLimit = await errorRateLimiter.checkRateLimit(clientIp);
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
      return new NextResponse(null, { status: 400 });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return new NextResponse(null, { status: 400 });
    }

    const { path, message, type, stack, source } = parsed.data;

    if (!path.startsWith("/")) {
      return new NextResponse(null, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || "";
    const browser = parseBrowser(userAgent);
    const os = parseOS(userAgent);

    const sql = getDb();

    // Deduplication: 1 per error message per IP per hour
    const existing = await sql`
      SELECT 1 FROM client_errors
      WHERE ip_address = ${clientIp}
        AND error_message = ${message}
        AND recorded_at > NOW() - INTERVAL '1 hour'
      LIMIT 1
    `;

    if (existing.length > 0) {
      return new NextResponse(null, { status: 204 });
    }

    await sql`
      INSERT INTO client_errors (page_path, error_message, error_type, error_stack, source, ip_address, browser, os)
      VALUES (${path}, ${message}, ${type}, ${stack || null}, ${source}, ${clientIp}, ${browser}, ${os})
    `;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Client error tracking failed:", error);
    return new NextResponse(null, { status: 500 });
  }
}
