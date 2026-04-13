import instinctsData from "@/data/dashboard/instincts.json";
import { SNESPanel } from "../_components/snes-panel";
import { SNESStatCard } from "../_components/snes-stat-card";
import { InstinctGrid } from "../_components/instinct-grid";

interface Instinct {
  id: string;
  trigger: string;
  confidence: number;
  domain: string;
  created: string;
}

export default function InstinctsPage() {
  const instincts = instinctsData as Instinct[];

  const avgConfidence = instincts.length > 0
    ? Math.round((instincts.reduce((sum, i) => sum + i.confidence, 0) / instincts.length) * 100)
    : 0;

  const domains = [...new Set(instincts.map((i) => i.domain))].sort();

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
          ♥ INSTINCTS
        </h1>
        <p style={{ color: "var(--snes-text-muted)", fontSize: "var(--snes-text-base)" }}>
          BEHAVIORAL PATTERNS · HOMUNCULUS EVOLUTION LAYER
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
        <SNESStatCard value={instincts.length} label="TOTAL" type="xp" />
        <SNESStatCard value={`${avgConfidence}%`} label="AVG CONFIDENCE" type="hp" />
        <SNESStatCard value={domains.length} label="DOMAINS" type="mp" />
        <SNESStatCard
          value={instincts.filter((i) => i.confidence >= 0.7).length}
          label="HIGH CONF"
          type="generic"
        />
      </div>

      {/* Client grid with filtering */}
      <SNESPanel title="INSTINCT GRID" subtitle="BEHAVIORAL PATTERNS">
        <InstinctGrid instincts={instincts} domains={domains} />
      </SNESPanel>
    </div>
  );
}
