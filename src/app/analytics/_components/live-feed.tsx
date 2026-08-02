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

/**
 * Stop polling after this much continuous live time and ask whether to keep
 * going. A dashboard left open all day was generating far more traffic than
 * the site itself: one poll every 4.2s costs a middleware invocation, a
 * function invocation, and a database query.
 */
const IDLE_LIMIT_MS = 30 * 60 * 1000;

export function LiveFeed() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [paused, setPaused] = useState<boolean>(false);
  const [promptOpen, setPromptOpen] = useState<boolean>(false);
  const [rateLabel, setRateLabel] = useState<string>("—");

  const cursorRef = useRef<string | null>(null);
  const rateWindowRef = useRef<number[]>([]);
  const deadlineRef = useRef<number>(0);

  // Set on the client so the deadline is not baked in at render time.
  if (deadlineRef.current === 0 && typeof window !== "undefined") {
    deadlineRef.current = Date.now() + IDLE_LIMIT_MS;
  }

  const resume = () => {
    deadlineRef.current = Date.now() + IDLE_LIMIT_MS;
    setPromptOpen(false);
    setPaused(false);
  };

  // A backgrounded tab should cost nothing, and coming back to it counts as
  // activity, so the idle window restarts rather than firing immediately.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        deadlineRef.current = Date.now() + IDLE_LIMIT_MS;
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    const poll = async () => {
      const auto = document.body.dataset.axAuto !== "0";
      if (!auto || paused) return;
      // Hidden tabs make no requests at all.
      if (document.visibilityState === "hidden") return;
      if (Date.now() >= deadlineRef.current) {
        setPaused(true);
        setPromptOpen(true);
        return;
      }
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
            onClick={() => (paused ? resume() : setPaused(true))}
            aria-pressed={paused}
          >
            {paused ? "Paused" : "Pause"}
          </button>
        </div>
      </div>
      {promptOpen && (
        <div
          className="ax-idle-prompt"
          role="dialog"
          aria-labelledby="ax-idle-title"
        >
          <div className="copy">
            <div className="h" id="ax-idle-title">
              Still watching?
            </div>
            <div className="s">
              Paused after {IDLE_LIMIT_MS / 60000} minutes to stop burning function time.
            </div>
          </div>
          <div className="actions">
            <button type="button" className="chip" onClick={resume}>
              Keep refreshing
            </button>
            <button
              type="button"
              className="chip on"
              onClick={() => setPromptOpen(false)}
            >
              Stay paused
            </button>
          </div>
        </div>
      )}
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
        <span>
          {paused ? "paused" : "live"} · polling every {POLL_MS / 1000}s · auto-pauses after{" "}
          {IDLE_LIMIT_MS / 60000}m idle
        </span>
      </div>
    </div>
  );
}
