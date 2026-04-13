"use client";

import dynamic from "next/dynamic";
import metricsData from "@/data/dashboard/metrics.json";
import sessionsData from "@/data/dashboard/sessions.json";
import { SNESPanel } from "../_components/snes-panel";
import { SNESStatCard } from "../_components/snes-stat-card";
import { SNESTable, SNESTableColumn } from "../_components/snes-table";

// Dynamic import for Recharts — browser only
const MetricChart = dynamic(
  () => import("../_components/metric-chart"),
  { ssr: false }
);

interface GmailRun {
  timestamp: string;
  account: string;
  duration_seconds: number;
  emails_processed: number;
  promotions_trashed: number;
  newsletters_trashed: number;
  primary_kept: number;
  attention_email_sent: boolean;
  errors: string[];
}

interface SessionEntry {
  id: string;
  date: string;
  time: string;
  sizeBytes: number;
  sizeMB: string;
}

function formatTimestamp(ts: string): string {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const metricsColumns: SNESTableColumn<Record<string, unknown>>[] = [
  {
    key: "timestamp",
    header: "DATE",
    render: (row) => (
      <span style={{ fontFamily: "var(--snes-font-code)", fontSize: "14px" }}>
        {formatTimestamp(String(row.timestamp))}
      </span>
    ),
  },
  {
    key: "emails_processed",
    header: "PROCESSED",
    render: (row) => (
      <span style={{ color: "var(--snes-gold)" }}>{String(row.emails_processed)}</span>
    ),
  },
  {
    key: "promotions_trashed",
    header: "PROMO",
    render: (row) => (
      <span style={{ color: "var(--snes-fire)" }}>{String(row.promotions_trashed)}</span>
    ),
  },
  {
    key: "newsletters_trashed",
    header: "NEWSLETTER",
    render: (row) => (
      <span style={{ color: "var(--snes-fire)" }}>{String(row.newsletters_trashed)}</span>
    ),
  },
  {
    key: "primary_kept",
    header: "KEPT",
    render: (row) => (
      <span style={{ color: "var(--snes-hp)" }}>{String(row.primary_kept)}</span>
    ),
  },
  {
    key: "duration_seconds",
    header: "DURATION",
    render: (row) => (
      <span style={{ color: "var(--snes-text-muted)" }}>{String(row.duration_seconds)}s</span>
    ),
  },
  {
    key: "errors",
    header: "STATUS",
    render: (row) => {
      const errors = row.errors as string[];
      return errors.length > 0 ? (
        <span style={{ color: "var(--snes-fire)", fontSize: "12px" }}>
          ⚠ {errors[0]}
        </span>
      ) : (
        <span style={{ color: "var(--snes-hp)" }}>OK</span>
      );
    },
  },
];

const sessionColumns: SNESTableColumn<Record<string, unknown>>[] = [
  {
    key: "id",
    header: "ID",
    render: (row) => (
      <span style={{ fontFamily: "var(--snes-font-code)", color: "var(--snes-mp)" }}>
        {String(row.id)}
      </span>
    ),
    width: "100px",
  },
  {
    key: "date",
    header: "DATE",
    render: (row) => (
      <span>
        {String(row.date)} {String(row.time)}
      </span>
    ),
  },
  {
    key: "sizeMB",
    header: "SIZE",
    render: (row) => (
      <span style={{ color: "var(--snes-gold)" }}>{String(row.sizeMB)} MB</span>
    ),
    width: "80px",
  },
];

export default function MetricsPage() {
  const metrics = metricsData as GmailRun[];
  const sessions = sessionsData as SessionEntry[];

  const totalProcessed = metrics.reduce((sum, r) => sum + r.emails_processed, 0);
  const totalTrashed = metrics.reduce(
    (sum, r) => sum + r.promotions_trashed + r.newsletters_trashed,
    0
  );
  const avgDuration = metrics.length > 0
    ? Math.round(metrics.reduce((sum, r) => sum + r.duration_seconds, 0) / metrics.length)
    : 0;
  const errorCount = metrics.reduce((sum, r) => sum + r.errors.length, 0);

  // Data for MetricChart
  const chartData = metrics.map((r) => ({
    label: formatTimestamp(r.timestamp),
    processed: r.emails_processed,
    trashed: r.promotions_trashed + r.newsletters_trashed,
    kept: r.primary_kept,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--snes-space-4)" }}>
      {/* Page header */}
      <div>
        <h1
          style={{
            fontFamily: "var(--snes-font-heading)",
            fontSize: "var(--snes-text-h2)",
            color: "var(--snes-gold)",
            marginBottom: "var(--snes-space-1)",
          }}
        >
          ▲ METRICS
        </h1>
        <p style={{ color: "var(--snes-text-muted)", fontSize: "var(--snes-text-base)" }}>
          GMAIL ASSISTANT · SESSION ARCHIVES
        </p>
      </div>

      {/* Stats bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "var(--snes-space-3)",
        }}
      >
        <SNESStatCard value={metrics.length} label="RUNS" type="mp" />
        <SNESStatCard value={totalProcessed} label="PROCESSED" type="generic" />
        <SNESStatCard value={totalTrashed} label="TRASHED" type="fire" />
        <SNESStatCard value={`${avgDuration}s`} label="AVG DURATION" type="hp" />
        <SNESStatCard
          value={errorCount}
          label="ERRORS"
          type={errorCount > 0 ? "fire" : "hp"}
        />
        <SNESStatCard value={sessions.length} label="SESSIONS" type="xp" />
      </div>

      {/* Chart */}
      <SNESPanel title="EMAILS PROCESSED" subtitle="PER RUN">
        <div style={{ padding: "var(--snes-space-4)", height: "260px" }}>
          <MetricChart data={chartData} />
        </div>
      </SNESPanel>

      {/* Gmail runs table */}
      <SNESPanel title="GMAIL ASSISTANT RUNS" subtitle="RUN LOG">
        <SNESTable
          columns={metricsColumns}
          data={metrics as unknown as Record<string, unknown>[]}
          emptyMessage="--- NO RUN DATA ---"
        />
      </SNESPanel>

      {/* Session archive */}
      <SNESPanel title="SESSION ARCHIVE" subtitle="TRANSCRIPT FILES">
        <SNESTable
          columns={sessionColumns}
          data={sessions as unknown as Record<string, unknown>[]}
          emptyMessage="--- NO SESSIONS ---"
        />
      </SNESPanel>
    </div>
  );
}
