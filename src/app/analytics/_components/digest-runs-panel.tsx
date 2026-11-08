import type { DigestRunRow } from "@/lib/analytics-queries/newsletter";

function clickThrough(clicks: number, recipients: number): string {
  if (recipients <= 0) return "n/a";
  return `${((clicks / recipients) * 100).toFixed(1)}%`;
}

export function DigestRunsPanel({ runs }: { runs: DigestRunRow[] }) {
  if (runs.length === 0) {
    return (
      <p className="ax-empty">
        No digest sends recorded yet (the Monday cron writes one row per send)
      </p>
    );
  }
  return (
    <div className="ax-tbl-scroll">
      <table className="ax-tbl">
        <thead>
          <tr>
            <th>Date</th>
            <th>Recipients</th>
            <th>Sent</th>
            <th>Failed</th>
            <th>Duration</th>
            <th>Clicks (7d)</th>
            <th>Click-through</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((r) => (
            <tr key={r.ran_at}>
              <td className="ax-nowrap">{new Date(r.ran_at).toLocaleDateString()}</td>
              <td>{r.recipients}</td>
              <td>{r.sent}</td>
              <td>{r.failed}</td>
              <td className="ax-nowrap">{(r.duration_ms / 1000).toFixed(1)}s</td>
              <td>
                {r.clicks7d}
                {r.partial && (
                  <span className="ax-nowrap" title="Seven-day window still open">
                    {" "}so far
                  </span>
                )}
              </td>
              <td className="ax-nowrap">{clickThrough(r.clicks7d, r.recipients)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
