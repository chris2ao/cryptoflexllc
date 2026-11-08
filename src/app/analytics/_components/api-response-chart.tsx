"use client";

import type { ApiMetricRow, ApiMetricDailyRow } from "@/lib/analytics-types";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const trendConfig = {
  p50: { label: "p50", color: "var(--ax-green)" },
  p75: { label: "p75", color: "var(--primary)" },
  p95: { label: "p95", color: "var(--ax-red)" },
} satisfies ChartConfig;

type Rating = "good" | "warn" | "bad";

function getRating(p75: number): Rating {
  if (p75 <= 200) return "good";
  if (p75 <= 500) return "warn";
  return "bad";
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
    return <p className="ax-empty">No data in range</p>;
  }

  return (
    <>
      {hasEndpoints && (
        <div className="ax-endpoints">
          {endpoints.map((ep) => {
            const errorPct =
              ep.total_count > 0
                ? Math.round((ep.error_count / ep.total_count) * 100)
                : 0;
            const rating = getRating(ep.p75);
            return (
              <div
                key={`${ep.method}-${ep.endpoint}`}
                className={`ax-endpoint ax-endpoint--${rating}`}
              >
                <div className="ax-endpoint-head">
                  <span>
                    <span className="ax-endpoint-method">{ep.method}</span>
                    {ep.endpoint}
                  </span>
                  <span>
                    <span className={`ax-endpoint-p75 ax-endpoint-p75--${rating}`}>
                      {Math.round(ep.p75)}ms
                    </span>{" "}
                    p75
                  </span>
                </div>
                <div className="ax-endpoint-meta">
                  <span>
                    p50: {Math.round(ep.p50)}ms &middot; p95:{" "}
                    {Math.round(ep.p95)}ms &middot;{" "}
                    {ep.total_count.toLocaleString()} calls
                  </span>
                  {errorPct > 0 && (
                    <span className="ax-endpoint-err">{errorPct}% errors</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {hasDaily && (
        <div className="ax-chart">
        <ChartContainer config={trendConfig} className="ax-chart-fill">
          <AreaChart
            data={daily}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillP75api" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--primary)"
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
              stroke="var(--ax-green)"
              strokeWidth={1}
              strokeDasharray="4 2"
            />
            <Area
              dataKey="p75"
              type="monotone"
              fill="url(#fillP75api)"
              stroke="var(--primary)"
              strokeWidth={2}
            />
            <Area
              dataKey="p95"
              type="monotone"
              fill="none"
              stroke="var(--ax-red)"
              strokeWidth={1}
              strokeDasharray="4 2"
            />
          </AreaChart>
        </ChartContainer>
        </div>
      )}
    </>
  );
}
