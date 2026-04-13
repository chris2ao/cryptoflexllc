import vectorMemories from "@/data/dashboard/vector-memories.json";
import memoryIndex from "@/data/dashboard/memory-index.json";
import { SNESPanel } from "../_components/snes-panel";
import { SNESStatCard } from "../_components/snes-stat-card";
import { SNESProgressBar } from "../_components/snes-progress-bar";
import { SNESBadge } from "../_components/snes-badge";

interface MemoryData {
  totalCount: number;
  recentTags: string[];
  byType: Record<string, number>;
}

interface MemoryIndexEntry {
  project: string;
  lineCount: number;
  keyTopics: string[];
}

const TYPE_COLORS: Record<string, string> = {
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

  const maxTypeCount = Math.max(...Object.values(data.byType));

  const typeEntries = Object.entries(data.byType).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--snes-space-4)" }}>
      {/* Page header */}
      <div>
        <h1
          style={{
            fontFamily: "var(--snes-font-heading)",
            fontSize: "var(--snes-text-h2)",
            color: "var(--snes-gold)",
            marginBottom: "var(--snes-space-1)",
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
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "var(--snes-space-3)",
        }}
      >
        <SNESStatCard value={data.totalCount} label="TOTAL MEMORIES" type="mp" />
        <SNESStatCard value={Object.keys(data.byType).length} label="MEMORY TYPES" type="xp" />
        <SNESStatCard value={data.recentTags.length} label="TAG VOCAB" type="hp" />
        <SNESStatCard value={index.length} label="PROJECTS" type="generic" />
      </div>

      {/* Type distribution */}
      <SNESPanel title="TYPE DISTRIBUTION" subtitle="BY CATEGORY">
        <div
          style={{
            padding: "var(--snes-space-4)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--snes-space-3)",
          }}
        >
          {typeEntries.map(([type, count]) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: "var(--snes-space-3)" }}>
              <div style={{ width: "100px", flexShrink: 0 }}>
                <span
                  style={{
                    fontFamily: "var(--snes-font-body)",
                    fontSize: "var(--snes-text-base)",
                    color: "var(--snes-text)",
                    textTransform: "uppercase",
                  }}
                >
                  {type}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <SNESProgressBar
                  value={count}
                  max={maxTypeCount}
                  type={(TYPE_COLORS[type] as "hp" | "mp" | "xp" | "fire" | "generic") ?? "generic"}
                  compact
                />
              </div>
              <div
                style={{
                  width: "48px",
                  textAlign: "right",
                  fontFamily: "var(--snes-font-body)",
                  fontSize: "var(--snes-text-base)",
                  color: "var(--snes-gold)",
                  flexShrink: 0,
                }}
              >
                {count}
              </div>
            </div>
          ))}
        </div>
      </SNESPanel>

      {/* Tag cloud */}
      <SNESPanel title="RECENT TAGS" subtitle="VOCABULARY">
        <div
          style={{
            padding: "var(--snes-space-4)",
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--snes-space-2)",
          }}
        >
          {data.recentTags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: "2px 10px",
                border: "1px solid var(--snes-border-outer)",
                background: "var(--snes-bg)",
                color: "var(--snes-mp)",
                fontFamily: "var(--snes-font-code)",
                fontSize: "var(--snes-text-sm)",
              }}
            >
              #{tag}
            </span>
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--snes-space-3)",
                marginBottom: "var(--snes-space-2)",
              }}
            >
              <SNESBadge entityType="Project" label={entry.project} />
              <span
                style={{
                  fontFamily: "var(--snes-font-body)",
                  fontSize: "var(--snes-text-sm)",
                  color: entry.lineCount > 200 ? "var(--snes-fire)" : "var(--snes-text-muted)",
                }}
              >
                {entry.lineCount} lines
                {entry.lineCount > 200 && " ⚠ OVER LIMIT"}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--snes-space-1)" }}>
              {entry.keyTopics.map((topic) => (
                <span
                  key={topic}
                  style={{
                    padding: "1px 6px",
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
