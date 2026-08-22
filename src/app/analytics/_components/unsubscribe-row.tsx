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
  pending: { label: "Pending", className: "bg-yellow-500/20 text-yellow-400" },
  approve: { label: "Approved", className: "bg-green-500/20 text-green-400" },
  deny: { label: "Allowed", className: "bg-zinc-500/20 text-zinc-400" },
} as const;

function statusBadge(decision: "approve" | "deny" | null) {
  return STATUS_BADGE[decision ?? "pending"];
}

function silenceLabel(attempt: UnsubscribeAttemptSummary | null): string {
  if (!attempt) return "No attempts yet";
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
      <tr className="border-t border-border hover:bg-muted/30 transition-colors">
        <td className="px-4 py-2 font-mono text-xs">{row.sender_email}</td>
        <td className="px-4 py-2 text-xs text-muted-foreground">{row.method}</td>
        <td className="px-4 py-2 text-xs">{row.trashed_count_14d}</td>
        <td className="px-4 py-2">
          <span
            className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${badge.className}`}
          >
            {badge.label}
          </span>
          {attempt && !attempt.succeeded && (
            <span className="ml-1 inline-block px-2 py-0.5 text-xs rounded-full font-medium bg-red-500/20 text-red-400">
              Attempt failed
            </span>
          )}
        </td>
        <td className="px-4 py-2 text-xs text-muted-foreground">
          {attempt ? `${attempt.status_code ?? "no status"}, ${silenceLabel(attempt)}` : "No attempts yet"}
        </td>
        <td className="px-4 py-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onToggleHistory(row.sender_email)}
              className="inline-flex items-center px-1 py-1 text-xs rounded-md text-muted-foreground hover:bg-muted/50 transition-colors"
              title={expanded ? "Hide history" : "Show history"}
              aria-label={expanded ? "Hide history" : "Show history"}
            >
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </button>

            {acting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
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
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  <Check className="h-3.5 w-3.5" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => onDecide(row.sender_email, "deny")}
                  title="Deny: allow this sender to keep sending"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md text-zinc-400 hover:bg-zinc-500/20 transition-colors"
                >
                  <ShieldOff className="h-3.5 w-3.5" />
                  Deny
                </button>
              </>
            ) : row.decision === "approve" ? (
              <button
                type="button"
                onClick={() => onDecide(row.sender_email, "deny")}
                title="Allow again: stop unsubscribing from this sender"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md text-zinc-400 hover:bg-zinc-500/20 transition-colors"
              >
                <Undo2 className="h-3.5 w-3.5" />
                Allow again
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onDecide(row.sender_email, "approve")}
                title="Unsubscribe from this sender"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md text-green-400 hover:bg-green-500/20 transition-colors"
              >
                <Check className="h-3.5 w-3.5" />
                Unsubscribe
              </button>
            )}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="border-t border-border bg-muted/20">
          <td colSpan={6} className="px-4 py-2">
            {row.history.length === 0 ? (
              <span className="text-xs text-muted-foreground">No decisions yet.</span>
            ) : (
              <ul className="space-y-1">
                {row.history.map((entry, i) => (
                  <li key={i} className="text-xs text-muted-foreground">
                    <span
                      className={
                        entry.decision === "approve" ? "text-green-400" : "text-zinc-400"
                      }
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
