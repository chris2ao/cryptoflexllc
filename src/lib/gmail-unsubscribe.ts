/**
 * Gmail Unsubscribe Review Panel: Data Loader
 * -------------------------------------------------
 * Reads the three unsubscribe tables (candidates, decisions, attempts)
 * and shapes them into the PanelData the review UI renders. Kept as
 * pure functions (shapePanelRows, summarize, latestDecisions) plus one
 * DB-facing entry point (loadUnsubscribePanel) so the panel route and
 * the page loader can share a single implementation.
 */

import type { NeonQueryFunction } from "@neondatabase/serverless";
import type {
  UnsubscribeMethod,
  UnsubscribeAttemptSummary,
  UnsubscribePanelRow,
  UnsubscribePanelSummary,
  UnsubscribePanelData,
} from "@/lib/analytics-types";

// --------------- Raw DB row shapes ---------------
// Timestamp columns come back from the neon driver as either Date
// objects or ISO strings depending on the query path; normalized to
// ISO strings before they reach the shaped output.

export interface UnsubscribeCandidateDbRow {
  sender_email: string;
  sender_domain: string;
  method: UnsubscribeMethod;
  trashed_count_14d: number;
  first_seen: Date | string;
  last_seen: Date | string;
  last_pushed_at: Date | string;
}

export interface UnsubscribeDecisionDbRow {
  id: number;
  sender_email: string;
  decision: "approve" | "deny";
  decided_at: Date | string;
  note: string | null;
}

export interface UnsubscribeAttemptDbRow {
  id: number;
  sender_email: string;
  attempted_at: Date | string;
  status_code: number | null;
  succeeded: boolean;
  silent_14d: boolean | null;
  silence_measured_at: Date | string | null;
}

// --------------- Helpers ---------------

function toISOString(value: Date | string): string {
  return typeof value === "string" ? value : value.toISOString();
}

function toISOStringOrNull(value: Date | string | null): string | null {
  return value === null ? null : toISOString(value);
}

function toTimeMs(value: Date | string): number {
  return typeof value === "string" ? new Date(value).getTime() : value.getTime();
}

function groupBySender<T extends { sender_email: string }>(items: T[]): Map<string, T[]> {
  const grouped = new Map<string, T[]>();
  for (const item of items) {
    const existing = grouped.get(item.sender_email);
    if (existing) {
      existing.push(item);
    } else {
      grouped.set(item.sender_email, [item]);
    }
  }
  return grouped;
}

/** Newest first: later decided_at wins, ties broken by the higher id. */
function compareDecisionsDesc(
  a: UnsubscribeDecisionDbRow,
  b: UnsubscribeDecisionDbRow
): number {
  const diff = toTimeMs(b.decided_at) - toTimeMs(a.decided_at);
  return diff !== 0 ? diff : b.id - a.id;
}

/** Newest first: later attempted_at wins, ties broken by the higher id. */
function compareAttemptsDesc(
  a: UnsubscribeAttemptDbRow,
  b: UnsubscribeAttemptDbRow
): number {
  const diff = toTimeMs(b.attempted_at) - toTimeMs(a.attempted_at);
  return diff !== 0 ? diff : b.id - a.id;
}

function shapeAttemptSummary(attempt: UnsubscribeAttemptDbRow): UnsubscribeAttemptSummary {
  return {
    attempted_at: toISOString(attempt.attempted_at),
    status_code: attempt.status_code,
    succeeded: attempt.succeeded,
    silent_14d: attempt.silent_14d,
    silence_measured_at: toISOStringOrNull(attempt.silence_measured_at),
  };
}

/** pending (no decision) first, then approved, then allowed; each group by trashed_count_14d desc. */
function groupRank(row: UnsubscribePanelRow): number {
  if (row.decision === null) return 0;
  return row.decision === "approve" ? 1 : 2;
}

function compareRows(a: UnsubscribePanelRow, b: UnsubscribePanelRow): number {
  const rankDiff = groupRank(a) - groupRank(b);
  if (rankDiff !== 0) return rankDiff;
  return b.trashed_count_14d - a.trashed_count_14d;
}

// --------------- Pure shaping functions ---------------

/** The current decision per sender: latest decided_at, ties broken by the higher id. */
export function latestDecisions(
  decisions: UnsubscribeDecisionDbRow[]
): Map<string, UnsubscribeDecisionDbRow> {
  const latest = new Map<string, UnsubscribeDecisionDbRow>();
  for (const decision of decisions) {
    const existing = latest.get(decision.sender_email);
    if (!existing || compareDecisionsDesc(decision, existing) < 0) {
      latest.set(decision.sender_email, decision);
    }
  }
  return latest;
}

