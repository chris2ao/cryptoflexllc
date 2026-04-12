/**
 * NewsletterSentinel
 *
 * A zero-height, zero-width invisible element placed inside the article at
 * approximately 70% depth. NewsletterPopup watches this element via
 * IntersectionObserver and opens the popup when it scrolls into view.
 *
 * This is a Server Component -- no "use client" directive needed.
 */

interface NewsletterSentinelProps {
  /** Must match the sentinelId prop passed to NewsletterPopup. Defaults to "newsletter-sentinel". */
  id?: string;
}

export function NewsletterSentinel({ id = "newsletter-sentinel" }: NewsletterSentinelProps) {
  return (
    <div
      id={id}
      data-newsletter-sentinel="true"
      aria-hidden="true"
      className="pointer-events-none h-0 w-0 overflow-hidden"
    />
  );
}
