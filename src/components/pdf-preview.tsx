"use client";

import { useState } from "react";

interface PdfPreviewProps {
  /** URL of the PDF, usually in the public Blob store. */
  src: string;
  /** Accessible title for the embedded viewer. */
  title: string;
}

/**
 * Click-to-load PDF viewer.
 *
 * The slide PDFs live in Vercel Blob and run to several MB each. An iframe
 * that mounts on page load fetches the whole file for every visitor and
 * crawler, and each Blob cache miss counts toward Fast Origin Transfer, which
 * Hobby caps at 10 GB. The file is only requested once the reader asks for it.
 */
export function PdfPreview({ src, title }: PdfPreviewProps) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        src={src}
        title={title}
        className="w-full rounded-lg border border-border"
        style={{ height: "80vh", minHeight: "600px" }}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card px-6 py-16 text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
      </svg>
      <span className="text-sm font-medium">Preview the PDF here</span>
    </button>
  );
}
