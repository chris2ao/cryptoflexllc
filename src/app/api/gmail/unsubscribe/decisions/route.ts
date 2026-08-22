/**
 * /api/gmail/unsubscribe/decisions
 * -----------------------------------------------
 * GET  (agent bearer auth): read-only feed the local gmail-agent polls
 *        before attempting an unsubscribe: the latest decision per
 *        sender, plus the full ledger when ?full=1.
 * POST (operator cookie auth): records an approve/deny decision made
 *        through the review panel UI.
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/analytics";
import { verifyApiAuth } from "@/lib/analytics-auth";
import { verifyGmailAgentAuth, agentAuthErrorBody } from "@/lib/gmail-agent-auth";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import { decisionBodySchema } from "@/lib/gmail-unsubscribe-schemas";
import { latestDecisions, type UnsubscribeDecisionDbRow } from "@/lib/gmail-unsubscribe";
import type { UnsubscribeDecision } from "@/lib/analytics-types";

const decisionsGetRateLimiter = createRateLimiter({
  name: "gmail-unsub-decisions-get",
  windowMs: 60 * 1000,
  maxRequests: 60,
});

const decisionsPostRateLimiter = createRateLimiter({
  name: "gmail-unsub-decisions-post",
  windowMs: 60 * 1000,
  maxRequests: 30,
});

function shapeDecision(row: UnsubscribeDecisionDbRow): UnsubscribeDecision {
  return {
    id: row.id,
    sender_email: row.sender_email,
    decision: row.decision,
    decided_at: typeof row.decided_at === "string" ? row.decided_at : row.decided_at.toISOString(),
    note: row.note,
  };
}

export async function GET(request: NextRequest) {
  const auth = verifyGmailAgentAuth(request);
  if (!auth.ok) {
    const { status, body } = agentAuthErrorBody(auth.status);
    return NextResponse.json(body, { status });
  }

  const ip = getClientIp(request);
  const rateLimit = await decisionsGetRateLimiter.checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter ?? 60) } }
    );
  }

  const full = request.nextUrl.searchParams.get("full") === "1";

  try {
    const sql = getDb();

    if (full) {
      const rows = (await sql`
        SELECT * FROM gmail_unsubscribe_decisions
        ORDER BY decided_at DESC, id DESC
        LIMIT 5000
      `) as unknown as UnsubscribeDecisionDbRow[];

      // Captured after the query completes, not before, so it reflects when
      // the data was actually read rather than when the request arrived.
      const generatedAt = new Date().toISOString();

      const decisions = Array.from(latestDecisions(rows).values())
        .sort((a, b) => a.sender_email.localeCompare(b.sender_email))
        .map(shapeDecision);

      return NextResponse.json(
        {
          ok: true,
          generated_at: generatedAt,
          decisions,
          ledger: rows.map(shapeDecision),
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const rows = (await sql`
      SELECT DISTINCT ON (sender_email) *
      FROM gmail_unsubscribe_decisions
      ORDER BY sender_email, decided_at DESC, id DESC
    `) as unknown as UnsubscribeDecisionDbRow[];

    const generatedAt = new Date().toISOString();

    return NextResponse.json(
      {
        ok: true,
        generated_at: generatedAt,
        decisions: rows.map(shapeDecision),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    console.error("gmail/unsubscribe/decisions GET: db error");
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const rateLimit = await decisionsPostRateLimiter.checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter ?? 60) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = decisionBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { sender_email, decision, note } = parsed.data;

  try {
    const sql = getDb();

    const existing = await sql`
      SELECT 1 FROM gmail_unsubscribe_candidates WHERE sender_email = ${sender_email}
    `;
    if (existing.length === 0) {
      return NextResponse.json({ error: "Unknown sender" }, { status: 404 });
    }

    const result = (await sql`
      INSERT INTO gmail_unsubscribe_decisions (sender_email, decision, note)
      VALUES (${sender_email}, ${decision}, ${note ?? null})
      RETURNING id, sender_email, decision, decided_at, note
    `) as unknown as UnsubscribeDecisionDbRow[];

    return NextResponse.json({ ok: true, decision: shapeDecision(result[0]) });
  } catch {
    console.error("gmail/unsubscribe/decisions POST: db error");
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
