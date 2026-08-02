/**
 * Post dates appear in frontmatter in two shapes: a bare calendar date
 * ("2026-08-01") and a full local datetime ("2026-04-17T23:30:00").
 *
 * Both need care, in opposite directions:
 *
 * - A bare date is parsed by JS as UTC midnight, which renders as the
 *   previous day in any negative-offset timezone. It has to be pinned to
 *   local midnight before formatting.
 * - A datetime is already local and must be left alone. Appending a time to
 *   it produces "2026-04-17T23:30:00T00:00:00", which is unparseable and
 *   formats as the literal string "Invalid Date".
 *
 * Callers should use these helpers rather than hand-rolling either rule.
 */

const LONG: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

const SHORT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

/** Parse a frontmatter date into a local-time Date. */
export function parsePostDate(date: string): Date {
  return new Date(date.includes("T") ? date : `${date}T00:00:00`);
}

function format(date: string, options: Intl.DateTimeFormatOptions): string {
  const parsed = parsePostDate(date);
  // Never render "Invalid Date" to a reader; fall back to the raw value.
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", options);
}

/** "August 1, 2026" */
export function formatPostDate(date: string): string {
  return format(date, LONG);
}

/** "Aug 1, 2026" */
export function formatPostDateShort(date: string): string {
  return format(date, SHORT);
}
