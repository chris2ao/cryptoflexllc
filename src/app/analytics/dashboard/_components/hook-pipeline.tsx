import { SNESPanel } from "./snes-panel";

interface HookEntry {
  matcher: string;
  script: string;
  description: string;
  timeout?: number;
}

interface HookGroup {
  type: string;
  entries: HookEntry[];
}

interface HookPipelineProps {
  hookGroups: HookGroup[];
}

const HOOK_TYPE_COLORS: Record<string, string> = {
  PreToolUse: "var(--snes-hp)",
  UserPromptSubmit: "var(--snes-mp)",
  PostToolUse: "var(--snes-xp)",
  Stop: "var(--snes-gold)",
  SessionEnd: "var(--snes-fire)",
};

const HOOK_TYPE_LABELS: Record<string, string> = {
  PreToolUse: "PRE-TOOL",
  UserPromptSubmit: "PROMPT",
  PostToolUse: "POST-TOOL",
  Stop: "STOP",
  SessionEnd: "SESSION END",
};

const HOOK_TYPE_DESC: Record<string, string> = {
  PreToolUse: "Before tool execution",
  UserPromptSubmit: "On each user prompt",
  PostToolUse: "After tool execution",
  Stop: "When session ends",
  SessionEnd: "Final cleanup",
};

export function HookPipeline({ hookGroups }: HookPipelineProps) {
  return (
    <div style={{ padding: "var(--snes-space-4)" }}>
      {/* Pipeline flow header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--snes-space-2)",
          marginBottom: "var(--snes-space-4)",
          overflowX: "auto",
          paddingBottom: "var(--snes-space-2)",
        }}
      >
        {hookGroups.map((group, idx) => {
          const color = HOOK_TYPE_COLORS[group.type] ?? "var(--snes-text-muted)";
          const label = HOOK_TYPE_LABELS[group.type] ?? group.type;
          return (
            <div key={group.type} style={{ display: "flex", alignItems: "center", gap: "var(--snes-space-2)", flexShrink: 0 }}>
              <div
                style={{
                  padding: "4px 10px",
                  border: `2px solid ${color}`,
                  background: `color-mix(in srgb, ${color} 15%, transparent)`,
                  fontFamily: "var(--font-snes-heading, 'Press Start 2P'), monospace",
                  fontSize: "7px",
                  color,
                  whiteSpace: "nowrap",
                }}
              >
                {label}
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--snes-font-body)",
                    fontSize: "10px",
                    color: "var(--snes-text-muted)",
                    fontWeight: "normal",
                    marginTop: "2px",
                  }}
                >
                  {group.entries.length} hook{group.entries.length !== 1 ? "s" : ""}
                </span>
              </div>
              {idx < hookGroups.length - 1 && (
                <span style={{ color: "var(--snes-text-subtle)", fontSize: "20px" }}>→</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Sections per hook type */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--snes-space-4)" }}>
        {hookGroups.map((group) => {
          const color = HOOK_TYPE_COLORS[group.type] ?? "var(--snes-text-muted)";
          const label = HOOK_TYPE_LABELS[group.type] ?? group.type;
          const desc = HOOK_TYPE_DESC[group.type] ?? "";

          return (
            <div key={group.type}>
              {/* Section header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--snes-space-3)",
                  marginBottom: "var(--snes-space-2)",
                  borderLeft: `4px solid ${color}`,
                  paddingLeft: "var(--snes-space-3)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-snes-heading, 'Press Start 2P'), monospace",
                    fontSize: "8px",
                    color,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--snes-font-body)",
                    fontSize: "var(--snes-text-sm)",
                    color: "var(--snes-text-muted)",
                  }}
                >
                  {desc}
                </span>
              </div>

              {/* Hook cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "var(--snes-space-2)",
                }}
              >
                {group.entries.map((hook, idx) => (
                  <HookCard key={idx} hook={hook} typeColor={color} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface HookCardProps {
  hook: HookEntry;
  typeColor: string;
}

function HookCard({ hook, typeColor }: HookCardProps) {
  return (
    <SNESPanel variant="default">
      <div style={{ padding: "var(--snes-space-3)" }}>
        {/* Script name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--snes-space-2)",
            marginBottom: "var(--snes-space-2)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              background: typeColor,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--snes-font-code)",
              fontSize: "var(--snes-text-sm)",
              color: "var(--snes-gold)",
            }}
          >
            {hook.script}.sh
          </span>
        </div>

        {/* Description */}
        <div
          style={{
            fontFamily: "var(--snes-font-body)",
            fontSize: "var(--snes-text-base)",
            color: "var(--snes-text)",
            marginBottom: "var(--snes-space-2)",
            lineHeight: 1.4,
          }}
        >
          {hook.description}
        </div>

        {/* Matcher + timeout */}
        <div style={{ display: "flex", gap: "var(--snes-space-3)", flexWrap: "wrap" }}>
          {hook.matcher && (
            <div
              style={{
                fontFamily: "var(--snes-font-code)",
                fontSize: "var(--snes-text-xs)",
                color: "var(--snes-mp)",
                background: "var(--snes-mp-bg)",
                padding: "2px 6px",
                border: "1px solid var(--snes-mp)",
              }}
            >
              MATCH: {hook.matcher}
            </div>
          )}
          {hook.timeout && (
            <div
              style={{
                fontFamily: "var(--snes-font-code)",
                fontSize: "var(--snes-text-xs)",
                color: "var(--snes-text-subtle)",
              }}
            >
              {(hook.timeout / 1000).toFixed(0)}s timeout
            </div>
          )}
        </div>
      </div>
    </SNESPanel>
  );
}
