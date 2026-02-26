"use client";

import type { ConvertingPageRow } from "@/lib/analytics-types";
import { PanelWrapper } from "./panel-wrapper";

interface TopConvertingPanelProps {
  data: ConvertingPageRow[];
}

export function TopConvertingPanel({ data }: TopConvertingPanelProps) {
  return (
    <PanelWrapper
      title="Top Converting Posts"
      tooltip="Pages that visitors were reading when they subscribed to the newsletter"
    >
      {data.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">
          No conversion data yet
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Page</th>
                <th className="pb-2 font-medium text-right">Subscribers</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={row.source_page}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-2 pr-4 max-w-[400px] truncate" title={row.source_page}>
                    {row.source_page}
                  </td>
                  <td className="py-2 text-right font-mono">
                    {row.subscriber_count}
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
