/**
 * POST /api/gmail/unsubscribe/attempts
 * -----------------------------------------------
 * Receives unsubscribe attempt results pushed by the local gmail-agent
 * (Mac Mini cron) after it acts on an approved candidate. Upserts by
 * (sender_email, attempted_at): silence-tracking fields only overwrite an
 * existing row when the agent actually measured them on this push.
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/analytics";
import { verifyGmailAgentAuth } from "@/lib/gmail-agent-auth";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import { containsForbidden, attemptsBodySchema } from "@/lib/gmail-unsubscribe-schemas";

const attemptsRateLimiter = createRateLimiter({
  name: "gmail-unsub-attempts",
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
  const rateLimit = await attemptsRateLimiter.checkRateLimit(ip);
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
      console.error(`gmail/unsubscribe/attempts: forbidden content at item ${index}`);
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

  const parsed = attemptsBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const items = parsed.data.items;

  try {
    const sql = getDb();

    await sql`
      INSERT INTO gmail_unsubscribe_attempts
        (sender_email, attempted_at, status_code, succeeded, silent_14d, silence_measured_at)
      SELECT * FROM UNNEST(
        ${items.map((item) => item.sender_email)}::text[],
        ${items.map((item) => item.attempted_at)}::timestamptz[],
        ${items.map((item) => item.status_code)}::int[],
        ${items.map((item) => item.succeeded)}::bool[],
        ${items.map((item) => item.silent_14d ?? null)}::bool[],
        ${items.map((item) => item.silence_measured_at ?? null)}::timestamptz[]
      )
      ON CONFLICT (sender_email, attempted_at) DO UPDATE SET
        status_code = EXCLUDED.status_code,
        succeeded = EXCLUDED.succeeded,
        silent_14d = COALESCE(EXCLUDED.silent_14d, gmail_unsubscribe_attempts.silent_14d),
        silence_measured_at = COALESCE(
          EXCLUDED.silence_measured_at,
          gmail_unsubscribe_attempts.silence_measured_at
        )
    `;

    return NextResponse.json({ ok: true, upserted: items.length });
  } catch {
    console.error("gmail/unsubscribe/attempts: db error");
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
