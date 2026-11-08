"use client";

import type { CampaignRow } from "@/lib/analytics-types";

interface CampaignPanelProps {
  campaigns: CampaignRow[];
}

export function CampaignPanel({ campaigns }: CampaignPanelProps) {
  const sorted = [...campaigns].sort((a, b) => b.visit_count - a.visit_count);

  if (sorted.length === 0) {
    return <p className="ax-empty">No campaign data yet</p>;
  }

  return (
    <div className="ax-tbl-scroll">
      <table className="ax-tbl ax-tbl-static">
        <thead>
          <tr>
            <th>Source</th>
            <th>Medium</th>
            <th>Campaign</th>
            <th className="num">Visits</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i}>
              <td>
                <b>{row.utm_source}</b>
              </td>
              <td className="muted">{row.utm_medium}</td>
              <td className="muted">{row.utm_campaign ?? "(none)"}</td>
              <td className="num">{row.visit_count.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
