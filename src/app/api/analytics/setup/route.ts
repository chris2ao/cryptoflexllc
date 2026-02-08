/**
 * GET /api/analytics/setup
 * -----------------------------------------------
 * One-time endpoint to create the page_views table in your Neon
 * Postgres database. Visit this URL once after setting up your
 * DATABASE_URL environment variable.
 *
 * TECHNICAL NOTES (for blog post):
 * --------------------------------
 * - This uses Next.js Route Handlers (the App Router replacement
 *   for pages/api). Route Handlers run as Vercel Serverless
 *   Functions by default.
 * - The CREATE TABLE IF NOT EXISTS clause makes this idempotent —
 *   you can safely call it multiple times without errors.
 * - In production, you'd typically use a migration tool (Drizzle,
 *   Prisma Migrate, etc.), but for a simple analytics table,
 *   a one-shot setup endpoint is sufficient.
 * - We protect this with ANALYTICS_SECRET to prevent random
 *   visitors from hitting it (defense in depth).
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  // Simple secret-based protection
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

    // Create the table — using tagged template literals because
    // Neon's neon() driver is a tagged template function, not a
    // regular function. Each statement must be a separate call.
    await sql`
      CREATE TABLE IF NOT EXISTS page_views (
        id            SERIAL PRIMARY KEY,
        visited_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        page_path     TEXT NOT NULL,
        ip_address    VARCHAR(45) NOT NULL,
        user_agent    TEXT NOT NULL DEFAULT '',
        browser       VARCHAR(100) NOT NULL DEFAULT 'Unknown',
        os            VARCHAR(100) NOT NULL DEFAULT 'Unknown',
        device_type   VARCHAR(20)  NOT NULL DEFAULT 'Unknown',
        referrer      TEXT NOT NULL DEFAULT '(direct)',
        country       VARCHAR(100) NOT NULL DEFAULT 'Unknown',
        city          VARCHAR(100) NOT NULL DEFAULT 'Unknown',
        region        VARCHAR(100) NOT NULL DEFAULT 'Unknown',
        latitude      VARCHAR(20)  NOT NULL DEFAULT '',
        longitude     VARCHAR(20)  NOT NULL DEFAULT ''
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_page_views_visited_at
        ON page_views (visited_at)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_page_views_ip_address
        ON page_views (ip_address)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_page_views_page_path
        ON page_views (page_path)
    `;

    return NextResponse.json({
      success: true,
      message:
        "page_views table and indexes created successfully. " +
        "Your analytics tracking is now ready to go!",
    });
  } catch (error) {
    console.error("Setup failed:", error);
    return NextResponse.json(
      {
        error: "Failed to create table",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
