"use client";

import { useState, useMemo, useEffect } from "react";
import Fuse from "fuse.js";
import { SNESBadge } from "./snes-badge";
import { SNESSearchBar } from "./snes-search-bar";

// Types matching the data shape
interface KGEntity {
  name: string;
  type: string;
  observations: string[];
}

interface Instinct {
  id: string;
  trigger: string;
  confidence: number;
  domain: string;
  created: string;
}

interface HookEntry {
  matcher: string;
  script: string;
  description: string;
  timeout?: number;
}

interface SearchResult {
  id: string;
  source: "entity" | "instinct" | "hook";
  title: string;
  subtitle: string;
  badge: string;
  snippet: string;
}

// Lazy-load all JSON data
async function loadAllData(): Promise<SearchResult[]> {
  const [entitiesModule, instinctsModule, hooksModule] = await Promise.all([
    import("@/data/dashboard/kg-entities.json"),
    import("@/data/dashboard/instincts.json"),
    import("@/data/dashboard/hooks.json"),
  ]);

  const entities: KGEntity[] = entitiesModule.default;
  const instincts: Instinct[] = instinctsModule.default;
  const hooks: Record<string, HookEntry[]> = hooksModule.default;

  const entityResults: SearchResult[] = entities.map((e) => ({
    id: `entity-${e.name}`,
    source: "entity" as const,
    title: e.name,
    subtitle: e.type,
    badge: e.type,
    snippet: e.observations.slice(0, 2).join(" · "),
  }));

  const instinctResults: SearchResult[] = instincts.map((i) => ({
    id: `instinct-${i.id}`,
    source: "instinct" as const,
    title: i.id.replace(/-/g, " "),
    subtitle: `${i.domain} · ${Math.round(i.confidence * 100)}% conf`,
    badge: "Skill",
    snippet: i.trigger,
  }));

  const hookResults: SearchResult[] = Object.entries(hooks).flatMap(([hookType, entries]) =>
    entries.map((h, idx) => ({
      id: `hook-${hookType}-${idx}`,
      source: "hook" as const,
      title: h.script,
      subtitle: hookType,
      badge: "Hook",
      snippet: h.description,
    }))
  );

  return [...entityResults, ...instinctResults, ...hookResults];
}

export function DashboardSearch() {
  const [query, setQuery] = useState("");
  const [allItems, setAllItems] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadAllData()
      .then((items) => {
        setAllItems(items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(allItems, {
        keys: ["title", "subtitle", "snippet"],
        threshold: 0.35,
        includeScore: true,
        includeMatches: true,
        minMatchCharLength: 2,
      }),
    [allItems]
  );

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    return fuse.search(query).map((r) => r.item);
  }, [fuse, query]);

  // Group by source
  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {
      entity: [],
      instinct: [],
      hook: [],
    };
    for (const r of results) {
      groups[r.source].push(r);
    }
    return groups;
  }, [results]);

  const totalResults = results.length;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIdx((i) => Math.min(i + 1, totalResults - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && focusedIdx >= 0) {
      const item = results[focusedIdx];
      if (item) {
        setExpandedId(expandedId === item.id ? null : item.id);
      }
    } else if (e.key === "Escape") {
      setQuery("");
      setFocusedIdx(-1);
    }
  }

  const SOURCE_LABELS: Record<string, string> = {
    entity: "KG ENTITIES",
    instinct: "INSTINCTS",
    hook: "HOOKS",
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      style={{ outline: "none" }}
    >
      {/* Search input */}
      <div style={{ padding: "var(--snes-space-4)" }}>
        <SNESSearchBar
          value={query}
          onChange={(v) => {
            setQuery(v);
            setFocusedIdx(-1);
          }}
          placeholder="SEARCH ENTITIES, INSTINCTS, HOOKS..."
          loading={loading}
        />
        <div
          style={{
            marginTop: "var(--snes-space-2)",
            fontFamily: "var(--snes-font-body)",
            fontSize: "var(--snes-text-sm)",
            color: "var(--snes-text-subtle)",
          }}
        >
          {loading
            ? "LOADING INDEX..."
            : query.length > 0
            ? `${totalResults} RESULT${totalResults !== 1 ? "S" : ""} · ↑↓ NAVIGATE · ENTER TO EXPAND`
            : `${allItems.length} ITEMS INDEXED · TYPE TO SEARCH`}
        </div>
      </div>

      {/* Empty state */}
      {query.length >= 2 && totalResults === 0 && !loading && (
        <div
          style={{
            padding: "var(--snes-space-8)",
            textAlign: "center",
            fontFamily: "var(--snes-font-body)",
            fontSize: "var(--snes-text-lg)",
            color: "var(--snes-text-subtle)",
          }}
        >
          --- 0 MATCHES ---
        </div>
      )}

      {/* Results grouped by source */}
      {totalResults > 0 && (
        <div style={{ borderTop: "1px solid var(--snes-border-dim)" }}>
          {(["entity", "instinct", "hook"] as const).map((source) => {
            const items = grouped[source];
            if (!items.length) return null;

            return (
              <div key={source}>
                {/* Group header */}
                <div
                  style={{
                    padding: "var(--snes-space-2) var(--snes-space-4)",
                    background: "#0a0930",
                    borderBottom: "1px solid var(--snes-border-dim)",
                    fontFamily: "var(--font-snes-heading, 'Press Start 2P'), monospace",
                    fontSize: "7px",
                    color: "var(--snes-text-muted)",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{SOURCE_LABELS[source]}</span>
                  <span style={{ color: "var(--snes-gold)" }}>{items.length}</span>
                </div>

                {/* Result rows */}
                {items.map((item) => {
                  const globalIdx = results.indexOf(item);
                  const isFocused = globalIdx === focusedIdx;
                  const isExpanded = expandedId === item.id;

                  return (
                    <div
                      key={item.id}
                      style={{
                        borderBottom: "1px solid var(--snes-border-dim)",
                        background: isFocused ? "var(--snes-surface-active)" : "transparent",
                      }}
                    >
                      <button
                        onClick={() => {
                          setFocusedIdx(globalIdx);
                          setExpandedId(isExpanded ? null : item.id);
                        }}
                        style={{
                          width: "100%",
                          background: "none",
                          border: "none",
                          padding: "var(--snes-space-3) var(--snes-space-4)",
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "var(--snes-space-3)",
                        }}
                        className="search-result-row"
                      >
                        {isFocused && (
                          <span style={{ color: "var(--snes-gold)", flexShrink: 0 }}>▶</span>
                        )}
                        <SNESBadge entityType={item.badge} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontFamily: "var(--snes-font-body)",
                              fontSize: "var(--snes-text-base)",
                              color: isFocused ? "var(--snes-gold)" : "var(--snes-text)",
                              marginBottom: "2px",
                            }}
                          >
                            {item.title}
                          </div>
                          <div
                            style={{
                              fontFamily: "var(--snes-font-body)",
                              fontSize: "var(--snes-text-sm)",
                              color: "var(--snes-text-subtle)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: isExpanded ? "normal" : "nowrap",
                            }}
                          >
                            {item.snippet}
                          </div>
                        </div>
                        <span
                          style={{
                            fontFamily: "var(--snes-font-body)",
                            fontSize: "var(--snes-text-sm)",
                            color: "var(--snes-text-subtle)",
                            flexShrink: 0,
                          }}
                        >
                          {item.subtitle}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .search-result-row:hover {
          background: var(--snes-surface-hover) !important;
        }
      `}</style>
    </div>
  );
}
