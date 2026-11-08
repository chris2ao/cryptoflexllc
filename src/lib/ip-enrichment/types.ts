/**
 * Shape of one enriched IP, as cached in `ip_intel` and returned by
 * GET /api/analytics/ip-intel. Nullable booleans mean "unknown": the
 * anonymous ipapi.is tier returns no detection flags, so a missing key
 * must never read as "not a datacenter".
 */
export type IpEnrichment = {
  ip: string;
  asn: string;
  asName: string;
  company: string;
  country: string;
  city: string;
  region: string;
  latitude: string;
  longitude: string;
  isDatacenter: boolean | null;
  isTor: boolean;
  isProxy: boolean | null;
  isVpn: boolean | null;
  isAbuser: boolean | null;
  abuserScore: string;
  onDrop: boolean;
  whoisOrg: string;
  sources: string[];
  enrichedAt: string;
};

export const EMPTY_ENRICHMENT: Omit<IpEnrichment, "ip" | "enrichedAt"> = {
  asn: "",
  asName: "",
  company: "",
  country: "",
  city: "",
  region: "",
  latitude: "",
  longitude: "",
  isDatacenter: null,
  isTor: false,
  isProxy: null,
  isVpn: null,
  isAbuser: null,
  abuserScore: "",
  onDrop: false,
  whoisOrg: "",
  sources: [],
};
