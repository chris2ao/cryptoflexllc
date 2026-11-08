"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { TimeOnPageRow } from "@/lib/analytics-types";
import { PathLegend, PathTick } from "./scroll-depth-chart";

const chartConfig = {
  avg_seconds: {
    label: "Avg Time (s)",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

function formatSeconds(s: number): string {
  if (s < 60) return `${Math.round(s)}s`;
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return `${m}m ${sec}s`;
}

export function TimeOnPageChart({ data }: { data: TimeOnPageRow[] }) {
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
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => formatSeconds(v)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatSeconds(Number(value))}
                />
              }
            />
            <Bar
              dataKey="avg_seconds"
              fill="var(--primary)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
      <PathLegend paths={data.map((r) => r.page_path)} />
    </>
  );
}
