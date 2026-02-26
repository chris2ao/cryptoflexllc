"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ClientErrorTrendRow, ClientErrorRow } from "@/lib/analytics-types";
import { PanelWrapper } from "./panel-wrapper";

const chartConfig = {
  error_count: {
    label: "Errors",
    color: "var(--chart-5)",
  },
  unique_errors: {
    label: "Unique",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

interface ClientErrorsPanelProps {
  trend: ClientErrorTrendRow[];
  recent: ClientErrorRow[];
  totalCount: number;
}

export function ClientErrorsPanel({
  trend,
  recent,
  totalCount,
}: ClientErrorsPanelProps) {
  return (
    <div className="space-y-8">
      {/* Trend chart */}
      <PanelWrapper
        title="Client Errors"
        tooltip="JavaScript errors captured from visitor browsers via window.onerror and unhandledrejection listeners"
        badge={
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {totalCount} total
          </span>
        }
      >
        {trend.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            No errors recorded yet
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <AreaChart
              data={trend}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillErrors" x1="0" y1="0" x2="0" y2="1">
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
                <linearGradient id="fillUnique" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="error_count"
                type="monotone"
                fill="url(#fillErrors)"
                stroke="var(--chart-5)"
                strokeWidth={2}
              />
              <Area
                dataKey="unique_errors"
                type="monotone"
                fill="url(#fillUnique)"
                stroke="var(--chart-4)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </PanelWrapper>

      {/* Recent errors table */}
      {recent.length > 0 && (
        <PanelWrapper
          title="Recent Errors"
          tooltip="Most recent client-side errors with type, page, and browser info"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Time</th>
                  <th className="pb-2 pr-4 font-medium">Type</th>
                  <th className="pb-2 pr-4 font-medium">Message</th>
                  <th className="pb-2 pr-4 font-medium">Page</th>
                  <th className="pb-2 font-medium">Browser</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((err) => (
                  <tr
                    key={err.id}
                    className="border-b border-border/50 last:border-0"
                  >
                    <td className="py-2 pr-4 text-muted-foreground whitespace-nowrap">
                      {new Date(err.recorded_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-2 pr-4">
                      <span className="inline-block rounded bg-destructive/10 px-1.5 py-0.5 text-xs text-destructive">
                        {err.error_type}
                      </span>
                    </td>
                    <td
                      className="py-2 pr-4 max-w-[300px] truncate"
                      title={err.error_message}
                    >
                      {err.error_message}
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground whitespace-nowrap">
                      {err.page_path}
                    </td>
                    <td className="py-2 text-muted-foreground whitespace-nowrap">
                      {err.browser}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelWrapper>
      )}
    </div>
  );
}
