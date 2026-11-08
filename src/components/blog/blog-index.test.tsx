import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogIndex } from "./blog-index";
import type { BlogPostSummary } from "@/components/blog-list";

const params = { get: vi.fn((): string | null => null) };

vi.mock("next/navigation", () => ({
  useSearchParams: () => params,
}));

vi.mock("@/components/blog-list", () => ({
  BlogList: ({ posts }: { posts: BlogPostSummary[] }) => (
    <ul>
      {posts.map((p) => (
        <li key={p.slug}>{p.title}</li>
      ))}
    </ul>
  ),
}));
vi.mock("@/components/blog/CategoryFilter", () => ({ CategoryFilter: () => null }));
vi.mock("@/components/blog/start-here", () => ({ StartHere: () => null }));

const base = { date: "2026-02-01", author: "A", readingTime: "1 min read", description: "d" };
const posts: BlogPostSummary[] = [
  { ...base, slug: "web", title: "Web Post", tags: ["Web Development"] },
  { ...base, slug: "sec", title: "Sec Post", tags: ["Security"] },
];

describe("BlogIndex category aliases", () => {
  beforeEach(() => params.get.mockReturnValue(null));

  it("shows everything with no category", () => {
    render(<BlogIndex posts={posts} startHere={[]} categories={["All"]} />);
    expect(screen.getByText("Sec Post")).toBeInTheDocument();
  });

  it("maps an old tag category to its topic", () => {
    params.get.mockReturnValue("Next.js");
    render(<BlogIndex posts={posts} startHere={[]} categories={["All"]} />);
    expect(screen.getByText("Web Post")).toBeInTheDocument();
    expect(screen.queryByText("Sec Post")).not.toBeInTheDocument();
  });

  it("matches nothing for a dropped tag", () => {
    params.get.mockReturnValue("Tutorial");
    render(<BlogIndex posts={posts} startHere={[]} categories={["All"]} />);
    expect(screen.queryByText("Web Post")).not.toBeInTheDocument();
    expect(screen.queryByText("Sec Post")).not.toBeInTheDocument();
  });
});
