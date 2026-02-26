import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogCard } from "./blog-card";
import type { BlogPost } from "@/lib/blog";

type BlogCardPost = Omit<BlogPost, "content"> & { content?: string };

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="card">{children}</div>
  ),
  CardHeader: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="card-header">{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
}));

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, variant }: { children: React.ReactNode; variant?: string }) => (
    <span data-variant={variant} className="badge">{children}</span>
  ),
}));

describe("BlogCard", () => {
  const mockPost: BlogCardPost = {
    slug: "test-post",
    title: "Test Post Title",
    description: "This is a test post description",
    tags: ["typescript", "react", "testing"],
    date: "2026-02-10",
    author: "Test Author",
    readingTime: "5 min read",
  };

  it("renders post title", () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText("Test Post Title")).toBeInTheDocument();
  });

  it("renders post description", () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText("This is a test post description")).toBeInTheDocument();
  });

  it("renders all tags", () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText("typescript")).toBeInTheDocument();
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("testing")).toBeInTheDocument();
  });

  it("renders formatted date", () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText("February 9, 2026")).toBeInTheDocument();
  });

  it("renders author when provided", () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText("Test Author")).toBeInTheDocument();
  });

  it("renders reading time when provided", () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText("5 min read")).toBeInTheDocument();
  });

  it("links to blog post detail page", () => {
    render(<BlogCard post={mockPost} />);
    const titleLink = screen.getByText("Test Post Title").closest("a");
    expect(titleLink).toHaveAttribute("href", "/blog/test-post");
  });

  it("links tags to filtered blog page", () => {
    render(<BlogCard post={mockPost} />);
    const typescriptLink = screen.getByText("typescript").closest("a");
    expect(typescriptLink).toHaveAttribute("href", "/blog?tag=typescript");
  });

  it("encodes special characters in tag URLs", () => {
    const postWithSpecialTag: BlogCardPost = {
      ...mockPost,
      tags: ["C++", "tag with spaces"],
    };
    render(<BlogCard post={postWithSpecialTag} />);

    const cppLink = screen.getByText("C++").closest("a");
    expect(cppLink).toHaveAttribute("href", "/blog?tag=C%2B%2B");

    const spacesLink = screen.getByText("tag with spaces").closest("a");
    expect(spacesLink).toHaveAttribute("href", "/blog?tag=tag%20with%20spaces");
  });

  it("handles post without author", () => {
    const postWithoutAuthor = {
      ...mockPost,
      author: undefined,
    } as unknown as BlogCardPost;
    render(<BlogCard post={postWithoutAuthor} />);

    // Should still render date and reading time
    expect(screen.getByText("February 9, 2026")).toBeInTheDocument();
    expect(screen.getByText("5 min read")).toBeInTheDocument();
  });

  it("handles post without reading time", () => {
    const postWithoutReadingTime = {
      ...mockPost,
      readingTime: undefined,
    } as unknown as BlogCardPost;
    render(<BlogCard post={postWithoutReadingTime} />);

    // Should still render author and date
    expect(screen.getByText("Test Author")).toBeInTheDocument();
    expect(screen.getByText("February 9, 2026")).toBeInTheDocument();
  });

  it("handles post without author or reading time", () => {
    const minimalPost = {
      ...mockPost,
      author: undefined,
      readingTime: undefined,
    } as unknown as BlogCardPost;
    render(<BlogCard post={minimalPost} />);

    // Should still render date
    expect(screen.getByText("February 9, 2026")).toBeInTheDocument();
  });

  it("renders middot separators between metadata items", () => {
    render(<BlogCard post={mockPost} />);

    const cardContent = screen.getByTestId("card-content");
    expect(cardContent.textContent).toContain("·");
  });

  it("handles empty tags array", () => {
    const postWithoutTags: BlogCardPost = {
      ...mockPost,
      tags: [],
    };
    render(<BlogCard post={postWithoutTags} />);

    expect(screen.getByText("Test Post Title")).toBeInTheDocument();
    expect(screen.queryByText("typescript")).not.toBeInTheDocument();
  });

  it("formats different date styles correctly", () => {
    const dates = [
      { input: "2026-01-01", expected: "December 31, 2025" },
      { input: "2026-12-31", expected: "December 30, 2026" },
      { input: "2026-06-15", expected: "June 14, 2026" },
    ];

    dates.forEach(({ input, expected }) => {
      const { unmount } = render(
        <BlogCard post={{ ...mockPost, date: input }} />
      );
      expect(screen.getByText(expected)).toBeInTheDocument();
      unmount();
    });
  });

  it("truncates long descriptions with line-clamp-3", () => {
    const longDescription = "A".repeat(500);
    const postWithLongDesc: BlogCardPost = {
      ...mockPost,
      description: longDescription,
    };

    render(<BlogCard post={postWithLongDesc} />);

    const description = screen.getByText(longDescription);
    expect(description).toHaveClass("line-clamp-3");
  });

  it("applies hover styles to card", () => {
    render(<BlogCard post={mockPost} />);

    const card = screen.getByTestId("card");
    expect(card).toHaveClass("group");
    expect(card).toHaveClass("hover:border-primary/50");
  });

  it("applies hover styles to title", () => {
    render(<BlogCard post={mockPost} />);

    const titleContainer = screen.getByText("Test Post Title").parentElement;
    expect(titleContainer).toHaveClass("group-hover:text-primary");
  });

  it("renders tags with secondary variant", () => {
    render(<BlogCard post={mockPost} />);

    const typescriptBadge = screen.getByText("typescript");
    expect(typescriptBadge).toHaveAttribute("data-variant", "secondary");
  });

  it("handles very long post titles", () => {
    const longTitle = "A".repeat(200);
    const postWithLongTitle: BlogCardPost = {
      ...mockPost,
      title: longTitle,
    };

    render(<BlogCard post={postWithLongTitle} />);
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it("handles special characters in title", () => {
    const specialTitle = "Test & <Script> \"Quotes\" 'Single'";
    const postWithSpecialTitle: BlogCardPost = {
      ...mockPost,
      title: specialTitle,
    };

    render(<BlogCard post={postWithSpecialTitle} />);
    expect(screen.getByText(specialTitle)).toBeInTheDocument();
  });

  it("handles special characters in description", () => {
    const specialDesc = "Description with <HTML> & \"special\" chars";
    const postWithSpecialDesc: BlogCardPost = {
      ...mockPost,
      description: specialDesc,
    };

    render(<BlogCard post={postWithSpecialDesc} />);
    expect(screen.getByText(specialDesc)).toBeInTheDocument();
  });

  it("handles posts with only one tag", () => {
    const postWithOneTag: BlogCardPost = {
      ...mockPost,
      tags: ["solo-tag"],
    };

    render(<BlogCard post={postWithOneTag} />);
    expect(screen.getByText("solo-tag")).toBeInTheDocument();
  });

  it("handles posts with many tags", () => {
    const manyTags = Array.from({ length: 10 }, (_, i) => `tag-${i}`);
    const postWithManyTags: BlogCardPost = {
      ...mockPost,
      tags: manyTags,
    };

    render(<BlogCard post={postWithManyTags} />);

    manyTags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });
});
