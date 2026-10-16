/**
 * True only for absolute http(s) URLs. Everything else, including
 * protocol-relative "//host" values, is treated as an internal path so it
 * never opens a new tab without rel="noopener noreferrer" handling.
 */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
