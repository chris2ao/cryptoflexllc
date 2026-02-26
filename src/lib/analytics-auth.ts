/**
 * Analytics Authentication Utility
 * -------------------------------------------------
 * Cookie-based auth for the analytics dashboard. Replaces the
 * query-string secret pattern to avoid leaking credentials in
 * URLs, browser history, server logs, and Referer headers.
 *
 * Flow:
 *   1. User visits /analytics/login and enters the secret
 *   2. POST /api/analytics/auth verifies the secret, sets httpOnly cookie
 *   3. Dashboard and API routes verify the cookie (or Authorization header)
 */

import { createHmac, timingSafeEqual } from "crypto";

export const ANALYTICS_COOKIE_NAME = "analytics_session";
const TOKEN_PAYLOAD = "analytics-authenticated";

/**
 * Returns the cookie name with __Secure- prefix in production.
 * This ensures the cookie is only sent over HTTPS connections.
 */
export function getAnalyticsCookieName(): string {
  return process.env.NODE_ENV === "production"
    ? `__Secure-${ANALYTICS_COOKIE_NAME}`
    : ANALYTICS_COOKIE_NAME;
}

/**
 * Derives an HMAC-SHA256 token from the analytics secret.
 * The cookie stores this token (not the raw secret), so even
 * if the cookie is intercepted, the original secret isn't exposed.
 */
export function generateAuthToken(secret: string): string {
  return createHmac("sha256", secret).update(TOKEN_PAYLOAD).digest("hex");
}

/**
 * Verifies an auth token against the expected HMAC.
 * Uses constant-time comparison to prevent timing attacks.
 */
export function verifyAuthToken(token: string): boolean {
  const expectedSecret = process.env.ANALYTICS_SECRET;
  if (!expectedSecret || !token) return false;

  const expected = generateAuthToken(expectedSecret);

  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch {
    return false;
  }
}

/**
 * Checks if an incoming request is authenticated via cookie
 * or Authorization header. Works with NextRequest (API routes).
 */
export function verifyApiAuth(request: Request): boolean {
  const expectedSecret = process.env.ANALYTICS_SECRET;
  if (!expectedSecret) return false;

  // Check cookie (use environment-aware cookie name)
  const cookieName = getAnalyticsCookieName();
  const cookieHeader = request.headers.get("cookie") || "";
  const cookieMatch = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${cookieName}=([^;]+)`)
  );
  if (cookieMatch) {
    const token = cookieMatch[1];
    const expected = generateAuthToken(expectedSecret);
    try {
      if (timingSafeEqual(Buffer.from(expected), Buffer.from(token))) {
        return true;
      }
    } catch {
      // Length mismatch - not authenticated
    }
  }

  // Fallback: Authorization header (for programmatic access)
  // Accepts the HMAC-derived token (not the raw secret) so the secret
  // never travels over the wire or appears in access logs.
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const bearerToken = authHeader.slice(7);
    const expected = generateAuthToken(expectedSecret);
    try {
      if (timingSafeEqual(Buffer.from(expected), Buffer.from(bearerToken))) {
        return true;
      }
    } catch {
      // Length mismatch
    }
  }

  return false;
}
