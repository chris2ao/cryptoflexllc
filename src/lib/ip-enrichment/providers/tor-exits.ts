import type { SqlTag } from "../batch";
import { ipv4ToInt } from "../cidr";

/** After a failed refresh the stale text is reused this long before trying again. */
export const STALE_TTL_MS = 10 * 60 * 1000;
/** A real list is well under this; a consent or error page that slips through is not cached. */
const MAX_LIST_BYTES = 2 * 1024 * 1024;
export const LIST_TTL_MS = 24 * 60 * 60 * 1000;
const TOR_URL = "https://check.torproject.org/torbulkexitlist";

const memo = new Map<string, { text: string; at: number }>();

/** Test hook: clears the module-level list cache. */
export function resetListCache(): void {
  memo.clear();
}

/**
 * Shared loader for the daily threat lists: module memo, then the
 * `threat_lists` row, then the network. On fetch failure falls back to the
 * stale cached text, else an empty string. Never throws.
 */
function rememberStale(name: string, text: string, now: number): string {
  if (text) {
    console.warn(`Threat list "${name}" refresh failed, serving stale copy`);
  } else {
    console.warn(`Threat list "${name}" refresh failed and no cached copy exists`);
  }
  memo.set(name, { text, at: now - LIST_TTL_MS + STALE_TTL_MS });
  return text;
}

export async function loadListText(
  sql: SqlTag,
  name: string,
  url: string,
  timeoutMs: number,
  fetchImpl: typeof fetch,
  now: number,
  validate: (text: string) => boolean = () => true,
): Promise<string> {
  const mem = memo.get(name);
  if (mem && now - mem.at < LIST_TTL_MS) return mem.text;

  let stale = mem?.text ?? "";
  try {
    const rows = (await sql`
      SELECT entries, fetched_at FROM threat_lists WHERE name = ${name} LIMIT 1
    `) as Array<{ entries: string; fetched_at: string | Date }>;
    if (rows.length > 0 && typeof rows[0].entries === "string") {
      const at = new Date(rows[0].fetched_at).getTime();
      if (Number.isFinite(at) && now - at < LIST_TTL_MS) {
        memo.set(name, { text: rows[0].entries, at });
        return rows[0].entries;
      }
      stale = rows[0].entries || stale;
    }
  } catch {
    // fall through to the network
  }

  try {
    const res = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return rememberStale(name, stale, now);
    const declared = Number(res.headers.get("content-length") ?? 0);
    if (declared > MAX_LIST_BYTES) return rememberStale(name, stale, now);
    const text = await res.text();
    if (!text.trim() || text.length > MAX_LIST_BYTES || !validate(text)) {
      return rememberStale(name, stale, now);
    }
    memo.set(name, { text, at: now });
    try {
      await sql`
        INSERT INTO threat_lists (name, entries, fetched_at)
        VALUES (${name}, ${text}, NOW())
        ON CONFLICT (name) DO UPDATE SET entries = EXCLUDED.entries, fetched_at = NOW()
      `;
    } catch {
      // cache write failure is not fatal
    }
    return text;
  } catch {
    return rememberStale(name, stale, now);
  }
}

export function parseTorExits(text: string): Set<string> {
  const out = new Set<string>();
  for (const line of text.split("\n")) {
    const ip = line.trim();
    if (ip && ipv4ToInt(ip) !== null) out.add(ip);
  }
  return out;
}

export async function loadTorExitSet(
  sql: SqlTag,
  fetchImpl: typeof fetch = fetch,
  now: number = Date.now(),
): Promise<Set<string>> {
  const text = await loadListText(sql, "tor-exits", TOR_URL, 8000, fetchImpl, now, (t) => parseTorExits(t).size > 0);
  return parseTorExits(text);
}
