import { getDb } from "@/lib/analytics";
import { loadGmailMetricsSnapshots } from "@/lib/automation-snapshots";
import { loadUnsubscribePanel } from "@/lib/gmail-unsubscribe";
import { GmailRunsPanel } from "../_components/gmail-runs-panel";
import { UnsubscribePanel } from "../_components/unsubscribe-panel";
import { SessionArchivePanel } from "../_components/session-archive-panel";
import { KpiStrip } from "../_components/kpi-strip";
import { AxPanel } from "../_components/ax-panel";
import { GmailMetricsChart } from "./lazy-charts";

export async function AgentsSection() {
  const sql = getDb();
  const { gmailRuns, sessions } = await loadGmailMetricsSnapshots(sql);
  const unsub = await loadUnsubscribePanel(sql).catch(() => null);

  const totalRuns = gmailRuns.length;
  const totalProcessed = gmailRuns.reduce((s, r) => s + r.messages_scanned, 0);
  const totalTrashed = gmailRuns.reduce((s, r) => s + r.messages_trashed, 0);
  const totalDuration = gmailRuns.reduce((s, r) => s + r.duration_seconds, 0);
  const avgDuration = totalRuns > 0 ? Math.round(totalDuration / totalRuns) : 0;
  const totalErrors = gmailRuns.filter((r) => r.status === "error").length;

  // Build chart data: newest first, trim to last 30, then reverse for chronological display
  function formatChartLabel(ts: string): string {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  const chartData = gmailRuns
    .slice()
    .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
    .slice(0, 30)
    .reverse()
    .map((r) => ({
      label: formatChartLabel(r.started_at),
      processed: r.messages_scanned,
      trashed: r.messages_trashed,
      archived: r.messages_archived,
    }));

  const automationKpis = [
    { id: "runs", label: "Gmail Runs", value: totalRuns, hint: "▲" },
    { id: "processed", label: "Processed", value: totalProcessed, hint: "▲" },
    { id: "trashed", label: "Trashed", value: totalTrashed, hint: "▲" },
    { id: "errors", label: "Errors", value: totalErrors, hint: "▼" },
  ];

  return (
    <div className="ax-wrap ax-section">
      <div className="ax-section-label">07 · Agents</div>
      <div className="ax-section-head">
        <h2>
          Agents at <em>work.</em>
        </h2>
        <p className="lede">
          Gmail assistant runs, session archive, and other automation
          telemetry from the local Claude Code install. Avg duration {avgDuration}s.
        </p>
      </div>

      <KpiStrip items={automationKpis} />

      <div style={{ marginBottom: 20 }}>
        <AxPanel title="Unsubscribe review" kicker={`${unsub?.summary.pending ?? 0} AWAITING`}>
          <UnsubscribePanel initial={unsub} />
        </AxPanel>
      </div>

      <div style={{ marginBottom: 20 }}>
        <AxPanel title="Emails processed per run" kicker="LAST 30 RUNS">
          <GmailMetricsChart data={chartData} />
        </AxPanel>
      </div>

      <div style={{ marginBottom: 20 }}>
        <AxPanel title="Gmail runs" kicker={`${Math.min(25, totalRuns)} MOST RECENT`}>
          <GmailRunsPanel runs={gmailRuns.slice(0, 25)} />
        </AxPanel>
      </div>

      <div>
        <AxPanel title="Session archive" kicker="LOCAL CLAUDE CODE SESSIONS">
          <SessionArchivePanel sessions={sessions.slice(0, 25)} />
        </AxPanel>
      </div>
    </div>
  );
}
