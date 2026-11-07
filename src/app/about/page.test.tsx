import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import AboutPage from "./page";
import { getAllSeries } from "@/lib/blog";
import { IDENTITY_LINE } from "@/lib/identity";

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));
vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

const RETIRED = [
  "Sometimes it's security-related",
  "Often it's not",
  "Welcome to the playground",
  "occasional deep dives",
  "playground",
];

function text(container: HTMLElement): string {
  return (container.textContent ?? "").replace(/’/g, "'");
}

describe("AboutPage", () => {
  it("states the identity line", () => {
    const { container } = render(<AboutPage />);
    expect(text(container)).toContain(IDENTITY_LINE);
  });

  it("drops the retired positioning strings", () => {
    const { container } = render(<AboutPage />);
    const body = text(container).toLowerCase();
    for (const phrase of RETIRED) {
      expect(body).not.toContain(phrase.toLowerCase());
    }
  });

  it("links to services", () => {
    const { container } = render(<AboutPage />);
    expect(container.querySelector('a[href="/services"]')).not.toBeNull();
  });

  it("links only to series that exist", () => {
    const { container } = render(<AboutPage />);
    const names = new Set(getAllSeries().map((s) => s.name));
    const hrefs = [...container.querySelectorAll('a[href^="/blog/series/"]')].map(
      (a) => a.getAttribute("href")!
    );
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(names.has(decodeURIComponent(href.replace("/blog/series/", "")))).toBe(true);
    }
  });

  it("contains no em dash", () => {
    const { container } = render(<AboutPage />);
    expect(container.textContent).not.toContain(String.fromCharCode(8212));
  });
});
