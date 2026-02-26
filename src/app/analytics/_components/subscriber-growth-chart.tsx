"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { SubscriberGrowthRow } from "@/lib/analytics-types";
import { PanelWrapper } from "./panel-wrapper";

const chartConfig = {
  cumulative: {
    label: "Total Subscribers",
    color: "var(--chart-3)",
  },
  new_subscribers: {
    label: "New",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface SubscriberGrowthChartProps {
  data: SubscriberGrowthRow[];
}

export function SubscriberGrowthChart({ data }: SubscriberGrowthChartProps) {
  if (data.length === 0) {
    return (
      <PanelWrapper
        title="Subscriber Growth"
        tooltip="Weekly subscriber growth trend showing new signups and cumulative total"
      >
        <p className="text-muted-foreground text-sm text-center py-8">
          No subscriber data yet
        </p>
      </PanelWrapper>
    );
  }

  return (
    <PanelWrapper
      title="Subscriber Growth"
      tooltip="Weekly subscriber growth trend showing new signups and cumulative total"
    >
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fillCumulative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0} />
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
            stroke="var(--chart-3)"
            strokeWidth={2}
          />
          <Area
            dataKey="new_subscribers"
            type="monotone"
            fill="none"
            stroke="var(--chart-1)"
            strokeWidth={2}
            strokeDasharray="4 2"
          />
        </AreaChart>
      </ChartContainer>
    </PanelWrapper>
  );
}
