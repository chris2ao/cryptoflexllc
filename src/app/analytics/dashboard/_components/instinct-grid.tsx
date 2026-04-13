"use client";

import { useState } from "react";
import { SNESBadge } from "./snes-badge";
import { SNESProgressBar } from "./snes-progress-bar";

interface Instinct {
  id: string;
  trigger: string;
  confidence: number;
  domain: string;
  created: string;
}

type SortKey = "confidence" | "date" | "domain";

interface InstinctGridProps {
  instincts: Instinct[];
  domains: string[];
}

export function InstinctGrid({ instincts, domains }: InstinctGridProps) {
  const [activeDomain, setActiveDomain] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<SortKey>("confidence");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = instincts
    .filter((i) => activeDomain === "ALL" || i.domain === activeDomain)
    .slice()
    .sort((a, b) => {
      if (sortBy === "confidence") return b.confidence - a.confidence;
      if (sortBy === "date") return b.created.localeCompare(a.created);
      return a.domain.localeCompare(b.domain);
    });

  return (
    <div>
      {/* Filter/sort toolbar */}
      <div
        style={{
          padding: "var(--snes-space-3) var(--snes-space-4)",
          borderBottom: "1px solid var(--snes-border-dim)",
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--snes-space-2)",
          alignItems: "center",
        }}
      >
        {/* Domain filter */}
        <div style={{ display: "flex", gap: "var(--snes-space-1)", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveDomain("ALL")}
            style={domainBtnStyle(activeDomain === "ALL")}
          >
            ALL
          </button>
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDomain(d)}
              style={domainBtnStyle(activeDomain === d)}
            >
              {d.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Sort buttons */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: "var(--snes-space-1)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-snes-heading, 'Press Start 2P'), monospace",
              fontSize: "7px",
              color: "var(--snes-text-subtle)",
              alignSelf: "center",
            }}
          >
            SORT:
          </span>
          {(["confidence", "date", "domain"] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              style={sortBtnStyle(sortBy === key)}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div
        style={{
          padding: "var(--snes-space-2) var(--snes-space-4)",
          fontFamily: "var(--snes-font-body)",
          fontSize: "var(--snes-text-sm)",
          color: "var(--snes-text-subtle)",
          borderBottom: "1px solid var(--snes-border-dim)",
        }}
      >
        {filtered.length} / {instincts.length} INSTINCTS
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          style={{
            padding: "var(--snes-space-8)",
            textAlign: "center",
            color: "var(--snes-text-subtle)",
            fontFamily: "var(--snes-font-body)",
            fontSize: "var(--snes-text-lg)",
          }}
        >
          --- 0 MATCHES ---
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "var(--snes-space-2)",
            padding: "var(--snes-space-4)",
          }}
        >
          {filtered.map((instinct) => (
            <InstinctCard
              key={instinct.id}
              instinct={instinct}
              isExpanded={expandedId === instinct.id}
              onToggle={() =>
                setExpandedId(expandedId === instinct.id ? null : instinct.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface InstinctCardProps {
  instinct: Instinct;
  isExpanded: boolean;
  onToggle: () => void;
}

function InstinctCard({ instinct, isExpanded, onToggle }: InstinctCardProps) {
  const confPct = Math.round(instinct.confidence * 100);

  return (
    <div
      style={{
        background: "var(--snes-bg)",
        border: `2px solid ${isExpanded ? "var(--snes-gold)" : "var(--snes-border-outer)"}`,
        boxShadow: "var(--snes-shadow-hard-sm)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--snes-space-2)",
      }}
    >
      {/* Card header */}
      <button
        onClick={onToggle}
        style={{
          background: "none",
          border: "none",
          padding: "var(--snes-space-3)",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          gap: "var(--snes-space-2)",
          width: "100%",
        }}
      >
        {/* Domain badge + date */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--snes-space-2)",
          }}
        >
          <SNESBadge entityType="Skill" label={instinct.domain.toUpperCase()} />
          <span
            style={{
              fontFamily: "var(--snes-font-code)",
              fontSize: "var(--snes-text-xs)",
              color: "var(--snes-text-subtle)",
            }}
          >
            {instinct.created}
          </span>
        </div>

        {/* Instinct name (ID formatted) */}
        <div
          style={{
            fontFamily: "var(--snes-font-heading)",
            fontSize: "7px",
            color: isExpanded ? "var(--snes-gold)" : "var(--snes-text)",
            lineHeight: 1.5,
          }}
        >
          {instinct.id.replace(/-/g, " ")}
        </div>

        {/* Confidence bar */}
        <SNESProgressBar
          value={confPct}
          max={100}
          type="xp"
          label={`CONF: ${confPct}%`}
          compact
        />

        <div
          style={{
            fontFamily: "var(--snes-font-body)",
            fontSize: "var(--snes-text-xs)",
            color: "var(--snes-text-subtle)",
            textAlign: "right",
          }}
        >
          {isExpanded ? "▲ COLLAPSE" : "▼ EXPAND"}
        </div>
      </button>

      {/* Expanded trigger text */}
      {isExpanded && (
        <div
          style={{
            padding: "var(--snes-space-3)",
            borderTop: "1px solid var(--snes-border-dim)",
            background: "var(--snes-surface)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-snes-heading, 'Press Start 2P'), monospace",
              fontSize: "7px",
              color: "var(--snes-text-muted)",
              marginBottom: "var(--snes-space-2)",
            }}
          >
            TRIGGER
          </div>
          <div
            style={{
              fontFamily: "var(--snes-font-body)",
              fontSize: "var(--snes-text-base)",
              color: "var(--snes-text)",
              lineHeight: 1.5,
            }}
          >
            {instinct.trigger}
          </div>
        </div>
      )}
    </div>
  );
}

function domainBtnStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? "var(--snes-xp-bg)" : "transparent",
    border: `1px solid ${active ? "var(--snes-xp)" : "var(--snes-border-outer)"}`,
    color: active ? "var(--snes-xp)" : "var(--snes-text-muted)",
    fontFamily: "var(--font-snes-heading, 'Press Start 2P'), monospace",
    fontSize: "7px",
    padding: "4px 8px",
    cursor: "pointer",
    borderRadius: 0,
    whiteSpace: "nowrap" as const,
  };
}

function sortBtnStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? "var(--snes-surface-active)" : "transparent",
    border: `1px solid ${active ? "var(--snes-gold)" : "var(--snes-border-dim)"}`,
    color: active ? "var(--snes-gold)" : "var(--snes-text-subtle)",
    fontFamily: "var(--font-snes-heading, 'Press Start 2P'), monospace",
    fontSize: "7px",
    padding: "3px 6px",
    cursor: "pointer",
    borderRadius: 0,
  };
}
