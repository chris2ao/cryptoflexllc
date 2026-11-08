export interface RdapResult {
  org: string;
  address: string;
}

/** RDAP (WHOIS) lookup via rdap.org. Never throws. */
export async function fetchRdap(
  ip: string,
  fetchImpl: typeof fetch = fetch,
): Promise<RdapResult> {
  const empty: RdapResult = { org: "", address: "" };

  try {
    const res = await fetchImpl(`https://rdap.org/ip/${encodeURIComponent(ip)}`, {
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
