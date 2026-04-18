"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

export type TabDef = {
  id: string;
  number: string;
  label: string;
};

export const DEFAULT_TABS: TabDef[] = [
  { id: "overview", number: "01", label: "Overview" },
  { id: "audience", number: "02", label: "Audience" },
  { id: "content", number: "03", label: "Content" },
  { id: "technology", number: "04", label: "Technology" },
  { id: "performance", number: "05", label: "Performance" },
  { id: "security", number: "06", label: "Security" },
  { id: "newsletter", number: "07", label: "Newsletter" },
  { id: "activity", number: "08", label: "Activity" },
  { id: "automation", number: "09", label: "Automation" },
];

export type RangeDef = {
  id: string;
  days: number;
  label: string;
};

export const DEFAULT_RANGES: RangeDef[] = [
  { id: "24h", days: 1, label: "24H" },
  { id: "7d", days: 7, label: "7D" },
  { id: "30d", days: 30, label: "30D" },
  { id: "90d", days: 90, label: "90D" },
  { id: "12m", days: 365, label: "12M" },
];

type Props = {
  tabs?: TabDef[];
  ranges?: RangeDef[];
  currentDays: number;
  children: ReactNode;
};

const TAB_STORAGE_KEY = "cf_analytics_tab";

function resolveRangeId(ranges: RangeDef[], days: number): string {
  const match = ranges.find((r) => r.days === days);
  return match ? match.id : "30d";
}

export function AnalyticsShell({
  tabs = DEFAULT_TABS,
  ranges = DEFAULT_RANGES,
  currentDays,
  children,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window === "undefined") return tabs[0]?.id ?? "overview";
    const saved = window.localStorage.getItem(TAB_STORAGE_KEY);
    if (saved && tabs.some((t) => t.id === saved)) return saved;
    return tabs[0]?.id ?? "overview";
  });
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

  // Persist tab when it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TAB_STORAGE_KEY, activeTab);
  }, [activeTab]);

  // Toggle .on on child panels + broadcast active-panel event for child effects
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.querySelectorAll<HTMLElement>("[data-panel]").forEach((el) => {
      const match = el.getAttribute("data-panel") === activeTab;
      el.classList.toggle("on", match);
    });
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
    const params = new URLSearchParams(window.location.search);
    params.set("days", String(days));
    router.push(`/analytics?${params.toString()}`);
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
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`ax-tab-${t.id}`}
                aria-selected={activeTab === t.id}
                aria-controls={`ax-panel-${t.id}`}
                tabIndex={activeTab === t.id ? 0 : -1}
                data-tab-id={t.id}
                className={`ax-tab${activeTab === t.id ? " on" : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                <span className="n">{t.number}</span>
                <span>{t.label}</span>
              </button>
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

      <div data-ax-filterable>{children}</div>
    </>
  );
}
