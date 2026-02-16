import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BacklogList } from "./backlog-list";

const mockPosts = [
  {
    slug: "first-draft",
    title: "First Draft",
    date: "2026-02-15",
    author: "CJ",
    readingTime: "3 min read",
    description: "First draft description.",
    tags: ["Claude Code", "Workflow"],
  },
  {
    slug: "second-draft",
    title: "Second Draft",
    date: "2026-02-14",
    author: "CJ",
    readingTime: "5 min read",
    description: "Second draft description.",
    tags: ["Analytics", "Workflow"],
  },
  {
    slug: "third-draft",
    title: "Third Draft",
    date: "2026-02-13",
    author: "CJ",
    readingTime: "7 min read",
    description: "Third draft about something else.",
    tags: ["Claude Code", "Security"],
  },
];

const allTags = ["Analytics", "Claude Code", "Security", "Workflow"];

describe("BacklogList", () => {
  it("renders all posts in a grid", () => {
    render(<BacklogList posts={mockPosts} allTags={allTags} />);

    expect(screen.getByText("First Draft")).toBeInTheDocument();
    expect(screen.getByText("Second Draft")).toBeInTheDocument();
    expect(screen.getByText("Third Draft")).toBeInTheDocument();
  });

  it("renders tag filter buttons", () => {
    render(<BacklogList posts={mockPosts} allTags={allTags} />);

    expect(screen.getByRole("button", { name: "Analytics" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Claude Code" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Security" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Workflow" })).toBeInTheDocument();
  });

  it("filters posts by search text", () => {
    render(<BacklogList posts={mockPosts} allTags={allTags} />);

    const searchInput = screen.getByPlaceholderText("Search drafts...");
    fireEvent.change(searchInput, { target: { value: "something else" } });

    expect(screen.queryByText("First Draft")).not.toBeInTheDocument();
    expect(screen.queryByText("Second Draft")).not.toBeInTheDocument();
    expect(screen.getByText("Third Draft")).toBeInTheDocument();
  });

  it("filters posts by tag selection", () => {
    render(<BacklogList posts={mockPosts} allTags={allTags} />);

    // Click "Security" tag filter
    const securityButton = screen.getByRole("button", { name: "Security" });
    fireEvent.click(securityButton);

    expect(screen.queryByText("First Draft")).not.toBeInTheDocument();
    expect(screen.queryByText("Second Draft")).not.toBeInTheDocument();
    expect(screen.getByText("Third Draft")).toBeInTheDocument();
  });

  it("filters by multiple tags with AND logic", () => {
    render(<BacklogList posts={mockPosts} allTags={allTags} />);

    // Click both "Claude Code" and "Workflow"
    const claudeButton = screen.getByRole("button", { name: "Claude Code" });
    fireEvent.click(claudeButton);

    const workflowButton = screen.getByRole("button", { name: "Workflow" });
    fireEvent.click(workflowButton);

    // Only "First Draft" has both tags
    expect(screen.getByText("First Draft")).toBeInTheDocument();
    expect(screen.queryByText("Second Draft")).not.toBeInTheDocument();
    expect(screen.queryByText("Third Draft")).not.toBeInTheDocument();
  });

  it("shows result count when filtered", () => {
    render(<BacklogList posts={mockPosts} allTags={allTags} />);

    const searchInput = screen.getByPlaceholderText("Search drafts...");
    fireEvent.change(searchInput, { target: { value: "First" } });

    expect(screen.getByText("Showing 1 of 3 drafts")).toBeInTheDocument();
  });

  it("shows clear filters button when filtered", () => {
    render(<BacklogList posts={mockPosts} allTags={allTags} />);

    const searchInput = screen.getByPlaceholderText("Search drafts...");
    fireEvent.change(searchInput, { target: { value: "First" } });

    const clearButton = screen.getByText("Clear filters");
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    // All posts should be visible again
    expect(screen.getByText("First Draft")).toBeInTheDocument();
    expect(screen.getByText("Second Draft")).toBeInTheDocument();
    expect(screen.getByText("Third Draft")).toBeInTheDocument();
  });

  it("shows empty state when no posts match filters", () => {
    render(<BacklogList posts={mockPosts} allTags={allTags} />);

    const searchInput = screen.getByPlaceholderText("Search drafts...");
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });

    expect(
      screen.getByText("No drafts match your filters.")
    ).toBeInTheDocument();
  });

  it("toggles tag selection off when clicked again", () => {
    render(<BacklogList posts={mockPosts} allTags={allTags} />);

    const securityButton = screen.getByRole("button", { name: "Security" });

    // Select
    fireEvent.click(securityButton);
    expect(screen.queryByText("First Draft")).not.toBeInTheDocument();

    // Deselect
    fireEvent.click(securityButton);
    expect(screen.getByText("First Draft")).toBeInTheDocument();
    expect(screen.getByText("Second Draft")).toBeInTheDocument();
    expect(screen.getByText("Third Draft")).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(<BacklogList posts={mockPosts} allTags={allTags} />);
    expect(screen.getByPlaceholderText("Search drafts...")).toBeInTheDocument();
  });
});
