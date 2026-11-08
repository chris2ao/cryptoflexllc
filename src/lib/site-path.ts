/**
 * Is this string a path on this site, safe to hand to next/link?
 *
 * Stored page paths come from the public tracking beacon, so a value such as
 * `/\evil.com` must never become an href: the URL parser turns it into
 * `https://evil.com/` and the App Router would hard-navigate there. Accepts
 * exactly one leading slash, no backslashes, and a result that stays on the
 * origin it is resolved against.
 */
export function isSitePath(path: string): boolean {
  if (typeof path !== "string" || path.length === 0 || path.length > 2000) return false;
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
  try {
    return new URL(path, "https://site.invalid").origin === "https://site.invalid";
  } catch {
    return false;
  }
}
