"use client";

import { useState } from "react";
import vectorMemories from "@/data/dashboard/vector-memories.json";
import memoryIndex from "@/data/dashboard/memory-index.json";
import { SNESPanel } from "../_components/snes-panel";
import { SNESStatCard } from "../_components/snes-stat-card";
import { SNESProgressBar } from "../_components/snes-progress-bar";
import { SNESBadge } from "../_components/snes-badge";

interface MemoryEntry {
  hash: string;
  date: string;
  tags: string[];
  content: string;
}

interface MemoryData {
  totalCount: number;
  recentTags: string[];
  byType: Record<string, number>;
  entries?: MemoryEntry[];
}

interface MemoryIndexEntry {
  project: string;
  lineCount: number;
  keyTopics: string[];
}

const TYPE_COLORS: Record<string, "hp" | "mp" | "xp" | "fire" | "generic"> = {
  note: "hp",
  decision: "mp",
  gotcha: "xp",
  convention: "generic",
  workaround: "fire",
  log: "hp",
};

export default function MemoryPage() {
  const data = vectorMemories as MemoryData;
  const index = memoryIndex as MemoryIndexEntry[];
  const entries = data.entries ?? [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [expandedHash, setExpandedHash] = useState<string | null>(null);

  const maxTypeCount = Math.max(...Object.values(data.byType));
  const typeEntries = Object.entries(data.byType).sort((a, b) => b[1] - a[1]);

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      !searchTerm ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = !selectedTag || entry.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(entries.flatMap((e) => e.tags))).sort();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--snes-space-4)" }}>
      {/* Page header */}
      <div>
        <h1
          style={{
            fontFamily: "var(--snes-font-heading)",
            fontSize: "var(--snes-text-h1)",
            color: "var(--snes-gold)",
            marginBottom: "var(--snes-space-2)",
          }}
        >
          ♦ MEMORY
        </h1>
        <p style={{ color: "var(--snes-text-muted)", fontSize: "var(--snes-text-base)" }}>
          VECTOR MEMORY SYSTEM · {data.totalCount} STORED MEMORIES
        </p>
      </div>

      {/* Stats bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "var(--snes-space-3)",
        }}
      >
        <SNESStatCard value={data.totalCount} label="TOTAL MEMORIES" type="mp" />
        <SNESStatCard value={entries.length} label="BROWSABLE" type="xp" />
        <SNESStatCard value={allTags.length} label="UNIQUE TAGS" type="hp" />
        <SNESStatCard value={index.length} label="PROJECTS" type="generic" />
      </div>

      {/* Search + filter */}
      <SNESPanel title="BROWSE MEMORIES" subtitle={`${filteredEntries.length} OF ${entries.length} SHOWN`}>
        <div style={{ padding: "var(--snes-space-4)" }}>
          {/* Search bar */}
          <div style={{ display: "flex", gap: "var(--snes-space-2)", marginBottom: "var(--snes-space-3)", flexWrap: "wrap" }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SEARCH MEMORIES..."
              style={{
                flex: 1,
                minWidth: "200px",
                padding: "var(--snes-space-2) var(--snes-space-3)",
                background: "var(--snes-bg)",
                border: "2px solid var(--snes-border-outer)",
                color: "var(--snes-text)",
                fontFamily: "var(--snes-font-body)",
                fontSize: "var(--snes-text-base)",
                outline: "none",
              }}
            />
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                style={{
                  padding: "var(--snes-space-2) var(--snes-space-3)",
                  background: "var(--snes-surface-hover)",
                  border: "2px solid var(--snes-mp)",
                  color: "var(--snes-mp)",
                  fontFamily: "var(--snes-font-body)",
                  fontSize: "var(--snes-text-sm)",
                  cursor: "pointer",
                }}
              >
                TAG: {selectedTag} ✕
              </button>
            )}
          </div>

          {/* Tag cloud (clickable filter) */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "var(--snes-space-4)" }}>
            {data.recentTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                style={{
                  padding: "2px 8px",
                  border: `1px solid ${selectedTag === tag ? "var(--snes-gold)" : "var(--snes-border-outer)"}`,
                  background: selectedTag === tag ? "var(--snes-surface-hover)" : "var(--snes-bg)",
                  color: selectedTag === tag ? "var(--snes-gold)" : "var(--snes-mp)",
                  fontFamily: "var(--snes-font-code)",
                  fontSize: "var(--snes-text-sm)",
                  cursor: "pointer",
                }}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Memory entries list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--snes-space-2)" }}>
            {filteredEntries.length === 0 && (
              <p style={{
                textAlign: "center",
                color: "var(--snes-text-subtle)",
                fontFamily: "var(--snes-font-body)",
                fontSize: "var(--snes-text-lg)",
                padding: "var(--snes-space-8)",
              }}>
                --- 0 MATCHES ---
              </p>
            )}
            {filteredEntries.map((entry, i) => {
              const isExpanded = expandedHash === entry.hash;
              return (
                <div
                  key={entry.hash}
                  onClick={() => setExpandedHash(isExpanded ? null : entry.hash)}
                  style={{
                    padding: "var(--snes-space-3)",
                    background: i % 2 === 0 ? "var(--snes-bg)" : "var(--snes-surface)",
                    border: isExpanded ? "2px solid var(--snes-gold)" : "1px solid var(--snes-border-dim)",
                    cursor: "pointer",
                    transition: "border-color 0.1s",
                  }}
                >
                  {/* Header row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--snes-space-2)", marginBottom: "var(--snes-space-1)", flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "var(--snes-font-body)",
                      fontSize: "var(--snes-text-sm)",
                      color: "var(--snes-mp)",
                    }}>
                      #{entry.hash}
                    </span>
                    <span style={{
                      fontFamily: "var(--snes-font-body)",
                      fontSize: "var(--snes-text-sm)",
                      color: "var(--snes-text-muted)",
                    }}>
                      {entry.date}
                    </span>
                    <span style={{
                      fontFamily: "var(--snes-font-heading)",
                      fontSize: "var(--snes-text-xs)",
                      color: "var(--snes-gold)",
                      marginLeft: "auto",
                    }}>
                      {isExpanded ? "▼" : "▶"}
                    </span>
                  </div>

                  {/* Content preview or full */}
                  <p style={{
                    fontFamily: "var(--snes-font-body)",
                    fontSize: "var(--snes-text-base)",
                    color: "var(--snes-text)",
                    lineHeight: 1.5,
                    overflow: isExpanded ? "visible" : "hidden",
                    display: isExpanded ? "block" : "-webkit-box",
                    WebkitLineClamp: isExpanded ? undefined : 2,
                    WebkitBoxOrient: isExpanded ? undefined : "vertical",
                  }}>
                    {entry.content}
                  </p>

                  {/* Tags */}
                  {isExpanded && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "var(--snes-space-2)" }}>
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          onClick={(e) => { e.stopPropagation(); setSelectedTag(tag); }}
                          style={{
                            padding: "1px 6px",
                            border: "1px solid var(--snes-border-outer)",
                            background: "var(--snes-surface-hover)",
                            color: "var(--snes-mp)",
                            fontFamily: "var(--snes-font-code)",
                            fontSize: "var(--snes-text-sm)",
                            cursor: "pointer",
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </SNESPanel>

      {/* Type distribution */}
      <SNESPanel title="TYPE DISTRIBUTION" subtitle="BY CATEGORY">
        <div style={{ padding: "var(--snes-space-4)", display: "flex", flexDirection: "column", gap: "var(--snes-space-3)" }}>
          {typeEntries.map(([type, count]) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: "var(--snes-space-3)" }}>
              <div style={{ width: "120px", flexShrink: 0 }}>
                <span style={{
                  fontFamily: "var(--snes-font-body)",
                  fontSize: "var(--snes-text-base)",
                  color: "var(--snes-text)",
                  textTransform: "uppercase",
                }}>
                  {type}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <SNESProgressBar value={count} max={maxTypeCount} type={TYPE_COLORS[type] ?? "generic"} compact />
              </div>
              <div style={{
                width: "48px",
                textAlign: "right",
                fontFamily: "var(--snes-font-body)",
                fontSize: "var(--snes-text-base)",
                color: "var(--snes-gold)",
                flexShrink: 0,
              }}>
                {count}
              </div>
            </div>
          ))}
        </div>
      </SNESPanel>

      {/* Project memory index */}
      <SNESPanel title="AUTO MEMORY INDEX" subtitle="MEMORY.MD FILES">
        {index.map((entry) => (
          <div
            key={entry.project}
            style={{
              padding: "var(--snes-space-4)",
              borderBottom: "1px solid var(--snes-border-dim)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--snes-space-3)", marginBottom: "var(--snes-space-2)" }}>
              <SNESBadge entityType="Project" label={entry.project} />
              <span style={{
                fontFamily: "var(--snes-font-body)",
                fontSize: "var(--snes-text-sm)",
                color: entry.lineCount > 200 ? "var(--snes-fire)" : "var(--snes-text-muted)",
              }}>
                {entry.lineCount} lines
                {entry.lineCount > 200 && " ⚠ OVER LIMIT"}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--snes-space-1)" }}>
              {entry.keyTopics.map((topic) => (
                <span
                  key={topic}
                  style={{
                    padding: "2px 8px",
                    background: "var(--snes-surface-hover)",
                    color: "var(--snes-text-muted)",
                    fontFamily: "var(--snes-font-body)",
                    fontSize: "var(--snes-text-sm)",
                    border: "1px solid var(--snes-border-dim)",
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        ))}
      </SNESPanel>
    </div>
  );
}
