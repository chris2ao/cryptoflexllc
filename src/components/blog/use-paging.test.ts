import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePaging } from "./use-paging";

describe("usePaging", () => {
  it("shows one page and reports more at the 12 and 24 boundaries", () => {
    const { result } = renderHook(() => usePaging(40, "a"));
    expect(result.current.pages).toBe(1);
    expect(result.current.mobileShown).toBe(12);
    expect(result.current.desktopShown).toBe(24);
    expect(result.current.hasMoreMobile).toBe(true);
    expect(result.current.hasMoreDesktop).toBe(true);
  });

  it("has no more when total equals the page size", () => {
    const { result } = renderHook(() => usePaging(12, "a"));
    expect(result.current.hasMoreMobile).toBe(false);
    expect(result.current.hasMoreDesktop).toBe(false);
    const wide = renderHook(() => usePaging(24, "a")).result.current;
    expect(wide.hasMoreMobile).toBe(true);
    expect(wide.hasMoreDesktop).toBe(false);
  });

  it("advances to 24 mobile and 48 desktop, and 36 total", () => {
    const { result } = renderHook(() => usePaging(36, "a"));
    act(() => result.current.showMore());
    expect(result.current.pages).toBe(2);
    expect(result.current.mobileShown).toBe(24);
    expect(result.current.desktopShown).toBe(36);
    expect(result.current.hasMoreMobile).toBe(true);
    expect(result.current.hasMoreDesktop).toBe(false);
    act(() => result.current.showMore());
    expect(result.current.mobileShown).toBe(36);
    expect(result.current.hasMoreMobile).toBe(false);
  });

  it("returns static class strings per index", () => {
    const { result } = renderHook(() => usePaging(40, "a"));
    expect(result.current.cardClass(11)).toBe("h-full");
    expect(result.current.cardClass(12)).toBe("h-full max-sm:hidden");
    expect(result.current.cardClass(23)).toBe("h-full max-sm:hidden");
    expect(result.current.cardClass(24)).toBe("h-full hidden");
  });

  it("resets to one page when the signature changes", () => {
    const { result, rerender } = renderHook(
      ({ sig }) => usePaging(40, sig),
      { initialProps: { sig: "a" } }
    );
    act(() => result.current.showMore());
    expect(result.current.pages).toBe(2);
    rerender({ sig: "b" });
    expect(result.current.pages).toBe(1);
    rerender({ sig: "a" });
    expect(result.current.pages).toBe(1);
  });
});
