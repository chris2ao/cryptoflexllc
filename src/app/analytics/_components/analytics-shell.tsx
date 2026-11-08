"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TrafficScope } from "@/lib/analytics-queries/shared";
import type { ReactNode } from "react";

import {
  DEFAULT_RANGES,
  DEFAULT_TABS,
  type RangeDef,
  type TabDef,
  type TabId,
} from "./tabs";

// Server components import these from "./tabs" directly; the re-export
// keeps client-side consumers working.
export { DEFAULT_RANGES, DEFAULT_TABS };
export type { RangeDef, TabDef, TabId };

type Props = {
  activeTab: TabId;
  currentDays: number;
  scope: TrafficScope;
  tabs?: readonly TabDef[];
  ranges?: RangeDef[];
  meta?: ReactNode;
  children: ReactNode;
};

const SCOPES: ReadonlyArray<{ id: TrafficScope; label: string }> = [
  { id: "humans", label: "Humans" },
  { id: "all", label: "All" },
];

function resolveRangeId(ranges: RangeDef[], days: number): string {
  const match = ranges.find((r) => r.days === days);
  return match ? match.id : "30d";
}

export function AnalyticsShell({
  activeTab,
  currentDays,
  scope,
  tabs = DEFAULT_TABS,
  ranges = DEFAULT_RANGES,
  meta,
  children,
}: Props) {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [autoOn, setAutoOn] = useState<boolean>(true);

  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [canLeft, setCanLeft] = useState<boolean>(false);
  const [canRight, setCanRight] = useState<boolean>(false);
  const [showArrows, setShowArrows] = useState<boolean>(true);

  const currentRangeId = useMemo(
    () => resolveRangeId(ranges, currentDays),
    [ranges, currentDays]
  );

  // Broadcast the active tab and auto-refresh flag for child effects
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.dataset.axTab = activeTab;
    document.body.dataset.axAuto = autoOn ? "1" : "0";
  }, [activeTab, autoOn]);

  // Tab overflow detection
  const recomputeArrows = useCallback(() => {
    const el = tabsContainerRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth - el.clientWidth > 2;
    setShowArrows(hasOverflow);
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    recomputeArrows();
    const el = tabsContainerRef.current;
    if (!el) return;
    const onScroll = () => recomputeArrows();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", recomputeArrows);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", recomputeArrows);
    };
  }, [recomputeArrows]);

  // Scroll active tab into center when it changes
  useEffect(() => {
    const el = tabsContainerRef.current;
    if (!el) return;
    const activeEl = el.querySelector<HTMLElement>(`[data-tab-id="${activeTab}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    }
  }, [activeTab]);

  // '/' hotkey focuses search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/") return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      e.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Search applies a textContent substring filter to .ax-row / .ax-tbl tbody tr
  useEffect(() => {
    const q = search.trim().toLowerCase();
    const rows = document.querySelectorAll<HTMLElement>(
      "[data-ax-filterable] .ax-row, [data-ax-filterable] .ax-tbl tbody tr"
    );
    rows.forEach((row) => {
      if (!q) {
        row.style.display = "";
        return;
      }
      const text = (row.textContent ?? "").toLowerCase();
      row.style.display = text.includes(q) ? "" : "none";
    });
  }, [search, activeTab]);

  const handleRange = (days: number) => {
    router.push(`/analytics?tab=${activeTab}&days=${days}&scope=${scope}`);
  };

  const handleScope = (next: TrafficScope) => {
    router.push(`/analytics?tab=${activeTab}&days=${currentDays}&scope=${next}`);
  };

  const scrollTabs = (delta: number) => {
    const el = tabsContainerRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <>
      <div className="ax-toolbar ax-wrap">
        <div className="seg" role="group" aria-label="Date range">
          {ranges.map((r) => {
            const isActive = r.id === currentRangeId;
            return (
              <button
                key={r.id}
                type="button"
                className={isActive ? "on" : ""}
                onClick={() => handleRange(r.days)}
                aria-pressed={isActive}
                aria-label={`Last ${r.label}`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        <div className="seg" role="group" aria-label="Traffic scope">
          {SCOPES.map((o) => {
            const isActive = o.id === scope;
            return (
              <button
                key={o.id}
                type="button"
                className={isActive ? "on" : ""}
                onClick={() => handleScope(o.id)}
                aria-pressed={isActive}
              >
                {o.label}
              </button>
            );
          })}
        </div>

        <div className="tabs-wrap">
          {showArrows && (
            <button
              type="button"
              className="tabs-arrow left"
              onClick={() => scrollTabs(-220)}
              disabled={!canLeft}
              aria-label="Scroll tabs left"
            >
              ‹
            </button>
          )}
          <div className="toolbar-tabs" ref={tabsContainerRef} role="tablist">
            {tabs.map((t) => (
              <Link
                key={t.id}
                role="tab"
                id={`ax-tab-${t.id}`}
                aria-selected={activeTab === t.id}
                aria-controls={`ax-panel-${t.id}`}
                data-tab-id={t.id}
                className={`ax-tab${activeTab === t.id ? " on" : ""}`}
                href={`/analytics?tab=${t.id}&days=${currentDays}&scope=${scope}`}
                prefetch={false}
              >
                <span className="n">{t.number}</span>
                <span>{t.label}</span>
              </Link>
            ))}
          </div>
          {showArrows && (
            <button
              type="button"
              className="tabs-arrow right"
              onClick={() => scrollTabs(220)}
              disabled={!canRight}
              aria-label="Scroll tabs right"
            >
              ›
            </button>
          )}
        </div>

        <div className="ax-search">
          <span aria-hidden="true">⌕</span>
          <input
            ref={searchRef}
            type="search"
            placeholder="Filter rows"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Filter analytics rows"
          />
          <kbd className="k">/</kbd>
        </div>

        <button
          type="button"
          className={`ax-autorefresh${autoOn ? "" : " off"}`}
          onClick={() => setAutoOn((v) => !v)}
          aria-pressed={autoOn}
          aria-label="Toggle auto refresh"
        >
          <span className="dot" aria-hidden="true" />
          AUTO · {autoOn ? "ON" : "OFF"}
        </button>
      </div>

      {meta ? <div className="ax-meta-line">{meta}</div> : null}

      <div data-ax-filterable>{children}</div>
    </>
  );
}
