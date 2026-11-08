/** IPv4 CIDR helpers for the Spamhaus DROP check. IPv6 never matches. */

export function ipv4ToInt(ip: string): number | null {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(ip.trim());
  if (!m) return null;
  const octets = m.slice(1).map(Number);
  if (octets.some((o) => o > 255)) return null;
  return ((octets[0] * 256 + octets[1]) * 256 + octets[2]) * 256 + octets[3];
}

/** True when the IPv4 address falls in any `[networkInt, prefixLength]` pair. */
export function ipInCidrs(ip: string, cidrs: Array<[number, number]>): boolean {
  const n = ipv4ToInt(ip);
  if (n === null) return false;
  return cidrs.some(([network, prefix]) => {
    if (prefix < 0 || prefix > 32) return false;
    const size = 2 ** (32 - prefix);
    return Math.floor(n / size) === Math.floor(network / size);
  });
}
