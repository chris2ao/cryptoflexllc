"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { TimeOnPageRow } from "@/lib/analytics-types";
import { PanelWrapper } from "./panel-wrapper";

const chartConfig = {
  avg_seconds: {
    label: "Avg Time (s)",
    color: "var(--chart-3)",
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
    return (
      <PanelWrapper
        title="Avg Time on Page"
        tooltip="Average time visitors spend on each page before navigating away"
      >
        <p className="text-muted-foreground text-sm text-center py-8">
          No engagement data yet
        </p>
      </PanelWrapper>
    );
  }

  return (
    <PanelWrapper
      title="Avg Time on Page"
      tooltip="Average time visitors spend on each page before navigating away"
    >
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <YAxis
            dataKey="page_path"
            type="category"
            width={120}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: string) =>
              v.length > 18 ? v.slice(0, 18) + "..." : v
            }
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
            fill="var(--chart-3)"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ChartContainer>
    </PanelWrapper>
  );
}
