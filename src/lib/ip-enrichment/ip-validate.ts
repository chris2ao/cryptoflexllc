/**
 * IP address validation shared by the ip-intel route and the nightly batch.
 * `isPrivateIp` is the SSRF guard: it rejects loopback, private and
 * link-local ranges before any outbound lookup.
 */

/** Validate IPv4 (each octet 0-255) or IPv6 (standard hex groups). */
export function isValidIp(ip: string): boolean {
  const ipv4 = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
  const ipv6 = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^([0-9a-fA-F]{1,4}:)*:[0-9a-fA-F:]*$/;
  return ipv4.test(ip) || ipv6.test(ip);
}

/** Reject private, loopback, and reserved IP ranges. */
export function isPrivateIp(ip: string): boolean {
  // Normalize IPv4-mapped IPv6 (e.g., ::ffff:127.0.0.1 -> 127.0.0.1)
  const normalized = /^::ffff:/i.test(ip) ? ip.replace(/^::ffff:/i, "") : ip;

  if (/^127\./.test(normalized)) return true;
  if (/^10\./.test(normalized)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(normalized)) return true;
  if (/^192\.168\./.test(normalized)) return true;
  if (/^0\./.test(normalized)) return true;
  if (/^169\.254\./.test(normalized)) return true;
  if (normalized === "::1" || normalized === "0:0:0:0:0:0:0:1") return true;
  if (/^fe80:/i.test(normalized)) return true;
  if (/^f[cd]/i.test(normalized)) return true;
  return false;
}
