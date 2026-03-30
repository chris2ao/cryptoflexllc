"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";

interface DiagramLightboxProps {
  children: ReactNode;
  caption?: string;
}

export function DiagramLightbox({ children, caption }: DiagramLightboxProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <>
      <figure className="not-prose my-8">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative w-full cursor-zoom-in rounded-lg border border-border/60 bg-card/50 p-6 overflow-x-auto transition-colors hover:border-primary/40 hover:bg-card/80"
          aria-label={caption ? `Enlarge diagram: ${caption}` : "Enlarge diagram"}
        >
          {children}
          <span className="absolute top-3 right-3 flex items-center gap-1.5 rounded-md bg-zinc-800/80 px-2 py-1 text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
            Click to enlarge
          </span>
        </button>
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
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={close}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

          {/* Content */}
          <div
            className="relative mx-4 max-h-[90vh] max-w-[95vw] overflow-auto rounded-xl border border-border/40 bg-zinc-900 p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={close}
              aria-label="Close enlarged view"
              className="absolute top-3 right-3 z-10 rounded-md border border-border bg-zinc-800 p-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Scaled-up SVG container */}
            <div className="min-w-[700px] [&_svg]:w-full [&_svg]:min-w-[700px]">
              {children}
            </div>

            {caption && (
              <p className="mt-4 text-center text-sm text-muted-foreground">{caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
