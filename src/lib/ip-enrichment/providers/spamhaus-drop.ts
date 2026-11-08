import type { SqlTag } from "../batch";
import { ipv4ToInt } from "../cidr";
import { loadListText } from "./tor-exits";

const DROP_URL = "https://www.spamhaus.org/drop/drop.txt";

export function parseDrop(text: string): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith(";")) continue;
    const m = /^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})\b/.exec(line);
    if (!m) continue;
    const network = ipv4ToInt(m[1]);
    const prefix = Number(m[2]);
    if (network === null || prefix > 32) continue;
    out.push([network, prefix]);
  }
  return out;
}

export async function loadDropCidrs(
  sql: SqlTag,
  fetchImpl: typeof fetch = fetch,
  now: number = Date.now(),
): Promise<Array<[number, number]>> {
  const text = await loadListText(sql, "spamhaus-drop", DROP_URL, 8000, fetchImpl, now, (t) => parseDrop(t).length > 0);
  return parseDrop(text);
}
