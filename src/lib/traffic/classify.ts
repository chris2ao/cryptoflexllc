/**
 * Traffic classification for page views.
 *
 * `classifyAtInsert` uses only the signals available when the beacon lands
 * (user agent, referrer class, path) and returns null when the row needs the
 * batch pass (`classifyFromSignals` in this module, run by
 * `src/lib/traffic/backfill.ts`), which also knows about hosting networks,
 * engagement beacons and the owner's own logins.
 */

import type { ReferrerClass } from "./referrer";
import { isTrackedPath } from "@/lib/analytics-tracking-rules";

export type TrafficClass = "human" | "bot" | "owner" | "self";

/** Regex source shared with the SQL batch (`~*` is case-insensitive) so both stay identical. */
export const BOT_UA_PATTERN_SOURCE =
  "bot|crawl|spider|slurp|headless|bytespider|python-requests|go-http-client|curl/|wget/|scrapy|facebookexternalhit|preview|okhttp|java/|libwww";

const BOT_UA_PATTERN = new RegExp(BOT_UA_PATTERN_SOURCE, "i");

export function isBotUserAgent(userAgent: string): boolean {
  return BOT_UA_PATTERN.test(userAgent);
}

export function classifyAtInsert(input: {
  userAgent: string;
  referrerClass: ReferrerClass;
  pagePath: string;
}): TrafficClass | null {
  if (!isTrackedPath(input.pagePath)) return "self";
  if (input.referrerClass === "forged") return "bot";
  if (isBotUserAgent(input.userAgent)) return "bot";
  return null;
}

export function classifyFromSignals(signals: {
  userAgent: string;
  referrerClass: ReferrerClass;
  pagePath: string;
  isHosting: boolean | null;
  hasEngagement: boolean;
  isOwnerIp: boolean;
}): TrafficClass {
  if (!isTrackedPath(signals.pagePath)) return "self";
  if (signals.isOwnerIp) return "owner";
  if (signals.referrerClass === "forged") return "bot";
  if (isBotUserAgent(signals.userAgent)) return "bot";
  if (signals.isHosting === true && !signals.hasEngagement) return "bot";
  return "human";
}
