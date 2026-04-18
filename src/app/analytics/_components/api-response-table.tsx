"use client";

import { useMemo, useState } from "react";
import type { ApiMetricRow } from "@/lib/analytics-types";

type SortKey =
  | "endpoint"
  | "method"
  | "total_count"
  | "avg_ms"
  | "p50"
  | "p75"
  | "p95"
  | "error_count";
type SortDir = "asc" | "desc";

const SORTABLE_KEYS: ReadonlySet<SortKey> = new Set([
  "endpoint",
  "method",
  "total_count",
  "avg_ms",
  "p50",
  "p75",
  "p95",
  "error_count",
]);

function compareBy(a: ApiMetricRow, b: ApiMetricRow, key: SortKey, dir: SortDir) {
  const av = a[key];
  const bv = b[key];
  if (typeof av === "number" && typeof bv === "number") {
    return dir === "asc" ? av - bv : bv - av;
  }
  const sa = String(av ?? "");
  const sb = String(bv ?? "");
  return dir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
}

type Props = {
  endpoints: ApiMetricRow[];
};

export function ApiResponseTable({ endpoints }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("total_count");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    const copy = [...endpoints];
    copy.sort((a, b) => compareBy(a, b, sortKey, sortDir));
    return copy;
  }, [endpoints, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (!SORTABLE_KEYS.has(key)) return;
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "endpoint" || key === "method" ? "asc" : "desc");
    }
  };

  if (!endpoints || endpoints.length === 0) {
    return (
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--fg-3)",
          padding: 16,
        }}
      >
        No API metrics in range
      </p>
    );
  }

  const renderHeader = (key: SortKey, label: string, className?: string) => {
    const isSorted = sortKey === key;
    const arrow = isSorted ? (sortDir === "asc" ? "↑" : "↓") : "";
    return (
      <th
        onClick={() => handleSort(key)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleSort(key);
          }
        }}
        tabIndex={0}
        className={`${className ?? ""} ${isSorted ? "sorted" : ""}`.trim()}
        aria-sort={
          isSorted
            ? sortDir === "asc"
              ? "ascending"
              : "descending"
            : "none"
        }
      >
        {label} {arrow && <span className="arr">{arrow}</span>}
      </th>
    );
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="ax-tbl">
        <thead>
          <tr>
            {renderHeader("endpoint", "Endpoint")}
            {renderHeader("method", "Method")}
            {renderHeader("total_count", "Requests", "num")}
            {renderHeader("avg_ms", "Avg", "num")}
            {renderHeader("p50", "P50", "num")}
            {renderHeader("p75", "P75", "num")}
            {renderHeader("p95", "P95", "num")}
            {renderHeader("error_count", "Errors", "num")}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const isErrHeavy = row.error_count > 5;
            const methodClass =
              row.method === "POST"
                ? "ok"
                : row.method === "DELETE"
                  ? "err"
                  : row.method === "PUT" || row.method === "PATCH"
                    ? "warn"
                    : "info";
            return (
              <tr key={`${row.endpoint}-${row.method}-${i}`}>
                <td>
                  <b>{row.endpoint}</b>
                </td>
                <td>
                  <span className={`ax-status-pill ${methodClass}`}>
                    {row.method}
                  </span>
                </td>
                <td className="num">{row.total_count.toLocaleString()}</td>
                <td className="num">{Math.round(row.avg_ms)}</td>
                <td className="num">{Math.round(row.p50)}</td>
                <td className="num">{Math.round(row.p75)}</td>
                <td className="num">{Math.round(row.p95)}</td>
                <td
                  className="num"
                  style={{ color: isErrHeavy ? "var(--ax-red)" : undefined }}
                >
                  {row.error_count}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
