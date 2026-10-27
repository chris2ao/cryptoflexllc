import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { SelectedWork } from "./selected-work";
import type { SeriesSummary } from "@/lib/home-content";

vi.mock("next/image", () => ({
  default: ({ fill: _fill, priority: _priority, ...props }: any) => <img {...props} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

function make(name: string, postCount: number): SeriesSummary {
  return {
    name,
    href: `/blog/series/${encodeURIComponent(name)}`,
    postCount,
    latest: { title: `${name} latest`, slug: "x", date: "2026-10-01" },
  };
}

const series: SeriesSummary[] = [
  make("Homelab Wazuh Deployment", 5),
  make("Custom SIEM", 2),
  make("Home Network Mission Control", 7),
  make("Unrelated", 3),
];

const TITLES = [
  "A home SOC, built from the logs up",
  "Security reviews of this site",
  "Ledgerly",
  "Cramdex",
  "Custom UniFi MCP",
  "My Claude Code setup",
];

describe("SelectedWork", () => {
  it("renders the six project titles in order", () => {
    render(<SelectedWork index={3} series={series} />);
    const headings = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(headings).toEqual(TITLES);
  });

  it("renders the section label with the padded index", () => {
    render(<SelectedWork index={3} series={series} />);
    expect(screen.getByText("§ 03 / Selected Work")).toBeInTheDocument();
  });

  it("derives the index label from the project count", () => {
    render(<SelectedWork index={3} series={series} />);
    expect(screen.getByText("01 / 06")).toBeInTheDocument();
    expect(screen.getByText("06 / 06")).toBeInTheDocument();
  });

  it("links the lede to the portfolio page", () => {
    render(<SelectedWork index={3} series={series} />);
    expect(screen.getByRole("link", { name: "portfolio page" })).toHaveAttribute("href", "/portfolio");
  });

  it("renders the featured card as a non-link container with series links", () => {
    render(<SelectedWork index={3} series={series} />);
    const featured = screen.getByRole("heading", { name: TITLES[0] }).closest(".ed-work-feat") as HTMLElement;
    expect(featured).not.toBeNull();
    expect(featured.tagName).not.toBe("A");
    const links = within(featured).getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual([
      "/blog/series/Homelab%20Wazuh%20Deployment",
      "/blog/series/Custom%20SIEM",
      "/blog/series/Home%20Network%20Mission%20Control",
    ]);
    expect(links[0]).toHaveTextContent("Homelab Wazuh Deployment · 5 parts");
    expect(links[1]).toHaveTextContent("Custom SIEM · 2 parts");
    expect(links[2]).toHaveTextContent("Home Network Mission Control · 7 parts");
  });

  it("skips a missing series without crashing", () => {
    render(<SelectedWork index={3} series={[make("Custom SIEM", 2)]} />);
    const featured = screen.getByRole("heading", { name: TITLES[0] }).closest(".ed-work-feat") as HTMLElement;
    expect(within(featured).getAllByRole("link")).toHaveLength(1);
  });

  it("renders with no series at all", () => {
    render(<SelectedWork index={3} series={[]} />);
    const featured = screen.getByRole("heading", { name: TITLES[0] }).closest(".ed-work-feat") as HTMLElement;
    expect(within(featured).queryAllByRole("link")).toHaveLength(0);
  });

  it("links media and compact cards to internal hrefs", () => {
    render(<SelectedWork index={3} series={series} />);
    const href = (title: string) =>
      screen.getByRole("heading", { name: title }).closest("a")?.getAttribute("href");
    expect(href("Security reviews of this site")).toBe("/blog/security-review-round-two");
    expect(href("Ledgerly")).toBe("/blog/series/Ledgerly");
    expect(href("Cramdex")).toBe("/blog/cramdex-open-source-sans-study-app");
    expect(href("Custom UniFi MCP")).toBe(
      "/blog/building-a-custom-unifi-mcp-103-tools-across-three-days"
    );
  });

  it("links the Claude Code setup card to the harness series in the same tab", () => {
    render(<SelectedWork index={3} series={series} />);
    const link = screen.getByRole("heading", { name: "My Claude Code setup" }).closest("a")!;
    expect(link).toHaveAttribute("href", "/blog/series/Claude%20Harness%20Modernization");
    expect(link).not.toHaveAttribute("target");
  });

  it("names each linked card by its title alone", () => {
    render(<SelectedWork index={3} series={series} />);
    for (const title of TITLES.slice(1)) {
      expect(screen.getByRole("link", { name: title })).toBeInTheDocument();
    }
  });

  it("renders images for the featured and media cards only", () => {
    const { container } = render(<SelectedWork index={3} series={series} />);
    expect(container.querySelectorAll("img")).toHaveLength(3);
  });

  it("uses no em dashes", () => {
    const { container } = render(<SelectedWork index={3} series={series} />);
    expect(container.textContent).not.toContain("\u2014");
    container.querySelectorAll("img").forEach((img) => {
      expect(img.getAttribute("alt")).not.toContain("\u2014");
    });
  });
});
