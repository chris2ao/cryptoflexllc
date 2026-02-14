"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { TopPageRow } from "@/lib/analytics-types";
import { PanelWrapper } from "./panel-wrapper";

const chartConfig = {
  views: {
    label: "Views",
    color: "var(--chart-1)",
  },
  unique_views: {
    label: "Unique",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function TopPagesChart({ data }: { data: TopPageRow[] }) {
  if (data.length === 0) {
    return (
      <PanelWrapper
        title="Top Pages"
        tooltip="Most visited pages ranked by total and unique views"
      >
        <p className="text-muted-foreground text-sm text-center py-8">No data yet</p>
      </PanelWrapper>
    );
  }

  const top10 = data.slice(0, 10).map((row) => ({
    ...row,
    short_path: row.page_path.length > 30
      ? "..." + row.page_path.slice(-27)
      : row.page_path,
  }));

  return (
    <PanelWrapper
      title="Top Pages"
      tooltip="Most visited pages ranked by total and unique views"
    >
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart data={top10} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <YAxis
            dataKey="short_path"
            type="category"
            tickLine={false}
            axisLine={false}
            width={140}
            tick={{ fontSize: 11 }}
          />
          <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_: string, payload: Array<{ payload?: { page_path?: string } }>) =>
                  payload[0]?.payload?.page_path || ""
                }
              />
            }
          />
          <Bar dataKey="views" fill="var(--chart-1)" radius={[0, 4, 4, 0]} barSize={16} />
          <Bar dataKey="unique_views" fill="var(--chart-2)" radius={[0, 4, 4, 0]} barSize={16} />
        </BarChart>
      </ChartContainer>
    </PanelWrapper>
  );
}
