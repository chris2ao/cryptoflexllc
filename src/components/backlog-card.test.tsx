import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BacklogCard } from "./backlog-card";

const mockPost = {
  slug: "test-draft",
  title: "My Draft Post",
  date: "2026-02-15",
  author: "CJ",
  readingTime: "5 min read",
  description: "This is a draft post description for testing.",
  tags: ["Claude Code", "Testing"],
};

describe("BacklogCard", () => {
  it("renders the post title", () => {
    render(<BacklogCard post={mockPost} />);
    expect(screen.getByText("My Draft Post")).toBeInTheDocument();
  });

  it("renders the post description", () => {
    render(<BacklogCard post={mockPost} />);
    expect(
      screen.getByText("This is a draft post description for testing.")
    ).toBeInTheDocument();
  });

  it("renders tag badges", () => {
    render(<BacklogCard post={mockPost} />);
    expect(screen.getByText("Claude Code")).toBeInTheDocument();
    expect(screen.getByText("Testing")).toBeInTheDocument();
  });

  it("renders a Draft badge", () => {
    render(<BacklogCard post={mockPost} />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("renders author and reading time", () => {
    render(<BacklogCard post={mockPost} />);
    expect(screen.getByText("CJ")).toBeInTheDocument();
    expect(screen.getByText("5 min read")).toBeInTheDocument();
  });

  it("renders formatted date", () => {
    render(<BacklogCard post={mockPost} />);
    expect(screen.getByText("February 15, 2026")).toBeInTheDocument();
  });

  it("links to /backlog/[slug]", () => {
    render(<BacklogCard post={mockPost} />);
    const link = screen.getByRole("link", { name: "My Draft Post" });
    expect(link).toHaveAttribute("href", "/backlog/test-draft");
  });

  it("renders with dashed border style", () => {
    const { container } = render(<BacklogCard post={mockPost} />);
    const card = container.firstElementChild;
    expect(card?.className).toContain("border-dashed");
  });
});
