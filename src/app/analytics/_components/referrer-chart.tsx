"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ReferrerRow } from "@/lib/analytics-types";
import { PanelWrapper } from "./panel-wrapper";

const chartConfig = {
  views: {
    label: "Views",
    color: "var(--chart-1)",
  },
  unique_visitors: {
    label: "Unique",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ReferrerChart({ data }: { data: ReferrerRow[] }) {
  if (data.length === 0) {
    return (
      <PanelWrapper
        title="Referrer Breakdown"
        tooltip="Where your traffic comes from — grouped by referring domain"
      >
        <p className="text-muted-foreground text-sm text-center py-8">
          No referrer data yet
        </p>
      </PanelWrapper>
    );
  }

  return (
    <PanelWrapper
      title="Referrer Breakdown"
      tooltip="Where your traffic comes from — grouped by referring domain"
    >
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <YAxis
            dataKey="referrer_domain"
            type="category"
            width={120}
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            tickFormatter={(v: string) =>
              v.length > 18 ? v.slice(0, 18) + "..." : v
            }
          />
          <XAxis type="number" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="views"
            fill="var(--chart-1)"
            radius={[0, 4, 4, 0]}
          />
          <Bar
            dataKey="unique_visitors"
            fill="var(--chart-2)"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ChartContainer>
    </PanelWrapper>
  );
}
