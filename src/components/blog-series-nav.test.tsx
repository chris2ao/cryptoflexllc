import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogSeriesNav } from "./blog-series-nav";
import type { BlogPost } from "@/lib/blog";

function makePost(n: number): BlogPost {
  return {
    slug: `part-${n}`,
    title: `Part Title ${n}`,
    date: "2026-01-01",
    author: "CJ",
    readingTime: "5 min read",
    description: "d",
    tags: [],
    content: "",
  };
}

const posts = [makePost(1), makePost(2), makePost(3)];

describe("BlogSeriesNav", () => {
  it("renders null for fewer than 2 posts", () => {
    const { container } = render(
      <BlogSeriesNav seriesName="S" posts={[posts[0]]} currentSlug="part-1" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the part position and series link", () => {
    render(<BlogSeriesNav seriesName="My Series" posts={posts} currentSlug="part-2" />);
    expect(screen.getByText("Part 2 of 3")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Series: My Series" })
    ).toHaveAttribute("href", "/blog/series/My%20Series");
  });

  it("links previous and next with titles in aria-labels", () => {
    render(<BlogSeriesNav seriesName="S" posts={posts} currentSlug="part-2" />);
    expect(
      screen.getByRole("link", { name: "Previous: Part Title 1" })
    ).toHaveAttribute("href", "/blog/part-1");
    expect(
      screen.getByRole("link", { name: "Next: Part Title 3" })
    ).toHaveAttribute("href", "/blog/part-3");
  });

  it("omits previous on the first part", () => {
    render(<BlogSeriesNav seriesName="S" posts={posts} currentSlug="part-1" />);
    expect(screen.queryByRole("link", { name: /^Previous:/ })).toBeNull();
    expect(screen.getByRole("link", { name: /^Next:/ })).toBeInTheDocument();
  });

  it("omits next on the last part", () => {
    render(<BlogSeriesNav seriesName="S" posts={posts} currentSlug="part-3" />);
    expect(screen.queryByRole("link", { name: /^Next:/ })).toBeNull();
    expect(screen.getByRole("link", { name: /^Previous:/ })).toBeInTheDocument();
  });

  it("has a closed details element listing every part", () => {
    const { container } = render(
      <BlogSeriesNav seriesName="S" posts={posts} currentSlug="part-2" />
    );
    const details = container.querySelector("details");
    expect(details).not.toBeNull();
    expect(details).not.toHaveAttribute("open");
    expect(screen.getByText("Show all parts")).toBeInTheDocument();
    for (const p of posts) {
      expect(details).toHaveTextContent(p.title);
    }
  });

  it("marks the current part with aria-current", () => {
    const { container } = render(
      <BlogSeriesNav seriesName="S" posts={posts} currentSlug="part-2" />
    );
    const current = container.querySelectorAll('[aria-current="true"]');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent("Part Title 2");
  });
});
