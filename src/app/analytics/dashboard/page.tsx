import Link from "next/link";
import metadata from "@/data/dashboard/metadata.json";
import kgEntities from "@/data/dashboard/kg-entities.json";
import hooksData from "@/data/dashboard/hooks.json";
import sessionsData from "@/data/dashboard/sessions.json";
import { SNESPanel } from "./_components/snes-panel";
import { SNESStatCard } from "./_components/snes-stat-card";
import { SNESProgressBar } from "./_components/snes-progress-bar";

// Count hook scripts across all hook types
function countHooks(hooks: Record<string, unknown[]>): number {
  return Object.values(hooks).reduce((sum, arr) => sum + arr.length, 0);
}

// Count entities by type
function countByType(entities: { name: string; type: string }[]): Record<string, number> {
  return entities.reduce<Record<string, number>>((acc, e) => {
    acc[e.type] = (acc[e.type] ?? 0) + 1;
    return acc;
  }, {});
}

interface TerritoryRegion {
  id: string;
  label: string;
  value: number;
  href: string;
  icon: string;
  color: string;
  col: number;
  row: number;
}

export default function DashboardOverviewPage() {
  const entityCounts = countByType(kgEntities);
  const hookCount = countHooks(hooksData as Record<string, unknown[]>);
  const sessionCount = sessionsData.length;

  const territories: TerritoryRegion[] = [
    {
      id: "graph",
      label: "GRAPH",
      value: metadata.entityCount,
      href: "/analytics/dashboard/graph",
      icon: "★",
      color: "var(--snes-entity-agent)",
      col: 1,
      row: 1,
    },
    {
      id: "memory",
      label: "MEMORY",
      value: metadata.memoryCount,
      href: "/analytics/dashboard/memory",
      icon: "♦",
      color: "var(--snes-entity-skill)",
      col: 2,
      row: 1,
    },
    {
      id: "instincts",
      label: "INSTINCTS",
      value: metadata.instinctCount,
      href: "/analytics/dashboard/instincts",
      icon: "♥",
      color: "var(--snes-entity-hook)",
      col: 3,
      row: 1,
    },
    {
      id: "hooks",
      label: "HOOKS",
      value: hookCount,
      href: "/analytics/dashboard/hooks",
      icon: "⊕",
      color: "var(--snes-entity-mcp)",
      col: 1,
      row: 2,
    },
    {
      id: "metrics",
      label: "METRICS",
      value: sessionCount,
      href: "/analytics/dashboard/metrics",
      icon: "▲",
      color: "var(--snes-entity-command)",
      col: 2,
      row: 2,
    },
    {
      id: "search",
      label: "SEARCH",
      value: metadata.entityCount + metadata.instinctCount,
      href: "/analytics/dashboard/search",
      icon: "?",
      color: "var(--snes-entity-script)",
      col: 3,
      row: 2,
    },
  ];

  const agentCount = entityCounts["Agent"] ?? 0;
  const skillCount = entityCounts["Skill"] ?? 0;
  const scriptCount = entityCounts["Script"] ?? 0;
  const commandCount = entityCounts["Command"] ?? 0;

  const lastSync = new Date(metadata.lastUpdated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--snes-space-4)" }}>
      {/* Page title */}
      <div style={{ marginBottom: "var(--snes-space-2)" }}>
        <h1
          style={{
            fontFamily: "var(--snes-font-heading)",
            fontSize: "var(--snes-text-h2)",
            color: "var(--snes-gold)",
            marginBottom: "var(--snes-space-1)",
          }}
        >
          ▶ WORLD MAP
        </h1>
        <p style={{ color: "var(--snes-text-muted)", fontSize: "var(--snes-text-base)" }}>
          SELECT A REGION TO EXPLORE
        </p>
      </div>

      {/* World Map Grid */}
      <SNESPanel title="WORLD MAP" subtitle="CLAUDE ENVIRONMENT v1">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "var(--snes-space-3)",
            padding: "var(--snes-space-4)",
          }}
        >
          {territories.map((region) => (
            <Link
              key={region.id}
              href={region.href}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "var(--snes-bg)",
                  border: "2px solid var(--snes-border-outer)",
                  padding: "var(--snes-space-4)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "var(--snes-space-2)",
                  cursor: "pointer",
                  transition: "background var(--snes-anim-fast) linear, border-color var(--snes-anim-fast) linear",
                  boxShadow: "var(--snes-shadow-hard)",
                  minHeight: "120px",
                  justifyContent: "center",
                }}
                className="snes-territory-card"
              >
                <span
                  style={{
                    fontSize: "32px",
                    color: region.color,
                    lineHeight: 1,
                  }}
                >
                  {region.icon}
                </span>
                <span
                  style={{
                    fontFamily: "var(--snes-font-heading)",
                    fontSize: "var(--snes-text-xs)",
                    color: "var(--snes-text-muted)",
                    textAlign: "center",
                  }}
                >
                  {region.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--snes-font-body)",
                    fontSize: "var(--snes-text-xl)",
                    color: region.color,
                    lineHeight: 1,
                  }}
                >
                  {region.value}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </SNESPanel>

      {/* Bottom row: Party Status + Last Sync */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--snes-space-4)" }}>
        {/* Party Status */}
        <SNESPanel title="PARTY STATUS" subtitle="SYSTEM HEALTH">
          <div
            style={{
              padding: "var(--snes-space-4)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--snes-space-3)",
            }}
          >
            <SNESProgressBar
              value={agentCount}
              max={30}
              type="hp"
              label={`AGENTS: ${agentCount}`}
            />
            <SNESProgressBar
              value={skillCount}
              max={20}
              type="mp"
              label={`SKILLS: ${skillCount}`}
            />
            <SNESProgressBar
              value={metadata.instinctCount}
              max={100}
              type="xp"
              label={`INSTINCTS: ${metadata.instinctCount}`}
            />
            <SNESProgressBar
              value={metadata.memoryCount}
              max={500}
              type="hp"
              label={`MEMORIES: ${metadata.memoryCount}`}
            />
          </div>
        </SNESPanel>

        {/* Quick Stats + Last Sync */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--snes-space-4)" }}>
          <SNESPanel title="QUICK STATS">
            <div
              style={{
                padding: "var(--snes-space-4)",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "var(--snes-space-3)",
              }}
            >
              <SNESStatCard value={agentCount} label="AGENTS" type="hp" />
              <SNESStatCard value={skillCount} label="SKILLS" type="mp" />
              <SNESStatCard value={scriptCount} label="SCRIPTS" type="xp" />
              <SNESStatCard value={commandCount} label="COMMANDS" type="generic" />
            </div>
          </SNESPanel>

          <SNESPanel title="LAST SYNC" subtitle="EXPORT TIMESTAMP">
            <div
              style={{
                padding: "var(--snes-space-4)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--snes-space-2)",
              }}
            >
              <div style={{ color: "var(--snes-gold)", fontSize: "var(--snes-text-lg)" }}>
                {lastSync}
              </div>
              <div
                style={{
                  color: "var(--snes-text-muted)",
                  fontSize: "var(--snes-text-sm)",
                  fontFamily: "var(--snes-font-code)",
                }}
              >
                v{metadata.exportVersion} · {metadata.entityCount} entities · {metadata.relationCount} relations
              </div>
              <div style={{ color: "var(--snes-text-subtle)", fontSize: "var(--snes-text-sm)" }}>
                {metadata.observationCount.toLocaleString()} total observations
              </div>
            </div>
          </SNESPanel>
        </div>
      </div>

      <style>{`
        .snes-territory-card:hover {
          background: var(--snes-surface-hover) !important;
          border-color: var(--snes-gold) !important;
        }
        @media (max-width: 640px) {
          .snes-world-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
