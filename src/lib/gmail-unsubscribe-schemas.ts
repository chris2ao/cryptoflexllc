/**
 * Gmail Unsubscribe Review Panel: Zod Schemas
 * -------------------------------------------------
 * Validates payloads pushed by the local gmail-agent (candidates,
 * attempts) and decisions made by the operator through the panel UI.
 *
 * Privacy tripwire: this repo is public, so no field may carry a URL,
 * a mailto link, or raw HTML. FORBIDDEN is checked against every
 * free-text field before anything is written to the database.
 */

import { z } from "zod";

export const FORBIDDEN = /https?:|mailto:|</i;

export function containsForbidden(text: string): boolean {
  return FORBIDDEN.test(text);
}

/**
 * Best-effort lookup of which item in a raw `{ items: [...] }` body tripped
 * the forbidden-content check, for a more useful log line. Returns null if
 * the raw text cannot be parsed, has no `items` array, or no single item
 * accounts for the match (the forbidden text sits elsewhere in the body).
 */
export function findForbiddenItemIndex(rawText: string): number | null {
  try {
    const parsed = JSON.parse(rawText) as { items?: unknown[] };
    if (!Array.isArray(parsed.items)) return null;
    const index = parsed.items.findIndex((item) => containsForbidden(JSON.stringify(item)));
    return index === -1 ? null : index;
  } catch {
    return null;
  }
}

const FORBIDDEN_MESSAGE = "Text may not contain a URL, mailto link, or HTML tag";

const noForbidden = z
  .string()
  .refine((value) => !containsForbidden(value), { message: FORBIDDEN_MESSAGE });

const senderEmailSchema = z
  .string()
  .max(320)
  .email()
  .refine((value) => !containsForbidden(value), { message: FORBIDDEN_MESSAGE })
  .transform((value) => value.toLowerCase());

const isoDateSchema = z.string().datetime({ offset: true });

export const methodSchema = z.enum(["rfc8058-post", "http-get", "mailto"]);

export const candidateSchema = z.object({
  sender_email: senderEmailSchema,
  sender_domain: noForbidden
    .max(255)
    .transform((value) => value.toLowerCase()),
  method: methodSchema,
  trashed_count_14d: z.number().int().nonnegative(),
  first_seen: isoDateSchema,
  last_seen: isoDateSchema,
});

export const candidatesBodySchema = z.object({
  items: z.array(candidateSchema).min(1).max(500),
});

export const attemptSchema = z.object({
  sender_email: senderEmailSchema,
  attempted_at: isoDateSchema,
  status_code: z.number().int().min(100).max(599).nullable(),
  succeeded: z.boolean(),
  silent_14d: z.boolean().nullable().optional(),
  silence_measured_at: isoDateSchema.nullable().optional(),
});

export const attemptsBodySchema = z.object({
  items: z.array(attemptSchema).min(1).max(100),
});

export const decisionBodySchema = z.object({
  sender_email: senderEmailSchema,
  decision: z.enum(["approve", "deny"]),
  note: noForbidden.max(280).nullable().optional(),
});

export type Method = z.infer<typeof methodSchema>;
export type CandidateInput = z.infer<typeof candidateSchema>;
export type CandidatesBody = z.infer<typeof candidatesBodySchema>;
export type AttemptInput = z.infer<typeof attemptSchema>;
export type AttemptsBody = z.infer<typeof attemptsBodySchema>;
export type DecisionBody = z.infer<typeof decisionBodySchema>;
