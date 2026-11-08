import type { IpEnrichment } from "../types";

type Json = Record<string, unknown>;

const asRecord = (v: unknown): Json | null =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Json) : null;
const str = (v: unknown): string =>
  typeof v === "string" ? v : typeof v === "number" ? String(v) : "";
const flag = (v: unknown): boolean | null => (typeof v === "boolean" ? v : null);

function parseAsn(v: unknown): { asn: string; asName: string } {
  const obj = asRecord(v);
  if (obj) {
    const n = str(obj.asn);
    return { asn: n ? (/^AS/i.test(n) ? n : `AS${n}`) : "", asName: str(obj.org) || str(obj.descr) };
  }
  const m = /^(AS\d+)\s*(.*)$/.exec(str(v).trim());
  return m ? { asn: m[1], asName: m[2] } : { asn: "", asName: "" };
}

/**
 * ipapi.is lookup. Anonymous responses carry no detection flags, so the four
 * nullable flags stay null (unknown). Never throws; returns `{}` on failure.
 */
export async function fetchIpapiIs(
  ip: string,
  key: string | undefined,
  fetchImpl: typeof fetch = fetch,
): Promise<Partial<IpEnrichment>> {
  try {
    let url = `https://api.ipapi.is/?q=${encodeURIComponent(ip)}`;
    if (key) url += `&key=${encodeURIComponent(key)}`;
    const res = await fetchImpl(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return {};
    const data = asRecord(await res.json());
    if (!data || data.error) return {};

    const companyObj = asRecord(data.company);
    const company = companyObj ? str(companyObj.name) : str(data.company);
    const { asn, asName } = parseAsn(data.asn);

    return {
      asn,
      asName,
      company,
      country: str(data.country),
      city: str(data.city),
      region: str(data.region),
      latitude: str(data.lat),
      longitude: str(data.lon),
      isDatacenter: flag(data.is_datacenter),
      isProxy: flag(data.is_proxy),
      isVpn: flag(data.is_vpn),
      isAbuser: flag(data.is_abuser),
      isTor: data.is_tor === true,
      abuserScore: companyObj ? str(companyObj.abuser_score) : "",
    };
  } catch {
    return {};
  }
}
