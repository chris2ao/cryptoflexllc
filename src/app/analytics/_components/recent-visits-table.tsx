"use client";

import { useMemo, useState } from "react";
import { IpLink } from "./ip-link";
import type { RecentVisit } from "@/lib/analytics-types";

type Filter = "all" | "hit" | "api";

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "All" },
  { id: "hit", label: "Hits" },
  { id: "api", label: "API" },
];

function classify(row: RecentVisit): "hit" | "api" {
  if (row.page_path.startsWith("/api/")) return "api";
  return "hit";
}

function location(row: RecentVisit): string {
  return (
    [row.city, row.region, row.country]
      .filter((v) => v && v !== "Unknown")
      .join(", ") || "n/a"
  );
}

interface RecentVisitsTableProps {
  data: RecentVisit[];
}

/**
 * The visit log. Each IP is an IpLink, so the visitor dossier panel mounted
 * once in the page opens for it; this table owns no lookup state of its own.
 */
export function RecentVisitsTable({ data }: RecentVisitsTableProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(() => {
    if (filter === "all") return data;
    return data.filter((r) => classify(r) === filter);
  }, [data, filter]);

  return (
    <div className="ax-panel-card">
      <div className="ax-panel-head">
        <div className="t">
          <span className="dot" aria-hidden="true" />
          <span>Recent visits</span>
          <span className="n">{rows.length.toLocaleString()} ROWS</span>
        </div>
        <div className="actions" role="group" aria-label="Filter visits">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`chip${filter === f.id ? " on" : ""}`}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="ax-panel-body ax-tbl-scroll">
        <table className="ax-tbl">
          <thead>
            <tr>
              <th>Time</th>
              <th>Path</th>
              <th>IP</th>
              <th>Location</th>
              <th>Browser</th>
              <th>OS</th>
              <th>Device</th>
              <th>Class</th>
              <th>Referrer</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="ax-tbl-empty">
                  No visits in this view
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td className="ax-nowrap ax-muted">
                    {new Date(row.visited_at).toLocaleString()}
                  </td>
                  <td>
                    <b>{row.page_path}</b>
                  </td>
                  <td>
                    <IpLink ip={row.ip_address} />
                  </td>
                  <td className="ax-nowrap">{location(row)}</td>
                  <td>{row.browser}</td>
                  <td>{row.os}</td>
                  <td>{row.device_type}</td>
                  <td>
                    {row.traffic_class ? (
                      <span className="chip">{row.traffic_class}</span>
                    ) : (
                      <span className="ax-muted">n/a</span>
                    )}
                  </td>
                  <td
                    className="ax-ellipsis ax-muted"
                    title={row.referrer_host || row.referrer}
                  >
                    {row.referrer_host || row.referrer}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
