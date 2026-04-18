"use client";

import { useEffect, useRef, useState } from "react";

export type KpiSpark = number[];

export type KpiItem = {
  id: string;
  label: string;
  value: number;
  format?: "number" | "percent";
  unit?: string;
  delta?: { value: number; direction: "up" | "down" } | null;
  hint?: string;
  spark?: KpiSpark;
};

type Props = {
  items: KpiItem[];
};

function useCountUp(target: number, durationMs = 900): number {
  const [value, setValue] = useState<number>(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const start = performance.now();
    const tick = (now: number) => {
      if (reduceMotion) {
        setValue(target);
        return;
      }
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durationMs);
      setValue(target * easeOut(t));
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, [target, durationMs]);

  return value;
}

function formatValue(item: KpiItem, raw: number): string {
  const rounded = Math.round(raw);
  if (item.format === "percent") return `${rounded}`;
  return rounded.toLocaleString();
}

function Sparkline({ data }: { data: KpiSpark }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = Math.max(max - min, 1);
  const width = 120;
  const height = 32;
  const step = width / (data.length - 1);

  const points = data
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      className="spark"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polygon points={areaPoints} fill="var(--accent-dim)" />
      <polyline
        points={points}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function KpiCell({
  item,
  active,
  onClick,
}: {
  item: KpiItem;
  active: boolean;
  onClick: () => void;
}) {
  const animated = useCountUp(item.value);
  const formatted = formatValue(item, animated);

  return (
    <button
      type="button"
      className={`ax-kpi${active ? " on" : ""}`}
      onClick={onClick}
      aria-pressed={active}
      aria-label={`${item.label}: ${formatted}${item.unit ?? ""}`}
    >
      <div className="label">
        <span>{item.label}</span>
        {item.hint && <span className="hint">{item.hint}</span>}
      </div>
      <div className="val">
        {formatted}
        {item.unit && <span className="unit">{item.unit}</span>}
      </div>
      {item.delta && (
        <div className={`delta${item.delta.direction === "down" ? " down" : ""}`}>
          <span>{item.delta.direction === "down" ? "▼" : "▲"}</span>
          <b>
            {item.delta.direction === "down" ? "-" : "+"}
            {Math.abs(item.delta.value).toFixed(1)}%
          </b>
          <span>vs prior</span>
        </div>
      )}
      {item.spark && <Sparkline data={item.spark} />}
    </button>
  );
}

export function KpiStrip({ items }: Props) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (!activeId) return;
    document.body.dataset.axKpi = activeId;
  }, [activeId]);

  return (
    <div className="ax-kpis" role="tablist" aria-label="Key metrics">
      {items.map((item) => (
        <KpiCell
          key={item.id}
          item={item}
          active={item.id === activeId}
          onClick={() => setActiveId(item.id)}
        />
      ))}
    </div>
  );
}
