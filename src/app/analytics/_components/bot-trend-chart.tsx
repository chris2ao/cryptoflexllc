"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { BotTrendRow } from "@/lib/analytics-types";

const chartConfig = {
  human_count: { label: "Humans", color: "var(--primary)" },
  bot_count: { label: "Bots", color: "var(--ax-red)" },
} satisfies ChartConfig;

type SeriesPoint = { date: string; humans: number; bots: number };

/** Marker dates that actually exist in the plotted series. */
export function markerDates(
  series: Array<{ date: string }>,
  markers?: string[],
): string[] {
  if (!markers || markers.length === 0) return [];
  const present = new Set(series.map((p) => p.date));
  return markers.filter((m) => present.has(m));
}

function formatDate(v: string): string {
  const d = new Date(v + "T00:00:00");
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function BotTrendChart({
  data,
  series,
  markers,
}: {
  data: BotTrendRow[];
  series?: SeriesPoint[];
  markers?: string[];
}) {
  const plotted: Array<{ date: string; human_count: number; bot_count: number }> =
    series
      ? series.map((p) => ({
          date: p.date,
          human_count: p.humans,
          bot_count: p.bots,
        }))
      : data;

  if (plotted.length === 0) {
    return <p className="ax-empty">No data in range</p>;
  }

  const totalBots = plotted.reduce((s, r) => s + r.bot_count, 0);
  const totalAll = plotted.reduce((s, r) => s + r.bot_count + r.human_count, 0);
  const overallPct = totalAll > 0 ? Math.round((totalBots / totalAll) * 100) : 0;
  const marks = markerDates(plotted, markers);

  return (
    <>
      <span className="ax-chart-badge">{overallPct}% bots</span>
      <div className="ax-chart">
        <ChartContainer config={chartConfig} className="ax-chart-fill">
          <AreaChart
            data={plotted}
            margin={{ top: 16, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatDate}
            />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {marks.map((m) => (
              <ReferenceLine
                key={m}
                x={m}
                stroke="var(--fg-3)"
                strokeDasharray="4 3"
                label={{
                  value: "post",
                  position: "top",
                  fontSize: 10,
                  fill: "var(--fg-3)",
                  fontFamily: "var(--font-mono)",
                }}
              />
            ))}
            <Area
              dataKey="human_count"
              type="monotone"
              fill="var(--primary)"
              fillOpacity={0.3}
              stroke="var(--primary)"
              strokeWidth={2}
              stackId="1"
            />
            <Area
              dataKey="bot_count"
              type="monotone"
              fill="var(--ax-red)"
              fillOpacity={0.2}
              stroke="var(--ax-red)"
              strokeWidth={2}
              stackId="1"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </>
  );
}
