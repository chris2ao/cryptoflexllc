import { IpLink } from "./ip-link";
import type { KnownBadRow } from "@/lib/analytics-queries/security-intel";

export function KnownBadPanel({ rows }: { rows: KnownBadRow[] }) {
  if (rows.length === 0) {
    return <p className="ax-empty">No known-bad visitors in range</p>;
  }
  return (
    <div className="ax-tbl-scroll">
      <table className="ax-tbl">
        <thead>
          <tr>
            <th>IP</th>
            <th>Reasons</th>
            <th>Hits</th>
            <th>Last seen</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.ip}>
              <td>
                <IpLink ip={r.ip} />
              </td>
              <td>
                <span className="ax-chip-row">
                  {r.reasons.map((reason) => (
                    <span key={reason} className="chip">
                      {reason}
                    </span>
                  ))}
                </span>
              </td>
              <td className="ax-nowrap">{r.hits.toLocaleString()}</td>
              <td className="ax-nowrap ax-muted">
                {r.last ? new Date(r.last).toLocaleString() : "n/a"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
