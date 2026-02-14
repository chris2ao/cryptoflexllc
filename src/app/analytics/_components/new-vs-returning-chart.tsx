"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { NewVsReturningRow } from "@/lib/analytics-types";
import { PanelWrapper } from "./panel-wrapper";

const chartConfig = {
  new_visitors: {
    label: "New",
    color: "var(--chart-1)",
  },
  returning_visitors: {
    label: "Returning",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function NewVsReturningChart({ data }: { data: NewVsReturningRow[] }) {
  if (data.length === 0) {
    return (
      <PanelWrapper
        title="New vs Returning"
        tooltip="Daily breakdown of first-time vs returning visitors"
      >
        <p className="text-muted-foreground text-sm text-center py-8">
          No visitor data yet
        </p>
      </PanelWrapper>
    );
  }

  const totalNew = data.reduce((s, r) => s + r.new_visitors, 0);
  const totalRet = data.reduce((s, r) => s + r.returning_visitors, 0);
  const total = totalNew + totalRet;
  const newPct = total > 0 ? Math.round((totalNew / total) * 100) : 0;

  return (
    <PanelWrapper
      title="New vs Returning"
      tooltip="Daily breakdown of first-time vs returning visitors"
      badge={
        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
          {newPct}% new
        </span>
      }
    >
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="fillNew" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--chart-1)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="var(--chart-1)"
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="fillReturning" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--chart-4)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="var(--chart-4)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
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
          <YAxis
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            dataKey="new_visitors"
            type="monotone"
            fill="url(#fillNew)"
            stroke="var(--chart-1)"
            strokeWidth={2}
            stackId="1"
          />
          <Area
            dataKey="returning_visitors"
            type="monotone"
            fill="url(#fillReturning)"
            stroke="var(--chart-4)"
            strokeWidth={2}
            stackId="1"
          />
        </AreaChart>
      </ChartContainer>
    </PanelWrapper>
  );
}
