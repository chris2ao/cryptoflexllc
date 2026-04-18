"use client";

import { useEffect, useState } from "react";

function formatUtc(d: Date): string {
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss} UTC`;
}

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(() =>
    typeof window !== "undefined" ? new Date() : null
  );

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) return <span>--:--:-- UTC</span>;
  return <time dateTime={now.toISOString()}>{formatUtc(now)}</time>;
}
