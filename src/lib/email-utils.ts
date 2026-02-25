/**
 * Mask email address for logging to prevent PII exposure.
 * Example: user@domain.com -> u***@domain.com
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  return `${local[0]}***@${domain}`;
}
