import { getDb } from "@/lib/analytics";
import { scopeClass, type TrafficScope } from "./shared";

export type NetworkType =
  | "residential"
  | "datacenter"
  | "proxy"
  | "tor"
  | "unknown";

export type NetworkTypeRow = {
  type: NetworkType;
  visitors: number;
  views: number;
};

export type KnownBadRow = {
  ip: string;
  reasons: string[];
  hits: number;
  last: string;
};

export type KnownBadData = { visitors: number; rows: KnownBadRow[] };

type Row = Record<string, unknown>;

const TYPE_ORDER: NetworkType[] = [
  "residential",
  "datacenter",
  "proxy",
  "tor",
  "unknown",
];

function num(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function asType(value: unknown): NetworkType {
  return TYPE_ORDER.includes(value as NetworkType)
    ? (value as NetworkType)
    : "unknown";
}

/** Visitors and views per network type; always returns the five types, residential first. */
export async function loadNetworkTypes(
  days: number,
  scope: TrafficScope = "humans"
): Promise<NetworkTypeRow[]> {
  const sql = getDb();
  const sc = scopeClass(scope);

  const rows = (await sql`
    SELECT
      CASE
        WHEN ii.is_tor IS TRUE THEN 'tor'
        WHEN ii.is_proxy IS TRUE OR ii.is_vpn IS TRUE THEN 'proxy'
        WHEN ii.is_hosting IS TRUE OR ii.is_datacenter IS TRUE THEN 'datacenter'
        WHEN ii.ip_address IS NOT NULL THEN 'residential'
        ELSE 'unknown'
      END AS type,
      COUNT(DISTINCT pv.ip_address)::int AS visitors,
      COUNT(*)::int AS views
    FROM page_views pv
    LEFT JOIN ip_intel ii ON ii.ip_address = pv.ip_address
    WHERE pv.visited_at > NOW() - INTERVAL '1 day' * ${days}
      AND (${sc}::text IS NULL OR pv.traffic_class = ${sc})
    GROUP BY 1
  `.catch(() => [])) as Row[];

  const byType = new Map<NetworkType, NetworkTypeRow>();
  for (const r of rows) {
    const type = asType(r.type);
    byType.set(type, { type, visitors: num(r.visitors), views: num(r.views) });
  }
  return TYPE_ORDER.map(
    (type) => byType.get(type) ?? { type, visitors: 0, views: 0 }
  );
}

function reasonsOf(r: Row): string[] {
  const out: string[] = [];
  if (r.is_abuser === true) out.push("abuse list");
  if (r.is_tor === true) out.push("Tor exit");
  if (r.on_drop === true) out.push("Spamhaus DROP");
  return out;
}

/** IPs in the window flagged by ip_intel (abuser, Tor, Spamhaus DROP); top 10 by hits. */
export async function loadKnownBad(days: number): Promise<KnownBadData> {
  const sql = getDb();

  const [rows, total] = await Promise.all([
    sql`
      SELECT pv.ip_address AS ip,
             BOOL_OR(ii.is_abuser IS TRUE) AS is_abuser,
             BOOL_OR(ii.is_tor IS TRUE) AS is_tor,
             BOOL_OR(ii.on_drop IS TRUE) AS on_drop,
             COUNT(*)::int AS hits,
             MAX(pv.visited_at) AS last
      FROM page_views pv
      JOIN ip_intel ii ON ii.ip_address = pv.ip_address
      WHERE pv.visited_at > NOW() - INTERVAL '1 day' * ${days}
        AND (ii.is_abuser IS TRUE OR ii.is_tor IS TRUE OR ii.on_drop IS TRUE)
      GROUP BY pv.ip_address
      ORDER BY hits DESC
      LIMIT 10
    `.catch(() => []),
    sql`
      SELECT COUNT(DISTINCT pv.ip_address)::int AS visitors
      FROM page_views pv
      JOIN ip_intel ii ON ii.ip_address = pv.ip_address
      WHERE pv.visited_at > NOW() - INTERVAL '1 day' * ${days}
        AND (ii.is_abuser IS TRUE OR ii.is_tor IS TRUE OR ii.on_drop IS TRUE)
    `.catch(() => []),
  ]);

  return {
    visitors: num(((total as Row[])?.[0] ?? {}).visitors),
    rows: (rows as Row[]).map((r) => ({
      ip: String(r.ip ?? ""),
      reasons: reasonsOf(r),
      hits: num(r.hits),
      last: r.last ? new Date(r.last as string).toISOString() : "",
    })),
  };
}
