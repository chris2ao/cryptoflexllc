import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutSection } from "./about-section";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

describe("AboutSection", () => {
  it("renders the section label with the passed index", () => {
    const { container } = render(<AboutSection index={5} />);
    expect(container.querySelector(".ed-section-label")?.textContent).toBe(
      "§ 05 / About the Author"
    );
  });

  it("keeps the about anchor id", () => {
    const { container } = render(<AboutSection index={5} />);
    expect(container.querySelector("section#about")).not.toBeNull();
  });

  it("renders the pull quote and attribution link", () => {
    render(<AboutSection index={5} />);
    expect(
      screen.getByText(
        "Everything I know about securing software has an expiration date."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Building With AI, Defending Against It" })
    ).toHaveAttribute("href", "/blog/tryhackme-ai1-ai-security-certification");
  });

  it("starts the first paragraph with My day job", () => {
    const { container } = render(<AboutSection index={5} />);
    const first = container.querySelector(".ed-about-prose p");
    expect(first?.textContent?.startsWith("My day job")).toBe(true);
  });

  it("lists five career steps in order with the last marked current", () => {
    render(<AboutSection index={5} />);
    const items = screen
      .getByRole("list", { name: "Career path" })
      .querySelectorAll("li");
    expect(items).toHaveLength(5);
    const text = Array.from(items).map((li) => li.textContent ?? "");
    expect(text[0]).toContain("Military intelligence");
    expect(text[1]).toContain("Chem/bio defense");
    expect(text[2]).toContain("IT operations");
    expect(text[3]).toContain("Security & cloud engineering");
    expect(text[4]).toContain("Cyber defense operations");
    expect(items[4]).toHaveClass("now");
    expect(items[0]).not.toHaveClass("now");
  });

  it("separates each role from its detail for screen readers", () => {
    render(<AboutSection index={5} />);
    const first = screen.getByRole("list", { name: "Career path" }).querySelector("li");
    expect(first?.textContent).toBe("Military intelligence Analyst, Iraq & Afghanistan");
  });

  it("has a heading so the section is reachable by heading navigation", () => {
    render(<AboutSection index={5} />);
    expect(screen.getByRole("heading", { level: 2, name: "About the author" })).toBeInTheDocument();
  });

  it("links the consulting note to services and about", () => {
    render(<AboutSection index={5} />);
    expect(screen.getByRole("link", { name: /See services/ })).toHaveAttribute(
      "href",
      "/services"
    );
    expect(screen.getByRole("link", { name: /More about me/ })).toHaveAttribute(
      "href",
      "/about"
    );
  });

  it("contains no em dash", () => {
    const { container } = render(<AboutSection index={5} />);
    expect(container.textContent).not.toContain("\u2014");
  });
});
