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

describe("Nav", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all 8 navigation links", () => {
    render(<Nav />);
    expect(screen.getAllByText("Blog").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Skills").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Services").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("About").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Portfolio").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Resources").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Guestbook").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Contact").length).toBeGreaterThanOrEqual(1);
  });

  it("renders logo image", () => {
    render(<Nav />);
    const logos = screen.getAllByAltText("CryptoFlex LLC");
    expect(logos.length).toBeGreaterThanOrEqual(1);
    expect(logos[0]).toHaveAttribute("src", "/CFLogo.png");
  });

  it("highlights active link with text-primary class", async () => {
    const { usePathname } = await import("next/navigation");
    vi.mocked(usePathname).mockReturnValue("/blog");

    render(<Nav />);

    const blogLinks = screen.getAllByText("Blog");
    const hasActiveClass = blogLinks.some((link: HTMLElement) =>
      link.className.includes("text-primary")
    );
    expect(hasActiveClass).toBe(true);
  });

  it("does not highlight inactive links with text-primary", async () => {
    const { usePathname } = await import("next/navigation");
    vi.mocked(usePathname).mockReturnValue("/blog");

    render(<Nav />);

    const aboutLinks = screen.getAllByText("About");
    const hasActiveClass = aboutLinks.some((link: HTMLElement) =>
      link.className.includes("text-primary")
    );
    expect(hasActiveClass).toBe(false);
  });

  it("renders mobile menu components", () => {
    render(<Nav />);
    expect(screen.getByTestId("sheet")).toBeInTheDocument();
    expect(screen.getByTestId("sheet-trigger")).toBeInTheDocument();
  });
});
