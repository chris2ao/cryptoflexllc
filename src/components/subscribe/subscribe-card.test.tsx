import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SubscribeCard } from "./subscribe-card";
import { SUBSCRIBE_COPY } from "@/lib/subscribe-copy";

/** Helper: create a fetch mock that returns `countResponse` for GET and `postResponse` for POST */
function mockFetch(postResponse?: { ok: boolean; json: () => Promise<unknown> }) {
  const countResponse = { ok: true, json: async () => ({ count: 5 }) };
  return vi.fn().mockImplementation((_url: string, options?: RequestInit) => {
    if (options?.method === "POST" && postResponse) {
      return Promise.resolve(postResponse);
    }
    return Promise.resolve(countResponse);
  });
}

describe("SubscribeCard", () => {
  beforeEach(() => {
    // Default: GET returns subscriber count, POST is not expected
    global.fetch = mockFetch();
  });

  it("renders the form with all elements", () => {
    render(<SubscribeCard />);

    expect(
      screen.getByRole("heading", { name: SUBSCRIBE_COPY.title })
    ).toBeInTheDocument();
    expect(screen.getByText(SUBSCRIBE_COPY.body)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("you@example.com")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /subscribe/i })
    ).toBeInTheDocument();
  });

  it("does not submit when email is empty", async () => {
    render(<SubscribeCard />);

    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalledWith(
        "/api/subscribe",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("does not submit when email is whitespace only", async () => {
    render(<SubscribeCard />);

    const input = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(input, { target: { value: "   " } });

    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalledWith(
        "/api/subscribe",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("submits the form successfully", async () => {
    global.fetch = mockFetch({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<SubscribeCard />);

    const input = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(input, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@example.com" }),
      });
    });

    expect(
      await screen.findByText(SUBSCRIBE_COPY.success)
    ).toBeInTheDocument();
  });

  it("shows loading spinner during submission", async () => {
    let resolvePost: (value: unknown) => void;
    const postPromise = new Promise((resolve) => {
      resolvePost = resolve;
    });

    global.fetch = vi.fn().mockImplementation((_url: string, options?: RequestInit) => {
      if (options?.method === "POST") return postPromise;
      return Promise.resolve({ ok: true, json: async () => ({ count: 5 }) });
    });

    render(<SubscribeCard />);

    const input = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(input, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    // Loader icon should be visible (using class name from lucide-react)
    const loader = document.querySelector('[class*="lucide-loader"]');
    expect(loader).toBeInTheDocument();

    // Resolve the promise
    resolvePost!({
      ok: true,
      json: async () => ({ success: true }),
    });

    // After success, the success message is shown
    await waitFor(() => {
      expect(
        screen.getByText(SUBSCRIBE_COPY.success)
      ).toBeInTheDocument();
    });
  });

  it("clears the email field after successful submission", async () => {
    global.fetch = mockFetch({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<SubscribeCard />);

    const input = screen.getByPlaceholderText(
      "you@example.com"
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    fireEvent.click(submitButton);

    // After success the input is emptied and locked
    await waitFor(() => {
      expect(input).toBeDisabled();
    });
    expect(input.value).toBe("");

    // Success message should be shown
    expect(
      screen.getByText(SUBSCRIBE_COPY.success)
    ).toBeInTheDocument();
  });

  it("shows API error message", async () => {
    global.fetch = mockFetch({
      ok: false,
      json: async () => ({ error: "Email already subscribed" }),
    });

    render(<SubscribeCard />);

    const input = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(input, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText("Email already subscribed")
    ).toBeInTheDocument();
  });

  it("shows generic error when API returns no error message", async () => {
    global.fetch = mockFetch({
      ok: false,
      json: async () => ({}),
    });

    render(<SubscribeCard />);

    const input = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(input, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText("Something went wrong.")).toBeInTheDocument();
  });

  it("shows network error message on fetch failure", async () => {
    global.fetch = vi.fn().mockImplementation((_url: string, options?: RequestInit) => {
      if (options?.method === "POST") return Promise.reject(new Error("Network error"));
      return Promise.resolve({ ok: true, json: async () => ({ count: 5 }) });
    });

    render(<SubscribeCard />);

    const input = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(input, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText("Network error. Please try again.")
    ).toBeInTheDocument();
  });

  it("clears error state when user types after an error", async () => {
    global.fetch = mockFetch({
      ok: false,
      json: async () => ({ error: "Email already subscribed" }),
    });

    render(<SubscribeCard />);

    const input = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(input, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    fireEvent.click(submitButton);

    await screen.findByText("Email already subscribed");

    // Type new character
    fireEvent.change(input, { target: { value: "test2@example.com" } });

    // Error message should disappear
    await waitFor(() => {
      expect(
        screen.queryByText("Email already subscribed")
      ).not.toBeInTheDocument();
    });
  });

  it("locks the form and shows the success message after subscription", async () => {
    global.fetch = mockFetch({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<SubscribeCard />);

    const input = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(input, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    fireEvent.click(submitButton);

    await screen.findByText(SUBSCRIBE_COPY.success);

    // Form stays in place but is locked, with a confirmed button label
    expect(screen.getByPlaceholderText("you@example.com")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveTextContent("✓ Subscribed");
  });
});

describe("SubscribeCard markup and social proof", () => {
  it("renders the card landmark labelled by its heading", () => {
    global.fetch = mockFetch();
    const { container } = render(<SubscribeCard />);
    const section = container.querySelector("section.ed-subscribe-card");
    const heading = section?.querySelector("h3");
    expect(heading).not.toBeNull();
    expect(section?.getAttribute("aria-labelledby")).toBe(heading?.id);
    expect(section?.querySelector(".ed-overline")).toHaveTextContent("Subscribe");
    expect(section?.querySelector("form.subscribe-form .row")).not.toBeNull();
    expect(container.textContent).not.toContain("\u2014");
  });

  it("hides a small subscriber count", async () => {
    global.fetch = mockFetch(); // count: 5
    const { container } = render(<SubscribeCard />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(container.textContent).not.toMatch(/Join/);
    expect(container.querySelector(".meta")?.textContent).toBe(
      "Weekly · Unsubscribe anytime · No tracking pixels"
    );
  });

  it("shows a count at or above the social proof floor", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ count: 250 }),
    });
    render(<SubscribeCard />);
    expect(await screen.findByText("250")).toBeInTheDocument();
    expect(screen.getByText(/Join/)).toBeInTheDocument();
  });
});
