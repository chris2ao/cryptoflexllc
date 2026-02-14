/**
 * POST /api/analytics/vitals
 * -----------------------------------------------
 * Receives Web Vitals metrics (LCP, INP, CLS, FCP, TTFB) from the
 * client-side WebVitalsReporter component and stores them in Postgres.
 *
 * No auth required (public endpoint like /track). Metrics are validated
 * and deduplicated by metric name + page (1 per hour per metric per page).
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/analytics";

const VALID_METRICS = new Set(["LCP", "INP", "CLS", "FCP", "TTFB"]);

// Zod schema for input validation
const vitalsSchema = z.object({
  name: z.string().min(1).max(50),
  value: z.number().nonnegative().finite(),
  rating: z.enum(["good", "needs-improvement", "poor"]),
  path: z.string().min(1).max(500),
  navigationType: z.string().max(30).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Content-Type validation
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const parsed = vitalsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, value, rating, path, navigationType } = parsed.data;

    // Additional validation for metric name (must be one of the allowed values)
    if (!VALID_METRICS.has(name)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Additional validation for path (must start with /)
    if (!path.startsWith("/")) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const safeNavType = navigationType || "navigate";

    const sql = getDb();

    // Metric+page deduplication: 1 per metric name per page per hour
    const existing = await sql`
      SELECT 1 FROM web_vitals
      WHERE metric_name = ${name}
        AND page_path = ${path}
        AND recorded_at > NOW() - INTERVAL '1 hour'
      LIMIT 1
    `;

    if (existing.length > 0) {
      // Already recorded this metric recently - silently succeed
      return new NextResponse(null, { status: 204 });
    }

    await sql`
      INSERT INTO web_vitals (metric_name, metric_value, rating, page_path, navigation_type)
      VALUES (${name}, ${value}, ${rating}, ${path}, ${safeNavType})
    `;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Vitals tracking error:", error);
    return NextResponse.json(
      { error: "Failed to record vitals" },
      { status: 500 }
    );
  }
}
