"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { AuthAttemptRow } from "@/lib/analytics-types";
import { PanelWrapper } from "./panel-wrapper";

const chartConfig = {
  success_count: {
    label: "Success",
    color: "var(--chart-2)",
  },
  fail_count: {
    label: "Failed",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function AuthAttemptsChart({ data }: { data: AuthAttemptRow[] }) {
  const totalFailed = data.reduce((s, r) => s + r.fail_count, 0);

  if (data.length === 0) {
    return (
      <PanelWrapper
        title="Auth Attempts"
        tooltip="Login success/failure trends — helps detect brute-force patterns"
      >
        <p className="text-muted-foreground text-sm text-center py-8">
          No login attempts recorded yet
        </p>
      </PanelWrapper>
    );
  }

  return (
    <PanelWrapper
      title="Auth Attempts"
      tooltip="Login success/failure trends — helps detect brute-force patterns"
      badge={
        totalFailed > 0 ? (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
            {totalFailed} failed
          </span>
        ) : undefined
      }
    >
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
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
            fill="var(--chart-2)"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="fail_count"
            stackId="a"
            fill="var(--chart-5)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </PanelWrapper>
  );
}
