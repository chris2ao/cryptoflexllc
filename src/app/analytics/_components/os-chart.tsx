"use client";

import { Cell, Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { OsRow } from "@/lib/analytics-types";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "oklch(0.6 0.15 250)",
  "oklch(0.7 0.12 130)",
  "oklch(0.65 0.18 340)",
];

export function OsChart({ data }: { data: OsRow[] }) {
  const total = data.reduce((sum, r) => sum + r.count, 0);

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Operating Systems</h2>
        <p className="text-muted-foreground text-sm text-center py-8">No data yet</p>
      </div>
    );
  }

  const chartConfig: ChartConfig = Object.fromEntries(
    data.map((row, i) => [
      row.os,
      { label: row.os, color: COLORS[i % COLORS.length] },
    ])
  );

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">Operating Systems</h2>
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="os" />} />
          <Pie
            data={data}
            dataKey="count"
            nameKey="os"
            innerRadius={60}
            outerRadius={90}
            strokeWidth={2}
            stroke="var(--background)"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                        {total.toLocaleString()}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-xs">
                        Total
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
