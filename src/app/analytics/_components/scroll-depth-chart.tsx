"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ScrollDepthRow } from "@/lib/analytics-types";
import { PanelWrapper } from "./panel-wrapper";

const chartConfig = {
  depth_25: { label: "25%", color: "var(--chart-1)" },
  depth_50: { label: "50%", color: "var(--chart-2)" },
  depth_75: { label: "75%", color: "var(--chart-3)" },
  depth_100: { label: "100%", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function ScrollDepthChart({ data }: { data: ScrollDepthRow[] }) {
  if (data.length === 0) {
    return (
      <PanelWrapper
        title="Scroll Depth"
        tooltip="How far down the page visitors scroll (25%, 50%, 75%, 100%)"
      >
        <p className="text-muted-foreground text-sm text-center py-8">
          No scroll data yet
        </p>
      </PanelWrapper>
    );
  }

  return (
    <PanelWrapper
      title="Scroll Depth"
      tooltip="How far down the page visitors scroll (25%, 50%, 75%, 100%)"
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
          <XAxis type="number" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="depth_25" stackId="a" fill="var(--chart-1)" />
          <Bar dataKey="depth_50" stackId="a" fill="var(--chart-2)" />
          <Bar dataKey="depth_75" stackId="a" fill="var(--chart-3)" />
          <Bar
            dataKey="depth_100"
            stackId="a"
            fill="var(--chart-4)"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ChartContainer>
    </PanelWrapper>
  );
}
