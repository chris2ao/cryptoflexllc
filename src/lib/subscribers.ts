import crypto from "crypto";

const BASE_URL = "https://www.cryptoflexllc.com";

/**
 * Generate an HMAC-based unsubscribe token for a given email.
 * Deterministic — the same email always produces the same token.
 */
export function makeUnsubscribeToken(email: string): string {
  const secret = process.env.SUBSCRIBER_SECRET;
  if (!secret) {
    throw new Error(
      "SUBSCRIBER_SECRET env var is not set. Add it to your Vercel environment variables."
    );
  }
  return crypto
    .createHmac("sha256", secret)
    .update(email.toLowerCase().trim())
    .digest("hex");
}

/**
 * Build a full unsubscribe URL for an email address.
 */
export function unsubscribeUrl(email: string): string {
  const token = makeUnsubscribeToken(email);
  return `${BASE_URL}/api/unsubscribe?email=${encodeURIComponent(
    email.toLowerCase().trim()
  )}&token=${token}`;
}

/** Basic email format check (RFC-ish, not exhaustive). */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 320;
}
