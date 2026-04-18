import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
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
  SheetContent: ({ children }: any) => (
    <div data-testid="sheet-content">{children}</div>
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

  it("renders primary navigation links", () => {
    render(<Nav />);
    expect(screen.getAllByText("Journal").length).toBeGreaterThanOrEqual(1);
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
    expect(screen.getByRole("link", { name: "CryptoFlex — home" })).toBeInTheDocument();
    expect(screen.getAllByText("CryptoFlex").length).toBeGreaterThanOrEqual(1);
  });

  it("highlights active link with aria-current when on /blog", async () => {
    const { usePathname } = await import("next/navigation");
    vi.mocked(usePathname).mockReturnValue("/blog");

    render(<Nav />);

    const journalLinks = screen.getAllByText("Journal");
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
});
