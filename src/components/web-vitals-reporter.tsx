/**
 * WebVitalsReporter — Client-side Web Vitals collection component
 * -----------------------------------------------
 * Measures Core Web Vitals (LCP, INP, CLS, FCP, TTFB) using the
 * web-vitals library and sends them to /api/analytics/vitals for storage.
 *
 * Uses sendBeacon() for non-blocking, reliable delivery (same pattern
 * as the AnalyticsTracker component).
 *
 * Dashboard and backlog paths (see isTrackedPath) are skipped: no web-vitals
 * listeners are registered there, so nothing is measured or sent.
 */

"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { onLCP, onINP, onCLS, onFCP, onTTFB } from "web-vitals";
import type { Metric } from "web-vitals";
import { isTrackedPath } from "@/lib/analytics-tracking-rules";

function sendMetric(metric: Metric, path: string) {
  const payload = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    path,
    navigationType: metric.navigationType,
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/analytics/vitals",
      new Blob([payload], { type: "application/json" })
    );
  } else {
    fetch("/api/analytics/vitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }
}

export function WebVitalsReporter() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isTrackedPath(pathname)) return;
    onLCP((metric) => sendMetric(metric, pathname));
    onINP((metric) => sendMetric(metric, pathname));
    onCLS((metric) => sendMetric(metric, pathname));
    onFCP((metric) => sendMetric(metric, pathname));
    onTTFB((metric) => sendMetric(metric, pathname));
  }, [pathname]);

  return null;
}
