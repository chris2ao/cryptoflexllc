import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { JournalSection } from "./journal-section";
import type { BlogPost } from "@/lib/blog";

vi.mock("next/image", () => ({
  default: ({ fill, priority, ...props }: any) => (
    <img data-priority={priority ? "yes" : "no"} {...props} />
  ),
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

function makePost(overrides: Partial<BlogPost> = {}): BlogPost {
  return {
    slug: "post",
    title: "Post",
    date: "2026-10-01",
    author: "Chris",
    description: "Desc",
    tags: ["Security"],
    readingTime: "5 min read",
    content: "",
    ...overrides,
  } as BlogPost;
}

const lead = makePost({
  slug: "lead",
  title: "Lead Post",
  coverImage: "/blog/lead/cover.jpg",
  tags: ["AI", "Security"],
});

describe("JournalSection", () => {
  it("renders the numbered section label", () => {
    render(<JournalSection index={1} posts={[lead]} totalCount={10} />);
    expect(screen.getByText("§ 01 / The Blog")).toBeInTheDocument();
  });

  it("keeps the lead chip out of the image link and before the tags", () => {
    const { container } = render(
      <JournalSection index={1} posts={[lead]} totalCount={10} />
    );
    const chip = screen.getByText("Lead Story", { exact: false });
    expect(chip.closest(".ed-post-image")).toBeNull();
    expect(container.querySelector(".ed-post-tag-bar")).toBeNull();
    const tags = Array.from(chip.parentElement!.children).map((c) => c.textContent);
    expect(tags).toEqual(["● Lead Story", "AI", "Security"]);
    expect(chip.querySelector("[aria-hidden=\"true\"]")?.textContent).toBe("●");
  });

  it("shows the lead chip even when the post has no tags", () => {
    render(
      <JournalSection index={1} posts={[makePost({ tags: [] })]} totalCount={1} />
    );
    expect(screen.getByText("Lead Story", { exact: false })).toBeInTheDocument();
  });

  it("does not prioritize the lead cover", () => {
    render(<JournalSection index={1} posts={[lead]} totalCount={10} />);
    expect(screen.getByAltText("Lead Post")).toHaveAttribute("data-priority", "no");
  });

  it("uses series and part for row kickers", () => {
    const row = makePost({
      slug: "r1",
      title: "Row One",
      series: "Custom SIEM",
      seriesOrder: 4,
    });
    render(<JournalSection index={1} posts={[lead, row]} totalCount={2} />);
    expect(screen.getByText("Custom SIEM · Part 4")).toBeInTheDocument();
  });

  it("falls back to the first tag when a row has no series", () => {
    const row = makePost({ slug: "r2", title: "Row Two", tags: ["Homelab"] });
    render(<JournalSection index={1} posts={[lead, row]} totalCount={2} />);
    expect(screen.getByText("Homelab")).toBeInTheDocument();
  });

  it("links to the archive with the total count", () => {
    render(<JournalSection index={1} posts={[lead]} totalCount={42} />);
    expect(screen.getByText("All posts (42)")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Go to the full archive →" })
    ).toHaveAttribute("href", "/blog");
  });

  it("contains no em dash", () => {
    const { container } = render(
      <JournalSection index={1} posts={[lead]} totalCount={10} />
    );
    expect(container.textContent).not.toContain("\u2014");
  });
});
