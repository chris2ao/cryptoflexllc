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
  // Guard: disable in production unless explicitly enabled
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ANALYTICS_SETUP_ENABLED !== "true"
  ) {
    return NextResponse.json({ error: "Setup disabled" }, { status: 404 });
  }

  // Guard: only allow if ANALYTICS_SETUP_ENABLED is set (for non-production)
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.ANALYTICS_SETUP_ENABLED !== "true"
  ) {
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

    // Web Vitals table for Speed Insights data
    await sql`
      CREATE TABLE IF NOT EXISTS web_vitals (
        id            SERIAL PRIMARY KEY,
        recorded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        metric_name   VARCHAR(10) NOT NULL,
        metric_value  DOUBLE PRECISION NOT NULL,
        rating        VARCHAR(20) NOT NULL DEFAULT 'unknown',
        page_path     TEXT NOT NULL DEFAULT '/',
        navigation_type VARCHAR(30) NOT NULL DEFAULT 'navigate'
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_web_vitals_recorded_at
        ON web_vitals (recorded_at)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_web_vitals_metric_name
        ON web_vitals (metric_name)
    `;

    // Subscribers table for blog newsletter
    await sql`
      CREATE TABLE IF NOT EXISTS subscribers (
        id            SERIAL PRIMARY KEY,
        email         VARCHAR(320) NOT NULL UNIQUE,
        subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        active        BOOLEAN NOT NULL DEFAULT TRUE,
        ip_address    VARCHAR(45) NOT NULL DEFAULT '',
        country       VARCHAR(100) NOT NULL DEFAULT 'Unknown',
        city          VARCHAR(100) NOT NULL DEFAULT 'Unknown',
        region        VARCHAR(100) NOT NULL DEFAULT 'Unknown'
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_subscribers_active
        ON subscribers (active) WHERE active = TRUE
    `;

    // Add columns to existing subscribers table if they don't exist
    await sql`
      ALTER TABLE subscribers
        ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45) NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS country VARCHAR(100) NOT NULL DEFAULT 'Unknown',
        ADD COLUMN IF NOT EXISTS city VARCHAR(100) NOT NULL DEFAULT 'Unknown',
        ADD COLUMN IF NOT EXISTS region VARCHAR(100) NOT NULL DEFAULT 'Unknown'
    `;

    // Blog comments table
    await sql`
      CREATE TABLE IF NOT EXISTS blog_comments (
        id            SERIAL PRIMARY KEY,
        slug          VARCHAR(255) NOT NULL,
        comment       TEXT NOT NULL,
        reaction      VARCHAR(10) NOT NULL DEFAULT 'up',
        email         VARCHAR(320) NOT NULL,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_blog_comments_slug
        ON blog_comments (slug)
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
