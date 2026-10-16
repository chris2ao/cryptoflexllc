import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroIdentity } from "./hero-identity";

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

describe("HeroIdentity", () => {
  it("shows the post count and the formatted latest date", () => {
    const { container } = render(
      <HeroIdentity postCount={91} latestDate="2026-10-12" />
    );
    const meta = container.querySelector(".ed-hero-meta-row")!;
    expect(meta.textContent).toContain("NO. 91");
    expect(meta.textContent).toContain("UPDATED OCT 12, 2026");
    expect(meta.textContent).not.toContain("ISSUE");
  });

  it("marks the middle span so CSS can hide it on small screens", () => {
    const { container } = render(<HeroIdentity postCount={3} />);
    const mid = container.querySelector(".ed-hero-meta-mid");
    expect(mid?.textContent).toBe("CRYPTOFLEX / ENGINEERING LAB");
  });

  it("omits the updated span without a latest date", () => {
    const { container } = render(<HeroIdentity postCount={3} />);
    expect(container.querySelector(".ed-hero-meta-row")?.textContent).not.toContain(
      "UPDATED"
    );
  });

  it("renders the subhead copy", () => {
    render(<HeroIdentity postCount={3} />);
    expect(
      screen.getByText(
        "I'm a security engineer and build with AI agents on my own time. This is where I write it all down: the security reviews, the home-lab SOC, the agent workflows, and the bugs that got past all of them."
      )
    ).toBeInTheDocument();
  });

  it("renders the portrait caption", () => {
    const { container } = render(<HeroIdentity postCount={3} />);
    const caption = container.querySelector(".ed-hero-portrait-caption")!;
    expect(caption.textContent).toContain("Chris Johnson");
    expect(caption.textContent).toContain("Security Engineer · Builder");
  });

  it("keeps the CTAs and the portrait", () => {
    render(<HeroIdentity postCount={3} />);
    expect(screen.getByRole("link", { name: "Read the blog →" })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: "About Chris" })).toHaveAttribute("href", "/about");
    expect(screen.getByAltText("Chris Johnson")).toBeInTheDocument();
  });

  it("contains no em dash", () => {
    const { container } = render(
      <HeroIdentity postCount={3} latestDate="2026-10-12" />
    );
    expect(container.textContent).not.toContain("\u2014");
  });
});
