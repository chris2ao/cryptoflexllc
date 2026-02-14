/**
 * AnalyticsTracker — Client-side page-view + engagement tracking
 * -----------------------------------------------
 * Tracks three things automatically on every page:
 *   1. Page views  (beacon to /api/analytics/track)
 *   2. Scroll depth milestones (25/50/75/100%)
 *   3. Time on page (seconds before navigation/unload)
 *
 * PRIVACY: Only page path and engagement numbers are sent.
 * All sensitive data (IP, geo, UA) is extracted server-side.
 * No cookies, fingerprints, or localStorage are used.
 */

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Send JSON payload via sendBeacon with fetch fallback */
function beacon(url: string, data: Record<string, unknown>) {
  const payload = JSON.stringify(data);
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      url,
      new Blob([payload], { type: "application/json" }),
    );
  } else {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const startTime = useRef(Date.now());
  const sentDepths = useRef(new Set<number>());

  // ---- 1. Page view tracking ----
  useEffect(() => {
    beacon("/api/analytics/track", { path: pathname });
  }, [pathname]);

  // ---- 2. Scroll depth + 3. Time on page ----
  useEffect(() => {
    // Reset state on each navigation
    startTime.current = Date.now();
    sentDepths.current = new Set();

    function checkScrollDepth() {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const pct = Math.round((window.scrollY / docHeight) * 100);
      const milestones = [25, 50, 75, 100] as const;

      for (const m of milestones) {
        if (pct >= m && !sentDepths.current.has(m)) {
          sentDepths.current.add(m);
          beacon("/api/analytics/track-engagement", {
            path: pathname,
            scroll_depth: m,
          });
        }
      }
    }

    // Throttled scroll handler via rAF (~16ms)
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          checkScrollDepth();
          ticking = false;
        });
      }
    }

    function sendTimeOnPage() {
      const seconds = Math.round((Date.now() - startTime.current) / 1000);
      if (seconds >= 1 && seconds <= 3600) {
        beacon("/api/analytics/track-engagement", {
          path: pathname,
          time_seconds: seconds,
        });
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") sendTimeOnPage();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", sendTimeOnPage);

    // Check initial scroll position (page might load scrolled)
    checkScrollDepth();

    return () => {
      sendTimeOnPage();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("beforeunload", sendTimeOnPage);
    };
  }, [pathname]);

  return null;
}
