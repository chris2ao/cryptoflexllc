"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

const ZOOM_LEVELS = [1, 1.5, 2, 3];

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
};

export function CoverImageLightbox({ src, alt, priority }: Props) {
  const [open, setOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  const close = useCallback(() => {
    setOpen(false);
    setZoomIndex(0);
  }, []);
  const zoomIn = useCallback(
    () => setZoomIndex((i) => Math.min(i + 1, ZOOM_LEVELS.length - 1)),
    []
  );
  const zoomOut = useCallback(
    () => setZoomIndex((i) => Math.max(i - 1, 0)),
    []
  );

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
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ed-post-cover group cursor-zoom-in"
        aria-label={`Enlarge cover image: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1080px) 100vw, 1080px"
          priority={priority}
        />
        <span className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-md bg-zinc-800/80 px-2 py-1 text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          <svg
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
          Click to enlarge
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt || "Image enlarged view"}
          className="fixed inset-0 z-50 flex flex-col"
        >
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={close}
          />
          <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-border/30 bg-zinc-900/95">
            <p className="text-sm text-muted-foreground truncate mr-4">{alt}</p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoomIndex === 0}
                aria-label="Zoom out"
                className="rounded-md border border-border bg-zinc-800 px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
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
                className="rounded-md border border-border bg-zinc-800 px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
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
                className="rounded-md border border-border bg-zinc-800 px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
          <div className="relative z-10 flex-1 overflow-auto flex items-start justify-center">
            <div
              className="inline-block p-8 transition-transform duration-200 motion-reduce:transition-none origin-top"
              style={{ transform: `scale(${zoom})` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="max-w-[90vw] max-h-[85vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
