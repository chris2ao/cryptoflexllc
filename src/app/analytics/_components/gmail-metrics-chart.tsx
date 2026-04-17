"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export interface GmailMetricsChartEntry {
  label: string;
  processed: number;
  trashed: number;
  kept: number;
}

const chartConfig = {
  processed: {
    label: "Processed",
    color: "var(--chart-1)",
  },
  trashed: {
    label: "Trashed",
    color: "var(--chart-3)",
  },
  kept: {
    label: "Kept",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function GmailMetricsChart({ data }: { data: GmailMetricsChartEntry[] }) {
  if (data.length === 0) {
    return (
      <p className="text-muted-foreground text-sm text-center py-8">
        No data yet
      </p>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillGmailProcessed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillGmailTrashed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillGmailKept" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 11 }}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="processed"
          type="monotone"
          fill="url(#fillGmailProcessed)"
          stroke="var(--chart-1)"
          strokeWidth={2}
        />
        <Area
          dataKey="trashed"
          type="monotone"
          fill="url(#fillGmailTrashed)"
          stroke="var(--chart-3)"
          strokeWidth={2}
        />
        <Area
          dataKey="kept"
          type="monotone"
          fill="url(#fillGmailKept)"
          stroke="var(--chart-2)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
