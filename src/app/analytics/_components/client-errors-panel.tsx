"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { IpLink } from "./ip-link";
import type { ClientErrorTrendRow, ClientErrorRow } from "@/lib/analytics-types";

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
    <div>
      <div className="ax-block">
        <p className="ax-subhead">
          Client errors <span className="ax-pill">{totalCount} total</span>
        </p>
        {trend.length === 0 ? (
          <p className="ax-empty">No errors recorded yet</p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <AreaChart
              data={trend}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillErrors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-5)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--chart-5)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillUnique" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0} />
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
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
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
      </div>

      {recent.length > 0 && (
        <div className="ax-block">
          <p className="ax-subhead">Recent errors</p>
          <div className="ax-tbl-scroll">
            <table className="ax-tbl ax-tbl-static">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Message</th>
                  <th>Page</th>
                  <th>Browser</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((err) => (
                  <tr key={err.id}>
                    <td className="muted" style={{ whiteSpace: "nowrap" }}>
                      {new Date(err.recorded_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>
                      <span className="ax-pill ax-pill--bad">{err.error_type}</span>
                    </td>
                    <td className="trunc" title={err.error_message}>
                      {err.error_message}
                    </td>
                    <td className="muted" style={{ whiteSpace: "nowrap" }}>
                      {err.page_path}
                    </td>
                    <td className="muted" style={{ whiteSpace: "nowrap" }}>
                      {err.browser}
                    </td>
                    <td>
                      <IpLink ip={err.ip_address} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
