"use client";

import type { SearchQueryRow } from "@/lib/analytics-types";
import { PanelWrapper } from "./panel-wrapper";

interface SearchQueriesPanelProps {
  queries: SearchQueryRow[];
}

export function SearchQueriesPanel({ queries }: SearchQueriesPanelProps) {
  const top20 = queries
    .slice()
    .sort((a, b) => b.search_count - a.search_count)
    .slice(0, 20);

  return (
    <PanelWrapper
      title="Top Searches"
      tooltip="Search queries entered by visitors on the blog, deduplicated per IP per hour"
    >
      {top20.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">
          No search data yet
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Query</th>
                <th className="pb-2 font-medium text-right">Count</th>
              </tr>
            </thead>
            <tbody>
              {top20.map((row) => (
                <tr
                  key={row.query}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-2 pr-4 max-w-[400px] truncate" title={row.query}>
                    {row.query}
                  </td>
                  <td className="py-2 text-right tabular-nums text-muted-foreground">
                    {row.search_count.toLocaleString()}
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
