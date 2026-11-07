import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BlogList, type BlogPostSummary } from "./blog-list";

const mockPosts: BlogPostSummary[] = [
  {
    slug: "post-1",
    title: "First Post",
    description: "This is the first post",
    tags: ["typescript", "react"],
    date: "2026-02-01",
    author: "Test Author",
    readingTime: "5 min read",
  },
  {
    slug: "post-2",
    title: "Second Post",
    description: "This is the second post",
    tags: ["typescript", "nextjs"],
    date: "2026-02-02",
    author: "Test Author",
    readingTime: "3 min read",
  },
  {
    slug: "post-3",
    title: "Third Post",
    description: "All about testing",
    tags: ["testing", "vitest"],
    date: "2026-02-03",
    author: "Test Author",
    readingTime: "10 min read",
  },
];

const mockRouter = {
  push: vi.fn(),
};

const mockSearchParams = {
  getAll: vi.fn((): string[] => []),
  toString: vi.fn(() => ""),
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => mockSearchParams,
}));

vi.mock("@/components/blog-card", () => ({
  BlogCard: ({ post }: { post: BlogPostSummary }) => (
    <div data-testid={`blog-card-${post.slug}`}>
      <h3>{post.title}</h3>
      <p>{post.description}</p>
    </div>
  ),
}));

vi.mock("@/components/ui/badge", () => ({
  Badge: ({
    children,
    variant,
  }: {
    children: React.ReactNode;
    variant?: string;
  }) => (
    <span data-variant={variant} className="badge">
      {children}
    </span>
  ),
}));

