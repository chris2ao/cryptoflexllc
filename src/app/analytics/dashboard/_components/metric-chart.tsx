"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartDataPoint {
  label: string;
  processed: number;
  trashed: number;
  kept: number;
}

interface MetricChartProps {
  data: ChartDataPoint[];
}

interface TooltipPayloadItem {
  color: string;
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "#1a1a3e",
        border: "2px solid #6a6aaa",
        padding: "8px 12px",
        fontFamily: "'VT323', monospace",
        fontSize: "16px",
        color: "#f0f0f0",
        boxShadow: "4px 4px 0px #000",
      }}
    >
      <div style={{ marginBottom: "4px", color: "#ffd700", fontSize: "12px" }}>{label}</div>
      {payload.map((entry) => (
        <div key={entry.name} style={{ color: entry.color }}>
          {entry.name.toUpperCase()}: {entry.value}
        </div>
      ))}
    </div>
  );
}

export default function MetricChart({ data }: MetricChartProps) {
  if (data.length === 0) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'VT323', monospace",
          fontSize: "20px",
          color: "#6060a0",
        }}
      >
        --- NO DATA ---
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
        barGap={2}
      >
        <CartesianGrid
          strokeDasharray="4 4"
          stroke="#2a2a5a"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fill: "#a0a0c0", fontFamily: "'VT323', monospace", fontSize: 14 }}
          axisLine={{ stroke: "#6a6aaa" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#a0a0c0", fontFamily: "'VT323', monospace", fontSize: 14 }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,215,0,0.05)" }} />
        <Legend
          wrapperStyle={{
            fontFamily: "'VT323', monospace",
            fontSize: "14px",
            color: "#a0a0c0",
          }}
        />
        <Bar dataKey="processed" fill="#ffd700" name="processed" maxBarSize={40} />
        <Bar dataKey="trashed" fill="#cc4444" name="trashed" maxBarSize={40} />
        <Bar dataKey="kept" fill="#44cc44" name="kept" maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
