import type { ReactNode } from "react";

interface MobileDiagramScrollProps {
  /** The inner element. Give it the `diagram-scroll-inner` class. */
  children: ReactNode;
  /** True when the inner element opens an enlarged view (DiagramLightbox). */
  enlargeable?: boolean;
}

/**
 * Shared phone mechanism for wide diagrams. Below 768px
 * src/app/diagrams-mobile.css gives each wide svg about 0.8x of its
 * viewBox width, and this wrapper is the horizontal scroll area plus the
 * visible hint. The width comes from the svg viewBox attribute via CSS
 * prefix selectors, so narrow frames (under 500) are never widened.
 * At 768px and up the frame looks and tabs exactly like the old one.
 *
 * Focus: the region is deliberately not focusable and has no role. An
 * enlargeable diagram has one tab stop (the lightbox button, with an inset
 * focus ring so the scroll area cannot clip it). Plain diagrams have none,
 * as before; browsers that make overflowing scrollers keyboard focusable
 * (Chrome, Edge, Firefox) still allow arrow-key scrolling.
 *
 * Show/hide of the hint and badge is done in CSS (.diagram-hint,
 * .diagram-badge), not with display utilities.
 */
export const DIAGRAM_SCROLL_INNER_CLASS = "diagram-scroll-inner";

const SCROLL_PLAIN =
  "diagram-scroll overflow-x-auto rounded-lg border border-border/60 bg-card/50";

/** Hover highlight only where the whole diagram is a click target. */
const SCROLL_ENLARGEABLE = `${SCROLL_PLAIN} transition-colors group-hover:border-primary/40 group-hover:bg-card/80`;

export function MobileDiagramScroll({
  children,
  enlargeable = false,
}: MobileDiagramScrollProps) {
  return (
    <div className="diagram-frame group relative">
      <div className={enlargeable ? SCROLL_ENLARGEABLE : SCROLL_PLAIN}>
        {children}
      </div>
      {enlargeable && (
        <span
          aria-hidden="true"
          className="diagram-badge pointer-events-none absolute top-3 right-3 items-center gap-1.5 rounded-md bg-zinc-800/80 px-2 py-1 text-[10px] text-muted-foreground transition-opacity"
        >
          <svg
            data-diagram-ui=""
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
          <span className="diagram-badge-mouse">Click to enlarge</span>
          <span className="diagram-badge-touch">Tap to enlarge</span>
        </span>
      )}
      <p className="diagram-hint mt-2 text-center text-xs text-muted-foreground">
        <span className="diagram-hint-swipe">
          Swipe to see the full diagram
          {enlargeable ? " · " : ""}
        </span>
        {enlargeable ? "Tap to enlarge" : ""}
      </p>
    </div>
  );
}
