import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReadingPaths } from "./reading-paths";
import type { SeriesSummary } from "@/lib/home-content";

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

const series: SeriesSummary[] = [
  {
    name: "Custom SIEM",
    href: "/blog/series/Custom%20SIEM",
    postCount: 4,
    latest: { title: "Part Four: Detections", slug: "siem-4", date: "2026-10-01", part: 4 },
  },
  {
    name: "Security Engineering",
    href: "/blog/series/Security%20Engineering",
    postCount: 9,
    latest: { title: "Security Review: Round Two", slug: "sec-9", date: "2026-08-12", part: 9 },
  },
];

describe("ReadingPaths", () => {
  it("renders nothing when there are no series", () => {
    const { container } = render(<ReadingPaths index={2} series={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the section label with the padded index", () => {
    render(<ReadingPaths index={2} series={series} />);
    expect(screen.getByText("§ 02 / Reading Paths")).toBeInTheDocument();
  });

  it("renders the section head", () => {
    render(<ReadingPaths index={2} series={series} />);
    expect(screen.getByRole("heading", { level: 2, name: "Pick a thread." })).toBeInTheDocument();
  });

  it("links each card to the encoded series href", () => {
    render(<ReadingPaths index={2} series={series} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/blog/series/Custom%20SIEM");
    expect(links[1]).toHaveAttribute("href", "/blog/series/Security%20Engineering");
  });

  it("shows the part count and updated date", () => {
    render(<ReadingPaths index={2} series={series} />);
    expect(screen.getByText("4 parts · Updated Oct 1, 2026")).toBeInTheDocument();
    expect(screen.getByText("9 parts · Updated Aug 12, 2026")).toBeInTheDocument();
  });

  it("shows the latest post title", () => {
    render(<ReadingPaths index={2} series={series} />);
    expect(screen.getByText("Latest: Part Four: Detections")).toBeInTheDocument();
  });

  it("gives each link an accessible name containing the series name", () => {
    render(<ReadingPaths index={2} series={series} />);
    expect(screen.getByRole("link", { name: /Custom SIEM/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Security Engineering/ })).toBeInTheDocument();
  });

  it("uses no em dashes", () => {
    const { container } = render(<ReadingPaths index={2} series={series} />);
    expect(container.textContent).not.toContain("\u2014");
  });
});
