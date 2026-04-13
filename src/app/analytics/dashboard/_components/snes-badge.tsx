type EntityType =
  | "Agent"
  | "Skill"
  | "Hook"
  | "MCP Server"
  | "Command"
  | "Script"
  | "Rule Set"
  | "Project"
  | "Infrastructure"
  | "Account"
  | string;

interface SNESBadgeProps {
  entityType: EntityType;
  label?: string;
}

const ENTITY_COLOR: Record<string, string> = {
  Agent: "var(--snes-entity-agent)",
  Skill: "var(--snes-entity-skill)",
  Hook: "var(--snes-entity-hook)",
  "MCP Server": "var(--snes-entity-mcp)",
  Command: "var(--snes-entity-command)",
  Script: "var(--snes-entity-script)",
  "Rule Set": "var(--snes-entity-ruleset)",
  Project: "var(--snes-entity-project)",
  Infrastructure: "var(--snes-entity-infra)",
  Account: "var(--snes-entity-external)",
};

function getColor(entityType: EntityType): string {
  return ENTITY_COLOR[entityType] ?? "var(--snes-entity-external)";
}

export function SNESBadge({ entityType, label }: SNESBadgeProps) {
  const color = getColor(entityType);
  const displayLabel = label ?? entityType.toUpperCase();

  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        border: `1px solid ${color}`,
        background: `color-mix(in srgb, ${color} 20%, transparent)`,
        color,
        fontFamily: "var(--snes-font-body)",
        fontSize: "14px",
        lineHeight: "1.4",
        whiteSpace: "nowrap",
      }}
    >
      {displayLabel}
    </span>
  );
}
