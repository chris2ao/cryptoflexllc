/**
 * Visitor dossier: everything the dashboard knows about one IP, gathered
 * from the first-party tables. Each sub-query degrades to its empty value
 * so one missing table never blanks the whole panel. Comments carry no IP
 * (blog_comments has only an email), so they are not part of the dossier.
 */

import type { getDb } from "@/lib/analytics";

type SqlTag = ReturnType<typeof getDb>;

export type VisitorDossier = {
  ip: string;
  firstSeen: string | null;
  lastSeen: string | null;
  hits: number;
  classes: Record<string, number>;
  pages: Array<{ page_path: string; views: number; last: string }>;
  userAgents: string[];
  locations: string[];
  referrerClasses: Record<string, number>;
  engagement: { scrolls: number; maxDepth: number; seconds: number };
  errors: number;
  auth: { success: number; fail: number };
  subscriber: boolean;
  guestbook: number;
};

const CONTROL_AND_BIDI =
  /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u180e\u200b-\u200f\u2028\u2029\u202a-\u202e\u2066-\u2069\ufeff]+/g;

/** Strip control and bidi characters from database text before rendering. */
function clean(s: unknown, max = 200): string {
  if (typeof s !== "string") return "";
  return s.replace(CONTROL_AND_BIDI, " ").trim().slice(0, max);
}

type Row = Record<string, unknown>;

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function iso(v: unknown): string | null {
  if (v == null) return null;
  const d = v instanceof Date ? v : new Date(String(v));
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function countMap(rows: Row[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of rows) {
    const k = clean(r.k, 60);
    if (k) out[k] = num(r.n);
  }
  return out;
}

const EMPTY: Row[] = [];

export async function loadVisitorDossier(
  sql: SqlTag,
  ip: string,
): Promise<VisitorDossier> {
  const q = (p: PromiseLike<unknown>): Promise<Row[]> =>
    Promise.resolve(p).then(
      (r) => (Array.isArray(r) ? (r as Row[]) : EMPTY),
      () => EMPTY,
    );

  const [
    summary,
    classRows,
    refRows,
    pageRows,
    uaRows,
    locRows,
    scrollRows,
    secRows,
    errRows,
    authRows,
    subRows,
    guestRows,
  ] = await Promise.all([
    q(sql`SELECT MIN(visited_at) AS first_seen, MAX(visited_at) AS last_seen, COUNT(*)::int AS hits FROM page_views WHERE ip_address = ${ip}`),
    q(sql`SELECT traffic_class AS k, COUNT(*)::int AS n FROM page_views WHERE ip_address = ${ip} AND traffic_class IS NOT NULL GROUP BY traffic_class`),
    q(sql`SELECT referrer_class AS k, COUNT(*)::int AS n FROM page_views WHERE ip_address = ${ip} AND referrer_class IS NOT NULL GROUP BY referrer_class`),
    q(sql`SELECT page_path, COUNT(*)::int AS views, MAX(visited_at) AS last FROM page_views WHERE ip_address = ${ip} GROUP BY page_path ORDER BY views DESC, last DESC LIMIT 15`),
    q(sql`SELECT DISTINCT user_agent AS v FROM page_views WHERE ip_address = ${ip} AND user_agent <> '' LIMIT 5`),
    q(sql`SELECT DISTINCT city, region, country FROM page_views WHERE ip_address = ${ip} AND country <> 'Unknown' LIMIT 5`),
    q(sql`SELECT COUNT(*)::int AS n, COALESCE(MAX(depth), 0)::int AS max_depth FROM scroll_events WHERE ip_address = ${ip}`),
    q(sql`SELECT COALESCE(SUM(time_seconds), 0)::int AS secs FROM page_engagement WHERE ip_address = ${ip}`),
    q(sql`SELECT COUNT(*)::int AS n FROM client_errors WHERE ip_address = ${ip}`),
    q(sql`SELECT COUNT(*) FILTER (WHERE success)::int AS ok, COUNT(*) FILTER (WHERE NOT success)::int AS bad FROM auth_attempts WHERE ip_address = ${ip}`),
    q(sql`SELECT 1 AS found FROM subscribers WHERE ip_address = ${ip} LIMIT 1`),
    q(sql`SELECT COUNT(*)::int AS n FROM guestbook WHERE ip = ${ip}`),
  ]);

  const s = summary[0] ?? {};
  const locations = locRows
    .map((r) =>
      [clean(r.city, 100), clean(r.region, 100), clean(r.country, 100)]
        .filter((p) => p && p !== "Unknown")
        .join(", "),
    )
    .filter(Boolean);

  return {
    ip,
    firstSeen: iso(s.first_seen),
    lastSeen: iso(s.last_seen),
    hits: num(s.hits),
    classes: countMap(classRows),
    pages: pageRows.map((r) => ({
      page_path: clean(r.page_path, 300),
      views: num(r.views),
      last: iso(r.last) ?? "",
    })),
    userAgents: uaRows.map((r) => clean(r.v, 120)).filter(Boolean),
    locations: Array.from(new Set(locations)).slice(0, 5),
    referrerClasses: countMap(refRows),
    engagement: {
      scrolls: num(scrollRows[0]?.n),
      maxDepth: num(scrollRows[0]?.max_depth),
      seconds: num(secRows[0]?.secs),
    },
    errors: num(errRows[0]?.n),
    auth: { success: num(authRows[0]?.ok), fail: num(authRows[0]?.bad) },
    subscriber: subRows.length > 0,
    guestbook: num(guestRows[0]?.n),
  };
}
