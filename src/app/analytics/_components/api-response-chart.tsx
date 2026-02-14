"use client";

import type { ApiMetricRow, ApiMetricDailyRow } from "@/lib/analytics-types";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { PanelWrapper } from "./panel-wrapper";

const trendConfig = {
  p50: { label: "p50", color: "var(--chart-2)" },
  p75: { label: "p75", color: "var(--chart-1)" },
  p95: { label: "p95", color: "var(--chart-5)" },
} satisfies ChartConfig;

function getRatingColor(p75: number): string {
  if (p75 <= 200) return "text-green-400";
  if (p75 <= 500) return "text-yellow-400";
  return "text-red-400";
}

function getRatingBorder(p75: number): string {
  if (p75 <= 200) return "border-green-500/30 bg-green-500/5";
  if (p75 <= 500) return "border-yellow-500/30 bg-yellow-500/5";
  return "border-red-500/30 bg-red-500/5";
}

export function ApiResponseChart({
  endpoints,
  daily,
}: {
  endpoints: ApiMetricRow[];
  daily: ApiMetricDailyRow[];
}) {
  const hasEndpoints = endpoints.length > 0;
  const hasDaily = daily.length > 0;

  if (!hasEndpoints && !hasDaily) {
    return (
      <PanelWrapper
        title="API Response Times"
        tooltip="Server-side latency (p50/p75/p95) and error rates per endpoint"
      >
        <p className="text-muted-foreground text-sm text-center py-8">
          No API metrics collected yet. Metrics appear as API routes are called.
        </p>
      </PanelWrapper>
    );
  }

  return (
    <PanelWrapper
      title="API Response Times"
      tooltip="Server-side latency (p50/p75/p95) and error rates per endpoint"
    >
      {/* Per-endpoint summary cards */}
      {hasEndpoints && (
        <div className="space-y-2 mb-6">
          {endpoints.map((ep) => {
            const errorPct =
              ep.total_count > 0
                ? Math.round((ep.error_count / ep.total_count) * 100)
                : 0;
            return (
              <div
                key={`${ep.method}-${ep.endpoint}`}
                className={`rounded-md border p-3 ${getRatingBorder(ep.p75)}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted">
                      {ep.method}
                    </span>
                    <span className="text-sm font-semibold truncate max-w-[200px]">
                      {ep.endpoint}
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-lg font-bold ${getRatingColor(ep.p75)}`}
                    >
                      {Math.round(ep.p75)}ms
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      p75
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    p50: {Math.round(ep.p50)}ms &middot; p95:{" "}
                    {Math.round(ep.p95)}ms &middot;{" "}
                    {ep.total_count.toLocaleString()} calls
                  </span>
                  {errorPct > 0 && (
                    <span className="text-red-400">{errorPct}% errors</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Daily trend chart */}
      {hasDaily && (
        <ChartContainer config={trendConfig} className="h-[200px] w-full">
          <AreaChart
            data={daily}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillP75api" x1="0" y1="0" x2="0" y2="1">
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
              tickFormatter={(v: number) => `${v}ms`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `${Math.round(Number(value))}ms`}
                />
              }
            />
            <Area
              dataKey="p50"
              type="monotone"
              fill="none"
              stroke="var(--chart-2)"
              strokeWidth={1}
              strokeDasharray="4 2"
            />
            <Area
              dataKey="p75"
              type="monotone"
              fill="url(#fillP75api)"
              stroke="var(--chart-1)"
              strokeWidth={2}
            />
            <Area
              dataKey="p95"
              type="monotone"
              fill="none"
              stroke="var(--chart-5)"
              strokeWidth={1}
              strokeDasharray="4 2"
            />
          </AreaChart>
        </ChartContainer>
      )}
    </PanelWrapper>
  );
}
