"use client";

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";

export type KGNodeData = {
  label: string;
  entityType: string;
  observationCount: number;
  connectionCount: number;
};

export type KGNodeType = Node<KGNodeData, "kg">;

const ENTITY_COLORS: Record<string, string> = {
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
  External: "var(--snes-entity-external)",
};

const ENTITY_ICONS: Record<string, string> = {
  Agent: "⚔",
  Skill: "✦",
  Hook: "⊕",
  "MCP Server": "◆",
  Command: "☰",
  Script: "◈",
  "Rule Set": "▣",
  Project: "⌂",
  Infrastructure: "▲",
  Account: "☺",
  External: "☺",
};

const HANDLE_STYLE: React.CSSProperties = {
  width: "8px",
  height: "8px",
  borderRadius: 0,
  background: "var(--snes-border-outer)",
  border: "1px solid var(--snes-border-inner)",
};

export function KGNode({ data, selected }: NodeProps<KGNodeType>) {
  const typeColor = ENTITY_COLORS[data.entityType] ?? "var(--snes-entity-external)";
  const icon = ENTITY_ICONS[data.entityType] ?? "☺";

  return (
    <div
      style={{
        width: "160px",
        minHeight: "80px",
        background: "var(--snes-surface)",
        border: `3px solid ${selected ? "var(--snes-gold)" : typeColor}`,
        boxShadow: selected
          ? `0 0 0 1px var(--snes-gold), var(--snes-shadow-hard-sm)`
          : "var(--snes-shadow-hard-sm)",
        fontFamily: "var(--snes-font-body)",
        opacity: 1,
        transition: "border-color 100ms linear, box-shadow 100ms linear",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={HANDLE_STYLE}
        isConnectable={false}
      />

      {/* Type strip */}
      <div
        style={{
          height: "24px",
          background: typeColor,
          display: "flex",
          alignItems: "center",
          padding: "0 8px",
          gap: "6px",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: "#000",
            fontSize: "12px",
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          {icon}
        </span>
        <span
          style={{
            color: "#000",
            fontSize: "10px",
            fontFamily: "var(--snes-font-heading, 'Press Start 2P'), monospace",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flex: 1,
          }}
        >
          {data.entityType.toUpperCase().slice(0, 7)}
        </span>
      </div>

      {/* Name */}
      <div
        style={{
          padding: "8px",
          fontSize: "14px",
          color: selected ? "var(--snes-gold)" : "var(--snes-text)",
          lineHeight: 1.3,
          wordBreak: "break-word",
          flex: 1,
        }}
      >
        {data.label}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "3px 8px",
          fontSize: "11px",
          color: "var(--snes-text-subtle)",
          borderTop: "1px solid var(--snes-border-dim)",
          flexShrink: 0,
        }}
      >
        {data.connectionCount} links
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={HANDLE_STYLE}
        isConnectable={false}
      />
    </div>
  );
}
