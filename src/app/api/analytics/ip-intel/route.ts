/**
 * GET /api/analytics/ip-intel?ip=1.2.3.4
 * -----------------------------------------------
 * On-demand IP intelligence lookup. Protected by cookie/header auth.
 * Checks DB cache first (7-day TTL), then queries free APIs:
 * ip-api.com, RDAP, Nominatim.
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/analytics";
import { verifyApiAuth } from "@/lib/analytics-auth";
import type { IpIntelData } from "@/lib/analytics-types";

// IPv4 or IPv6 format validation
const IP_REGEX = /^(?:\d{1,3}\.){3}\d{1,3}$|^[0-9a-fA-F:]+$/;

/**
 * Reject private, loopback, and reserved IP ranges.
 * Prevents SSRF by blocking lookups against internal addresses.
 */
function isPrivateIp(ip: string): boolean {
  // Normalize IPv4-mapped IPv6 (e.g., ::ffff:127.0.0.1 -> 127.0.0.1)
  const normalized = /^::ffff:/i.test(ip) ? ip.replace(/^::ffff:/i, "") : ip;

  // IPv4 private/reserved ranges
  if (/^127\./.test(normalized)) return true;
  if (/^10\./.test(normalized)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(normalized)) return true;
  if (/^192\.168\./.test(normalized)) return true;
  if (/^0\./.test(normalized)) return true;
  if (/^169\.254\./.test(normalized)) return true;
  // IPv6 loopback
  if (normalized === "::1" || normalized === "0:0:0:0:0:0:0:1") return true;
  // IPv6 link-local
  if (/^fe80:/i.test(normalized)) return true;
  // IPv6 unique local addresses (fc00::/7)
  if (/^f[cd]/i.test(normalized)) return true;
  return false;
}

