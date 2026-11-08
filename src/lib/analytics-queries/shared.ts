/**
 * Parse the `days` search param: missing or anything but 1 to 4 digits gives 30,
 * anything else is clamped to 1..365.
 */
export function rangeDays(input: string | undefined): number {
  const parsed = input && /^\d{1,4}$/.test(input) ? parseInt(input, 10) : 30;
  return Math.max(1, Math.min(365, parsed));
}

export type TrafficScope = "humans" | "all";

/** Returns "all" only for the exact string "all", otherwise "humans". */
export function resolveScope(param: string | undefined): TrafficScope {
  return param === "all" ? "all" : "humans";
}

/**
 * The SQL rule for the humans scope. Loaders must NOT interpolate this
 * string (the Neon tag would bind it as a value); it documents the rule and
 * is used by tests. Loaders write the predicate with `scopeClass` instead:
 * `AND (${cls}::text IS NULL OR traffic_class = ${cls})`.
 */
export function trafficFilter(scope: TrafficScope): string {
  return scope === "humans" ? "AND traffic_class = 'human'" : "";
}

/** Bound parameter for the scope predicate: "human" or null (no filter). */
export function scopeClass(scope: TrafficScope): string | null {
  return scope === "humans" ? "human" : null;
}

export type Delta = { value: number; direction: "up" | "down" };

/**
 * Percent change from `previous` to `current`, one decimal, always positive
 * with the sign carried by `direction`. Null when there is no baseline.
 *
 * Previous window SQL used by loaders:
 *   visited_at > NOW() - INTERVAL '1 day' * (2 * ${days})
 *   AND visited_at <= NOW() - INTERVAL '1 day' * ${days}
 */
export function deltaPercent(current: number, previous: number): Delta | null {
  if (!previous) return null;
  const pct = ((current - previous) / previous) * 100;
  return {
    value: Math.round(Math.abs(pct) * 10) / 10,
    direction: pct < 0 ? "down" : "up",
  };
}
