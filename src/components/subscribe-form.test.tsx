import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SubscribeForm } from "./subscribe-form";

describe("SubscribeForm", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("renders the form with all elements", () => {
    render(<SubscribeForm />);

    expect(screen.getByText("Weekly Digest")).toBeInTheDocument();
    expect(
      screen.getByText(/Get a weekly email with what I learned/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("you@example.com")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /subscribe/i })
    ).toBeInTheDocument();
  });

  it("does not submit when email is empty", async () => {
    render(<SubscribeForm />);

    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  it("does not submit when email is whitespace only", async () => {
    render(<SubscribeForm />);

    const input = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(input, { target: { value: "   " } });

    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  it("submits the form successfully", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<SubscribeForm />);

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
      await screen.findByText(/You're subscribed! Check your inbox on Mondays./i)
    ).toBeInTheDocument();
  });

  it("shows loading spinner during submission", async () => {
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (global.fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(promise);

    render(<SubscribeForm />);

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
    resolvePromise!({
      ok: true,
      json: async () => ({ success: true }),
    });

    // After success, form is hidden and replaced with success message
    await waitFor(() => {
      expect(
        screen.getByText(/You're subscribed! Check your inbox on Mondays./i)
      ).toBeInTheDocument();
    });
  });

  it("clears the email field after successful submission", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<SubscribeForm />);

    const input = screen.getByPlaceholderText(
      "you@example.com"
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    fireEvent.click(submitButton);

    // After success, the form is hidden so the input field disappears
    await waitFor(() => {
      expect(screen.queryByPlaceholderText("you@example.com")).not.toBeInTheDocument();
    });

    // Success message should be shown
    expect(
      screen.getByText(/You're subscribed! Check your inbox on Mondays./i)
    ).toBeInTheDocument();
  });

  it("shows API error message", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Email already subscribed" }),
    });

    render(<SubscribeForm />);

    const input = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(input, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText("Email already subscribed")
    ).toBeInTheDocument();
  });

  it("shows generic error when API returns no error message", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    render(<SubscribeForm />);

    const input = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(input, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText("Something went wrong.")).toBeInTheDocument();
  });

  it("shows network error message on fetch failure", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Network error")
    );

    render(<SubscribeForm />);

    const input = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(input, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText("Network error. Please try again.")
    ).toBeInTheDocument();
  });

  it("clears error state when user types after an error", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Email already subscribed" }),
    });

    render(<SubscribeForm />);

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

  it("hides form and shows success message after subscription", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<SubscribeForm />);

    const input = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(input, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /subscribe/i });
    fireEvent.click(submitButton);

    await screen.findByText(/You're subscribed! Check your inbox on Mondays./i);

    // Form should be replaced with success message
    expect(screen.queryByPlaceholderText("you@example.com")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /subscribe/i })).not.toBeInTheDocument();
  });
});
