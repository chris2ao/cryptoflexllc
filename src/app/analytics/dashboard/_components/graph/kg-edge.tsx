"use client";

import { BaseEdge, getSmoothStepPath, type EdgeProps, type Edge } from "@xyflow/react";

export type KGEdgeData = {
  relationType: string;
};

export type KGEdgeType = Edge<KGEdgeData, "kg">;

export function KGEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  data,
  markerEnd,
  markerStart,
}: EdgeProps<KGEdgeType>) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0,
  });

  const strokeColor = selected ? "var(--snes-gold)" : "var(--snes-border-outer)";

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        markerStart={markerStart}
        style={{
          stroke: strokeColor,
          strokeWidth: selected ? 3 : 2,
          transition: "stroke 100ms linear, stroke-width 100ms linear",
        }}
      />
      {data?.relationType && (
        <foreignObject
          x={labelX - 32}
          y={labelY - 9}
          width={64}
          height={18}
          style={{ overflow: "visible", pointerEvents: "none" }}
        >
          <div
            style={{
              background: "var(--snes-bg)",
              border: `1px solid ${selected ? "var(--snes-gold)" : "var(--snes-border-dim)"}`,
              color: selected ? "var(--snes-gold)" : "var(--snes-text-muted)",
              fontFamily: "var(--snes-font-body)",
              fontSize: "10px",
              padding: "1px 4px",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: "16px",
            }}
          >
            {data.relationType}
          </div>
        </foreignObject>
      )}
    </>
  );
}
