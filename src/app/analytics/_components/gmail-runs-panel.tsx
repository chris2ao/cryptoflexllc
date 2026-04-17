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
  if (run.circuit_breaker_triggered) return "CIRCUIT BREAK";
  if (run.errors.length > 0) {
    const first = run.errors[0];
    return first.length > 30 ? first.slice(0, 27) + "..." : first;
  }
  return "OK";
}

export function GmailRunsPanel({ runs }: { runs: GmailRun[] }) {
  const headers = [
    "Date",
    "Processed",
    "Promo Trashed",
    "NL Trashed",
    "Kept",
    "Duration",
    "Status",
  ];

  const rows = runs.map((r) => [
    formatTimestamp(r.timestamp),
    String(r.emails_processed),
    String(r.promotions_trashed),
    String(r.newsletters_trashed),
    String(r.primary_kept),
    `${r.duration_seconds}s`,
    runStatus(r),
  ]);

  return (
    <PanelWrapper
      title="Gmail Assistant Runs"
      tooltip="Recent runs of the Gmail assistant showing processed, trashed, and kept counts plus error state."
    >
      <DataTable
        title=""
        headers={headers}
        rows={rows}
      />
    </PanelWrapper>
  );
}
