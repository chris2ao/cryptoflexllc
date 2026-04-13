import { SNESPanel } from "../_components/snes-panel";
import { DashboardSearch } from "../_components/dashboard-search";

export default function SearchPage() {
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
          ? SEARCH
        </h1>
        <p style={{ color: "var(--snes-text-muted)", fontSize: "var(--snes-text-base)" }}>
          SEARCH ACROSS ENTITIES, INSTINCTS, AND HOOKS
        </p>
      </div>

      <SNESPanel title="GLOBAL SEARCH">
        <DashboardSearch />
      </SNESPanel>
    </div>
  );
}
