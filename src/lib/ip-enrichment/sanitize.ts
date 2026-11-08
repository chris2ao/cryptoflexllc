import type { IpEnrichment } from "./types";

// C0 and C1 controls, plus Unicode format and bidi characters that can
// reorder or hide text when a provider string is rendered.
const STRIP =
  /[\u0000-\u001F\u007F-\u009F\u061C\u180E\u200B-\u200F\u2028-\u202E\u2060-\u206F\uFEFF\uFFF9-\uFFFB\u{E0000}-\u{E007F}]/gu;

/** String-only, control and bidi stripped, trimmed, capped at `max`. */
export function cleanText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  // Array.from cuts on code points so a surrogate pair is never split.
  return Array.from(value.replace(STRIP, "").trim()).slice(0, max).join("");
}

const MAX_SOURCES = 8;

/** Returns a new enrichment with every provider string cleaned and capped. */
export function sanitizeEnrichment(e: IpEnrichment): IpEnrichment {
  return {
    ...e,
    asn: cleanText(e.asn, 32),
    asName: cleanText(e.asName, 200),
    company: cleanText(e.company, 200),
    whoisOrg: cleanText(e.whoisOrg, 200),
    country: cleanText(e.country, 100),
    city: cleanText(e.city, 100),
    region: cleanText(e.region, 100),
    latitude: cleanText(e.latitude, 20),
    longitude: cleanText(e.longitude, 20),
    abuserScore: cleanText(e.abuserScore, 20),
    sources: (Array.isArray(e.sources) ? e.sources : [])
      .map((x) => cleanText(x, 40))
      .filter(Boolean)
      .slice(0, MAX_SOURCES),
  };
}
