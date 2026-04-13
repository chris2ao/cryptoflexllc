import hooksData from "@/data/dashboard/hooks.json";
import { SNESPanel } from "../_components/snes-panel";
import { SNESStatCard } from "../_components/snes-stat-card";
import { HookPipeline } from "../_components/hook-pipeline";

interface HookEntry {
  matcher: string;
  script: string;
  description: string;
  timeout?: number;
}

type HooksMap = Record<string, HookEntry[]>;

export default function HooksPage() {
  const hooks = hooksData as HooksMap;

  const hookTypeOrder: string[] = ["PreToolUse", "UserPromptSubmit", "PostToolUse", "Stop", "SessionEnd"];
  const orderedHooks = hookTypeOrder
    .filter((k) => k in hooks)
    .map((k) => ({ type: k, entries: hooks[k] ?? [] }));

  const totalHooks = Object.values(hooks).reduce((sum, arr) => sum + arr.length, 0);
  const hookTypeCount = Object.keys(hooks).length;

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
          ⊕ HOOKS
        </h1>
        <p style={{ color: "var(--snes-text-muted)", fontSize: "var(--snes-text-base)" }}>
          EVENT PIPELINE · LIFECYCLE AUTOMATION
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "var(--snes-space-3)",
        }}
      >
        <SNESStatCard value={totalHooks} label="TOTAL HOOKS" type="hp" />
        <SNESStatCard value={hookTypeCount} label="HOOK TYPES" type="mp" />
      </div>

      {/* Pipeline view */}
      <SNESPanel title="HOOK PIPELINE" subtitle="EXECUTION FLOW">
        <HookPipeline hookGroups={orderedHooks} />
      </SNESPanel>
    </div>
  );
}
