"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { MobileDiagramScroll } from "./mobile-diagram-scroll";

interface DiagramLightboxProps {
  children: ReactNode;
  caption?: string;
}

const ZOOM_LEVELS = [1, 1.5, 2, 3];

export function DiagramLightbox({ children, caption }: DiagramLightboxProps) {
  const [open, setOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  const close = useCallback(() => {
    setOpen(false);
    setZoomIndex(0);
  }, []);

  const zoomIn = useCallback(() => {
    setZoomIndex((i) => Math.min(i + 1, ZOOM_LEVELS.length - 1));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomIndex((i) => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, zoomIn, zoomOut]);

  const zoom = ZOOM_LEVELS[zoomIndex];

  return (
    <>
      <figure className="not-prose my-8">
        <MobileDiagramScroll enlargeable>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="diagram-scroll-inner block w-full cursor-zoom-in p-4 md:p-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary/60"
            aria-label={caption ? `Enlarge diagram: ${caption}` : "Enlarge diagram"}
          >
            {children}
          </button>
        </MobileDiagramScroll>
        {caption && (
          <figcaption className="mt-2 text-center text-xs text-muted-foreground">
            {caption}
          </figcaption>
        )}
      </figure>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={caption ?? "Diagram enlarged view"}
          className="fixed inset-0 z-50 flex flex-col"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={close} />

          {/* Toolbar */}
          <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-border/30 bg-zinc-900/95">
            {caption && (
              <p className="text-sm text-muted-foreground truncate mr-4">{caption}</p>
            )}
            {!caption && <div />}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoomIndex === 0}
                aria-label="Zoom out"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-zinc-800 px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </button>
              <span className="text-xs text-muted-foreground font-mono min-w-[3.5rem] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={zoomIn}
                disabled={zoomIndex === ZOOM_LEVELS.length - 1}
                aria-label="Zoom in"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-zinc-800 px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </button>
              <div className="w-px h-5 bg-border/40 mx-1" />
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-zinc-800 px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable + zoomable content area */}
          {/* pan-x pan-y keep one-finger scrolling; pinch-zoom allows browser pinch */}
          <div className="relative z-10 flex-1 overflow-auto [touch-action:pan-x_pan-y_pinch-zoom]">
            <div
              className="inline-block p-8 transition-transform duration-200 motion-reduce:transition-none origin-top-left [&_svg]:max-w-none [&_svg]:w-auto [&_svg]:h-auto"
              style={{
                transform: `scale(${zoom})`,
                minWidth: `${90 * zoom}vw`,
              }}
            >
              {/* Large base size from md up. On phones diagrams-mobile.css
                  (.diagram-modal-content) opens at about the natural viewBox
                  width so text is readable at zoom 1. */}
              <div className="diagram-modal-content md:[&_svg]:min-w-[85vw] md:[&_svg]:w-[85vw]">
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
