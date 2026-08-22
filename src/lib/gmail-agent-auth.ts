/**
 * Gmail Agent Authentication Utility
 * -------------------------------------------------
 * Bearer-token auth for the local gmail-agent (Mac Mini cron) pushing
 * unsubscribe candidates, attempts, and reading decisions. Deliberately
 * separate from the analytics cookie/HMAC path (verifyApiAuth): a
 * dedicated token keeps the blast radius small if the Mac Mini's
 * env file is ever exposed.
 */

import { timingSafeEqual } from "crypto";

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

  try {
    if (timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken))) {
      return { ok: true };
    }
  } catch {
    // Length mismatch: not authenticated.
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
      error: status === 503 ? "Gmail agent authentication not configured" : "Unauthorized",
    },
  };
}
