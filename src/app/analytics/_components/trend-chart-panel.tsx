"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export type TrendPoint = { date: string; value: number };
export type ViewsBreakdownPoint = {
  date: string;
  total: number;
  new: number;
  returning: number;
};

export type TrendSeries = {
  views: ViewsBreakdownPoint[];
  uniques: TrendPoint[];
  bounce: TrendPoint[];
  new: TrendPoint[];
};

type Mode = "area" | "line" | "bar";
type MetricKey = keyof TrendSeries;

const METRIC_LABELS: Record<MetricKey, string> = {
  views: "Total Views",
  uniques: "Unique Visitors",
  bounce: "Bounce Rate",
  new: "New Visitors",
};

const VIEWS_SERIES = [
  { key: "total", label: "Total Views", color: "var(--primary)" },
  { key: "new", label: "New Visitors", color: "var(--ax-green)" },
  { key: "returning", label: "Returning", color: "var(--ax-amber)" },
] as const;

function formatDate(value: string) {
  const d = new Date(value + "T00:00:00");
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function readKpiFromBody(): MetricKey {
  if (typeof document === "undefined") return "views";
  const raw = document.body.dataset.axKpi as MetricKey | undefined;
  if (raw && raw in METRIC_LABELS) return raw;
  return "views";
}

type Props = {
  series: TrendSeries;
  days: number;
};

export function TrendChartPanel({ series, days }: Props) {
  const [mode, setMode] = useState<Mode>("area");
  const [metric, setMetric] = useState<MetricKey>(() => readKpiFromBody());

  useEffect(() => {
    if (typeof document === "undefined") return;
    const observer = new MutationObserver(() => {
      setMetric(readKpiFromBody());
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-ax-kpi"],
    });
    return () => observer.disconnect();
  }, []);

  const isMulti = metric === "views";
  const data = series[metric] ?? [];
  const label = METRIC_LABELS[metric];

  const chartConfig = useMemo<ChartConfig>(() => {
    if (isMulti) {
      return VIEWS_SERIES.reduce((acc, s) => {
        acc[s.key] = { label: s.label, color: s.color };
        return acc;
      }, {} as ChartConfig);
    }
    return {
      value: {
        label,
        color: "var(--primary)",
      },
    };
  }, [label, isMulti]);

  const isEmpty = !data || data.length === 0;

  return (
    <div className="ax-panel-card">
      <div className="ax-panel-head">
        <div className="t">
          <span className="dot" aria-hidden="true" />
          <span>{label}</span>
          <span className="n">LAST {days}D</span>
        </div>
        <div className="actions" role="group" aria-label="Chart display mode">
          {(["area", "line", "bar"] as const).map((m) => (
            <button
              key={m}
              type="button"
              className={`chip${mode === m ? " on" : ""}`}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <div className="ax-panel-body">
        {isEmpty ? (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--fg-3)",
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            No data in range
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            {mode === "area" ? (
              <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  {isMulti ? (
                    VIEWS_SERIES.map((s) => (
                      <linearGradient key={s.key} id={`trendFill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={s.color} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                      </linearGradient>
                    ))
                  ) : (
                    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  )}
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatDate}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  allowDecimals={false}
                />
                <ChartTooltip content={<ChartTooltipContent labelFormatter={formatDate} />} />
                {isMulti ? (
                  VIEWS_SERIES.map((s) => (
                    <Area
                      key={s.key}
                      dataKey={s.key}
                      name={s.label}
                      type="monotone"
                      fill={`url(#trendFill-${s.key})`}
                      stroke={s.color}
                      strokeWidth={2}
                    />
                  ))
                ) : (
                  <Area
                    dataKey="value"
                    type="monotone"
                    fill="url(#trendFill)"
                    stroke="var(--primary)"
                    strokeWidth={2}
                  />
                )}
              </AreaChart>
            ) : mode === "line" ? (
              <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatDate}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  allowDecimals={false}
                />
                <ChartTooltip content={<ChartTooltipContent labelFormatter={formatDate} />} />
                {isMulti ? (
                  VIEWS_SERIES.map((s) => (
                    <Line
                      key={s.key}
                      dataKey={s.key}
                      name={s.label}
                      type="monotone"
                      stroke={s.color}
                      strokeWidth={2}
                      dot={{ r: 3, fill: "var(--background)", stroke: s.color }}
                    />
                  ))
                ) : (
                  <Line
                    dataKey="value"
                    type="monotone"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "var(--background)", stroke: "var(--primary)" }}
                  />
                )}
              </LineChart>
            ) : (
              <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatDate}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  allowDecimals={false}
                />
                <ChartTooltip content={<ChartTooltipContent labelFormatter={formatDate} />} />
                {isMulti ? (
                  VIEWS_SERIES.map((s) => (
                    <Bar
                      key={s.key}
                      dataKey={s.key}
                      name={s.label}
                      fill={s.color}
                      radius={[2, 2, 0, 0]}
                    />
                  ))
                ) : (
                  <Bar dataKey="value" fill="var(--primary)" radius={[2, 2, 0, 0]} />
                )}
              </BarChart>
            )}
          </ChartContainer>
        )}
      </div>
      {isMulti && !isEmpty && (
        <div className="ax-chart-legend" role="list" aria-label="Chart legend">
          {VIEWS_SERIES.map((s) => (
            <span key={s.key} className="ax-chart-legend-item" role="listitem">
              <span className="ax-chart-legend-dot" style={{ background: s.color }} aria-hidden="true" />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
