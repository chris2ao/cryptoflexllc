"use client";

import { Check, ShieldOff, Undo2, Loader2, ChevronDown } from "lucide-react";
import type { UnsubscribePanelRow, UnsubscribeAttemptSummary } from "@/lib/analytics-types";

interface UnsubscribeRowProps {
  row: UnsubscribePanelRow;
  acting: boolean;
  expanded: boolean;
  onToggleHistory: (senderEmail: string) => void;
  onDecide: (senderEmail: string, decision: "approve" | "deny") => void;
}

const STATUS_BADGE = {
  pending: { label: "Pending", className: "ax-pill ax-pill--warn" },
  approve: { label: "Approved", className: "ax-pill ax-pill--ok" },
  deny: { label: "Allowed", className: "ax-pill" },
} as const;

function statusBadge(decision: "approve" | "deny" | null) {
  return STATUS_BADGE[decision ?? "pending"];
}

function silenceLabel(attempt: UnsubscribeAttemptSummary | null): string {
  if (!attempt) return "No attempts yet";
  // A failed attempt was never sent, so there is nothing to measure silence
  // against: show Failed rather than leaving the row stuck on Measuring.
  if (!attempt.succeeded) return "Failed";
  if (attempt.silent_14d === null) return "Measuring";
  return attempt.silent_14d ? "Silent" : "Still sending";
}

/** One row of the unsubscribe review table, plus its optional expanded history row. */
export function UnsubscribeRow({ row, acting, expanded, onToggleHistory, onDecide }: UnsubscribeRowProps) {
  const badge = statusBadge(row.decision);
  const attempt = row.last_attempt;
  const canAutoApprove = row.method === "rfc8058-post";

  return (
    <>
      <tr>
        <td>{row.sender_email}</td>
        <td className="muted">{row.method}</td>
        <td>{row.trashed_count_14d}</td>
        <td>
          <span className={badge.className}>{badge.label}</span>
          {attempt && !attempt.succeeded && (
            <span className="ax-pill ax-pill--bad" style={{ marginLeft: 4 }}>
              Attempt failed
            </span>
          )}
        </td>
        <td className="muted">
          {attempt ? `${attempt.status_code ?? "no status"}, ${silenceLabel(attempt)}` : "No attempts yet"}
        </td>
        <td>
          <div className="row-actions">
            <button
              type="button"
              onClick={() => onToggleHistory(row.sender_email)}
              className="btn-editorial btn-editorial--sm ax-icon-btn"
              title={expanded ? "Hide history" : "Show history"}
              aria-label={expanded ? "Hide history" : "Show history"}
            >
              <ChevronDown
                size={14}
                style={{
                  transition: "transform 140ms",
                  transform: expanded ? "rotate(180deg)" : "none",
                }}
              />
            </button>

            {acting ? (
              <Loader2 size={14} className="ax-spin" aria-label="Saving" />
            ) : row.decision === null ? (
              <>
                <button
                  type="button"
                  onClick={() => onDecide(row.sender_email, "approve")}
                  disabled={!canAutoApprove}
                  title={
                    canAutoApprove
                      ? "Approve unsubscribe"
                      : "Only one-click (RFC 8058) senders can be approved"
                  }
                  className="btn-editorial btn-editorial--sm ax-icon-btn"
                >
                  <Check size={14} />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => onDecide(row.sender_email, "deny")}
                  title="Deny: allow this sender to keep sending"
                  className="btn-editorial btn-editorial--sm ax-icon-btn"
                >
                  <ShieldOff size={14} />
                  Deny
                </button>
              </>
            ) : row.decision === "approve" ? (
              <button
                type="button"
                onClick={() => onDecide(row.sender_email, "deny")}
                title="Allow again: stop unsubscribing from this sender"
                className="btn-editorial btn-editorial--sm ax-icon-btn"
              >
                <Undo2 size={14} />
                Allow again
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onDecide(row.sender_email, "approve")}
                title="Unsubscribe from this sender"
                className="btn-editorial btn-editorial--sm ax-icon-btn"
              >
                <Check size={14} />
                Unsubscribe
              </button>
            )}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={6}>
            {row.history.length === 0 ? (
              <span className="muted">No decisions yet.</span>
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {row.history.map((entry, i) => (
                  <li key={i} className="muted">
                    <span
                      style={{
                        color: entry.decision === "approve" ? "var(--ax-green)" : "var(--fg-2)",
                      }}
                    >
                      {entry.decision === "approve" ? "Approved" : "Denied"}
                    </span>{" "}
                    {new Date(entry.decided_at).toLocaleString()}
                    {entry.note ? `: ${entry.note}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
