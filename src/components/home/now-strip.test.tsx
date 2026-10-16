import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NowStrip, NOW_BUILDING } from "./now-strip";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

const inProgress = {
  name: "Custom SIEM",
  href: "/blog/series/Custom%20SIEM",
  part: 12,
  title: "Part 12",
  slug: "siem-12",
};

describe("NowStrip", () => {
  it("hides the building cell when explicitly null", () => {
    render(<NowStrip inProgress={inProgress} nowBuilding={null} />);
    expect(screen.queryByText("Now building")).not.toBeInTheDocument();
  });

  it("falls back to the NOW_BUILDING constant", () => {
    const implicit = render(<NowStrip inProgress={null} />).container.innerHTML;
    const explicit = render(<NowStrip inProgress={null} nowBuilding={NOW_BUILDING} />).container
      .innerHTML;
    expect(implicit).toBe(explicit);
  });

  it("points the shipped NOW_BUILDING link at a real series route", () => {
    expect(NOW_BUILDING?.href).toBe("/blog/series/OpenClaw%20Deployment");
  });

  it("shows the building cell with link and as-of date", () => {
    render(
      <NowStrip
        inProgress={null}
        nowBuilding={{ text: "Letta agent", href: "/blog/letta", asOf: "2026-10-16" }}
      />
    );
    expect(screen.getByText("Now building")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Letta agent" })).toHaveAttribute(
      "href",
      "/blog/letta"
    );
    expect(screen.getByText(/as of Oct 16, 2026/i)).toBeInTheDocument();
  });

  it("renders building text without a link when no href", () => {
    render(
      <NowStrip inProgress={null} nowBuilding={{ text: "Plain text", asOf: "2026-10-16" }} />
    );
    expect(screen.getByText("Plain text")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Plain text" })).not.toBeInTheDocument();
  });

  it("opens external building links in a new tab", () => {
    render(
      <NowStrip
        inProgress={null}
        nowBuilding={{ text: "Repo", href: "https://example.com/x", asOf: "2026-10-16" }}
      />
    );
    const link = screen.getByRole("link", { name: "Repo" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("links the in-progress series with part number", () => {
    render(<NowStrip inProgress={inProgress} />);
    const link = screen.getByRole("link", { name: "Custom SIEM · Part 12" });
    expect(link).toHaveAttribute("href", "/blog/series/Custom%20SIEM");
  });

  it("shows just the name when there is no part", () => {
    render(<NowStrip inProgress={{ ...inProgress, part: undefined }} />);
    expect(screen.getByRole("link", { name: "Custom SIEM" })).toBeInTheDocument();
  });

  it("hides the in-progress cell when null", () => {
    render(<NowStrip inProgress={null} />);
    expect(screen.queryByText("In progress")).not.toBeInTheDocument();
  });

  it("points Subscribe at the subscribe anchor", () => {
    render(<NowStrip inProgress={null} />);
    expect(screen.getByText("Every Monday")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Subscribe" })).toHaveAttribute(
      "href",
      "#subscribe"
    );
  });

  it("is a labeled region with no em dash", () => {
    const { container } = render(
      <NowStrip
        inProgress={inProgress}
        nowBuilding={{ text: "X", href: "/x", asOf: "2026-10-16" }}
      />
    );
    expect(screen.getByRole("region", { name: "Now" })).toBeInTheDocument();
    expect(container.textContent).not.toContain("\u2014");
  });
});
