"use client";

import { isSitePath } from "@/lib/site-path";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ScrollDepthRow } from "@/lib/analytics-types";

const chartConfig = {
  depth_25: { label: "25%", color: "var(--primary)" },
  depth_50: { label: "50%", color: "var(--ax-green)" },
  depth_75: { label: "75%", color: "var(--ax-amber)" },
  depth_100: { label: "100%", color: "var(--ax-red)" },
} satisfies ChartConfig;

const MAX_LABEL = 28;
const PREFIXES = ["/blog/series/", "/backlog/", "/blog/"];

/** Same rule as ax-ranked-list: a single leading slash, no protocol-relative paths. */
export function isSafeInternalPath(href: string): boolean {
  return isSitePath(href);
}

/** Slug shown on the axis: known prefix stripped, capped at 28 chars. */
export function slugLabel(path: string): string {
  const prefix = PREFIXES.find((p) => path.startsWith(p));
  const slug = prefix ? path.slice(prefix.length) : path;
  return slug.length > MAX_LABEL ? slug.slice(0, MAX_LABEL - 1) + "…" : slug;
}

export function PathTick(props: {
  x?: number;
  y?: number;
  payload?: { value: string };
}) {
  const { x = 0, y = 0, payload } = props;
  const path = payload?.value ?? "";
  return (
    <text
      x={x}
      y={y}
      dy={4}
      textAnchor="end"
      className="recharts-cartesian-axis-tick-value"
    >
      <title>{path}</title>
      {slugLabel(path)}
    </text>
  );
}

export function PathLegend({ paths }: { paths: string[] }) {
  return (
    <ol className="ax-chart-legend" aria-label="Pages">
      {paths.map((path) => (
        <li key={path} className="ax-chart-legend-item">
          {isSafeInternalPath(path) ? (
            <Link href={path} title={path}>
              {slugLabel(path)}
            </Link>
          ) : (
            <span title={path}>{slugLabel(path)}</span>
          )}
        </li>
      ))}
    </ol>
  );
}

export function ScrollDepthChart({ data }: { data: ScrollDepthRow[] }) {
  if (data.length === 0) {
    return <p className="ax-empty">No data in range</p>;
  }

  return (
    <>
      <div className="ax-chart ax-chart--tall">
        <ChartContainer config={chartConfig} className="ax-chart-fill">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <YAxis
              dataKey="page_path"
              type="category"
              width={170}
              tickLine={false}
              axisLine={false}
              tick={<PathTick />}
            />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="depth_25" stackId="a" fill="var(--primary)" />
            <Bar dataKey="depth_50" stackId="a" fill="var(--ax-green)" />
            <Bar dataKey="depth_75" stackId="a" fill="var(--ax-amber)" />
            <Bar
              dataKey="depth_100"
              stackId="a"
              fill="var(--ax-red)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
      <PathLegend paths={data.map((r) => r.page_path)} />
    </>
  );
}
