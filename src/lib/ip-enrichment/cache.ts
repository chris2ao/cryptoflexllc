import type { SqlTag } from "./batch";
import { EMPTY_ENRICHMENT, type IpEnrichment } from "./types";

type Row = Record<string, unknown>;

const s = (v: unknown): string => (typeof v === "string" ? v : v == null ? "" : String(v));
const b = (v: unknown): boolean | null => (typeof v === "boolean" ? v : null);

function rowToEnrichment(row: Row): IpEnrichment {
  const isDatacenter = b(row.is_datacenter);
  const isVpn = b(row.is_vpn);
  const isAbuser = b(row.is_abuser);
  // The legacy is_proxy column is NOT NULL, so an anonymous lookup (no
  // detection flags at all) would read back as a false "not a proxy".
  const anonymous = isDatacenter === null && isVpn === null && isAbuser === null;
  const enrichedAt = row.enriched_at ? new Date(s(row.enriched_at)).toISOString() : "";
  const sources = s(row.sources).split(",").map((x) => x.trim()).filter(Boolean);

  return {
    ...EMPTY_ENRICHMENT,
    ip: s(row.ip_address),
    asn: s(row.as_number),
    asName: s(row.as_name),
    company: s(row.company),
    country: s(row.country),
    city: s(row.city),
    region: s(row.region),
    latitude: s(row.latitude),
    longitude: s(row.longitude),
    isDatacenter,
    isTor: row.is_tor === true,
    isProxy: anonymous ? null : b(row.is_proxy),
    isVpn,
    isAbuser,
    abuserScore: s(row.abuser_score),
    onDrop: row.on_drop === true,
    whoisOrg: s(row.whois_org),
    sources,
    enrichedAt,
  };
}

/** A cached row whose `enriched_at` is within 7 days, else null. */
export async function getCachedIntel(sql: SqlTag, ip: string): Promise<IpEnrichment | null> {
  const rows = (await sql`
    SELECT * FROM ip_intel
    WHERE ip_address = ${ip}
      AND enriched_at IS NOT NULL
      AND enriched_at > NOW() - INTERVAL '7 days'
    LIMIT 1
  `) as Row[];
  return rows.length > 0 ? rowToEnrichment(rows[0]) : null;
}

/** Writes the new columns and the legacy ones the wave 1 classifier reads. */
export async function upsertIntel(sql: SqlTag, d: IpEnrichment): Promise<void> {
  const isHosting = d.isDatacenter ?? false;
  const isProxy = d.isProxy ?? false;
  const sources = d.sources.join(",");
  const lat = d.latitude.slice(0, 20);
  const lon = d.longitude.slice(0, 20);
  const country = d.country.slice(0, 100);
  const city = d.city.slice(0, 100);
  const region = d.region.slice(0, 100);

  await sql`
    INSERT INTO ip_intel (
      ip_address, isp, org, as_number, as_name,
      is_proxy, is_hosting, is_mobile,
      country, city, region, whois_org,
      latitude, longitude, cached_at,
      company, is_datacenter, is_tor, is_vpn, is_abuser, abuser_score,
      on_drop, sources, enriched_at
    ) VALUES (
      ${d.ip}, ${d.company}, ${d.company}, ${d.asn}, ${d.asName},
      ${isProxy}, ${isHosting}, ${false},
      ${country}, ${city}, ${region}, ${d.whoisOrg},
      ${lat}, ${lon}, NOW(),
      ${d.company}, ${d.isDatacenter}, ${d.isTor}, ${d.isVpn}, ${d.isAbuser}, ${d.abuserScore},
      ${d.onDrop}, ${sources}, NOW()
    )
    ON CONFLICT (ip_address) DO UPDATE SET
      isp = EXCLUDED.isp, org = EXCLUDED.org,
      as_number = EXCLUDED.as_number, as_name = EXCLUDED.as_name,
      is_proxy = EXCLUDED.is_proxy, is_hosting = EXCLUDED.is_hosting,
      is_mobile = EXCLUDED.is_mobile,
      country = EXCLUDED.country, city = EXCLUDED.city, region = EXCLUDED.region,
      whois_org = EXCLUDED.whois_org,
      latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude,
      cached_at = NOW(),
      company = EXCLUDED.company, is_datacenter = EXCLUDED.is_datacenter,
      is_tor = EXCLUDED.is_tor, is_vpn = EXCLUDED.is_vpn,
      is_abuser = EXCLUDED.is_abuser, abuser_score = EXCLUDED.abuser_score,
      on_drop = EXCLUDED.on_drop, sources = EXCLUDED.sources,
      enriched_at = NOW()
  `;
}
