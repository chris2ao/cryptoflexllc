/**
 * POST /api/gmail/unsubscribe/candidates
 * -----------------------------------------------
 * Receives unsubscribe candidate senders pushed by the local gmail-agent
 * (Mac Mini cron). Upserts by sender_email: an existing candidate has its
 * mutable fields refreshed and first_seen/last_seen widened to the union
 * of what is already stored and what was just pushed.
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/analytics";
import { verifyGmailAgentAuth } from "@/lib/gmail-agent-auth";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import { containsForbidden, candidatesBodySchema } from "@/lib/gmail-unsubscribe-schemas";

const candidatesRateLimiter = createRateLimiter({
  name: "gmail-unsub-candidates",
  windowMs: 60 * 1000,
  maxRequests: 60,
});

/**
 * Best-effort lookup of which item in a raw `{ items: [...] }` body tripped
 * the forbidden-content check, for a more useful log line. Returns null if
 * the raw text cannot be parsed or no single item accounts for the match.
 */
function findForbiddenItemIndex(rawText: string): number | null {
  try {
    const parsed = JSON.parse(rawText) as { items?: unknown[] };
    if (!Array.isArray(parsed.items)) return null;
    const index = parsed.items.findIndex((item) => containsForbidden(JSON.stringify(item)));
    return index === -1 ? null : index;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const auth = verifyGmailAgentAuth(request);
  if (!auth.ok) {
    return NextResponse.json(
      {
        error:
          auth.status === 503 ? "Gmail agent authentication not configured" : "Unauthorized",
      },
      { status: auth.status }
    );
  }

  const ip = getClientIp(request);
  const rateLimit = await candidatesRateLimiter.checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter ?? 60) } }
    );
  }

  const rawText = await request.text();
  if (containsForbidden(rawText)) {
    const index = findForbiddenItemIndex(rawText);
    if (index !== null) {
      console.error(`gmail/unsubscribe/candidates: forbidden content at item ${index}`);
    }
    return NextResponse.json(
      { error: "Payload contains forbidden content" },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(rawText);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = candidatesBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const items = parsed.data.items;

  try {
    const sql = getDb();

    await sql`
      INSERT INTO gmail_unsubscribe_candidates
        (sender_email, sender_domain, method, trashed_count_14d, first_seen, last_seen)
      SELECT * FROM UNNEST(
        ${items.map((item) => item.sender_email)}::text[],
        ${items.map((item) => item.sender_domain)}::text[],
        ${items.map((item) => item.method)}::text[],
        ${items.map((item) => item.trashed_count_14d)}::int[],
        ${items.map((item) => item.first_seen)}::timestamptz[],
        ${items.map((item) => item.last_seen)}::timestamptz[]
      )
      ON CONFLICT (sender_email) DO UPDATE SET
        sender_domain = EXCLUDED.sender_domain,
        method = EXCLUDED.method,
        trashed_count_14d = EXCLUDED.trashed_count_14d,
        first_seen = LEAST(gmail_unsubscribe_candidates.first_seen, EXCLUDED.first_seen),
        last_seen = GREATEST(gmail_unsubscribe_candidates.last_seen, EXCLUDED.last_seen),
        last_pushed_at = NOW()
    `;

    return NextResponse.json({ ok: true, upserted: items.length });
  } catch {
    console.error("gmail/unsubscribe/candidates: db error");
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
