"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { AuthAttemptRow } from "@/lib/analytics-types";

const chartConfig = {
  success_count: {
    label: "Success",
    color: "var(--ax-green)",
  },
  fail_count: {
    label: "Failed",
    color: "var(--ax-red)",
  },
} satisfies ChartConfig;

export function AuthAttemptsChart({ data }: { data: AuthAttemptRow[] }) {
  const totalFailed = data.reduce((s, r) => s + r.fail_count, 0);

  if (data.length === 0) {
    return (
      <p className="ax-empty">No data in range</p>
    );
  }

  return (
    <>
      {totalFailed > 0 && (
        <span className="ax-chart-badge ax-chart-badge--bad">
          {totalFailed} failed
        </span>
      )}
      <div className="ax-chart">
      <ChartContainer config={chartConfig} className="ax-chart-fill">
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
        >
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
          <Bar
            dataKey="success_count"
            stackId="a"
            fill="var(--ax-green)"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="fail_count"
            stackId="a"
            fill="var(--ax-red)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
      </div>
    </>
  );
}
