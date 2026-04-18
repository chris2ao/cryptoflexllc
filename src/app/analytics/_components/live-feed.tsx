"use client";

import { useEffect, useRef, useState } from "react";

type EventTag = "hit" | "api" | "sub" | "err" | "bot";

type LiveEvent = {
  tag: EventTag;
  time: string;
  body: string;
  meta: string;
  ts: string;
};

const POLL_MS = 4200;
const MAX_ROWS = 50;

export function LiveFeed() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [paused, setPaused] = useState<boolean>(false);
  const [rateLabel, setRateLabel] = useState<string>("—");

  const cursorRef = useRef<string | null>(null);
  const rateWindowRef = useRef<number[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    const poll = async () => {
      const auto = document.body.dataset.axAuto !== "0";
      if (!auto || paused) return;
      const url = new URL("/api/analytics/live", window.location.origin);
      if (cursorRef.current) url.searchParams.set("cursor", cursorRef.current);
      url.searchParams.set("limit", "15");
      try {
        const res = await fetch(url.toString(), {
          credentials: "same-origin",
          cache: "no-store",
        });
        if (!res.ok) return;
        const payload = (await res.json()) as {
          events: LiveEvent[];
          cursor: string;
        };
        if (cancelled) return;
        if (payload.events && payload.events.length > 0) {
          setEvents((prev) => {
            const seen = new Set(prev.map((e) => `${e.ts}-${e.tag}-${e.body}`));
            const fresh = payload.events.filter(
              (e) => !seen.has(`${e.ts}-${e.tag}-${e.body}`)
            );
            const combined = [...fresh, ...prev].slice(0, MAX_ROWS);
            return combined;
          });
          const now = Date.now();
          rateWindowRef.current = [
            ...rateWindowRef.current.filter((t) => now - t < 60_000),
            ...payload.events.map(() => now),
          ];
          const rate = rateWindowRef.current.length;
          setRateLabel(`${rate}/min`);
        }
        if (payload.cursor) cursorRef.current = payload.cursor;
      } catch {
        // swallow — transient errors shouldn't break the UI
      }
    };

    poll();
    const id = window.setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [paused]);

  return (
    <div className="ax-panel-card">
      <div className="ax-panel-head">
        <div className="t">
          <span className="dot" aria-hidden="true" />
          <span>Live feed</span>
          <span className="n">RECENT EVENTS</span>
        </div>
        <div className="actions">
          <button
            type="button"
            className={`chip${paused ? " on" : ""}`}
            onClick={() => setPaused((v) => !v)}
            aria-pressed={paused}
          >
            {paused ? "Paused" : "Pause"}
          </button>
        </div>
      </div>
      <div className="ax-feed" role="log" aria-live="polite" aria-label="Live event feed">
        {events.length === 0 ? (
          <div style={{ padding: 18, color: "var(--fg-3)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
            Waiting for events…
          </div>
        ) : (
          events.map((e, i) => (
            <div key={`${e.ts}-${i}`} className="frow">
              <span className="t">{e.time}</span>
              <span className={`tag ${e.tag}`}>{e.tag}</span>
              <span className="body">{e.body}</span>
              <span className="meta">{e.meta}</span>
            </div>
          ))
        )}
      </div>
      <div className="ax-panel-foot">
        <span>Rate <b>{rateLabel}</b></span>
        <span>{paused ? "paused" : "live"} · polling every {POLL_MS / 1000}s</span>
      </div>
    </div>
  );
}
