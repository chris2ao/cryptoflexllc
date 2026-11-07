import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NowStrip } from "./now-strip";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

const building = {
  text: "Custom SIEM · Part 12",
  href: "/blog/series/Custom%20SIEM",
  asOf: "2026-10-16",
};

describe("NowStrip", () => {
  it("renders the derived cell with link and as-of date", () => {
    render(<NowStrip nowBuilding={building} />);
    expect(screen.getByText("Now building")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Custom SIEM · Part 12" })).toHaveAttribute(
      "href",
      "/blog/series/Custom%20SIEM"
    );
    expect(screen.getByText(/as of Oct 16, 2026/i)).toBeInTheDocument();
  });

  it("hides the cell when null", () => {
    render(<NowStrip nowBuilding={null} />);
    expect(screen.queryByText("Now building")).not.toBeInTheDocument();
  });

  it("no longer renders an In progress cell", () => {
    render(<NowStrip nowBuilding={building} />);
    expect(screen.queryByText("In progress")).not.toBeInTheDocument();
  });

  it("opens external links in a new tab", () => {
    render(<NowStrip nowBuilding={{ ...building, text: "Repo", href: "https://example.com/x" }} />);
    const link = screen.getByRole("link", { name: "Repo" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("points Subscribe at the subscribe anchor", () => {
    render(<NowStrip nowBuilding={null} />);
    expect(screen.getByText("Every Monday")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Subscribe" })).toHaveAttribute(
      "href",
      "#subscribe"
    );
  });

  it("is a labeled region with no em dash", () => {
    const { container } = render(<NowStrip nowBuilding={building} />);
    expect(screen.getByRole("region", { name: "Now" })).toBeInTheDocument();
    expect(container.textContent).not.toContain("—");
  });
});
