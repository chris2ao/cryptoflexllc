/**
 * Gmail Metrics Ingest: Zod Schemas
 * -------------------------------------------------
 * Validates the payload pushed by the local export script
 * (~/.claude/scripts/gmail-metrics-export.sh) to POST /api/gmail/metrics:
 * the gmail-agent run history and the local Claude Code session-archive
 * listing. Field shapes mirror the `GmailRun` / `SessionEntry` interfaces
 * in src/lib/analytics-types.ts and the row shape the export script's
 * Python step writes.
 */

import { z } from "zod";

const MAX_ERROR_LEN = 300;
const MAX_AGENT_VERSION_LEN = 40;
const MAX_RUN_ID_LEN = 100;
const MAX_SESSION_ID_LEN = 64;
const MAX_SIZE_MB_LEN = 20;

const isoDateSchema = z.string().datetime({ offset: true });

/** Caps chosen generously above current volume (201 runs / 1830 sessions as
 * of 2026-09-22) so the ingest route rejects a runaway or malformed push
 * without needing to grow these limits on ordinary use. */
export const MAX_GMAIL_RUNS = 5000;
export const MAX_SESSION_ENTRIES = 20000;

export const gmailRunSchema = z.object({
  run_id: z.string().min(1).max(MAX_RUN_ID_LEN),
  started_at: isoDateSchema,
  ended_at: isoDateSchema.nullable(),
  status: z.enum(["success", "error", "circuit_broken", "running", "unknown"]),
  duration_seconds: z.number().int().nonnegative(),
  messages_scanned: z.number().int().nonnegative(),
  messages_trashed: z.number().int().nonnegative(),
  messages_archived: z.number().int().nonnegative(),
  messages_flagged: z.number().int().nonnegative(),
  filters_created: z.number().int().nonnegative().optional(),
  unsubscribes_succeeded: z.number().int().nonnegative().optional(),
  cost_usd: z.number().nonnegative().optional(),
  circuit_breaker_tripped: z.boolean().optional(),
  agent_version: z.string().max(MAX_AGENT_VERSION_LEN).optional(),
  attention_email_sent: z.boolean().optional(),
  error: z.string().max(MAX_ERROR_LEN).nullable().optional(),
});

export const sessionEntrySchema = z.object({
  id: z.string().min(1).max(MAX_SESSION_ID_LEN),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "must be HH:MM"),
  sizeBytes: z.number().int().nonnegative(),
  sizeMB: z.string().max(MAX_SIZE_MB_LEN),
});

export const gmailMetricsBodySchema = z.object({
  gmailMetrics: z.array(gmailRunSchema).max(MAX_GMAIL_RUNS),
  sessionArchive: z.array(sessionEntrySchema).max(MAX_SESSION_ENTRIES),
});

export type GmailRunInput = z.infer<typeof gmailRunSchema>;
export type SessionEntryInput = z.infer<typeof sessionEntrySchema>;
export type GmailMetricsBody = z.infer<typeof gmailMetricsBodySchema>;
