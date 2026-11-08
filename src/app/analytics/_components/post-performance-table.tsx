"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PostPerformanceRow } from "@/lib/analytics-queries/posts";

type SortKey = "views" | "readers" | "read_through_pct" | "median_seconds";
type SortDir = "asc" | "desc";

const SORTABLE_KEYS: ReadonlySet<SortKey> = new Set([
  "views",
  "readers",
  "read_through_pct",
  "median_seconds",
]);

/** Single leading slash only: rejects protocol-relative and external URLs. */
function isInternalPath(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/\\");
}

function formatMedian(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function PostPerformanceTable({ rows }: { rows: PostPerformanceRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("views");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) =>
      sortDir === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
    );
    return copy;
  }, [rows, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (!SORTABLE_KEYS.has(key)) return;
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  if (!rows || rows.length === 0) {
    return <p className="ax-empty">No posts in range</p>;
  }

  const renderHeader = (key: SortKey, label: string) => {
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
        className={`num ${isSorted ? "sorted" : ""}`.trim()}
        aria-sort={isSorted ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
      >
        {label} {arrow && <span className="arr">{arrow}</span>}
      </th>
    );
  };

  return (
    <div className="ax-tbl-scroll">
      <table className="ax-tbl">
        <thead>
          <tr>
            <th scope="col" style={{ cursor: "default" }}>Post</th>
            {renderHeader("views", "Views")}
            {renderHeader("readers", "Readers")}
            {renderHeader("read_through_pct", "Read-through")}
            {renderHeader("median_seconds", "Median read")}
            <th scope="col" className="num" style={{ cursor: "default" }} title="All time, not limited to the range">Subscribes (all time)</th>
            <th scope="col" className="num" style={{ cursor: "default" }} title="All time, not limited to the range">Comments (all time)</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.page_path}>
              <td>
                {isInternalPath(row.page_path) ? (
                  <Link href={row.page_path} className="ax-link">
                    {row.title}
                  </Link>
                ) : (
                  <b>{row.title}</b>
                )}
              </td>
              <td className="num">{row.views.toLocaleString()}</td>
              <td className="num">{row.readers.toLocaleString()}</td>
              <td className="num">{`${row.read_through_pct.toFixed(1)}%`}</td>
              <td className="num">{formatMedian(row.median_seconds)}</td>
              <td className="num">{row.subscribes.toLocaleString()}</td>
              <td className="num">{row.comments.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