describe("BlogList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.getAll.mockReturnValue([]);
    mockSearchParams.toString.mockReturnValue("");
  });

  it("renders all posts when no filters are active", () => {
    render(<BlogList posts={mockPosts} />);

    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.getByText("Second Post")).toBeInTheDocument();
    expect(screen.getByText("Third Post")).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(<BlogList posts={mockPosts} />);

    expect(screen.getByPlaceholderText("Search posts...")).toBeInTheDocument();
  });

  it("filters posts by search text", async () => {
    render(<BlogList posts={mockPosts} />);

    const searchInput = screen.getByPlaceholderText("Search posts...");
    fireEvent.change(searchInput, { target: { value: "testing" } });

    await waitFor(() => {
      expect(screen.getByText("Third Post")).toBeInTheDocument();
      expect(screen.queryByText("First Post")).not.toBeInTheDocument();
      expect(screen.queryByText("Second Post")).not.toBeInTheDocument();
    });
  });

  it("filters posts case-insensitively", async () => {
    render(<BlogList posts={mockPosts} />);

    const searchInput = screen.getByPlaceholderText("Search posts...");
    fireEvent.change(searchInput, { target: { value: "TESTING" } });

    await waitFor(() => {
      expect(screen.getByText("Third Post")).toBeInTheDocument();
      expect(screen.queryByText("First Post")).not.toBeInTheDocument();
    });
  });

  it("searches across title, description, and tags", async () => {
    render(<BlogList posts={mockPosts} />);

    const searchInput = screen.getByPlaceholderText("Search posts...");

    // Search by title
    fireEvent.change(searchInput, { target: { value: "First" } });
    await waitFor(() => {
      expect(screen.getByText("First Post")).toBeInTheDocument();
      expect(screen.queryByText("Second Post")).not.toBeInTheDocument();
    });

    // Search by description
    fireEvent.change(searchInput, { target: { value: "second post" } });
    await waitFor(() => {
      expect(screen.getByText("Second Post")).toBeInTheDocument();
      expect(screen.queryByText("First Post")).not.toBeInTheDocument();
    });

    // Search by tag
    fireEvent.change(searchInput, { target: { value: "vitest" } });
    await waitFor(() => {
      expect(screen.getByText("Third Post")).toBeInTheDocument();
      expect(screen.queryByText("First Post")).not.toBeInTheDocument();
    });
  });

  it("filters posts by selected URL tags using AND logic", () => {
    mockSearchParams.getAll.mockReturnValue(["typescript", "react"]);

    render(<BlogList posts={mockPosts} />);

    // Only post-1 has both typescript AND react tags
    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.queryByText("Second Post")).not.toBeInTheDocument();
    expect(screen.queryByText("Third Post")).not.toBeInTheDocument();
  });

  it("shows result count when filters are active", async () => {
    render(<BlogList posts={mockPosts} />);

    const searchInput = screen.getByPlaceholderText("Search posts...");
    fireEvent.change(searchInput, { target: { value: "testing" } });

    await waitFor(() => {
      expect(screen.getByText(/Showing 1 of 3 posts/i)).toBeInTheDocument();
    });
  });

  it("shows clear filters button when filters are active", async () => {
    render(<BlogList posts={mockPosts} />);

    const searchInput = screen.getByPlaceholderText("Search posts...");
    fireEvent.change(searchInput, { target: { value: "testing" } });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /clear filters/i })
      ).toBeInTheDocument();
    });
  });

  it("hides result count and clear button when no filters are active", () => {
    render(<BlogList posts={mockPosts} />);

    expect(screen.queryByText(/Showing/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /clear filters/i })
    ).not.toBeInTheDocument();
  });

  it("clears all filters when clear button is clicked", async () => {
    mockSearchParams.getAll.mockReturnValue(["typescript"]);
    mockSearchParams.toString.mockReturnValue("tag=typescript");

    render(<BlogList posts={mockPosts} />);

    const searchInput = screen.getByPlaceholderText("Search posts...");
    fireEvent.change(searchInput, { target: { value: "test" } });

    await screen.findByRole("button", { name: /clear filters/i });

    const clearButton = screen.getByRole("button", { name: /clear filters/i });
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect((searchInput as HTMLInputElement).value).toBe("");
      expect(mockRouter.push).toHaveBeenCalledWith("/blog", { scroll: false });
    });
  });

  it("shows empty state when no posts match filters", async () => {
    render(<BlogList posts={mockPosts} />);

    const searchInput = screen.getByPlaceholderText("Search posts...");
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });

    await waitFor(() => {
      expect(
        screen.getByText("No posts match your filters.")
      ).toBeInTheDocument();
    });
  });

  it("shows empty state when no posts are provided", () => {
    render(<BlogList posts={[]} />);

    expect(screen.getByText("No posts match your filters.")).toBeInTheDocument();
  });

  it("combines URL tag filter and text search", () => {
    mockSearchParams.getAll.mockReturnValue(["typescript"]);

    render(<BlogList posts={mockPosts} />);

    const searchInput = screen.getByPlaceholderText("Search posts...");
    fireEvent.change(searchInput, { target: { value: "first" } });

    // Should match posts with typescript tag AND "first" in text
    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.queryByText("Second Post")).not.toBeInTheDocument();
  });

  it("trims whitespace from search input", async () => {
    render(<BlogList posts={mockPosts} />);

    const searchInput = screen.getByPlaceholderText("Search posts...");
    fireEvent.change(searchInput, { target: { value: "   testing   " } });

    await waitFor(() => {
      expect(screen.getByText("Third Post")).toBeInTheDocument();
      expect(screen.queryByText("First Post")).not.toBeInTheDocument();
    });
  });

  it("treats empty whitespace search as no filter", () => {
    render(<BlogList posts={mockPosts} />);

    const searchInput = screen.getByPlaceholderText("Search posts...");
    fireEvent.change(searchInput, { target: { value: "   " } });

    // Should show all posts
    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.getByText("Second Post")).toBeInTheDocument();
    expect(screen.getByText("Third Post")).toBeInTheDocument();

    // Should not show filter UI
    expect(screen.queryByText(/Showing/i)).not.toBeInTheDocument();
  });

  it("renders posts in a grid layout", () => {
    render(<BlogList posts={mockPosts} />);

    // Check that BlogCard components are rendered
    expect(screen.getByTestId("blog-card-post-1")).toBeInTheDocument();
    expect(screen.getByTestId("blog-card-post-2")).toBeInTheDocument();
    expect(screen.getByTestId("blog-card-post-3")).toBeInTheDocument();
  });

  it("handles posts with missing optional fields", () => {
    const minimalPosts: BlogPostSummary[] = [
      {
        slug: "minimal",
        title: "Minimal Post",
        description: "Description",
        tags: [],
        date: "2026-02-01",
        author: "",
        readingTime: "",
      },
    ];

    render(<BlogList posts={minimalPosts} />);

    expect(screen.getByText("Minimal Post")).toBeInTheDocument();
  });

  describe("paging", () => {
    const makePosts = (n: number): BlogPostSummary[] =>
      Array.from({ length: n }, (_, i) => ({
        slug: `bulk-${i + 1}`,
        title: `Bulk ${i + 1}`,
        description: `Description ${i + 1}`,
        tags: i % 2 === 0 ? ["even"] : ["odd"],
        date: "2026-02-01",
        author: "Test Author",
        readingTime: "1 min read",
      }));
    const manyPosts = makePosts(60);

    const cls = (slug: string) =>
      (screen.getByTestId(`blog-card-${slug}`).parentElement as HTMLElement).className;
    const showMore = () => screen.getByRole("button", { name: /show more posts/i });

    it("keeps every card in the DOM and hides cards beyond each width's page", () => {
      render(<BlogList posts={manyPosts} />);
      expect(screen.getAllByTestId(/^blog-card-/)).toHaveLength(60);
      expect(cls("bulk-12")).not.toMatch(/hidden/);
      expect(cls("bulk-13")).toContain("max-sm:hidden");
      expect(cls("bulk-24")).toContain("max-sm:hidden");
      expect(cls("bulk-25")).not.toContain("max-sm:hidden");
      expect(cls("bulk-25").split(" ")).toContain("hidden");
    });

    it("labels the button with a count for each width", () => {
      render(<BlogList posts={manyPosts} />);
      const button = showMore();
      expect(button).toHaveTextContent("(12 of 60 shown)");
      expect(button).toHaveTextContent("(24 of 60 shown)");
      expect(button.querySelector("span.sm\\:hidden")).toHaveTextContent("(12 of 60 shown)");
      expect(button.querySelector("span.hidden")).toHaveTextContent("(24 of 60 shown)");
    });

    it("reveals one more page per click at both widths", () => {
      render(<BlogList posts={manyPosts} />);
      fireEvent.click(showMore());
      expect(cls("bulk-24")).not.toMatch(/hidden/);
      expect(cls("bulk-25")).toContain("max-sm:hidden");
      expect(cls("bulk-48")).toContain("max-sm:hidden");
      expect(cls("bulk-49").split(" ")).toContain("hidden");
      expect(showMore()).toHaveTextContent("(24 of 60 shown)");
      expect(showMore()).toHaveTextContent("(48 of 60 shown)");
    });

    it("shows the button only on mobile when only mobile has more", () => {
      render(<BlogList posts={makePosts(20)} />);
      expect(showMore().parentElement?.className).toContain("sm:hidden");
      expect(showMore()).toHaveTextContent("(12 of 20 shown)");
      expect(cls("bulk-20")).toContain("max-sm:hidden");
      expect(cls("bulk-20").split(" ")).not.toContain("hidden");
    });

    it("shows the button at every width while desktop has more", () => {
      render(<BlogList posts={manyPosts} />);
      expect(showMore().parentElement?.className).not.toContain("sm:hidden");
    });

    it("removes the button once nothing remains at either width", () => {
      render(<BlogList posts={makePosts(24)} />);
      fireEvent.click(showMore());
      expect(cls("bulk-24")).not.toMatch(/hidden/);
      expect(screen.queryByRole("button", { name: /show more posts/i })).toBeNull();
    });

    it("omits the button when 12 or fewer posts exist", () => {
      render(<BlogList posts={mockPosts} />);
      expect(screen.queryByRole("button", { name: /show more posts/i })).toBeNull();
    });

    it("resets paging when the filter changes", () => {
      render(<BlogList posts={manyPosts} />);
      fireEvent.click(showMore());
      expect(cls("bulk-13")).not.toMatch(/hidden/);

      fireEvent.change(screen.getByPlaceholderText("Search posts..."), {
        target: { value: "Bulk 1" },
      });
      const matches = screen.getAllByTestId(/^blog-card-/).length;
      expect(matches).toBeGreaterThan(12);
      expect(showMore()).toHaveTextContent(`(12 of ${matches} shown)`);
    });

    it("does not restore an old page count when returning to a previous filter", () => {
      render(<BlogList posts={manyPosts} />);
      fireEvent.click(showMore());
      expect(cls("bulk-24")).not.toMatch(/hidden/);

      const input = screen.getByPlaceholderText("Search posts...");
      fireEvent.change(input, { target: { value: "Bulk 1" } });
      fireEvent.change(input, { target: { value: "" } });

      expect(cls("bulk-13")).toContain("max-sm:hidden");
      expect(showMore()).toHaveTextContent("(12 of 60 shown)");
    });
  });
});
