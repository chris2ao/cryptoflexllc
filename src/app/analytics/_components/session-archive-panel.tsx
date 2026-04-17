import type { SessionEntry } from "@/lib/analytics-types";
import { PanelWrapper } from "./panel-wrapper";
import { DataTable } from "./data-table";

export function SessionArchivePanel({ sessions }: { sessions: SessionEntry[] }) {
  const headers = ["ID", "Date", "Time", "Size"];

  const rows = sessions.map((s) => [
    s.id,
    s.date,
    s.time,
    `${s.sizeMB} MB`,
  ]);

  return (
    <PanelWrapper
      title="Session Archive"
      tooltip="Claude Code session transcripts archived locally — file list with size."
    >
      <DataTable
        title=""
        headers={headers}
        rows={rows}
      />
    </PanelWrapper>
  );
}
