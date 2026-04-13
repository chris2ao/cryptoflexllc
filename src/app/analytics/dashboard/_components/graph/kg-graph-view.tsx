"use client";

import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  type Node,
  type NodeTypes,
  type EdgeTypes,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useMemo } from "react";
import { KGNode, type KGNodeType, type KGNodeData } from "./kg-node";
import { KGEdge, type KGEdgeType } from "./kg-edge";

interface RawEntity {
  name: string;
  type: string;
  observations: string[];
}

interface RawRelation {
  from: string;
  to: string;
  type: string;
}

interface KGGraphViewProps {
  entities: RawEntity[];
  relations: RawRelation[];
  activeTypes: Set<string>;
  searchTerm: string;
  onNodeSelect: (entityName: string | null) => void;
  selectedNodeId: string | null;
}

// --- Layout: group by type, columns of max 8 nodes each ---
const COL_WIDTH = 260;
const ROW_HEIGHT = 130;
const MAX_ROWS = 8;

function buildLayout(entities: RawEntity[]): Map<string, { x: number; y: number }> {
  const byType = new Map<string, RawEntity[]>();
  for (const entity of entities) {
    const list = byType.get(entity.type) ?? [];
    list.push(entity);
    byType.set(entity.type, list);
  }

  const positions = new Map<string, { x: number; y: number }>();
  let col = 0;

  for (const [, group] of byType) {
    let row = 0;
    for (const entity of group) {
      positions.set(entity.name, {
        x: col * COL_WIDTH + 40,
        y: row * ROW_HEIGHT + 40,
      });
      row++;
      if (row >= MAX_ROWS) {
        row = 0;
        col++;
      }
    }
    col++;
  }

  return positions;
}

function buildRelationCounts(relations: RawRelation[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const rel of relations) {
    counts.set(rel.from, (counts.get(rel.from) ?? 0) + 1);
    counts.set(rel.to, (counts.get(rel.to) ?? 0) + 1);
  }
  return counts;
}

const NODE_TYPES: NodeTypes = { kg: KGNode };
const EDGE_TYPES: EdgeTypes = { kg: KGEdge };

export function KGGraphView({
  entities,
  relations,
  activeTypes,
  searchTerm,
  onNodeSelect,
  selectedNodeId,
}: KGGraphViewProps) {
  const relationCounts = useMemo(() => buildRelationCounts(relations), [relations]);

  // Filter visible entities
  const visibleEntities = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return entities.filter((e) => {
      if (!activeTypes.has(e.type)) return false;
      if (term === "") return true;
      return (
        e.name.toLowerCase().includes(term) ||
        e.observations.some((o) => o.toLowerCase().includes(term))
      );
    });
  }, [entities, activeTypes, searchTerm]);

  const visibleNames = useMemo(
    () => new Set(visibleEntities.map((e) => e.name)),
    [visibleEntities]
  );

  const positions = useMemo(
    () => buildLayout(visibleEntities),
    [visibleEntities]
  );

  const initialNodes: KGNodeType[] = useMemo(() => {
    return visibleEntities.map((entity) => {
      const pos = positions.get(entity.name) ?? { x: 0, y: 0 };
      const data: KGNodeData = {
        label: entity.name,
        entityType: entity.type,
        observationCount: entity.observations.length,
        connectionCount: relationCounts.get(entity.name) ?? 0,
      };
      return {
        id: entity.name,
        type: "kg" as const,
        position: pos,
        data,
        selected: entity.name === selectedNodeId,
      };
    });
  }, [visibleEntities, positions, relationCounts, selectedNodeId]);

  const initialEdges: KGEdgeType[] = useMemo(() => {
    return relations
      .filter((r) => visibleNames.has(r.from) && visibleNames.has(r.to))
      .map((rel, i) => ({
        id: `${rel.from}--${rel.type}--${rel.to}--${i}`,
        source: rel.from,
        target: rel.to,
        type: "kg" as const,
        data: { relationType: rel.type },
        animated: false,
      }));
  }, [relations, visibleNames]);

  const [nodes, , onNodesChange] = useNodesState<KGNodeType>(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState<KGEdgeType>(initialEdges);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onNodeSelect(node.id === selectedNodeId ? null : node.id);
    },
    [onNodeSelect, selectedNodeId]
  );

  const handlePaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.1}
        maxZoom={2}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        colorMode="dark"
        style={{ background: "var(--snes-bg)" }}
        proOptions={{ hideAttribution: true }}
      >
        <MiniMap
          style={{
            background: "var(--snes-surface)",
            border: "2px solid var(--snes-border-outer)",
          }}
          nodeColor={(node) => {
            const data = node.data as KGNodeData;
            const colorMap: Record<string, string> = {
              Agent: "#ffd700",
              Skill: "#aa66cc",
              Hook: "#44cc44",
              "MCP Server": "#4488ff",
              Command: "#ff8844",
              Script: "#44cccc",
              "Rule Set": "#cc8844",
              Project: "#aaaacc",
              Infrastructure: "#cc4444",
            };
            return colorMap[data.entityType] ?? "#f0f0f0";
          }}
          maskColor="rgba(15, 14, 46, 0.7)"
          pannable
          zoomable
        />

        <Controls
          style={{
            background: "var(--snes-surface)",
            border: "2px solid var(--snes-border-outer)",
          }}
        />

        <Background
          variant={BackgroundVariant.Dots}
          color="#2a2a5a"
          gap={24}
          size={1.5}
        />

        <Panel position="top-left">
          <div
            style={{
              background: "var(--snes-surface)",
              border: "2px solid var(--snes-border-dim)",
              padding: "4px 10px",
              fontFamily: "var(--snes-font-heading, 'Press Start 2P'), monospace",
              fontSize: "8px",
              color: "var(--snes-text-muted)",
            }}
          >
            {visibleEntities.length} NODES · {initialEdges.length} EDGES
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
