"use client";

import dynamic from "next/dynamic";
import { useState, useMemo, useCallback } from "react";
import kgEntities from "@/data/dashboard/kg-entities.json";
import kgRelations from "@/data/dashboard/kg-relations.json";
import { SNESPanel } from "../_components/snes-panel";
import { EntityFilterList } from "../_components/graph/entity-filter-list";
import { EntityDetailPanel } from "../_components/graph/entity-detail-panel";

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

// Dynamically import React Flow canvas (browser-only, no SSR)
const KGGraphView = dynamic(
  () => import("../_components/graph/kg-graph-view").then((m) => ({ default: m.KGGraphView })),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: "100%",
          height: "600px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--snes-bg)",
          fontFamily: "var(--snes-font-heading, 'Press Start 2P'), monospace",
          fontSize: "8px",
          color: "var(--snes-text-muted)",
        }}
      >
        LOADING GRAPH...
      </div>
    ),
  }
);

function buildRelationCounts(relations: KGRelation[]): Record<string, number> {
  return relations.reduce<Record<string, number>>((acc, rel) => {
    acc[rel.from] = (acc[rel.from] ?? 0) + 1;
    acc[rel.to] = (acc[rel.to] ?? 0) + 1;
    return acc;
  }, {});
}

type ViewMode = "graph" | "list";

export default function GraphPage() {
  const entities = kgEntities as KGEntity[];
  const relations = kgRelations as KGRelation[];
  const relationCounts = useMemo(() => buildRelationCounts(relations), [relations]);

  const entityTypes = useMemo(
    () => [...new Set(entities.map((e) => e.type))].sort(),
    [entities]
  );

  // View mode: graph vs list
  const [viewMode, setViewMode] = useState<ViewMode>("graph");

  // Graph: active type filters
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set(entityTypes));

  // Graph: search
  const [graphSearch, setGraphSearch] = useState("");

  // Graph: selected node
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedEntity = useMemo(
    () => (selectedNodeId ? (entities.find((e) => e.name === selectedNodeId) ?? null) : null),
    [selectedNodeId, entities]
  );

  const selectedEntityRelations = useMemo(
    () =>
      selectedEntity
        ? relations.filter(
            (r) => r.from === selectedEntity.name || r.to === selectedEntity.name
          )
        : [],
    [selectedEntity, relations]
  );

  const toggleType = useCallback((type: string) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }, []);

  const setAllTypes = useCallback(
    (on: boolean) => {
      setActiveTypes(on ? new Set(entityTypes) : new Set<string>());
    },
    [entityTypes]
  );

  const entityCountByType = useMemo(
    () =>
      entities.reduce<Record<string, number>>((acc, e) => {
        acc[e.type] = (acc[e.type] ?? 0) + 1;
        return acc;
      }, {}),
    [entities]
  );

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
          ★ KG GRAPH
        </h1>
        <p style={{ color: "var(--snes-text-muted)", fontSize: "var(--snes-text-base)" }}>
          {entities.length} ENTITIES · {relations.length} RELATIONS
        </p>
      </div>

      {/* Main panel */}
      <SNESPanel
        title="ENTITY EXPLORER"
        subtitle="KNOWLEDGE GRAPH"
        headerAction={
          <div style={{ display: "flex", gap: "var(--snes-space-2)" }}>
            <button
              onClick={() => setViewMode("graph")}
              style={viewToggleStyle(viewMode === "graph")}
            >
              GRAPH
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={viewToggleStyle(viewMode === "list")}
            >
              LIST
            </button>
          </div>
        }
      >
        {viewMode === "graph" ? (
          <>
            {/* Graph toolbar */}
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
              {/* Search */}
              <input
                type="text"
                value={graphSearch}
                onChange={(e) => setGraphSearch(e.target.value)}
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
                  width: "160px",
                }}
              />

              {/* ALL / NONE */}
              <button
                onClick={() => setAllTypes(true)}
                style={filterBtnStyle(activeTypes.size === entityTypes.length)}
              >
                ALL
              </button>
              <button
                onClick={() => setAllTypes(false)}
                style={filterBtnStyle(activeTypes.size === 0)}
              >
                NONE
              </button>

              {/* Per-type toggles */}
              {entityTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  style={filterBtnStyle(activeTypes.has(type))}
                  title={`${entityCountByType[type] ?? 0} entities`}
                >
                  {type.toUpperCase().slice(0, 5)} ({entityCountByType[type] ?? 0})
                </button>
              ))}
            </div>

            {/* Graph canvas + optional detail panel */}
            <div
              style={{
                display: "flex",
                height: "600px",
                overflow: "hidden",
              }}
            >
              <div style={{ flex: 1, minWidth: 0, height: "100%" }}>
                <KGGraphView
                  entities={entities}
                  relations={relations}
                  activeTypes={activeTypes}
                  searchTerm={graphSearch}
                  onNodeSelect={setSelectedNodeId}
                  selectedNodeId={selectedNodeId}
                />
              </div>

              {selectedEntity && (
                <div style={{ flex: "0 0 340px", overflow: "hidden" }}>
                  <EntityDetailPanel
                    entity={selectedEntity}
                    relations={selectedEntityRelations}
                    onClose={() => setSelectedNodeId(null)}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Type summary bar (list mode) */}
            <div
              style={{
                padding: "var(--snes-space-3) var(--snes-space-4)",
                borderBottom: "1px solid var(--snes-border-dim)",
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--snes-space-2)",
              }}
            >
              {entityTypes.map((type) => (
                <span
                  key={type}
                  style={{
                    fontFamily: "var(--snes-font-body)",
                    fontSize: "var(--snes-text-sm)",
                    color: "var(--snes-text-muted)",
                  }}
                >
                  {type}:{" "}
                  <span style={{ color: "var(--snes-gold)" }}>
                    {entityCountByType[type]}
                  </span>
                </span>
              ))}
            </div>

            {/* Full filterable list view */}
            <EntityFilterList
              entities={entities}
              relations={relations}
              relationCounts={relationCounts}
              entityTypes={entityTypes}
            />
          </>
        )}
      </SNESPanel>
    </div>
  );
}

function viewToggleStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? "var(--snes-surface-active)" : "transparent",
    border: `1px solid ${active ? "var(--snes-gold)" : "var(--snes-border-outer)"}`,
    color: active ? "var(--snes-gold)" : "var(--snes-text-muted)",
    fontFamily: "var(--font-snes-heading, 'Press Start 2P'), monospace",
    fontSize: "8px",
    padding: "4px 8px",
    cursor: "pointer",
    borderRadius: 0,
    whiteSpace: "nowrap",
  };
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
