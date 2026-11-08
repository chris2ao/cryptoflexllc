/**
 * Paths the analytics never records. The dashboard and the backlog preview
 * are the owner's own tooling, so their page views, engagement beacons and
 * web vitals would only measure the owner.
 *
 * Shared by the client tracker, the vitals reporter and the API routes so
 * the rule lives in exactly one place.
 */
export const UNTRACKED_PREFIXES = ["/analytics", "/backlog"] as const;

export function isTrackedPath(pathname: string): boolean {
  return !UNTRACKED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
