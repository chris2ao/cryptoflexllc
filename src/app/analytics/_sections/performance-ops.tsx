import { loadOps } from "@/lib/analytics-queries/ops";
import { AxPanel } from "../_components/ax-panel";

function mb(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function when(iso: string): string {
  return iso ? new Date(iso).toLocaleString() : "n/a";
}

function shorten(note: string, max = 60): string {
  return note.length > max ? `${note.slice(0, max - 1)}…` : note;
}

/**
 * Ops panels for the Performance tab: table sizes, cron runs and server
 * events from the last seven days.
 */
export async function PerformanceOps() {
  const { tables, cronRuns, serverEvents7d } = await loadOps();
  const topTables = tables.slice(0, 10);

  return (
    <div className="ax-grid-3" style={{ marginBottom: 20 }}>
      <AxPanel title="Tables" kicker={`TOP ${topTables.length}`}>
        {topTables.length === 0 ? (
          <p className="ax-empty">No table statistics available</p>
        ) : (
          <div className="ax-tbl-scroll">
            <table className="ax-tbl">
              <thead>
                <tr>
                  <th>Table</th>
                  <th>Rows</th>
                  <th>Size</th>
                </tr>
              </thead>
              <tbody>
                {topTables.map((t) => (
                  <tr key={t.name}>
                    <td>{t.name}</td>
                    <td>{t.rows.toLocaleString()}</td>
                    <td className="ax-nowrap">{mb(t.bytes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AxPanel>

      <AxPanel title="Cron runs" kicker={`LAST ${cronRuns.length}`}>
        {cronRuns.length === 0 ? (
          <p className="ax-empty">No cron runs recorded yet</p>
        ) : (
          <div className="ax-tbl-scroll">
            <table className="ax-tbl">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>When</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {cronRuns.map((r) => (
                  <tr key={`${r.name}-${r.ran_at}`}>
                    <td>{r.name}</td>
                    <td className="ax-nowrap ax-muted">{when(r.ran_at)}</td>
                    <td>
                      <span className={`chip ${r.ok ? "ax-ops-ok" : "ax-ops-fail"}`}>
                        {r.ok ? "ok" : "failed"}
                      </span>
                    </td>
                    <td className="ax-nowrap">{(r.duration_ms / 1000).toFixed(1)}s</td>
                    <td className="ax-muted">{shorten(r.note)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AxPanel>

      <AxPanel title="Server events (7d)" kicker={`${serverEvents7d.length} GROUPS`}>
        {serverEvents7d.length === 0 ? (
          <p className="ax-empty">No server events in the last 7 days</p>
        ) : (
          <div className="ax-tbl-scroll">
            <table className="ax-tbl">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Kind</th>
                  <th>Count</th>
                  <th>Last</th>
                </tr>
              </thead>
              <tbody>
                {serverEvents7d.map((e) => (
                  <tr key={`${e.route}-${e.kind}`}>
                    <td>{e.route}</td>
                    <td>{e.kind}</td>
                    <td>{e.count.toLocaleString()}</td>
                    <td className="ax-nowrap ax-muted">{when(e.last)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AxPanel>
    </div>
  );
}
