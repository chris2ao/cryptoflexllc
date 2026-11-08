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
    <div className="ax-block">
      <h3 className="ax-subhead">{heading}</h3>
      <div className="ax-tbl-scroll">
        <table className="ax-tbl ax-tbl-static">
          <thead>
            <tr>
              {TABLE_HEADERS.map((header, i) => (
                <th key={i}>
                  {header === "" ? <span className="ax-sr">Actions</span> : header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={TABLE_HEADERS.length} className="muted">
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
    <div className="ax-stat" aria-label={`${label}: ${value}`}>
      <span className="v">{value}</span>
      <span className="l">{label}</span>
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
      <div className="ax-notice">
        Unsubscribe tables are not set up yet. Run <code>/api/analytics/setup</code> to
        create them.
      </div>
    );
  }

  const pending = data.rows.filter((r) => r.decision === null);
  const approved = data.rows.filter((r) => r.decision === "approve");
  const allowed = data.rows.filter((r) => r.decision === "deny");

  return (
    <div>
      {error && (
        <div className="ax-notice ax-notice--bad" role="alert" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div className="ax-panel-toolbar" style={{ alignItems: "flex-start" }}>
        <div className="ax-stat-row" style={{ flex: 1, marginBottom: 0 }}>
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
          className="btn-editorial btn-editorial--sm ax-icon-btn"
        >
          {refreshing ? (
            <Loader2 size={14} className="ax-spin" />
          ) : (
            <RefreshCw size={14} />
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
