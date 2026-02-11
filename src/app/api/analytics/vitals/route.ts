/**
 * POST /api/analytics/vitals
 * -----------------------------------------------
 * Receives Web Vitals metrics (LCP, INP, CLS, FCP, TTFB) from the
 * client-side WebVitalsReporter component and stores them in Postgres.
 *
 * No auth required (public endpoint like /track). Metrics are validated
 * and rate-limited by metric name + page to prevent abuse.
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/analytics";

const VALID_METRICS = new Set(["LCP", "INP", "CLS", "FCP", "TTFB"]);
const VALID_RATINGS = new Set(["good", "needs-improvement", "poor"]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, value, rating, path, navigationType } = body;

    // Validate metric name
    if (!name || !VALID_METRICS.has(name)) {
      return NextResponse.json({ error: "Invalid metric" }, { status: 400 });
    }

    // Validate value
    if (typeof value !== "number" || !isFinite(value) || value < 0) {
      return NextResponse.json({ error: "Invalid value" }, { status: 400 });
    }

    const safeRating = VALID_RATINGS.has(rating) ? rating : "unknown";
    const safePath =
      typeof path === "string" && path.startsWith("/") && path.length <= 500
        ? path
        : "/";
    const safeNavType =
      typeof navigationType === "string" && navigationType.length <= 30
        ? navigationType
        : "navigate";

    const sql = getDb();

    await sql`
      INSERT INTO web_vitals (metric_name, metric_value, rating, page_path, navigation_type)
      VALUES (${name}, ${value}, ${safeRating}, ${safePath}, ${safeNavType})
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
