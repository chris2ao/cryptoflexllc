/**
 * Gmail Agent Authentication Utility
 * -------------------------------------------------
 * Bearer-token auth for the local gmail-agent (Mac Mini cron) pushing
 * unsubscribe candidates, attempts, and reading decisions. Deliberately
 * separate from the analytics cookie/HMAC path (verifyApiAuth): a
 * dedicated token keeps the blast radius small if the Mac Mini's
 * env file is ever exposed.
 */

import { createHash, timingSafeEqual } from "crypto";

function sha256(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

export function verifyGmailAgentAuth(
  request: Request
): { ok: true } | { ok: false; status: 401 | 503 } {
  const expectedToken = process.env.GMAIL_AGENT_API_TOKEN;
  if (!expectedToken) {
    return { ok: false, status: 503 };
  }

  const authHeader = request.headers.get("authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return { ok: false, status: 401 };
  }
  const token = authHeader.slice(7);

  // Hash both sides to a fixed 32-byte digest before comparing. This makes
  // timingSafeEqual's inputs always equal length, so it never throws, and
  // makes the wrong-length and wrong-value rejection paths indistinguishable
  // in timing (a raw comparison would otherwise be measurably faster to
  // reject a wrong-length token, a real if minor side channel).
  if (timingSafeEqual(sha256(token), sha256(expectedToken))) {
    return { ok: true };
  }

  return { ok: false, status: 401 };
}

/**
 * Shared response body for a failed verifyGmailAgentAuth() check, so the
 * three agent-bearer routes (candidates, attempts, decisions GET) render
 * identical error text instead of hand-rolling the same conditional three
 * times. Returns a plain { status, body } pair (not a NextResponse) so this
 * lib stays framework-response-free; each route wraps it in NextResponse.json.
 */
export function agentAuthErrorBody(
  status: 401 | 503
): { status: 401 | 503; body: { error: string } } {
  return {
    status,
    body: {
      error: status === 503 ? "Agent API not configured" : "Unauthorized",
    },
  };
}
