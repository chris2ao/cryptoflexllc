import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CannCannPromo } from "./cann-cann-promo";

vi.mock("@/hooks/use-typing-animation", () => ({
  useTypingAnimation: (text: string) => text,
}));

describe("CannCannPromo", () => {
  it("shows the verified stat chips", () => {
    const { container } = render(<CannCannPromo />);
    const text = container.textContent ?? "";
    expect(text).toContain("12 Weapons");
    expect(text).toContain("7 Biomes");
    expect(text).toContain("Online Multiplayer");
  });

  it("shows the online subtitle", () => {
    render(<CannCannPromo />);
    expect(
      screen.getByText("Aim. Fire. Adjust. Now online: send a friend the invite link.")
    ).toBeInTheDocument();
  });

  it("links to the game", () => {
    render(<CannCannPromo />);
    expect(screen.getByRole("link", { name: "Play Now" })).toHaveAttribute(
      "href",
      "https://cann-cann.vercel.app"
    );
  });

  it("contains no em dash", () => {
    const { container } = render(<CannCannPromo />);
    expect(container.textContent).not.toContain("\u2014");
  });
});
