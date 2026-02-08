/**
 * AnalyticsTracker — Client-side page-view tracking component
 * -----------------------------------------------
 * Drop this into your root layout and it automatically tracks
 * every page navigation (both initial load and client-side route
 * changes via Next.js App Router).
 *
 * TECHNICAL NOTES (for blog post):
 * --------------------------------
 * HOW IT WORKS:
 *   1. This is a "use client" component — it runs in the browser.
 *   2. On mount (and on every pathname change), it sends a POST
 *      request to /api/analytics/track with the current page path.
 *   3. We use navigator.sendBeacon() as the primary method because
 *      it's non-blocking — the browser sends the request in the
 *      background without waiting for a response, so it doesn't
 *      affect page load performance.
 *   4. sendBeacon() also survives page unloads (the browser
 *      guarantees delivery even if the user navigates away).
 *   5. We fall back to fetch() for browsers that don't support
 *      sendBeacon (very rare in 2025+).
 *
 * WHY usePathname()?
 *   Next.js App Router uses client-side navigation (no full page
 *   reload when clicking links). The usePathname() hook re-renders
 *   this component whenever the URL changes, triggering a new
 *   tracking event. This is more reliable than listening to
 *   popstate/pushstate events manually.
 *
 * PRIVACY CONSIDERATION:
 *   The client only sends the page path. All sensitive data (IP,
 *   geo, user-agent) is extracted server-side from request headers.
 *   No cookies, fingerprints, or localStorage are used.
 */

"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Build the tracking payload — just the page path
    const payload = JSON.stringify({ path: pathname });

    // Prefer sendBeacon for non-blocking, reliable delivery
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/analytics/track",
        new Blob([payload], { type: "application/json" })
      );
    } else {
      // Fallback for older browsers
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        // keepalive ensures the request completes even on page unload
        keepalive: true,
      }).catch(() => {
        // Silently fail — analytics should never break the user experience
      });
    }
  }, [pathname]);

  // This component renders nothing — it's purely a side-effect
  return null;
}
