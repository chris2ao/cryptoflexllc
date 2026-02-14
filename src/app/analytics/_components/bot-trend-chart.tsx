"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { BotTrendRow } from "@/lib/analytics-types";
import { PanelWrapper } from "./panel-wrapper";

const chartConfig = {
  human_count: {
    label: "Humans",
    color: "var(--chart-2)",
  },
  bot_count: {
    label: "Bots",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function BotTrendChart({ data }: { data: BotTrendRow[] }) {
  if (data.length === 0) {
    return (
      <PanelWrapper
        title="Bot Traffic"
        tooltip="Percentage of traffic from bots vs real visitors over time"
      >
        <p className="text-muted-foreground text-sm text-center py-8">
          No data yet
        </p>
      </PanelWrapper>
    );
  }

  const totalBots = data.reduce((s, r) => s + r.bot_count, 0);
  const totalAll = data.reduce((s, r) => s + r.bot_count + r.human_count, 0);
  const overallPct = totalAll > 0 ? Math.round((totalBots / totalAll) * 100) : 0;

  return (
    <PanelWrapper
      title="Bot Traffic"
      tooltip="Percentage of traffic from bots vs real visitors over time"
      badge={
        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
          {overallPct}% bots
        </span>
      }
    >
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="fillHuman" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--chart-2)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="var(--chart-2)"
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="fillBot" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--chart-5)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="var(--chart-5)"
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
            dataKey="human_count"
            type="monotone"
            fill="url(#fillHuman)"
            stroke="var(--chart-2)"
            strokeWidth={2}
            stackId="1"
          />
          <Area
            dataKey="bot_count"
            type="monotone"
            fill="url(#fillBot)"
            stroke="var(--chart-5)"
            strokeWidth={2}
            stackId="1"
          />
        </AreaChart>
      </ChartContainer>
    </PanelWrapper>
  );
}
