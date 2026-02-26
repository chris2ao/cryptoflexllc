import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { CodeBlock } from "./code-block";

describe("CodeBlock", () => {
  let originalClipboard: Clipboard;

  beforeEach(() => {
    originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  it("renders children inside a pre element", () => {
    const { container } = render(
      <CodeBlock>
        <code>const x = 1;</code>
      </CodeBlock>
    );

    const pre = container.querySelector("pre");
    expect(pre).toBeInTheDocument();
    expect(pre).toHaveTextContent("const x = 1;");
  });

  it("shows copy button on render", () => {
    render(
      <CodeBlock>
        <code>{"console.log(\"hello\");"}</code>
      </CodeBlock>
    );

    const button = screen.getByRole("button", { name: /copy code/i });
    expect(button).toBeInTheDocument();
  });

  it("copies text content to clipboard on button click", async () => {
    render(
      <CodeBlock>
        <code>npm install next</code>
      </CodeBlock>
    );

    const button = screen.getByRole("button", { name: /copy code/i });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "npm install next"
    );
  });

  it("shows checkmark icon after copying", async () => {
    render(
      <CodeBlock>
        <code>hello</code>
      </CodeBlock>
    );

    const button = screen.getByRole("button", { name: /copy code/i });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();
  });

  it("announces copy to screen readers", async () => {
    render(
      <CodeBlock>
        <code>hello</code>
      </CodeBlock>
    );

    const button = screen.getByRole("button", { name: /copy code/i });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(screen.getByRole("status")).toHaveTextContent(
      "Code copied to clipboard"
    );
  });

  it("reverts to clipboard icon after timeout", async () => {
    vi.useFakeTimers();

    render(
      <CodeBlock>
        <code>hello</code>
      </CodeBlock>
    );

    const button = screen.getByRole("button", { name: /copy code/i });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(
      screen.getByRole("button", { name: /copy code/i })
    ).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("handles clipboard API failure gracefully", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: vi.fn().mockRejectedValue(new Error("Permission denied")),
      },
      writable: true,
      configurable: true,
    });

    render(
      <CodeBlock>
        <code>secret code</code>
      </CodeBlock>
    );

    const button = screen.getByRole("button", { name: /copy code/i });
    await act(async () => {
      fireEvent.click(button);
    });

    // Button should still be functional (not crash)
    expect(
      screen.getByRole("button", { name: /copy code/i })
    ).toBeInTheDocument();
  });

  it("passes through additional HTML attributes", () => {
    const { container } = render(
      <CodeBlock className="language-ts" data-testid="my-code">
        <code>type Foo = string;</code>
      </CodeBlock>
    );

    const pre = container.querySelector("pre");
    expect(pre).toHaveClass("language-ts");
  });
});
