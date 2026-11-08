import type { SqlTag } from "./batch";
import { getCachedIntel, upsertIntel } from "./cache";
import { ipInCidrs } from "./cidr";
import { fetchIpapiIs } from "./providers/ipapi-is";
import { fetchRdap } from "./providers/rdap";
import { loadDropCidrs } from "./providers/spamhaus-drop";
import { loadTorExitSet } from "./providers/tor-exits";
import { EMPTY_ENRICHMENT, type IpEnrichment } from "./types";

export interface EnrichDeps {
  fetchImpl: typeof fetch;
  key: string | undefined;
  now: number;
}

export interface EnrichResult {
  enrichment: IpEnrichment;
  cached: boolean;
}

/**
 * Cache first, else ipapi.is + RDAP + Tor exits + Spamhaus DROP, merged and
 * upserted. Never throws. If neither ipapi.is nor RDAP answered, nothing is
 * cached and the result is empty with `sources: []`.
 */
export async function enrichIp(
  sql: SqlTag,
  ip: string,
  deps: EnrichDeps = { fetchImpl: fetch, key: process.env.IPAPI_IS_KEY, now: Date.now() },
): Promise<EnrichResult> {
  const enrichedAt = new Date(deps.now).toISOString();
  const empty: IpEnrichment = { ...EMPTY_ENRICHMENT, ip, enrichedAt, sources: [] };

  try {
    try {
      const hit = await getCachedIntel(sql, ip);
      if (hit) return { enrichment: hit, cached: true };
    } catch (error) {
      console.error("IP intel cache read failed:", error instanceof Error ? error.message : "unknown");
    }

    const [ipapi, rdap, torSet, dropCidrs] = await Promise.all([
      fetchIpapiIs(ip, deps.key, deps.fetchImpl),
      fetchRdap(ip, deps.fetchImpl),
      loadTorExitSet(sql, deps.fetchImpl, deps.now),
      loadDropCidrs(sql, deps.fetchImpl, deps.now),
    ]);

    const ipapiOk = Object.keys(ipapi).length > 0;
    const rdapOk = Boolean(rdap.org || rdap.address);
    if (!ipapiOk && !rdapOk) {
      // Negative cache: a row without ipapi.is in its sources is served for
      // one day only (see getCachedIntel), so a dead lookup cannot occupy a
      // batch slot every night and is retried tomorrow.
      await upsertIntel(sql, empty).catch(() => undefined);
      return { enrichment: empty, cached: false };
    }

    const sources = [
      ...(ipapiOk ? ["ipapi.is"] : []),
      ...(rdapOk ? ["rdap"] : []),
      ...(torSet.size > 0 ? ["tor-exits"] : []),
      ...(dropCidrs.length > 0 ? ["spamhaus-drop"] : []),
    ];

    const enrichment: IpEnrichment = {
      ...EMPTY_ENRICHMENT,
      ...ipapi,
      ip,
      isTor: torSet.has(ip) || ipapi.isTor === true,
      onDrop: ipInCidrs(ip, dropCidrs),
      whoisOrg: rdap.org,
      sources,
      enrichedAt,
    };

    await upsertIntel(sql, enrichment);
    return { enrichment, cached: false };
  } catch (error) {
    console.error("IP enrichment failed:", error instanceof Error ? error.message : "unknown");
    return { enrichment: empty, cached: false };
  }
}