export async function GET(request: NextRequest) {
  // Auth check (cookie or Authorization header)
  if (!verifyApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = request.nextUrl.searchParams.get("ip");
  if (!ip || !IP_REGEX.test(ip)) {
    return NextResponse.json({ error: "Invalid IP address" }, { status: 400 });
  }

  // Block private/loopback IPs to prevent SSRF
  if (isPrivateIp(ip)) {
    return NextResponse.json({ error: "Private IP addresses are not supported" }, { status: 400 });
  }

  try {
    const sql = getDb();

    // Check cache (7-day TTL)
    const cached = await sql`
      SELECT * FROM ip_intel
      WHERE ip_address = ${ip}
        AND cached_at > NOW() - INTERVAL '7 days'
      LIMIT 1
    `;

    if (cached.length > 0) {
      return NextResponse.json(cached[0] as IpIntelData);
    }

    // Step 1: ip-api.com — ISP, org, ASN, geo, proxy flags
    // NOTE: ip-api.com free tier only supports HTTP, not HTTPS.
    // The paid plan supports HTTPS. For a personal analytics dashboard
    // this is acceptable; the data returned is public IP metadata.
    const ipApiData = await fetchIpApi(ip);

    // Step 2: RDAP — WHOIS registered org and address
    const rdapData = await fetchRdap(ip);

    // Step 3: Nominatim — Reverse geocode lat/lon to address
    const nominatimData =
      ipApiData.lat && ipApiData.lon
        ? await fetchNominatim(ipApiData.lat, ipApiData.lon)
        : { address: "", county: "", state: "" };

    const result: IpIntelData = {
      ip_address: ip,
      isp: ipApiData.isp,
      org: ipApiData.org,
      as_number: ipApiData.asNumber,
      as_name: ipApiData.asName,
      is_proxy: ipApiData.proxy,
      is_hosting: ipApiData.hosting,
      is_mobile: ipApiData.mobile,
      country: ipApiData.country,
      city: ipApiData.city,
      region: ipApiData.region,
      whois_org: rdapData.org,
      whois_address: rdapData.address,
      reverse_address: nominatimData.address,
      reverse_county: nominatimData.county,
      reverse_state: nominatimData.state,
      latitude: ipApiData.lat ? String(ipApiData.lat) : "",
      longitude: ipApiData.lon ? String(ipApiData.lon) : "",
      cached_at: new Date().toISOString(),
    };

    // Upsert into cache
    await sql`
      INSERT INTO ip_intel (
        ip_address, isp, org, as_number, as_name,
        is_proxy, is_hosting, is_mobile,
        country, city, region,
        whois_org, whois_address,
        reverse_address, reverse_county, reverse_state,
        latitude, longitude, cached_at
      ) VALUES (
        ${result.ip_address}, ${result.isp}, ${result.org},
        ${result.as_number}, ${result.as_name},
        ${result.is_proxy}, ${result.is_hosting}, ${result.is_mobile},
        ${result.country}, ${result.city}, ${result.region},
        ${result.whois_org}, ${result.whois_address},
        ${result.reverse_address}, ${result.reverse_county}, ${result.reverse_state},
        ${result.latitude}, ${result.longitude}, NOW()
      )
      ON CONFLICT (ip_address) DO UPDATE SET
        isp = EXCLUDED.isp, org = EXCLUDED.org,
        as_number = EXCLUDED.as_number, as_name = EXCLUDED.as_name,
        is_proxy = EXCLUDED.is_proxy, is_hosting = EXCLUDED.is_hosting,
        is_mobile = EXCLUDED.is_mobile,
        country = EXCLUDED.country, city = EXCLUDED.city, region = EXCLUDED.region,
        whois_org = EXCLUDED.whois_org, whois_address = EXCLUDED.whois_address,
        reverse_address = EXCLUDED.reverse_address,
        reverse_county = EXCLUDED.reverse_county, reverse_state = EXCLUDED.reverse_state,
        latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude,
        cached_at = NOW()
    `;

    return NextResponse.json(result);
  } catch (error) {
    console.error("IP intel lookup error:", error);
    return NextResponse.json(
      { error: "Lookup failed" },
      { status: 500 }
    );
  }
}

// ---- ip-api.com ----

interface IpApiResult {
  isp: string;
  org: string;
  asNumber: string;
  asName: string;
  proxy: boolean;
  hosting: boolean;
  mobile: boolean;
  country: string;
  city: string;
  region: string;
  lat: number;
  lon: number;
}

async function fetchIpApi(ip: string): Promise<IpApiResult> {
  const empty: IpApiResult = {
    isp: "", org: "", asNumber: "", asName: "",
    proxy: false, hosting: false, mobile: false,
    country: "", city: "", region: "",
    lat: 0, lon: 0,
  };

  try {
    // ip-api.com free tier: 45 req/min, HTTP only (HTTPS requires paid plan)
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,message,country,city,regionName,lat,lon,isp,org,as,mobile,proxy,hosting`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return empty;

    const data = await res.json();
    if (data.status !== "success") return empty;

    // Parse AS field: "AS7922 Comcast Cable Communications, LLC"
    const asMatch = (data.as || "").match(/^(AS\d+)\s*(.*)/);

    return {
      isp: data.isp || "",
      org: data.org || "",
      asNumber: asMatch ? asMatch[1] : "",
      asName: asMatch ? asMatch[2] : "",
      proxy: !!data.proxy,
      hosting: !!data.hosting,
      mobile: !!data.mobile,
      country: data.country || "",
      city: data.city || "",
      region: data.regionName || "",
      lat: data.lat || 0,
      lon: data.lon || 0,
    };
  } catch {
    return empty;
  }
}

// ---- RDAP (WHOIS) ----

interface RdapResult {
  org: string;
  address: string;
}

async function fetchRdap(ip: string): Promise<RdapResult> {
  const empty: RdapResult = { org: "", address: "" };

  try {
    const res = await fetch(`https://rdap.org/ip/${encodeURIComponent(ip)}`, {
      headers: { Accept: "application/rdap+json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return empty;

    const data = await res.json();

    let org = "";
    let address = "";

    if (data.entities && Array.isArray(data.entities)) {
      for (const entity of data.entities) {
        if (entity.vcardArray && Array.isArray(entity.vcardArray)) {
          const vcard = entity.vcardArray[1] || [];
          for (const entry of vcard) {
            if (entry[0] === "fn" && !org) {
              org = entry[3] || "";
            }
            if (entry[0] === "adr" && !address) {
              const parts = Array.isArray(entry[3]) ? entry[3] : [];
              address = parts
                .filter((p: string) => typeof p === "string" && p.trim())
                .join(", ");
            }
          }
        }
        if (org && address) break;
      }
    }

    return { org, address };
  } catch {
    return empty;
  }
}

// ---- Nominatim (reverse geocode) ----

interface NominatimResult {
  address: string;
  county: string;
  state: string;
}

async function fetchNominatim(lat: number, lon: number): Promise<NominatimResult> {
  const empty: NominatimResult = { address: "", county: "", state: "" };

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=16`,
      {
        headers: { "User-Agent": "CryptoFlexAnalytics/1.0" },
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) return empty;

    const data = await res.json();
    const addr = data.address || {};

    const parts = [
      addr.road || addr.pedestrian || "",
      addr.city || addr.town || addr.village || "",
      addr.state || "",
      addr.postcode || "",
      addr.country || "",
    ].filter(Boolean);

    return {
      address: parts.join(", "),
      county: addr.county || "",
      state: addr.state || "",
    };
  } catch {
    return empty;
  }
}
