/**
 * GET /api/analytics/live
 * -----------------------------------------------
 * Returns recent events (page views, API hits, subscriber signups,
 * client errors) for the analytics dashboard live feed.
 *
 * Auth: cookie-based via analytics_session (same as /analytics page).
 * Rate limit: 60 requests per minute per IP (client polls every ~4s).
 *
 * Query params:
 *   ?cursor=<ISO timestamp>  Return events newer than this timestamp.
 *                            Defaults to 5 minutes ago.
 *   ?limit=<number>          Max events to return (1-50, default 15).
 *
 * Returns:
 *   { events: Event[], cursor: string }
 *   where each Event = { tag, time, body, meta, ts }
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getAnalyticsCookieName,
  verifyAuthToken,
} from "@/lib/analytics-auth";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import { getDb } from "@/lib/analytics";

export const dynamic = "force-dynamic";

const liveRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 60,
});

type EventTag = "hit" | "api" | "sub" | "err";

type LiveEvent = {
  tag: EventTag;
  time: string;
  body: string;
  meta: string;
  ts: string;
};

function formatRelative(iso: string, now: Date): string {
  const then = new Date(iso).getTime();
  const diffSec = Math.max(0, Math.floor((now.getTime() - then) / 1000));
  if (diffSec < 10) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  return `${Math.floor(diffSec / 3600)}h ago`;
}

// Strip control chars + Unicode directional overrides that could visually
// reorder text in the rendered feed rows. Client uses React text nodes, so
// this is belt-and-suspenders — not an XSS guard.
const CONTROL_AND_BIDI = /[\u0000-\u001f\u007f\u200b-\u200f\u2028\u2029\u202a-\u202e\u2066-\u2069]+/g;
function sanitize(s: string | null | undefined, max = 120): string {
  if (!s) return "";
  return s.replace(CONTROL_AND_BIDI, " ").slice(0, max);
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(getAnalyticsCookieName())?.value;
  if (!authToken || !verifyAuthToken(authToken)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const rate = await liveRateLimiter.checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter ?? 60) } }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const cursorParam = searchParams.get("cursor");
  const limitParam = searchParams.get("limit");

  let cursorDate: Date;
  if (cursorParam) {
    const d = new Date(cursorParam);
    if (Number.isNaN(d.getTime())) {
      return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
    }
    cursorDate = d;
  } else {
    cursorDate = new Date(Date.now() - 5 * 60 * 1000);
  }

  let limit = 15;
  if (limitParam) {
    const n = parseInt(limitParam, 10);
    if (!Number.isNaN(n)) {
      limit = Math.max(1, Math.min(50, n));
    }
  }

  const cursorIso = cursorDate.toISOString();
  const perQueryLimit = Math.min(limit, 25);

  const events: LiveEvent[] = [];
  const now = new Date();

  let sql;
  try {
    sql = getDb();
  } catch {
    return NextResponse.json({ events: [], cursor: now.toISOString() });
  }

  // page_views → HIT events
  try {
    const rows = (await sql`
      SELECT visited_at, page_path, country, device_type, browser
      FROM page_views
      WHERE visited_at > ${cursorIso}
      ORDER BY visited_at DESC
      LIMIT ${perQueryLimit}
    `) as Array<{
      visited_at: string;
      page_path: string;
      country: string | null;
      device_type: string | null;
      browser: string | null;
    }>;
    for (const r of rows) {
      events.push({
        tag: "hit",
        ts: r.visited_at,
        time: formatRelative(r.visited_at, now),
        body: sanitize(r.page_path, 80),
        meta: sanitize(
          [r.country, r.device_type, r.browser].filter(Boolean).join(" · "),
          60
        ),
      });
    }
  } catch {
    // swallow per-source errors; live feed should degrade gracefully
  }

  // api_metrics → API events
  try {
    const rows = (await sql`
      SELECT recorded_at, endpoint, method, status_code, duration_ms
      FROM api_metrics
      WHERE recorded_at > ${cursorIso}
      ORDER BY recorded_at DESC
      LIMIT ${perQueryLimit}
    `) as Array<{
      recorded_at: string;
      endpoint: string;
      method: string | null;
      status_code: number | null;
      duration_ms: number | null;
    }>;
    for (const r of rows) {
      const isErr = (r.status_code ?? 0) >= 500;
      events.push({
        tag: isErr ? "err" : "api",
        ts: r.recorded_at,
        time: formatRelative(r.recorded_at, now),
        body: sanitize(
          `${r.method ?? "GET"} ${r.endpoint}`,
          80
        ),
        meta: sanitize(
          [
            r.status_code != null ? String(r.status_code) : null,
            r.duration_ms != null ? `${Math.round(r.duration_ms)}ms` : null,
          ]
            .filter(Boolean)
            .join(" · "),
          40
        ),
      });
    }
  } catch {
    // ignore
  }

  // subscribers → SUB events
  try {
    const rows = (await sql`
      SELECT created_at, source_page
      FROM subscribers
      WHERE created_at > ${cursorIso}
      ORDER BY created_at DESC
      LIMIT ${perQueryLimit}
    `) as Array<{ created_at: string; source_page: string | null }>;
    for (const r of rows) {
      events.push({
        tag: "sub",
        ts: r.created_at,
        time: formatRelative(r.created_at, now),
        body: "new subscriber",
        meta: sanitize(r.source_page ?? "", 60),
      });
    }
  } catch {
    // ignore
  }

  // client_errors → ERR events
  try {
    const rows = (await sql`
      SELECT occurred_at, message, page_path
      FROM client_errors
      WHERE occurred_at > ${cursorIso}
      ORDER BY occurred_at DESC
      LIMIT ${perQueryLimit}
    `) as Array<{
      occurred_at: string;
      message: string | null;
      page_path: string | null;
    }>;
    for (const r of rows) {
      events.push({
        tag: "err",
        ts: r.occurred_at,
        time: formatRelative(r.occurred_at, now),
        body: sanitize(r.message ?? "error", 80),
        meta: sanitize(r.page_path ?? "", 60),
      });
    }
  } catch {
    // ignore
  }

  events.sort((a, b) => (a.ts < b.ts ? 1 : a.ts > b.ts ? -1 : 0));
  const trimmed = events.slice(0, limit);
  // Advance cursor to `now` when the response is empty so the next poll
  // uses a fresh window instead of re-scanning the same 5-minute tail.
  const newestTs = trimmed[0]?.ts ?? now.toISOString();

  return NextResponse.json(
    { events: trimmed, cursor: newestTs },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
