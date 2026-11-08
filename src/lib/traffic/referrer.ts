/**
 * Referrer classification for page views.
 *
 * The client sends `document.referrer`; this module reduces it to a host and
 * a class so the dashboard can group traffic by where it came from. Hosts
 * are matched by suffix (a list entry of `google.com` matches
 * `news.google.com`), and `www.` is stripped first.
 */

export type ReferrerClass =
  | "direct"
  | "internal"
  | "search"
  | "social"
  | "ai"
  | "newsletter"
  | "forged"
  | "other";

export const SEARCH_HOSTS = [
  "bing.com",
  "duckduckgo.com",
  "search.yahoo.com",
  "ecosia.org",
  "search.brave.com",
  "baidu.com",
  "startpage.com",
  "kagi.com",
] as const;

/** Country-specific search engines: the host starts with this label. */
const SEARCH_LABELS = ["google", "yandex"] as const;

export const SOCIAL_HOSTS = [
  "x.com",
  "twitter.com",
  "t.co",
  "linkedin.com",
  "lnkd.in",
  "facebook.com",
  "reddit.com",
  "news.ycombinator.com",
  "bsky.app",
  "threads.net",
  "mastodon.social",
  "lobste.rs",
  "dev.to",
  "medium.com",
  "youtube.com",
] as const;

export const AI_HOSTS = [
  "chatgpt.com",
  "chat.openai.com",
  "perplexity.ai",
  "claude.ai",
  "copilot.microsoft.com",
  "gemini.google.com",
  "you.com",
  "poe.com",
] as const;

/** Hosts known to be written into the Referer header by crawlers. */
export const FORGED_HOSTS = ["aocr.org"] as const;

export const INTERNAL_HOST_SUFFIXES = [
  "cryptoflexllc.com",
  ".vercel.app",
  "localhost",
] as const;

function hostMatches(host: string, list: readonly string[]): boolean {
  return list.some((entry) => host === entry || host.endsWith(`.${entry}`));
}

function isSearchHost(host: string): boolean {
  if (hostMatches(host, SEARCH_HOSTS)) return true;
  const labels = host.split(".");
  return SEARCH_LABELS.some((label) => labels.includes(label));
}

function isInternalHost(host: string): boolean {
  return INTERNAL_HOST_SUFFIXES.some((suffix) => {
    const bare = suffix.replace(/^\./, "");
    return host === bare || host.endsWith(`.${bare}`);
  });
}

/** Lowercase hostname without a leading `www.`; empty for anything that is not an http(s) URL. */
export function referrerHost(referrer: string): string {
  if (!referrer || referrer.length > 2000) return "";
  try {
    const url = new URL(referrer);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function classifyReferrer(
  referrer: string,
  utm: { source?: string | null; medium?: string | null },
): { host: string; cls: ReferrerClass } {
  const host = referrerHost(referrer);
  const source = (utm.source ?? "").toLowerCase();
  const medium = (utm.medium ?? "").toLowerCase();

  if (medium === "email" || source === "newsletter") {
    return { host, cls: "newsletter" };
  }
  if (source && hostMatches(source, AI_HOSTS)) {
    return { host, cls: "ai" };
  }
  if (!host) return { host, cls: "direct" };
  if (hostMatches(host, FORGED_HOSTS)) return { host, cls: "forged" };
  if (isInternalHost(host)) return { host, cls: "internal" };
  if (hostMatches(host, AI_HOSTS)) return { host, cls: "ai" };
  if (isSearchHost(host)) return { host, cls: "search" };
  if (hostMatches(host, SOCIAL_HOSTS)) return { host, cls: "social" };
  return { host, cls: "other" };
}
