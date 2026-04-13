"use client";

import { SNESBadge } from "../snes-badge";

// TODO: When @xyflow/react is installed, this panel will link to a focused
// subgraph view centered on the selected entity.

interface KGEntity {
  name: string;
  type: string;
  observations: string[];
}

interface KGRelation {
  from: string;
  to: string;
  type: string;
}

interface EntityDetailPanelProps {
  entity: KGEntity;
  relations: KGRelation[];
  onClose: () => void;
}

export function EntityDetailPanel({ entity, relations, onClose }: EntityDetailPanelProps) {
  const outgoing = relations.filter((r) => r.from === entity.name);
  const incoming = relations.filter((r) => r.to === entity.name);

  return (
    <div
      style={{
        flex: "0 0 45%",
        borderLeft: "2px solid var(--snes-border-outer)",
        background: "var(--snes-surface)",
        maxHeight: "600px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "var(--snes-space-3) var(--snes-space-4)",
          borderBottom: "2px solid var(--snes-border-outer)",
          background: "#0a0930",
          display: "flex",
          alignItems: "center",
          gap: "var(--snes-space-2)",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--snes-space-2)" }}>
          <SNESBadge entityType={entity.type} />
          <span
            style={{
              fontFamily: "var(--font-snes-heading, 'Press Start 2P'), monospace",
              fontSize: "8px",
              color: "var(--snes-gold)",
            }}
          >
            DETAIL
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "var(--snes-text-muted)",
            cursor: "pointer",
            fontFamily: "var(--snes-font-body)",
            fontSize: "var(--snes-text-lg)",
            padding: "0 4px",
          }}
          aria-label="Close detail panel"
        >
          ×
        </button>
      </div>

      {/* Entity name */}
      <div
        style={{
          padding: "var(--snes-space-4)",
          borderBottom: "1px solid var(--snes-border-dim)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--snes-font-body)",
            fontSize: "var(--snes-text-lg)",
            color: "var(--snes-text)",
            marginBottom: "var(--snes-space-1)",
          }}
        >
          {entity.name}
        </div>
        <div
          style={{
            fontFamily: "var(--snes-font-body)",
            fontSize: "var(--snes-text-sm)",
            color: "var(--snes-text-subtle)",
          }}
        >
          {entity.observations.length} observations · {relations.length} connections
        </div>
      </div>

      {/* Observations */}
      {entity.observations.length > 0 && (
        <div
          style={{
            padding: "var(--snes-space-3) var(--snes-space-4)",
            borderBottom: "1px solid var(--snes-border-dim)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-snes-heading, 'Press Start 2P'), monospace",
              fontSize: "8px",
              color: "var(--snes-text-muted)",
              marginBottom: "var(--snes-space-2)",
            }}
          >
            OBSERVATIONS
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
            {entity.observations.map((obs, i) => (
              <li
                key={i}
                style={{
                  fontFamily: "var(--snes-font-body)",
                  fontSize: "var(--snes-text-sm)",
                  color: "var(--snes-text)",
                  display: "flex",
                  gap: "6px",
                }}
              >
                <span style={{ color: "var(--snes-gold)" }}>▸</span>
                {obs}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Relations */}
      {(outgoing.length > 0 || incoming.length > 0) && (
        <div style={{ padding: "var(--snes-space-3) var(--snes-space-4)" }}>
          <div
            style={{
              fontFamily: "var(--font-snes-heading, 'Press Start 2P'), monospace",
              fontSize: "8px",
              color: "var(--snes-text-muted)",
              marginBottom: "var(--snes-space-2)",
            }}
          >
            RELATIONS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {outgoing.map((r, i) => (
              <div
                key={`out-${i}`}
                style={{
                  fontFamily: "var(--snes-font-body)",
                  fontSize: "var(--snes-text-sm)",
                  color: "var(--snes-hp)",
                  display: "flex",
                  gap: "6px",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "var(--snes-text-subtle)", fontSize: "10px" }}>
                  {r.type.toUpperCase()}
                </span>
                <span>→</span>
                <span style={{ color: "var(--snes-text)" }}>{r.to}</span>
              </div>
            ))}
            {incoming.map((r, i) => (
              <div
                key={`in-${i}`}
                style={{
                  fontFamily: "var(--snes-font-body)",
                  fontSize: "var(--snes-text-sm)",
                  color: "var(--snes-mp)",
                  display: "flex",
                  gap: "6px",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "var(--snes-text-subtle)", fontSize: "10px" }}>
                  {r.type.toUpperCase()}
                </span>
                <span>←</span>
                <span style={{ color: "var(--snes-text)" }}>{r.from}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TODO: React Flow mini-graph view goes here */}
      {/* <KGMiniGraph entity={entity} relations={relations} /> */}
    </div>
  );
}
