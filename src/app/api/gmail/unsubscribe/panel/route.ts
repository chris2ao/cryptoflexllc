/**
 * GET /api/gmail/unsubscribe/panel
 * -----------------------------------------------
 * Serves the shaped PanelData the operator's review UI renders and
 * refreshes against. Cookie-authenticated (analytics dashboard only).
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/analytics";
import { verifyApiAuth } from "@/lib/analytics-auth";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import { loadUnsubscribePanel } from "@/lib/gmail-unsubscribe";

const panelRateLimiter = createRateLimiter({
  name: "gmail-unsub-panel",
  windowMs: 60 * 1000,
  maxRequests: 60,
});

export async function GET(request: NextRequest) {
  if (!verifyApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const rateLimit = await panelRateLimiter.checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter ?? 60) } }
    );
  }

  try {
    const panel = await loadUnsubscribePanel(getDb());
    if (panel === null) {
      return NextResponse.json(
        { error: "Unsubscribe tables not set up" },
        { status: 503 }
      );
    }

    return NextResponse.json(panel);
  } catch {
    console.error("gmail/unsubscribe/panel: db error");
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
