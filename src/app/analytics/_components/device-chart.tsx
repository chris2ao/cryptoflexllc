"use client";

import { Cell, Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DeviceRow } from "@/lib/analytics-types";
import { PanelWrapper } from "./panel-wrapper";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function DeviceChart({ data }: { data: DeviceRow[] }) {
  const total = data.reduce((sum, r) => sum + r.count, 0);

  if (data.length === 0) {
    return (
      <PanelWrapper
        title="Devices"
        tooltip="Desktop, mobile, tablet, and bot distribution"
      >
        <p className="text-muted-foreground text-sm text-center py-8">No data yet</p>
      </PanelWrapper>
    );
  }

  const chartConfig: ChartConfig = Object.fromEntries(
    data.map((row, i) => [
      row.device_type,
      { label: row.device_type, color: COLORS[i % COLORS.length] },
    ])
  );

  return (
    <PanelWrapper
      title="Devices"
      tooltip="Desktop, mobile, tablet, and bot distribution"
    >
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="device_type" />} />
          <Pie
            data={data}
            dataKey="count"
            nameKey="device_type"
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
