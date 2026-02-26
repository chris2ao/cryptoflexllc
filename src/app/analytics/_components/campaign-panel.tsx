"use client";

import type { CampaignRow } from "@/lib/analytics-types";
import { PanelWrapper } from "./panel-wrapper";

interface CampaignPanelProps {
  campaigns: CampaignRow[];
}

export function CampaignPanel({ campaigns }: CampaignPanelProps) {
  const sorted = [...campaigns].sort((a, b) => b.visit_count - a.visit_count);

  return (
    <PanelWrapper
      title="Campaign Performance"
      tooltip="UTM-tagged traffic grouped by source, medium, and campaign name. Only visits with utm_source set are included."
    >
      {sorted.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">
          No campaign data yet
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Source</th>
                <th className="pb-2 pr-4 font-medium">Medium</th>
                <th className="pb-2 pr-4 font-medium">Campaign</th>
                <th className="pb-2 font-medium text-right">Visits</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-2 pr-4 font-medium">{row.utm_source}</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    {row.utm_medium}
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    {row.utm_campaign ?? (
                      <span className="italic text-muted-foreground/60">
                        (none)
                      </span>
                    )}
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {row.visit_count.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PanelWrapper>
  );
}
