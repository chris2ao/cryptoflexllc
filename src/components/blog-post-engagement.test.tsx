import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BlogPostThumbsUp } from "./blog-post-engagement";

describe("BlogPostThumbsUp", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("fetches thumbs-up count on mount", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({ thumbsUp: 5 }),
    });

    render(<BlogPostThumbsUp slug="test-post" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/comments?slug=test-post"
      );
    });
  });

  it("displays thumbs-up count when greater than zero", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({ thumbsUp: 5 }),
    });

    render(<BlogPostThumbsUp slug="test-post" />);

    expect(await screen.findByText("5")).toBeInTheDocument();
  });

  it("displays thumbs-up icon when count is greater than zero", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({ thumbsUp: 3 }),
    });

    render(<BlogPostThumbsUp slug="test-post" />);

    await screen.findByText("3");

    const thumbsUpIcon = document.querySelector(".lucide-thumbs-up");
    expect(thumbsUpIcon).toBeInTheDocument();
  });

  it("displays middot separator when count is greater than zero", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({ thumbsUp: 2 }),
    });

    const { container } = render(<BlogPostThumbsUp slug="test-post" />);

    await screen.findByText("2");

    expect(container.textContent).toContain("·");
  });

  it("hides component when count is zero", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({ thumbsUp: 0 }),
    });

    const { container } = render(<BlogPostThumbsUp slug="test-post" />);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it("hides component when count is null", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({ thumbsUp: null }),
    });

    const { container } = render(<BlogPostThumbsUp slug="test-post" />);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it("hides component when thumbsUp field is missing", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({}),
    });

    const { container } = render(<BlogPostThumbsUp slug="test-post" />);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it("hides component when fetch fails", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { container } = render(<BlogPostThumbsUp slug="test-post" />);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it("encodes slug in API request", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({ thumbsUp: 1 }),
    });

    render(<BlogPostThumbsUp slug="post with spaces" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/comments?slug=post%20with%20spaces"
      );
    });
  });

  it("handles large thumbs-up counts", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({ thumbsUp: 9999 }),
    });

    render(<BlogPostThumbsUp slug="test-post" />);

    expect(await screen.findByText("9999")).toBeInTheDocument();
  });

  it("displays count of 1 correctly", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({ thumbsUp: 1 }),
    });

    render(<BlogPostThumbsUp slug="test-post" />);

    expect(await screen.findByText("1")).toBeInTheDocument();
  });

  it("shows nothing initially before fetch completes", () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      new Promise(() => {})
    );

    const { container } = render(<BlogPostThumbsUp slug="test-post" />);

    expect(container.firstChild).toBeNull();
  });

  it("silently handles JSON parse errors", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });

    const { container } = render(<BlogPostThumbsUp slug="test-post" />);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it("applies correct styling to thumbs-up icon", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({ thumbsUp: 5 }),
    });

    render(<BlogPostThumbsUp slug="test-post" />);

    await screen.findByText("5");

    const icon = document.querySelector(".lucide-thumbs-up");
    expect(icon).toHaveClass("h-3.5");
    expect(icon).toHaveClass("w-3.5");
    expect(icon).toHaveClass("text-green-400");
  });

  it("refetches when slug changes", async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        json: async () => ({ thumbsUp: 5 }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ thumbsUp: 3 }),
      });

    const { rerender } = render(<BlogPostThumbsUp slug="post-1" />);

    await screen.findByText("5");

    rerender(<BlogPostThumbsUp slug="post-2" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/comments?slug=post-2");
    });

    expect(await screen.findByText("3")).toBeInTheDocument();
  });
});
