"use client";

import { useMemo, useState } from "react";
import { IpOsintPanel, useIpOsintPanel } from "./ip-osint-panel";
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

interface RecentVisitsTableProps {
  data: RecentVisit[];
}

export function RecentVisitsTable({ data }: RecentVisitsTableProps) {
  const osint = useIpOsintPanel();
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(() => {
    if (filter === "all") return data;
    return data.filter((r) => classify(r) === filter);
  }, [data, filter]);

  const handleIpClick = (ip: string) => {
    osint.lookup(ip);
  };

  return (
    <>
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
        <div className="ax-panel-body" style={{ padding: 0, overflowX: "auto" }}>
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
                <th>Referrer</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: "center",
                      padding: "40px 12px",
                      color: "var(--fg-3)",
                    }}
                  >
                    No visits in this view
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td style={{ whiteSpace: "nowrap", color: "var(--fg-3)" }}>
                      {new Date(row.visited_at).toLocaleString()}
                    </td>
                    <td>
                      <b>{row.page_path}</b>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleIpClick(row.ip_address)}
                        style={{
                          background: "transparent",
                          border: 0,
                          padding: 0,
                          fontFamily: "var(--font-mono)",
                          color: "var(--primary)",
                          textDecoration: "underline",
                          textDecorationColor: "var(--accent-line)",
                          textUnderlineOffset: 3,
                          cursor: "pointer",
                        }}
                      >
                        {row.ip_address}
                      </button>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {[row.city, row.region, row.country]
                        .filter((v) => v && v !== "Unknown")
                        .join(", ") || "—"}
                    </td>
                    <td>{row.browser}</td>
                    <td>{row.os}</td>
                    <td>{row.device_type}</td>
                    <td
                      style={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "var(--fg-3)",
                      }}
                    >
                      {row.referrer}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <IpOsintPanel
        open={osint.open}
        onOpenChange={osint.setOpen}
        ip={osint.ip}
        data={osint.data}
        loading={osint.loading}
        error={osint.error}
      />
    </>
  );
}
