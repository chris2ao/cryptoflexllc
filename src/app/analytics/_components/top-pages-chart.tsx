"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { TopPageRow } from "@/lib/analytics-types";

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
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Top Pages</h2>
        <p className="text-muted-foreground text-sm text-center py-8">No data yet</p>
      </div>
    );
  }

  // Take top 10 and truncate long paths for display
  const top10 = data.slice(0, 10).map((row) => ({
    ...row,
    short_path: row.page_path.length > 30
      ? "..." + row.page_path.slice(-27)
      : row.page_path,
  }));

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">Top Pages</h2>
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
    </div>
  );
}
