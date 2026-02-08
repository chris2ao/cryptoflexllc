/**
 * Analytics Utility Module
 * -------------------------------------------------
 * Provides the database connection, TypeScript types, and helper
 * functions used by the analytics tracking system.
 *
 * Storage: Neon Serverless Postgres (free tier — 0.5 GB)
 * Connection: Uses the DATABASE_URL environment variable which Neon
 *             provides when you create a project.
 *
 * TECHNICAL NOTES (for blog post):
 * --------------------------------
 * - @neondatabase/serverless uses WebSocket connections under the
 *   hood, which makes it compatible with Vercel Edge & Serverless
 *   functions (no persistent TCP connection needed).
 * - The `neon()` function returns a tagged-template SQL executor
 *   that automatically parameterizes queries to prevent SQL injection.
 * - Each call to `getDb()` creates a fresh connection — Neon's
 *   serverless driver is designed for this (connection pooling happens
 *   on Neon's side via their HTTP proxy).
 */

import { neon } from "@neondatabase/serverless";

// --------------- Types ---------------

export interface VisitorRecord {
  id: number;
  /** ISO-8601 timestamp of the visit */
  visited_at: string;
  /** Page path, e.g. "/blog/my-post" */
  page_path: string;
  /** Visitor IP (from x-forwarded-for or x-real-ip) */
  ip_address: string;
  /** Raw User-Agent string */
  user_agent: string;
  /** Parsed browser name, e.g. "Chrome 120" */
  browser: string;
  /** Parsed OS name, e.g. "Windows 11" */
  os: string;
  /** Device type: "Desktop", "Mobile", "Tablet", "Bot" */
  device_type: string;
  /** Referrer URL or "(direct)" */
  referrer: string;
  /** Country name from Vercel geo header */
  country: string;
  /** City name from Vercel geo header */
  city: string;
  /** Region/state from Vercel geo header */
  region: string;
  /** Latitude from Vercel geo header */
  latitude: string;
  /** Longitude from Vercel geo header */
  longitude: string;
}

// --------------- Database ---------------

/**
 * Returns a Neon SQL executor bound to DATABASE_URL.
 *
 * TECHNICAL NOTE:
 * The neon() function returns a query function that sends queries
 * over HTTP (not a persistent connection). This is perfect for
 * serverless because:
 *   1. No connection pool management needed
 *   2. Zero cold-start penalty from opening TCP/TLS connections
 *   3. Neon handles connection pooling on their infrastructure
 */
export function getDb() {
  let databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
        "Create a Neon project at https://neon.tech and add the " +
        "connection string to your Vercel environment variables."
    );
  }

  // Sanitize: strip "psql" prefix and surrounding quotes if someone
  // pasted the Neon CLI command instead of just the connection string.
  // e.g. psql 'postgresql://...' → postgresql://...
  databaseUrl = databaseUrl.replace(/^psql\s+/, "").replace(/^'|'$/g, "");

  return neon(databaseUrl);
}

// --------------- User-Agent Parsing ---------------

/**
 * Lightweight User-Agent parser — no external dependency needed.
 *
 * TECHNICAL NOTE:
 * Instead of pulling in a heavy UA parsing library (ua-parser-js is
 * 17 KB), we use simple regex matching. This covers ~95% of real
 * traffic. The regexes are ordered so the first match wins.
 */

export function parseBrowser(ua: string): string {
  if (!ua) return "Unknown";

  // Order matters — check specific browsers before generic engines
  const browsers: [RegExp, string][] = [
    [/Edg(?:e|A|iOS)?\/(\d+)/, "Edge"],
    [/OPR\/(\d+)/, "Opera"],
    [/Brave\/(\d+)/, "Brave"],
    [/Vivaldi\/(\d+)/, "Vivaldi"],
    [/SamsungBrowser\/(\d+)/, "Samsung Internet"],
    [/Firefox\/(\d+)/, "Firefox"],
    [/CriOS\/(\d+)/, "Chrome iOS"],
    [/Chrome\/(\d+)/, "Chrome"],
    [/Version\/(\d+).*Safari/, "Safari"],
    [/Safari\/(\d+)/, "Safari"],
  ];

  for (const [regex, name] of browsers) {
    const match = ua.match(regex);
    if (match) return `${name} ${match[1]}`;
  }

  // Bot detection
  if (/bot|crawl|spider|slurp|Googlebot|Bingbot/i.test(ua)) return "Bot";

  return "Other";
}

export function parseOS(ua: string): string {
  if (!ua) return "Unknown";

  const osList: [RegExp, string][] = [
    [/Windows NT 10\.0/, "Windows 10/11"],
    [/Windows NT 6\.3/, "Windows 8.1"],
    [/Windows NT 6\.1/, "Windows 7"],
    [/Mac OS X (\d+)[._](\d+)/, "macOS"],
    [/CrOS/, "Chrome OS"],
    [/Android (\d+)/, "Android"],
    [/iPhone OS (\d+)/, "iOS"],
    [/iPad.*OS (\d+)/, "iPadOS"],
    [/Linux/, "Linux"],
  ];

  for (const [regex, name] of osList) {
    const match = ua.match(regex);
    if (match) {
      if (name === "macOS" && match[1]) return `macOS ${match[1]}.${match[2]}`;
      if (name === "Android" && match[1]) return `Android ${match[1]}`;
      if (name === "iOS" && match[1]) return `iOS ${match[1]}`;
      if (name === "iPadOS" && match[1]) return `iPadOS ${match[1]}`;
      return name;
    }
  }

  return "Other";
}

export function parseDeviceType(ua: string): string {
  if (!ua) return "Unknown";
  if (/bot|crawl|spider|slurp/i.test(ua)) return "Bot";
  if (/Mobi|Android.*Mobile|iPhone/i.test(ua)) return "Mobile";
  if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) return "Tablet";
  return "Desktop";
}

// --------------- SQL Schema Reference ---------------

/**
 * The page_views table schema (created via /api/analytics/setup):
 *
 * TECHNICAL NOTES:
 * - SERIAL for auto-incrementing IDs (Neon supports this)
 * - TIMESTAMPTZ stores timezone-aware timestamps, defaulting to NOW()
 * - VARCHAR(45) for IP supports both IPv4 (max 15 chars) and IPv6 (max 45 chars)
 * - Indexes on visited_at, ip_address, and page_path for fast dashboard queries
 * - The setup route uses tagged template literals (sql`...`) because Neon's
 *   neon() driver is a tagged template function, not a regular function
 */
