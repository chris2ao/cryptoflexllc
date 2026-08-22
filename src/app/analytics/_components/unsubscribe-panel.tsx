"use client";

import { useRef, useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import type { UnsubscribePanelData, UnsubscribePanelRow } from "@/lib/analytics-types";
import { UnsubscribeRow } from "./unsubscribe-row";
import { recountSummary } from "./unsubscribe-summary";

interface UnsubscribePanelProps {
  initial: UnsubscribePanelData | null;
}

const TABLE_HEADERS = ["Sender", "Method", "Trashed (14d)", "Status", "Last attempt", ""];

function formatPercent(rate: number | null): string {
  return rate === null ? "n/a" : `${Math.round(rate * 100)}%`;
}

interface SectionProps {
  heading: string;
  rows: UnsubscribePanelRow[];
  actingSender: string | null;
  expandedSender: string | null;
  onToggleHistory: (senderEmail: string) => void;
  onDecide: (senderEmail: string, decision: "approve" | "deny") => void;
  emptyLabel: string;
}

function Section({
  heading,
  rows,
  actingSender,
  expandedSender,
  onToggleHistory,
  onDecide,
  emptyLabel,
}: SectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2">{heading}</h3>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 text-left">
              {TABLE_HEADERS.map((header, i) => (
                <th key={i} className="px-4 py-3 font-medium">
                  {header === "" ? <span className="sr-only">Actions</span> : header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={TABLE_HEADERS.length}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <UnsubscribeRow
                  key={row.sender_email}
                  row={row}
                  acting={actingSender === row.sender_email}
                  expanded={expandedSender === row.sender_email}
                  onToggleHistory={onToggleHistory}
                  onDecide={onDecide}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-border bg-muted/30 p-3" aria-label={`${label}: ${value}`}>
      <span className="block text-xl font-bold">{value}</span>
      <span className="block text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function UnsubscribePanel({ initial }: UnsubscribePanelProps) {
  const [data, setData] = useState<UnsubscribePanelData | null>(initial);
  const [actingSender, setActingSender] = useState<string | null>(null);
  const [expandedSender, setExpandedSender] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  // Mirrors actingSender synchronously so a second click landing before the
  // first render flushes still sees a decision is in flight. State alone is
  // not enough: two synchronous clicks can both read the same stale value.
  const actingSenderRef = useRef<string | null>(null);

  function toggleHistory(senderEmail: string) {
    setExpandedSender((prev) => (prev === senderEmail ? null : senderEmail));
  }

  async function refresh() {
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch("/api/gmail/unsubscribe/panel");
      if (!res.ok) {
        setError("Could not refresh the panel.");
        return;
      }
      const next = (await res.json()) as UnsubscribePanelData;
      setData(next);
    } catch {
      setError("Could not refresh the panel.");
    } finally {
      setRefreshing(false);
    }
  }

  async function decide(senderEmail: string, decision: "approve" | "deny") {
    if (!data) return;
    // Guard against a second click landing before the first decision settles
    // (or before React has re-rendered the acting row as disabled).
    if (actingSenderRef.current !== null) return;

    const previous = data;
    const decidedAt = new Date().toISOString();

    const nextRows = data.rows.map((row): UnsubscribePanelRow =>
      row.sender_email === senderEmail
        ? {
            ...row,
            decision,
            decided_at: decidedAt,
            history: [{ decision, decided_at: decidedAt, note: null }, ...row.history],
          }
        : row
    );

    actingSenderRef.current = senderEmail;
    setData({ ...data, rows: nextRows, summary: recountSummary(data.summary, nextRows) });
    setActingSender(senderEmail);
    setError(null);

    try {
      const res = await fetch("/api/gmail/unsubscribe/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender_email: senderEmail, decision }),
      });

      if (!res.ok) {
        setData({ ...previous, summary: recountSummary(previous.summary, previous.rows) });
        setError("Could not save the decision. Try again.");
      }
    } catch {
      setData({ ...previous, summary: recountSummary(previous.summary, previous.rows) });
      setError("Could not save the decision. Try again.");
    } finally {
      actingSenderRef.current = null;
      setActingSender(null);
    }
  }

  if (!data) {
    return (
      <div className="rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        Unsubscribe tables are not set up yet. Run{" "}
        <code className="font-mono text-xs">/api/analytics/setup</code> to create them.
      </div>
    );
  }

  const pending = data.rows.filter((r) => r.decision === null);
  const approved = data.rows.filter((r) => r.decision === "approve");
  const allowed = data.rows.filter((r) => r.decision === "deny");

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 flex-1">
          <SummaryStat label="Pending" value={data.summary.pending} />
          <SummaryStat label="Approved" value={data.summary.approved} />
          <SummaryStat label="Allowed" value={data.summary.allowed} />
          <SummaryStat label="Unsubscribed (7d)" value={data.summary.unsubscribed_7d} />
          <SummaryStat
            label="Silence rate (14d, target 80%)"
            value={formatPercent(data.summary.silence_rate)}
          />
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md text-muted-foreground hover:bg-muted/50 transition-colors disabled:opacity-50"
        >
          {refreshing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Refresh
        </button>
      </div>

      <Section
        heading="Awaiting review"
        rows={pending}
        actingSender={actingSender}
        expandedSender={expandedSender}
        onToggleHistory={toggleHistory}
        onDecide={decide}
        emptyLabel="Nothing awaiting review."
      />
      <Section
        heading="Approved to unsubscribe"
        rows={approved}
        actingSender={actingSender}
        expandedSender={expandedSender}
        onToggleHistory={toggleHistory}
        onDecide={decide}
        emptyLabel="Nothing approved yet."
      />
      <Section
        heading="Allowed"
        rows={allowed}
        actingSender={actingSender}
        expandedSender={expandedSender}
        onToggleHistory={toggleHistory}
        onDecide={decide}
        emptyLabel="Nothing allowed."
      />
    </div>
  );
}
