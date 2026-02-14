"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { CountryRow } from "@/lib/analytics-types";
import { PanelWrapper } from "./panel-wrapper";

const chartConfig = {
  views: {
    label: "Views",
    color: "var(--chart-3)",
  },
  unique_visitors: {
    label: "Unique",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function CountriesChart({ data }: { data: CountryRow[] }) {
  if (data.length === 0) {
    return (
      <PanelWrapper
        title="Countries"
        tooltip="Top countries by page views and unique visitors"
      >
        <p className="text-muted-foreground text-sm text-center py-8">No data yet</p>
      </PanelWrapper>
    );
  }

  const top10 = data.slice(0, 10);

  return (
    <PanelWrapper
      title="Countries"
      tooltip="Top countries by page views and unique visitors"
    >
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart data={top10} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <YAxis
            dataKey="country"
            type="category"
            tickLine={false}
            axisLine={false}
            width={100}
            tick={{ fontSize: 11 }}
          />
          <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="views" fill="var(--chart-3)" radius={[0, 4, 4, 0]} barSize={16} />
          <Bar dataKey="unique_visitors" fill="var(--chart-4)" radius={[0, 4, 4, 0]} barSize={16} />
        </BarChart>
      </ChartContainer>
    </PanelWrapper>
  );
}
