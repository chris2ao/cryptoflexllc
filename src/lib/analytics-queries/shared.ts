/**
 * Parse the `days` search param: missing or non-numeric gives 30,
 * anything else is clamped to 1..365.
 */
export function rangeDays(input: string | undefined): number {
  const parsed = input ? parseInt(input, 10) : 30;
  return Math.max(1, Math.min(365, isNaN(parsed) ? 30 : parsed));
}

export type TrafficScope = "humans" | "all";

/** Returns "all" only for the exact string "all", otherwise "humans". */
export function resolveScope(param: string | undefined): TrafficScope {
  return param === "all" ? "all" : "humans";
}
