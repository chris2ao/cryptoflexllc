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
  archived: number;
}

const chartConfig = {
  processed: {
    label: "Processed",
    color: "var(--primary)",
  },
  trashed: {
    label: "Trashed",
    color: "var(--ax-amber)",
  },
  archived: {
    label: "Archived",
    color: "var(--ax-green)",
  },
} satisfies ChartConfig;

export function GmailMetricsChart({ data }: { data: GmailMetricsChartEntry[] }) {
  if (data.length === 0) {
    return (
      <p className="ax-empty">No data in range</p>
    );
  }

  return (
    <div className="ax-chart ax-chart--tall">
    <ChartContainer config={chartConfig} className="ax-chart-fill">
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillGmailProcessed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillGmailTrashed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--ax-amber)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--ax-amber)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillGmailArchived" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--ax-green)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--ax-green)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="processed"
          type="monotone"
          fill="url(#fillGmailProcessed)"
          stroke="var(--primary)"
          strokeWidth={2}
        />
        <Area
          dataKey="trashed"
          type="monotone"
          fill="url(#fillGmailTrashed)"
          stroke="var(--ax-amber)"
          strokeWidth={2}
        />
        <Area
          dataKey="archived"
          type="monotone"
          fill="url(#fillGmailArchived)"
          stroke="var(--ax-green)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
    </div>
  );
}
