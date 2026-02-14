"use client";

import { Cell, Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { BrowserRow } from "@/lib/analytics-types";
import { PanelWrapper } from "./panel-wrapper";

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

export function BrowserChart({ data }: { data: BrowserRow[] }) {
  const total = data.reduce((sum, r) => sum + r.count, 0);

  if (data.length === 0) {
    return (
      <PanelWrapper
        title="Browsers"
        tooltip="Browser distribution across all page views"
      >
        <p className="text-muted-foreground text-sm text-center py-8">No data yet</p>
      </PanelWrapper>
    );
  }

  const chartConfig: ChartConfig = Object.fromEntries(
    data.map((row, i) => [
      row.browser,
      { label: row.browser, color: COLORS[i % COLORS.length] },
    ])
  );

  return (
    <PanelWrapper
      title="Browsers"
      tooltip="Browser distribution across all page views"
    >
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="browser" />} />
          <Pie
            data={data}
            dataKey="count"
            nameKey="browser"
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
    </PanelWrapper>
  );
}
