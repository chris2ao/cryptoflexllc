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
  getAll: vi.fn(() => []),
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
    render(<BlogList posts={mockPosts} allTags={["typescript", "react"]} />);

    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.getByText("Second Post")).toBeInTheDocument();
    expect(screen.getByText("Third Post")).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(<BlogList posts={mockPosts} allTags={["typescript"]} />);

    expect(screen.getByPlaceholderText("Search posts...")).toBeInTheDocument();
  });

  it("renders all tags as badges", () => {
    render(
      <BlogList
        posts={mockPosts}
        allTags={["typescript", "react", "testing"]}
      />
    );

    expect(screen.getByText("typescript")).toBeInTheDocument();
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("testing")).toBeInTheDocument();
  });

  it("filters posts by search text", async () => {
    render(<BlogList posts={mockPosts} allTags={["typescript"]} />);

    const searchInput = screen.getByPlaceholderText("Search posts...");
    fireEvent.change(searchInput, { target: { value: "testing" } });

    await waitFor(() => {
      expect(screen.getByText("Third Post")).toBeInTheDocument();
      expect(screen.queryByText("First Post")).not.toBeInTheDocument();
      expect(screen.queryByText("Second Post")).not.toBeInTheDocument();
    });
  });

  it("filters posts case-insensitively", async () => {
    render(<BlogList posts={mockPosts} allTags={["typescript"]} />);

    const searchInput = screen.getByPlaceholderText("Search posts...");
    fireEvent.change(searchInput, { target: { value: "TESTING" } });

    await waitFor(() => {
      expect(screen.getByText("Third Post")).toBeInTheDocument();
      expect(screen.queryByText("First Post")).not.toBeInTheDocument();
    });
  });

  it("searches across title, description, and tags", async () => {
    render(<BlogList posts={mockPosts} allTags={["typescript"]} />);

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

  it("toggles tag selection when tag badge is clicked", async () => {
    render(<BlogList posts={mockPosts} allTags={["typescript", "react"]} />);

    const typescriptButton = screen.getByText("typescript").closest("button");
    fireEvent.click(typescriptButton!);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        "/blog?tag=typescript",
        { scroll: false }
      );
    });
  });

  it("removes tag when already selected tag is clicked", async () => {
    mockSearchParams.getAll.mockReturnValue(["typescript"]);
    mockSearchParams.toString.mockReturnValue("tag=typescript");

    render(<BlogList posts={mockPosts} allTags={["typescript", "react"]} />);

    const typescriptButton = screen.getByText("typescript").closest("button");
    fireEvent.click(typescriptButton!);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/blog", { scroll: false });
    });
  });

  it("adds multiple tags to filter", async () => {
    mockSearchParams.getAll.mockReturnValue(["typescript"]);
    mockSearchParams.toString.mockReturnValue("tag=typescript");

    render(<BlogList posts={mockPosts} allTags={["typescript", "react"]} />);

    const reactButton = screen.getByText("react").closest("button");
    fireEvent.click(reactButton!);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        "/blog?tag=typescript&tag=react",
        { scroll: false }
      );
    });
  });

  it("filters posts by selected tags using AND logic", () => {
    mockSearchParams.getAll.mockReturnValue(["typescript", "react"]);

    render(<BlogList posts={mockPosts} allTags={["typescript", "react"]} />);

    // Only post-1 has both typescript AND react tags
    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.queryByText("Second Post")).not.toBeInTheDocument();
    expect(screen.queryByText("Third Post")).not.toBeInTheDocument();
  });

  it("shows result count when filters are active", async () => {
    render(<BlogList posts={mockPosts} allTags={["typescript"]} />);

    const searchInput = screen.getByPlaceholderText("Search posts...");
    fireEvent.change(searchInput, { target: { value: "testing" } });

    await waitFor(() => {
      expect(screen.getByText(/Showing 1 of 3 posts/i)).toBeInTheDocument();
    });
  });

  it("shows clear filters button when filters are active", async () => {
    render(<BlogList posts={mockPosts} allTags={["typescript"]} />);

    const searchInput = screen.getByPlaceholderText("Search posts...");
    fireEvent.change(searchInput, { target: { value: "testing" } });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /clear filters/i })
      ).toBeInTheDocument();
    });
  });

  it("hides result count and clear button when no filters are active", () => {
    render(<BlogList posts={mockPosts} allTags={["typescript"]} />);

    expect(screen.queryByText(/Showing/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /clear filters/i })
    ).not.toBeInTheDocument();
  });

  it("clears all filters when clear button is clicked", async () => {
    mockSearchParams.getAll.mockReturnValue(["typescript"]);
    mockSearchParams.toString.mockReturnValue("tag=typescript");

    render(<BlogList posts={mockPosts} allTags={["typescript"]} />);

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
    render(<BlogList posts={mockPosts} allTags={["typescript"]} />);

    const searchInput = screen.getByPlaceholderText("Search posts...");
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });

    await waitFor(() => {
      expect(
        screen.getByText("No posts match your filters.")
      ).toBeInTheDocument();
    });
  });

  it("shows empty state when no posts are provided", () => {
    render(<BlogList posts={[]} allTags={[]} />);

    expect(screen.getByText("No posts match your filters.")).toBeInTheDocument();
  });

  it("marks selected tags with default variant", () => {
    mockSearchParams.getAll.mockReturnValue(["typescript"]);

    render(<BlogList posts={mockPosts} allTags={["typescript", "react"]} />);

    const typescriptBadge = screen.getByText("typescript");
    const reactBadge = screen.getByText("react");

    expect(typescriptBadge).toHaveAttribute("data-variant", "default");
    expect(reactBadge).toHaveAttribute("data-variant", "outline");
  });

  it("compares tags case-insensitively", () => {
    mockSearchParams.getAll.mockReturnValue(["TypeScript"]);

    render(<BlogList posts={mockPosts} allTags={["typescript", "react"]} />);

    // Should match case-insensitively
    const typescriptBadge = screen.getByText("typescript");
    expect(typescriptBadge).toHaveAttribute("data-variant", "default");
  });

  it("combines tag filter and text search", () => {
    mockSearchParams.getAll.mockReturnValue(["typescript"]);

    render(<BlogList posts={mockPosts} allTags={["typescript"]} />);

    const searchInput = screen.getByPlaceholderText("Search posts...");
    fireEvent.change(searchInput, { target: { value: "first" } });

    // Should match posts with typescript tag AND "first" in text
    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.queryByText("Second Post")).not.toBeInTheDocument();
  });

  it("trims whitespace from search input", async () => {
    render(<BlogList posts={mockPosts} allTags={["typescript"]} />);

    const searchInput = screen.getByPlaceholderText("Search posts...");
    fireEvent.change(searchInput, { target: { value: "   testing   " } });

    await waitFor(() => {
      expect(screen.getByText("Third Post")).toBeInTheDocument();
      expect(screen.queryByText("First Post")).not.toBeInTheDocument();
    });
  });

  it("treats empty whitespace search as no filter", () => {
    render(<BlogList posts={mockPosts} allTags={["typescript"]} />);

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
    render(<BlogList posts={mockPosts} allTags={["typescript"]} />);

    // Check that BlogCard components are rendered
    expect(screen.getByTestId("blog-card-post-1")).toBeInTheDocument();
    expect(screen.getByTestId("blog-card-post-2")).toBeInTheDocument();
    expect(screen.getByTestId("blog-card-post-3")).toBeInTheDocument();
  });

  it("encodes tag in URL when navigating", async () => {
    render(
      <BlogList posts={mockPosts} allTags={["tag with spaces", "normal"]} />
    );

    const tagButton = screen.getByText("tag with spaces").closest("button");
    fireEvent.click(tagButton!);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(
        "/blog?tag=tag+with+spaces",
        { scroll: false }
      );
    });
  });

  it("handles posts with missing optional fields", () => {
    const minimalPosts: BlogPostSummary[] = [
      {
        slug: "minimal",
        title: "Minimal Post",
        description: "Description",
        tags: [],
        date: "2026-02-01",
      },
    ];

    render(<BlogList posts={minimalPosts} allTags={[]} />);

    expect(screen.getByText("Minimal Post")).toBeInTheDocument();
  });
});
