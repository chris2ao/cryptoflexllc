import type { SessionEntry } from "@/lib/analytics-types";
import { DataTable } from "./data-table";

export function SessionArchivePanel({ sessions }: { sessions: SessionEntry[] }) {
  const headers = ["ID", "Date", "Time", "Size"];

  const rows = sessions.map((s) => [
    s.id,
    s.date,
    s.time,
    `${s.sizeMB} MB`,
  ]);

  return <DataTable title="" headers={headers} rows={rows} />;
}
