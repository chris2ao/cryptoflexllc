import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ServicesPage from "./page";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

describe("ServicesPage", () => {
  it("renders both offer headings and the three steps", () => {
    render(<ServicesPage />);
    expect(
      screen.getByRole("heading", { name: "Security review of AI agent setups" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Detection engineering for small teams" }),
    ).toBeTruthy();
    for (const name of ["Scoping call", "Fixed-scope work", "Report and handoff"]) {
      expect(screen.getByRole("heading", { level: 3, name })).toBeTruthy();
    }
  });

  it("links the contact button to /contact", () => {
    render(<ServicesPage />);
    const link = screen.getByRole("link", { name: "Get in touch" });
    expect(link.getAttribute("href")).toBe("/contact");
  });

  it("has no dropped offers and no em dash", () => {
    const { container } = render(<ServicesPage />);
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/web design/i);
    expect(text).not.toContain("Web Development");
    expect(text).not.toContain("IT Strategy");
    expect(text).not.toContain("—");
  });
});
