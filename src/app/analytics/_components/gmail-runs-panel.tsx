import type { GmailRun } from "@/lib/analytics-types";
import { PanelWrapper } from "./panel-wrapper";
import { DataTable } from "./data-table";

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function runStatus(run: GmailRun): string {
  if (run.circuit_breaker_tripped || run.status === "circuit_broken") {
    return "CIRCUIT BREAK";
  }
  if (run.status === "error") {
    const msg = run.error ?? "ERROR";
    return msg.length > 30 ? msg.slice(0, 27) + "..." : msg;
  }
  return "OK";
}

export function GmailRunsPanel({ runs }: { runs: GmailRun[] }) {
  const headers = [
    "Date",
    "Scanned",
    "Trashed",
    "Archived",
    "Flagged",
    "Duration",
    "Status",
  ];

  const rows = runs.map((r) => [
    formatTimestamp(r.started_at),
    String(r.messages_scanned),
    String(r.messages_trashed),
    String(r.messages_archived),
    String(r.messages_flagged),
    `${r.duration_seconds}s`,
    runStatus(r),
  ]);

  return (
    <PanelWrapper
      title="Gmail Assistant Runs"
      tooltip="Recent runs of the gmail-agent showing scanned, trashed, archived, and flagged counts plus error state."
    >
      <DataTable
        title=""
        headers={headers}
        rows={rows}
      />
    </PanelWrapper>
  );
}
