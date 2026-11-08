/**
 * IP address validation shared by the ip-intel route and the nightly batch.
 * `isPrivateIp` is the SSRF guard: it rejects loopback, private, link-local
 * and other reserved ranges before any outbound lookup. Server-only: it uses
 * `node:net`, which cannot be bundled for the client.
 */
import { BlockList, isIP } from "node:net";

const V4_RESERVED: ReadonlyArray<readonly [string, number]> = [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
];

const V6_RESERVED: ReadonlyArray<readonly [string, number]> = [
  ["::", 128],
  ["::1", 128],
  ["100::", 64],
  ["2001:db8::", 32],
  ["fc00::", 7],
  ["fe80::", 10],
  ["fec0::", 10],
  ["ff00::", 8],
];

const RESERVED = new BlockList();
for (const [net, prefix] of V4_RESERVED) RESERVED.addSubnet(net, prefix, "ipv4");
for (const [net, prefix] of V6_RESERVED) RESERVED.addSubnet(net, prefix, "ipv6");

/** True for any literal IPv4 or IPv6 address. */
export function isValidIp(ip: string): boolean {
  return isIP(ip) !== 0;
}

/** Turns ::ffff:a.b.c.d and ::ffff:hhhh:hhhh into dotted IPv4, else null. */
function unmapV4(ip: string): string | null {
  const dotted = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(ip);
  if (dotted) return dotted[1];
  const hex = /^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i.exec(ip);
  if (!hex) return null;
  const hi = parseInt(hex[1], 16);
  const lo = parseInt(hex[2], 16);
  return `${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`;
}

/** Reject private, loopback, and reserved IP ranges. */
export function isPrivateIp(ip: string): boolean {
  const family = isIP(ip);
  if (family === 0) return false;
  const v4 = family === 6 ? unmapV4(ip) : null;
  if (v4 !== null) return isIP(v4) === 4 && RESERVED.check(v4, "ipv4");
  return RESERVED.check(ip, family === 4 ? "ipv4" : "ipv6");
}
