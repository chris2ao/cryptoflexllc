import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StartHere } from "./start-here";
import type { SeriesSummary } from "@/lib/home-content";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const series: SeriesSummary[] = [
  {
    name: "Custom SIEM",
    href: "/blog/series/Custom%20SIEM",
    postCount: 4,
    latest: { title: "Part four title", slug: "siem-4", date: "2026-10-01" },
  },
  {
    name: "Home Lab",
    href: "/blog/series/Home%20Lab",
    postCount: 3,
    latest: { title: "Newest lab post", slug: "lab-3", date: "2026-09-12" },
  },
];

describe("StartHere", () => {
  it("renders one card per series linking to the series page", () => {
    render(<StartHere series={series} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/blog/series/Custom%20SIEM");
    expect(links[1]).toHaveAttribute("href", "/blog/series/Home%20Lab");
  });

  it("shows the overline, a lede with the real count and each card's details", () => {
    render(<StartHere series={series} />);
    expect(screen.getByText("Start here")).toHaveClass("ed-overline");
    expect(
      screen.getByText("Two reading paths through the archive, newest first.")
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Custom SIEM" })).toBeInTheDocument();
    expect(screen.getByText(/4 parts · updated/i)).toBeInTheDocument();
    expect(screen.getByText("Part four title")).toBeInTheDocument();
    expect(screen.getAllByText(/Start the series/)).toHaveLength(2);
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(<StartHere series={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
