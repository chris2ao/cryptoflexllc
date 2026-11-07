import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TerminalPromo } from "./TerminalPromo";

vi.mock("@/hooks/use-typing-animation", () => ({
  useTypingAnimation: (text: string) => text.slice(0, 3),
}));

const props = {
  accentColor: "amber" as const,
  filename: "demo.exe",
  headerText: "INCOMING TRANSMISSION",
  subtitle: "sub",
  stats: [],
  links: [],
};

describe("TerminalPromo heading", () => {
  it("exposes the full headerText as the accessible name on first render", () => {
    render(<TerminalPromo {...props} />);
    expect(
      screen.getByRole("heading", { name: /INCOMING TRANSMISSION/i })
    ).toBeInTheDocument();
  });

  it("still renders the typed text visibly, hidden from assistive tech", () => {
    const { container } = render(<TerminalPromo {...props} />);
    const decorative = container.querySelector('h2 [aria-hidden="true"]');
    expect(decorative?.textContent).toContain("INC");
  });
});
