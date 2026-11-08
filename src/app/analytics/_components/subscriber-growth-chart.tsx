"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { SubscriberGrowthRow } from "@/lib/analytics-types";

const chartConfig = {
  cumulative: {
    label: "Total Subscribers",
    color: "var(--ax-amber)",
  },
  new_subscribers: {
    label: "New",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

interface SubscriberGrowthChartProps {
  data: SubscriberGrowthRow[];
}

export function SubscriberGrowthChart({ data }: SubscriberGrowthChartProps) {
  if (data.length === 0) {
    return (
      <p className="ax-empty">No data in range</p>
    );
  }

  return (
    <div className="ax-chart">
      <ChartContainer config={chartConfig} className="ax-chart-fill">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fillCumulative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--ax-amber)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--ax-amber)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="week"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v: string) => {
              const d = new Date(v + "T00:00:00");
              return d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            dataKey="cumulative"
            type="monotone"
            fill="url(#fillCumulative)"
            stroke="var(--ax-amber)"
            strokeWidth={2}
          />
          <Area
            dataKey="new_subscribers"
            type="monotone"
            fill="none"
            stroke="var(--primary)"
            strokeWidth={2}
            strokeDasharray="4 2"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
