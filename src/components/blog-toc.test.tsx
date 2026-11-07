import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BlogToc } from "./blog-toc";

const headings = [
  { id: "one", text: "One", level: 2 },
  { id: "two", text: "Two", level: 2 },
  { id: "three", text: "Three", level: 3 },
];

describe("BlogToc", () => {
  beforeEach(() => {
    globalThis.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    } as unknown as typeof IntersectionObserver;
  });

  it("starts collapsed in the inline variant", () => {
    render(<BlogToc headings={headings} />);
    const toggle = screen.getByRole("button", { name: /table of contents/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "One" })).not.toBeInTheDocument();
  });

  it("expands on click and shows roomy link rows", () => {
    render(<BlogToc headings={headings} />);
    fireEvent.click(screen.getByRole("button", { name: /table of contents/i }));
    const link = screen.getByRole("link", { name: "One" });
    expect(link).toHaveClass("py-2");
  });

  it("always shows links in the sidebar variant", () => {
    render(<BlogToc headings={headings} variant="sidebar" />);
    expect(screen.getByRole("link", { name: "Two" })).toBeInTheDocument();
  });

  it("sidebar nav sticks below the single 88px header", () => {
    render(<BlogToc headings={headings} variant="sidebar" />);
    const nav = screen.getByRole("navigation", { name: "Table of contents" });
    expect(nav).toHaveClass("top-[100px]");
  });
});
