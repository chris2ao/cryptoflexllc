import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { OPEN_COMMAND_PALETTE_EVENT } from "@/components/search/open-command-palette";
import { Nav } from "./nav";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
}));

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: any) => <div data-testid="sheet">{children}</div>,
  SheetContent: ({ children, onCloseAutoFocus }: any) => (
    <div data-testid="sheet-content">
      <button
        type="button"
        data-testid="sheet-close-autofocus"
        onClick={() => onCloseAutoFocus?.(new Event("focus", { cancelable: true }))}
      />
      {children}
    </div>
  ),
  SheetTrigger: ({ children }: any) => (
    <div data-testid="sheet-trigger">{children}</div>
  ),
  SheetTitle: ({ children }: any) => (
    <div data-testid="sheet-title">{children}</div>
  ),
}));

vi.mock("@/components/theme-toggle", () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Toggle</button>,
}));

describe("Nav", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders primary navigation links", () => {
    render(<Nav />);
    expect(screen.getAllByText("Blog").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Work").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("About").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Services").length).toBeGreaterThanOrEqual(1);
  });

  it("renders mobile menu links including extended nav", () => {
    render(<Nav />);
    expect(screen.getAllByText("Skills").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Resources").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Guestbook").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Contact").length).toBeGreaterThanOrEqual(1);
  });

  it("renders brand name", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: "CryptoFlex home" })).toBeInTheDocument();
    expect(screen.getAllByAltText("CryptoFlex").length).toBeGreaterThanOrEqual(1);
  });

  it("highlights active link with aria-current when on /blog", async () => {
    const { usePathname } = await import("next/navigation");
    vi.mocked(usePathname).mockReturnValue("/blog");

    render(<Nav />);

    const journalLinks = screen.getAllByText("Blog");
    const hasAriaCurrent = journalLinks.some((link: HTMLElement) => {
      const anchor = link.closest("a");
      return anchor?.getAttribute("aria-current") === "page";
    });
    expect(hasAriaCurrent).toBe(true);
  });

  it("does not mark inactive links as current", async () => {
    const { usePathname } = await import("next/navigation");
    vi.mocked(usePathname).mockReturnValue("/blog");

    render(<Nav />);

    const aboutLinks = screen.getAllByText("About");
    const hasAriaCurrent = aboutLinks.some((link: HTMLElement) => {
      const anchor = link.closest("a");
      return anchor?.getAttribute("aria-current") === "page";
    });
    expect(hasAriaCurrent).toBe(false);
  });

  it("renders mobile menu components", () => {
    render(<Nav />);
    expect(screen.getByTestId("sheet")).toBeInTheDocument();
    expect(screen.getByTestId("sheet-trigger")).toBeInTheDocument();
  });

  it("search button dispatches the open-palette event", () => {
    const handler = vi.fn();
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, handler);
    render(<Nav />);
    fireEvent.click(screen.getByRole("button", { name: "Search posts" }));
    expect(handler).toHaveBeenCalledTimes(1);
    window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, handler);
  });

  it("mobile menu Search entry opens the palette from onCloseAutoFocus, not a timer", () => {
    vi.useFakeTimers();
    const handler = vi.fn();
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, handler);
    render(<Nav />);
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(handler).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("sheet-close-autofocus"));
    expect(handler).toHaveBeenCalledTimes(1);
    // The flag is consumed: a later ordinary close does not reopen the palette
    fireEvent.click(screen.getByTestId("sheet-close-autofocus"));
    expect(handler).toHaveBeenCalledTimes(1);
    window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, handler);
  });

  it("an ordinary sheet close does not open the palette", () => {
    const handler = vi.fn();
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, handler);
    render(<Nav />);
    fireEvent.click(screen.getByTestId("sheet-close-autofocus"));
    expect(handler).not.toHaveBeenCalled();
    window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, handler);
  });

  it("does not pair display utilities with custom display classes", () => {
    render(<Nav />);
    expect(document.querySelector(".masthead-social")?.className).not.toMatch(/hidden|sm:/);
    expect(document.querySelector(".masthead-right > .btn-editorial")?.className).not.toMatch(/hidden|sm:/);
  });
});
