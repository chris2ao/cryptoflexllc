import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { SubscribeBlock } from "./subscribe-block";
import { SUBSCRIBE_COPY } from "@/lib/subscribe-copy";

const hook = vi.hoisted(() => ({
  state: {
    email: "",
    status: "idle" as "idle" | "loading" | "success" | "error",
    message: "",
    subscriberCount: null as number | null,
    handleSubmit: () => {},
    updateEmail: () => {},
  },
}));

vi.mock("@/hooks/use-subscribe", () => ({
  useSubscribe: () => hook.state,
}));

function setState(patch: Partial<typeof hook.state>) {
  hook.state = { ...hook.state, ...patch };
}

describe("SubscribeBlock", () => {
  beforeEach(() => {
    hook.state = {
      email: "",
      status: "idle",
      message: "",
      subscriberCount: null,
      handleSubmit: () => {},
      updateEmail: () => {},
    };
  });

  it("keeps the subscribe anchor and nests content in the wrap", () => {
    const { container } = render(<SubscribeBlock />);
    const section = container.querySelector("section#subscribe.ed-subscribe");
    expect(section).not.toBeNull();
    expect(section?.querySelector(".ed-wrap.ed-subscribe-inner")).not.toBeNull();
  });

  it("shows the fallback meta with No tracking pixels", () => {
    const { container } = render(<SubscribeBlock />);
    const meta = container.querySelector("#subscribe-message");
    expect(meta?.textContent).toBe(
      "Weekly · Unsubscribe anytime · No tracking pixels"
    );
  });

  it("body copy says No tracking pixels and avoids the bare claim", () => {
    const { container } = render(<SubscribeBlock />);
    expect(container.textContent).toContain("No tracking pixels");
    expect(container.textContent).not.toMatch(/No tracking(?! pixels)/);
  });

  it("shows the subscriber count at or above the social proof floor", () => {
    setState({ subscriberCount: 250 });
    render(<SubscribeBlock />);
    expect(screen.getByText(/Join/)).toBeInTheDocument();
    expect(screen.getByText("250")).toBeInTheDocument();
  });

  it("hides a small subscriber count", () => {
    setState({ subscriberCount: 30 });
    const { container } = render(<SubscribeBlock />);
    expect(container.textContent).not.toMatch(/Join/);
    expect(container.querySelector("#subscribe-message")?.textContent).toBe(
      "Weekly · Unsubscribe anytime · No tracking pixels"
    );
  });

  it("shows the success variant", () => {
    setState({ status: "success" });
    render(<SubscribeBlock />);
    expect(screen.getByText(SUBSCRIBE_COPY.success)).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("✓ Subscribed");
    expect(screen.getByLabelText("Email address")).toBeDisabled();
  });

  it("shows the error variant with aria wiring", () => {
    setState({ status: "error", message: "Nope" });
    render(<SubscribeBlock />);
    expect(screen.getByText("Nope")).toBeInTheDocument();
    const input = screen.getByLabelText("Email address");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "subscribe-message");
  });

  it("contains no em dash", () => {
    const { container } = render(<SubscribeBlock />);
    expect(container.textContent).not.toContain("\u2014");
  });
});
