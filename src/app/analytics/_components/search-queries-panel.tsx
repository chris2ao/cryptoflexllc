"use client";

import type { SearchQueryRow } from "@/lib/analytics-types";

interface SearchQueriesPanelProps {
  queries: SearchQueryRow[];
}

/** Search queries entered on the blog, deduplicated per IP per hour. */
export function SearchQueriesPanel({ queries }: SearchQueriesPanelProps) {
  const top20 = queries
    .slice()
    .sort((a, b) => b.search_count - a.search_count)
    .slice(0, 20);

  if (top20.length === 0) {
    return <p className="ax-empty">No search data yet</p>;
  }

  return (
    <div className="ax-tbl-scroll">
      <table className="ax-tbl ax-tbl-static">
        <thead>
          <tr>
            <th>Query</th>
            <th className="num">Count</th>
          </tr>
        </thead>
        <tbody>
          {top20.map((row) => (
            <tr key={row.query}>
              <td className="trunc" title={row.query}>
                {row.query}
              </td>
              <td className="num">{row.search_count.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
