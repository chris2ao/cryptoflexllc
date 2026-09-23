/**
 * POST /api/gmail/metrics
 * -----------------------------------------------
 * Receives gmail-agent run metrics and Claude session-archive metadata
 * pushed by the local export script
 * (~/.claude/scripts/gmail-metrics-export.sh) after every gmail-agent run.
 * Upserts both into the automation_snapshots table so /analytics can read
 * them at request time, instead of the old flow that committed
 * src/data/gmail-metrics.json + src/data/session-archive.json and pushed,
 * triggering a full Vercel rebuild (deployment-storage-reduction-plan.md,
 * section C).
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/analytics";
import { verifyGmailAgentAuth, agentAuthErrorBody } from "@/lib/gmail-agent-auth";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import { putSnapshot } from "@/lib/automation-snapshots";
import { gmailMetricsBodySchema } from "@/lib/gmail-metrics-schemas";

// Larger than the unsubscribe routes' 1 MB cap because this payload carries
// the full run history and session-archive listing, not a small delta. Sized
// to fit the schema's array caps while staying under Vercel's 4.5 MB request
// limit. The real payload was ~280 KB in September 2026.
const MAX_BODY_BYTES = 4 * 1024 * 1024; // 4 MB

// The export script runs at most a few times a day; this only needs to
// stop a misbehaving or looping caller, not shape normal traffic.
const metricsRateLimiter = createRateLimiter({
  name: "gmail-metrics",
  windowMs: 60 * 1000,
  maxRequests: 10,
});

export async function POST(request: NextRequest) {
  const auth = verifyGmailAgentAuth(request);
  if (!auth.ok) {
    const { status, body } = agentAuthErrorBody(auth.status);
    return NextResponse.json(body, { status });
  }

  const ip = getClientIp(request);
  const rateLimit = await metricsRateLimiter.checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter ?? 60) } }
    );
  }

  // Cheap early reject when the header is honest; the byte check below is
  // the real guard.
  const contentLength = Number(request.headers.get("content-length"));
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  const rawText = await request.text();
  // Content-Length can be absent (chunked) or wrong, so check what arrived.
  if (Buffer.byteLength(rawText, "utf8") > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawText);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = gmailMetricsBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { gmailMetrics, sessionArchive } = parsed.data;

  try {
    const sql = getDb();

    await putSnapshot(sql, "gmail-metrics", gmailMetrics);
    await putSnapshot(sql, "session-archive", sessionArchive);

    return NextResponse.json({
      ok: true,
      gmailRuns: gmailMetrics.length,
      sessionEntries: sessionArchive.length,
    });
  } catch {
    console.error("gmail/metrics: db error");
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
