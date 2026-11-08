"use client";

import type { ReactNode } from "react";

/** Fired on window with `{ detail: { ip } }`; the visitor panel host listens. */
export const VISITOR_EVENT = "ax:open-visitor";

export type VisitorEventDetail = { ip: string };

export function openVisitor(ip: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<VisitorEventDetail>(VISITOR_EVENT, { detail: { ip } }),
  );
}

/**
 * Every IP on the dashboard is one of these. Clicking opens the visitor
 * dossier panel (wave 3, task 10) through a window event, so the panel is
 * mounted once in the page and no component needs a prop drilled to it.
 */
export function IpLink({ ip, children }: { ip: string; children?: ReactNode }) {
  if (!ip) return <span className="ax-ip ax-ip--empty">unknown</span>;
  return (
    <button
      type="button"
      className="ax-ip"
      onClick={() => openVisitor(ip)}
      aria-label={`Open visitor details for ${ip}`}
      title="Visitor details"
    >
      {children ?? ip}
    </button>
  );
}
