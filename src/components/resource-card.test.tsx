import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResourceCard } from "./resource-card";
import type { Resource } from "@/lib/resources";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  CardContent: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
}));

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

const mockResource: Resource = {
  slug: "test-resource",
  title: "Test Resource Title",
  description: "A test resource description.",
  type: "carousel",
  tags: ["React", "Testing"],
  date: "2026-02-14",
};

describe("ResourceCard", () => {
  it("renders the resource title", () => {
    render(<ResourceCard resource={mockResource} />);
    expect(screen.getByText("Test Resource Title")).toBeInTheDocument();
  });

  it("renders the resource description", () => {
    render(<ResourceCard resource={mockResource} />);
    expect(
      screen.getByText("A test resource description.")
    ).toBeInTheDocument();
  });

  it("renders all tags", () => {
    render(<ResourceCard resource={mockResource} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Testing")).toBeInTheDocument();
  });

  it("links to the correct resource page", () => {
    render(<ResourceCard resource={mockResource} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/resources/test-resource");
  });

  it("renders the type badge", () => {
    render(<ResourceCard resource={mockResource} />);
    expect(screen.getByText("carousel")).toBeInTheDocument();
  });

  it("renders the date", () => {
    render(<ResourceCard resource={mockResource} />);
    expect(screen.getByText("2026-02-14")).toBeInTheDocument();
  });
});
