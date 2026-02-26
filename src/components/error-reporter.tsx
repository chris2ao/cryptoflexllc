"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ErrorReporter() {
  const pathname = usePathname();

  useEffect(() => {
    function reportError(data: {
      message: string;
      type?: string;
      stack?: string;
      source: "onerror" | "unhandledrejection" | "react";
    }) {
      try {
        const payload = JSON.stringify({
          path: pathname,
          message: data.message.slice(0, 2000),
          type: (data.type || "Error").slice(0, 100),
          stack: data.stack?.slice(0, 5000),
          source: data.source,
        });

        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            "/api/analytics/errors",
            new Blob([payload], { type: "application/json" })
          );
        } else {
          fetch("/api/analytics/errors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // Silently fail - don't cause more errors while reporting errors
      }
    }

    function handleError(event: ErrorEvent) {
      reportError({
        message: event.message || "Unknown error",
        type: event.error?.name || "Error",
        stack: event.error?.stack,
        source: "onerror",
      });
    }

    function handleRejection(event: PromiseRejectionEvent) {
      const reason = event.reason;
      reportError({
        message:
          reason instanceof Error
            ? reason.message
            : String(reason || "Unhandled promise rejection"),
        type: reason instanceof Error ? reason.name : "UnhandledRejection",
        stack: reason instanceof Error ? reason.stack : undefined,
        source: "unhandledrejection",
      });
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, [pathname]);

  return null;
}
