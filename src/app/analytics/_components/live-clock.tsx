"use client";

import { useEffect, useState } from "react";

function formatUtc(d: Date): string {
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss} UTC`;
}

export function LiveClock() {
  // Server and first client render agree on the placeholder; the real time
  // arrives in the effect, so hydration never sees two different clocks.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration: the clock starts after mount
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) return <span>--:--:-- UTC</span>;
  return <time dateTime={now.toISOString()}>{formatUtc(now)}</time>;
}