export function shapePanelRows(
  candidates: UnsubscribeCandidateDbRow[],
  decisions: UnsubscribeDecisionDbRow[],
  attempts: UnsubscribeAttemptDbRow[]
): UnsubscribePanelRow[] {
  const decisionsBySender = groupBySender(decisions);
  const attemptsBySender = groupBySender(attempts);

  const rows = candidates.map((candidate): UnsubscribePanelRow => {
    const senderDecisions = (decisionsBySender.get(candidate.sender_email) ?? [])
      .slice()
      .sort(compareDecisionsDesc);
    const latest = senderDecisions[0] ?? null;

    const senderAttempts = (attemptsBySender.get(candidate.sender_email) ?? [])
      .slice()
      .sort(compareAttemptsDesc);
    const lastAttempt = senderAttempts[0] ?? null;

    const decidedAtMs = latest ? toTimeMs(latest.decided_at) : null;
    const attemptsSinceDecision =
      decidedAtMs === null
        ? 0
        : senderAttempts.filter((item) => toTimeMs(item.attempted_at) >= decidedAtMs).length;

    return {
      sender_email: candidate.sender_email,
      sender_domain: candidate.sender_domain,
      method: candidate.method,
      trashed_count_14d: candidate.trashed_count_14d,
      first_seen: toISOString(candidate.first_seen),
      last_seen: toISOString(candidate.last_seen),
      last_pushed_at: toISOString(candidate.last_pushed_at),
      decision: latest?.decision ?? null,
      decided_at: latest ? toISOString(latest.decided_at) : null,
      note: latest?.note ?? null,
      last_attempt: lastAttempt ? shapeAttemptSummary(lastAttempt) : null,
      attempts_since_decision: attemptsSinceDecision,
      history: senderDecisions.map((item) => ({
        decision: item.decision,
        decided_at: toISOString(item.decided_at),
        note: item.note,
      })),
    };
  });

  return rows.sort(compareRows);
}

export function summarize(rows: UnsubscribePanelRow[], now: Date): UnsubscribePanelSummary {
  const nowMs = now.getTime();
  const sevenDaysAgoMs = nowMs - 7 * 24 * 60 * 60 * 1000;

  let pending = 0;
  let approved = 0;
  let allowed = 0;
  let unsubscribed7d = 0;
  let silenceMeasured = 0;
  let silenceSilent = 0;

  for (const row of rows) {
    if (row.decision === null) pending += 1;
    else if (row.decision === "approve") approved += 1;
    else allowed += 1;

    const attempt = row.last_attempt;
    if (!attempt) continue;

    if (attempt.succeeded) {
      const attemptedMs = new Date(attempt.attempted_at).getTime();
      if (attemptedMs >= sevenDaysAgoMs && attemptedMs <= nowMs) {
        unsubscribed7d += 1;
      }
    }

    if (attempt.silent_14d !== null) {
      silenceMeasured += 1;
      if (attempt.silent_14d) silenceSilent += 1;
    }
  }

  return {
    pending,
    approved,
    allowed,
    unsubscribed_7d: unsubscribed7d,
    silence_measured: silenceMeasured,
    silence_silent: silenceSilent,
    silence_rate: silenceMeasured === 0 ? null : silenceSilent / silenceMeasured,
    target: 0.8,
  };
}

// --------------- DB-facing loader ---------------

function isMissingTableError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "42P01"
  );
}

/**
 * Loads and shapes the unsubscribe review panel data. Returns null when
 * the unsubscribe tables have not been created yet (Postgres error code
 * 42P01, "undefined table"); any other error propagates to the caller.
 */
export async function loadUnsubscribePanel(
  sql: NeonQueryFunction<false, false>,
  now: Date = new Date()
): Promise<UnsubscribePanelData | null> {
  let candidates: UnsubscribeCandidateDbRow[];
  let decisions: UnsubscribeDecisionDbRow[];
  let attempts: UnsubscribeAttemptDbRow[];

  try {
    candidates = (await sql`
      SELECT * FROM gmail_unsubscribe_candidates
    `) as unknown as UnsubscribeCandidateDbRow[];

    decisions = (await sql`
      SELECT * FROM gmail_unsubscribe_decisions
      ORDER BY sender_email, decided_at DESC, id DESC
    `) as unknown as UnsubscribeDecisionDbRow[];

    attempts = (await sql`
      SELECT * FROM gmail_unsubscribe_attempts
      ORDER BY attempted_at DESC
    `) as unknown as UnsubscribeAttemptDbRow[];
  } catch (error) {
    if (isMissingTableError(error)) return null;
    throw error;
  }

  const rows = shapePanelRows(candidates, decisions, attempts);

  return {
    ok: true,
    generated_at: now.toISOString(),
    summary: summarize(rows, now),
    rows,
  };
}
