export const SUBSCRIBE_COPY = {
  name: "Field notes",
  title: "Field notes, every Monday.",
  body: "One email each Monday with what I published that week. No tracking pixels, no growth hacks, and an unsubscribe link in every issue.",
  success: "You're in. Check your inbox Monday.",
  placeholder: "you@example.com",
  cta: "Subscribe",
} as const;

/** A small subscriber count works against the site, so hide it below this. */
export const MIN_SOCIAL_PROOF = 100;

export function showSubscriberCount(count: number | null): count is number {
  return typeof count === "number" && count >= MIN_SOCIAL_PROOF;
}
