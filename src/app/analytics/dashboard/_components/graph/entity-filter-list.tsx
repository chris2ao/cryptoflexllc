"use client";

import { useState } from "react";
import { SNESBadge } from "../snes-badge";
import { EntityDetailPanel } from "./entity-detail-panel";

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

interface EntityFilterListProps {
  entities: KGEntity[];
  relations: KGRelation[];
  relationCounts: Record<string, number>;
  entityTypes: string[];
}

export function EntityFilterList({
  entities,
  relations,
  relationCounts,
  entityTypes,
}: EntityFilterListProps) {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [selectedEntity, setSelectedEntity] = useState<KGEntity | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = entities.filter((e) => {
    const matchesType = activeFilter === "ALL" || e.type === activeFilter;
    const matchesSearch =
      searchTerm === "" ||
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.observations.some((o) => o.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const entityRelations = selectedEntity
    ? relations.filter(
        (r) => r.from === selectedEntity.name || r.to === selectedEntity.name
      )
    : [];

  return (
    <div>
      {/* Filter toolbar */}
      <div
        style={{
          padding: "var(--snes-space-3) var(--snes-space-4)",
          borderBottom: "1px solid var(--snes-border-dim)",
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--snes-space-2)",
          alignItems: "center",
        }}
      >
        {/* Search input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="FILTER..."
          style={{
            background: "var(--snes-bg)",
            border: "2px solid var(--snes-border-outer)",
            color: "var(--snes-text)",
            fontFamily: "var(--snes-font-body)",
            fontSize: "var(--snes-text-base)",
            padding: "4px 8px",
            outline: "none",
            borderRadius: 0,
            width: "180px",
          }}
        />

        {/* Type filter buttons */}
        <button
          onClick={() => setActiveFilter("ALL")}
          style={filterBtnStyle(activeFilter === "ALL")}
        >
          ALL ({entities.length})
        </button>
        {entityTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            style={filterBtnStyle(activeFilter === type)}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Entity list + detail panel */}
      <div style={{ display: "flex", gap: 0 }}>
        {/* Entity list */}
        <div
          style={{
            flex: selectedEntity ? "0 0 55%" : "1 1 100%",
            maxHeight: "600px",
            overflowY: "auto",
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "var(--snes-space-8)",
                textAlign: "center",
                color: "var(--snes-text-subtle)",
                fontFamily: "var(--snes-font-body)",
                fontSize: "var(--snes-text-lg)",
              }}
            >
              --- 0 MATCHES ---
            </div>
          ) : (
            filtered.map((entity) => (
              <button
                key={entity.name}
                onClick={() =>
                  setSelectedEntity(selectedEntity?.name === entity.name ? null : entity)
                }
                style={{
                  width: "100%",
                  background:
                    selectedEntity?.name === entity.name
                      ? "var(--snes-surface-active)"
                      : "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--snes-border-dim)",
                  padding: "var(--snes-space-3) var(--snes-space-4)",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--snes-space-3)",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                className="entity-row"
              >
                <SNESBadge entityType={entity.type} />
                <span
                  style={{
                    fontFamily: "var(--snes-font-body)",
                    fontSize: "var(--snes-text-base)",
                    color:
                      selectedEntity?.name === entity.name
                        ? "var(--snes-gold)"
                        : "var(--snes-text)",
                    flex: 1,
                  }}
                >
                  {entity.name}
                </span>
                <span
                  style={{
                    fontFamily: "var(--snes-font-body)",
                    fontSize: "var(--snes-text-sm)",
                    color: "var(--snes-text-subtle)",
                  }}
                >
                  {entity.observations.length} obs · {relationCounts[entity.name] ?? 0} links
                </span>
              </button>
            ))
          )}
        </div>

        {/* Detail panel */}
        {selectedEntity && (
          <EntityDetailPanel
            entity={selectedEntity}
            relations={entityRelations}
            onClose={() => setSelectedEntity(null)}
          />
        )}
      </div>

      <style>{`
        .entity-row:hover {
          background: var(--snes-surface-hover) !important;
        }
      `}</style>
    </div>
  );
}

function filterBtnStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? "var(--snes-surface-active)" : "transparent",
    border: `1px solid ${active ? "var(--snes-gold)" : "var(--snes-border-outer)"}`,
    color: active ? "var(--snes-gold)" : "var(--snes-text-muted)",
    fontFamily: "var(--font-snes-heading, 'Press Start 2P'), monospace",
    fontSize: "8px",
    padding: "4px 8px",
    cursor: "pointer",
    borderRadius: 0,
    whiteSpace: "nowrap" as const,
  };
}
