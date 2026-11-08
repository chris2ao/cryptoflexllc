import { useState } from "react";

export const PAGE_SIZE_MOBILE = 12;
export const PAGE_SIZE_DESKTOP = 24;

export interface Paging {
  pages: number;
  showMore: () => void;
  cardClass: (index: number) => string;
  mobileShown: number;
  desktopShown: number;
  hasMoreMobile: boolean;
  hasMoreDesktop: boolean;
}

/**
 * One page counter drives both widths (12 per page under sm, 24 at sm and up).
 * It resets whenever the signature changes, during render (no effect), so
 * returning to an earlier filter cannot resurrect an old count.
 */
export function usePaging(total: number, signature: string): Paging {
  const [state, setState] = useState({ signature, pages: 1 });
  if (state.signature !== signature) {
    setState({ signature, pages: 1 });
  }
  const pages = state.signature === signature ? state.pages : 1;
  const mobileLimit = PAGE_SIZE_MOBILE * pages;
  const desktopLimit = PAGE_SIZE_DESKTOP * pages;

  return {
    pages,
    showMore: () =>
      setState((prev) =>
        prev.signature === signature
          ? { signature, pages: prev.pages + 1 }
          : { signature, pages: 2 }
      ),
    // Static class strings per visibility state (never built from fragments).
    cardClass: (index) => {
      if (index < mobileLimit) return "h-full";
      if (index < desktopLimit) return "h-full max-sm:hidden";
      return "h-full hidden";
    },
    mobileShown: Math.min(mobileLimit, total),
    desktopShown: Math.min(desktopLimit, total),
    hasMoreMobile: mobileLimit < total,
    hasMoreDesktop: desktopLimit < total,
  };
}
