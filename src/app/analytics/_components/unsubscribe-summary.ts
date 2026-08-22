import type { UnsubscribePanelRow, UnsubscribePanelSummary } from "@/lib/analytics-types";

/**
 * Recomputes the pending, approved, and allowed counts in `summary` from
 * `rows`, keeping unsubscribed_7d, silence_measured, silence_silent,
 * silence_rate, and target as they were. Used after an optimistic decision
 * update (and its rollback) so the summary strip stays in sync with the
 * sections instead of only catching up on the next Refresh.
 */
export function recountSummary(
  summary: UnsubscribePanelSummary,
  rows: UnsubscribePanelRow[]
): UnsubscribePanelSummary {
  let pending = 0;
  let approved = 0;
  let allowed = 0;

  for (const row of rows) {
    if (row.decision === null) pending += 1;
    else if (row.decision === "approve") approved += 1;
    else allowed += 1;
  }

  return { ...summary, pending, approved, allowed };
}
