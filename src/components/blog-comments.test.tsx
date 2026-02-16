import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BlogComments } from "./blog-comments";

const mockCommentsThreaded = [
  {
    id: 2,
    slug: "test-post",
    comment: "Not convinced",
    reaction: "down" as const,
    email: "another@test.com",
    created_at: "2026-02-02T14:30:00Z",
    parent_id: null,
    replies: [],
  },
  {
    id: 1,
    slug: "test-post",
    comment: "Great post!",
    reaction: "up" as const,
    email: "test@example.com",
    created_at: "2026-02-01T12:00:00Z",
    parent_id: null,
    replies: [
      {
        id: 3,
        slug: "test-post",
        comment: "I agree with this!",
        reaction: "up" as const,
        email: "reply@example.com",
        created_at: "2026-02-03T13:00:00Z",
        parent_id: 1,
      },
    ],
  },
];

describe("BlogComments", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("fetches and displays comments on mount", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comments: mockCommentsThreaded, thumbsUp: 1 }),
    });

    render(<BlogComments slug="test-post" />);

    expect(await screen.findByText("Great post!")).toBeInTheDocument();
    expect(screen.getByText("Not convinced")).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/comments?slug=test-post"
    );
  });

  it("displays replies indented below parent comments", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comments: mockCommentsThreaded, thumbsUp: 1 }),
    });

    render(<BlogComments slug="test-post" />);

    expect(await screen.findByText("I agree with this!")).toBeInTheDocument();

    // Reply should have the indented class
    const replyElement = document.getElementById("comment-3");
    expect(replyElement).toBeInTheDocument();
    expect(replyElement?.className).toContain("ml-8");
  });

  it("shows Reply button on top-level comments", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comments: mockCommentsThreaded, thumbsUp: 1 }),
    });

    render(<BlogComments slug="test-post" />);

    await screen.findByText("Great post!");

    const replyButtons = screen.getAllByRole("button", { name: /reply/i });
    // Should have reply buttons for the 2 top-level comments
    expect(replyButtons.length).toBe(2);
  });

  it("shows reply form when Reply button is clicked", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comments: mockCommentsThreaded, thumbsUp: 1 }),
    });

    render(<BlogComments slug="test-post" />);

    await screen.findByText("Great post!");

    const replyButtons = screen.getAllByRole("button", { name: /^reply$/i });
    fireEvent.click(replyButtons[0]);

    expect(screen.getByText("Replying to comment")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Write your reply...")).toBeInTheDocument();
  });

  it("hides reply form when Cancel is clicked", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comments: mockCommentsThreaded, thumbsUp: 1 }),
    });

    render(<BlogComments slug="test-post" />);

    await screen.findByText("Great post!");

    const replyButtons = screen.getAllByRole("button", { name: /^reply$/i });
    fireEvent.click(replyButtons[0]);

    expect(screen.getByText("Replying to comment")).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(screen.queryByText("Replying to comment")).not.toBeInTheDocument();
  });

  it("shows loading state initially", () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      new Promise(() => {})
    );

    render(<BlogComments slug="test-post" />);

    expect(screen.getByText("Loading comments...")).toBeInTheDocument();
  });

  it("shows empty state when no comments exist", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comments: [], thumbsUp: 0 }),
    });

    render(<BlogComments slug="test-post" />);

    expect(
      await screen.findByText(/No comments yet. Be the first to share your thoughts!/i)
    ).toBeInTheDocument();
  });

  it("masks email addresses correctly", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comments: mockCommentsThreaded, thumbsUp: 1 }),
    });

    render(<BlogComments slug="test-post" />);

    expect(await screen.findByText("te***@example.com")).toBeInTheDocument();
    expect(screen.getByText("an***@test.com")).toBeInTheDocument();
  });

  it("masks email with no @ symbol as-is", async () => {
    const badEmail = [
      {
        id: 3,
        slug: "test-post",
        comment: "Test",
        reaction: "up" as const,
        email: "notanemail",
        created_at: "2026-02-01T12:00:00Z",
        parent_id: null,
        replies: [],
      },
    ];

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comments: badEmail, thumbsUp: 0 }),
    });

    render(<BlogComments slug="test-post" />);

    // Should return the original string unchanged
    expect(await screen.findByText("notanemail")).toBeInTheDocument();
  });

  it("formats dates correctly", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comments: mockCommentsThreaded, thumbsUp: 1 }),
    });

    render(<BlogComments slug="test-post" />);

    expect(await screen.findByText("Feb 1, 2026")).toBeInTheDocument();
    expect(screen.getByText("Feb 2, 2026")).toBeInTheDocument();
  });

  it("displays thumbs-up and thumbs-down icons correctly", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comments: mockCommentsThreaded, thumbsUp: 1 }),
    });

    render(<BlogComments slug="test-post" />);

    await screen.findByText("Great post!");

    // Check for lucide icon classes
    const thumbsUpIcons = document.querySelectorAll(".lucide-thumbs-up");
    const thumbsDownIcons = document.querySelectorAll(".lucide-thumbs-down");

    expect(thumbsUpIcons.length).toBeGreaterThan(0);
    expect(thumbsDownIcons.length).toBeGreaterThan(0);
  });

  it("shows thumbs-up summary when count > 0", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comments: mockCommentsThreaded, thumbsUp: 5 }),
    });

    render(<BlogComments slug="test-post" />);

    expect(
      await screen.findByText("5 people liked this post")
    ).toBeInTheDocument();
  });

  it("shows singular 'person' when thumbsUp count is 1", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comments: mockCommentsThreaded, thumbsUp: 1 }),
    });

    render(<BlogComments slug="test-post" />);

    expect(
      await screen.findByText("1 person liked this post")
    ).toBeInTheDocument();
  });

  it("hides thumbs-up summary when count is 0", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comments: mockCommentsThreaded, thumbsUp: 0 }),
    });

    render(<BlogComments slug="test-post" />);

    await screen.findByText("Great post!");

    expect(screen.queryByText(/liked this post/i)).not.toBeInTheDocument();
  });

  it("calls onThumbsUpCount callback with the count", async () => {
    const callback = vi.fn();

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comments: mockCommentsThreaded, thumbsUp: 3 }),
    });

    render(<BlogComments slug="test-post" onThumbsUpCount={callback} />);

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith(3);
    });
  });

  it("toggles reaction between up and down", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comments: [], thumbsUp: 0 }),
    });

    render(<BlogComments slug="test-post" />);

    await screen.findByText(/No comments yet/i);

    const thumbsUpButton = screen.getByRole("button", { name: /thumbs up/i });
    const thumbsDownButton = screen.getByRole("button", {
      name: /thumbs down/i,
    });

    // Default is thumbs up
    expect(thumbsUpButton).toHaveClass("bg-green-500/20");

    // Click thumbs down
    fireEvent.click(thumbsDownButton);

    await waitFor(() => {
      expect(thumbsDownButton).toHaveClass("bg-red-500/20");
      expect(thumbsUpButton).not.toHaveClass("bg-green-500/20");
    });

    // Click thumbs up again
    fireEvent.click(thumbsUpButton);

    await waitFor(() => {
      expect(thumbsUpButton).toHaveClass("bg-green-500/20");
      expect(thumbsDownButton).not.toHaveClass("bg-red-500/20");
    });
  });

  it("submits a comment successfully", async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: [], thumbsUp: 0 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          comments: [
            {
              id: 10,
              slug: "test-post",
              comment: "New comment",
              reaction: "up",
              email: "new@example.com",
              created_at: new Date().toISOString(),
              parent_id: null,
              replies: [],
            },
          ],
          thumbsUp: 1,
        }),
      });

    render(<BlogComments slug="test-post" />);

    await screen.findByText(/No comments yet/i);

    const textarea = screen.getByPlaceholderText("Share your thoughts...");
    const emailInput = screen.getByPlaceholderText(
      "your-subscriber@email.com"
    );
    const submitButton = screen.getByRole("button", { name: /post/i });

    fireEvent.change(textarea, { target: { value: "New comment" } });
    fireEvent.change(emailInput, { target: { value: "new@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: "test-post",
          comment: "New comment",
          reaction: "up",
          email: "new@example.com",
        }),
      });
    });

    expect(await screen.findByText("Comment posted!")).toBeInTheDocument();
  });

  it("does not submit when comment is empty", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comments: [], thumbsUp: 0 }),
    });

    render(<BlogComments slug="test-post" />);

    await screen.findByText(/No comments yet/i);

    const submitButton = screen.getByRole("button", { name: /post/i });
    fireEvent.click(submitButton);

    // Should only be called once (for initial fetch)
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it("does not submit when email is empty", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comments: [], thumbsUp: 0 }),
    });

    render(<BlogComments slug="test-post" />);

    await screen.findByText(/No comments yet/i);

    const textarea = screen.getByPlaceholderText("Share your thoughts...");
    fireEvent.change(textarea, { target: { value: "New comment" } });

    const submitButton = screen.getByRole("button", { name: /post/i });
    fireEvent.click(submitButton);

    // Should only be called once (for initial fetch)
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it("shows loading spinner during submission", async () => {
    let resolvePostPromise: (value: unknown) => void;
    const postPromise = new Promise((resolve) => {
      resolvePostPromise = resolve;
    });

    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: [], thumbsUp: 0 }),
      })
      .mockReturnValueOnce(postPromise);

    render(<BlogComments slug="test-post" />);

    await screen.findByText(/No comments yet/i);

    const textarea = screen.getByPlaceholderText("Share your thoughts...");
    const emailInput = screen.getByPlaceholderText(
      "your-subscriber@email.com"
    );
    const submitButton = screen.getByRole("button", { name: /post/i });

    fireEvent.change(textarea, { target: { value: "Test" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    const loader = document.querySelector('[class*="lucide-loader"]');
    expect(loader).toBeInTheDocument();

    // Resolve
    resolvePostPromise!({
      ok: true,
      json: async () => ({ success: true }),
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("shows API error message on failed submission", async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: [], thumbsUp: 0 }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Not a subscriber" }),
      });

    render(<BlogComments slug="test-post" />);

    await screen.findByText(/No comments yet/i);

    const textarea = screen.getByPlaceholderText("Share your thoughts...");
    const emailInput = screen.getByPlaceholderText(
      "your-subscriber@email.com"
    );
    const submitButton = screen.getByRole("button", { name: /post/i });

    fireEvent.change(textarea, { target: { value: "Test" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    expect(await screen.findByText("Not a subscriber")).toBeInTheDocument();
  });

  it("shows network error on fetch failure", async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: [], thumbsUp: 0 }),
      })
      .mockRejectedValueOnce(new Error("Network error"));

    render(<BlogComments slug="test-post" />);

    await screen.findByText(/No comments yet/i);

    const textarea = screen.getByPlaceholderText("Share your thoughts...");
    const emailInput = screen.getByPlaceholderText(
      "your-subscriber@email.com"
    );
    const submitButton = screen.getByRole("button", { name: /post/i });

    fireEvent.change(textarea, { target: { value: "Test" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText("Network error. Please try again.")
    ).toBeInTheDocument();
  });

  it("clears form fields after successful submission", async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: [], thumbsUp: 0 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: [], thumbsUp: 0 }),
      });

    render(<BlogComments slug="test-post" />);

    await screen.findByText(/No comments yet/i);

    const textarea = screen.getByPlaceholderText(
      "Share your thoughts..."
    ) as HTMLTextAreaElement;
    const emailInput = screen.getByPlaceholderText(
      "your-subscriber@email.com"
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: /post/i });

    fireEvent.change(textarea, { target: { value: "Test comment" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await screen.findByText("Comment posted!");

    // Wait for the component to refresh and verify fields are cleared
    await waitFor(() => {
      const currentTextarea = screen.getByPlaceholderText(
        "Share your thoughts..."
      ) as HTMLTextAreaElement;
      const currentEmail = screen.getByPlaceholderText(
        "your-subscriber@email.com"
      ) as HTMLInputElement;
      expect(currentTextarea.value).toBe("");
      expect(currentEmail.value).toBe("");
    }, { timeout: 2000 });
  });

  it("resets reaction to 'up' after successful submission", async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: [], thumbsUp: 0 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: [], thumbsUp: 0 }),
      });

    render(<BlogComments slug="test-post" />);

    await screen.findByText(/No comments yet/i);

    const thumbsDownButton = screen.getByRole("button", {
      name: /thumbs down/i,
    });
    fireEvent.click(thumbsDownButton);

    const textarea = screen.getByPlaceholderText("Share your thoughts...");
    const emailInput = screen.getByPlaceholderText(
      "your-subscriber@email.com"
    );
    const submitButton = screen.getByRole("button", { name: /post/i });

    fireEvent.change(textarea, { target: { value: "Test" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await screen.findByText("Comment posted!");

    const thumbsUpButton = screen.getByRole("button", { name: /thumbs up/i });
    await waitFor(() => {
      expect(thumbsUpButton).toHaveClass("bg-green-500/20");
    });
  });

  it("clears error state when user types in textarea", async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: [], thumbsUp: 0 }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Not a subscriber" }),
      });

    render(<BlogComments slug="test-post" />);

    await screen.findByText(/No comments yet/i);

    const textarea = screen.getByPlaceholderText("Share your thoughts...");
    const emailInput = screen.getByPlaceholderText(
      "your-subscriber@email.com"
    );
    const submitButton = screen.getByRole("button", { name: /post/i });

    fireEvent.change(textarea, { target: { value: "Test" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await screen.findByText("Not a subscriber");

    // Type in textarea
    fireEvent.change(textarea, { target: { value: "Test2" } });

    await waitFor(() => {
      expect(screen.queryByText("Not a subscriber")).not.toBeInTheDocument();
    });
  });

  it("clears error state when user types in email", async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: [], thumbsUp: 0 }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Not a subscriber" }),
      });

    render(<BlogComments slug="test-post" />);

    await screen.findByText(/No comments yet/i);

    const textarea = screen.getByPlaceholderText("Share your thoughts...");
    const emailInput = screen.getByPlaceholderText(
      "your-subscriber@email.com"
    );
    const submitButton = screen.getByRole("button", { name: /post/i });

    fireEvent.change(textarea, { target: { value: "Test" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await screen.findByText("Not a subscriber");

    // Type in email
    fireEvent.change(emailInput, { target: { value: "test2@example.com" } });

    await waitFor(() => {
      expect(screen.queryByText("Not a subscriber")).not.toBeInTheDocument();
    });
  });

  it("silently handles fetch error for initial load", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Network error")
    );

    render(<BlogComments slug="test-post" />);

    // Should show empty state after error
    await waitFor(() => {
      expect(
        screen.queryByText("Loading comments...")
      ).not.toBeInTheDocument();
    });

    // Should still show form
    expect(screen.getByPlaceholderText("Share your thoughts...")).toBeInTheDocument();
  });

  it("encodes slug in API request", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comments: [], thumbsUp: 0 }),
    });

    render(<BlogComments slug="post with spaces" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/comments?slug=post%20with%20spaces"
      );
    });
  });

  it("enforces maxLength on textarea", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comments: [], thumbsUp: 0 }),
    });

    render(<BlogComments slug="test-post" />);

    await screen.findByText(/No comments yet/i);

    const textarea = screen.getByPlaceholderText(
      "Share your thoughts..."
    ) as HTMLTextAreaElement;

    expect(textarea.maxLength).toBe(2000);
  });
});
