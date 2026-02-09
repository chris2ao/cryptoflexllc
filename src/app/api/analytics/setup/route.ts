/**
 * GET /api/analytics/setup
 * -----------------------------------------------
 * One-time endpoint to create the page_views table in your Neon
 * Postgres database. Protected by cookie/header auth AND the
 * ANALYTICS_SETUP_ENABLED env var (must be "true" to allow).
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/analytics";
import { verifyApiAuth } from "@/lib/analytics-auth";

export async function GET(request: NextRequest) {
  // Guard: only allow if ANALYTICS_SETUP_ENABLED is set
  if (process.env.ANALYTICS_SETUP_ENABLED !== "true") {
    return NextResponse.json(
      { error: "Setup endpoint is disabled. Set ANALYTICS_SETUP_ENABLED=true to enable." },
      { status: 403 }
    );
  }

  // Auth check (cookie or Authorization header)
  if (!verifyApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDb();

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

    // IP intelligence cache table
    await sql`
      CREATE TABLE IF NOT EXISTS ip_intel (
        ip_address       VARCHAR(45) PRIMARY KEY,
        isp              TEXT DEFAULT '',
        org              TEXT DEFAULT '',
        as_number        TEXT DEFAULT '',
        as_name          TEXT DEFAULT '',
        is_proxy         BOOLEAN DEFAULT FALSE,
        is_hosting       BOOLEAN DEFAULT FALSE,
        is_mobile        BOOLEAN DEFAULT FALSE,
        country          VARCHAR(100) DEFAULT '',
        city             VARCHAR(100) DEFAULT '',
        region           VARCHAR(100) DEFAULT '',
        whois_org        TEXT DEFAULT '',
        whois_address    TEXT DEFAULT '',
        reverse_address  TEXT DEFAULT '',
        reverse_county   VARCHAR(100) DEFAULT '',
        reverse_state    VARCHAR(10) DEFAULT '',
        latitude         VARCHAR(20) DEFAULT '',
        longitude        VARCHAR(20) DEFAULT '',
        cached_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    return NextResponse.json({
      success: true,
      message: "Tables created successfully. Your analytics tracking is now ready.",
    });
  } catch (error) {
    console.error("Setup failed:", error);
    return NextResponse.json(
      { error: "Setup failed. Check server logs for details." },
      { status: 500 }
    );
  }
}
