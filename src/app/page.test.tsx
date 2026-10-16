import fs from "fs";
import path from "path";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import HomePage from "./page";
import { getAllPosts, getAllSeries, type BlogPost } from "@/lib/blog";

// Pass-through by default so most tests render real content; individual tests
// can swap in fixtures with mockReturnValueOnce.
vi.mock("@/lib/blog", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/blog")>();
  return { ...actual, getAllPosts: vi.fn(actual.getAllPosts) };
});

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

vi.mock("@/hooks/use-subscribe", () => ({
  useSubscribe: () => ({
    email: "",
    status: "idle",
    message: "",
    handleSubmit: vi.fn(),
    updateEmail: vi.fn(),
    subscriberCount: null,
  }),
}));

// IntersectionObserver and matchMedia are browser-only; the motion layer adds no content.
vi.mock("@/components/home/motion-layer", () => ({ MotionLayer: () => null }));

function renderHome() {
  return render(<HomePage />);
}

function sectionNumbers(container: HTMLElement): number[] {
  return Array.from(container.querySelectorAll(".ed-section-label")).map((el) =>
    Number(/^§ (\d{2}) \/ /.exec(el.textContent ?? "")?.[1])
  );
}

afterEach(() => {
  vi.mocked(getAllPosts).mockClear();
});

describe("HomePage", () => {
  it("keeps section numbers gapless when no series qualifies for Reading Paths", () => {
    const loosePosts: BlogPost[] = getAllPosts()
      .slice(0, 6)
      .map((p) => ({ ...p, series: undefined, seriesOrder: undefined }));
    vi.mocked(getAllPosts).mockReturnValueOnce(loosePosts);

    const { container } = renderHome();
    expect(container.querySelector("#series")).toBeNull();
    const numbers = sectionNumbers(container);
    expect(numbers).toEqual(numbers.map((_, i) => i + 1));
  });

  it("links all three home SOC series from the featured work card", () => {
    const { container } = renderHome();
    const links = container.querySelectorAll('.ed-work-feat a[href^="/blog/series/"]');
    expect(links).toHaveLength(3);
  });

  it("references only images that exist in public/", () => {
    const { container } = renderHome();
    const sources = Array.from(container.querySelectorAll("main img"))
      .map((img) => img.getAttribute("src") ?? "")
      .filter((src) => src.startsWith("/"));

    expect(sources.length).toBeGreaterThan(0);
    for (const src of sources) {
      expect(fs.existsSync(path.join(process.cwd(), "public", src)), src).toBe(true);
    }
  });

  it("numbers its section labels 01..N with no gaps or repeats", () => {
    const { container } = renderHome();
    const numbers = sectionNumbers(container);
    expect(numbers.length).toBeGreaterThanOrEqual(5);
    expect(numbers).toEqual(numbers.map((_, i) => i + 1));
  });

  it("renders no em dashes anywhere in the page text", () => {
    const { container } = renderHome();
    expect(container.textContent).not.toContain("\u2014");
  });

  it("shows no hand-typed vanity stats", () => {
    const { container } = renderHome();
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/ISSUE #|TESTS PASSING|CODE COVERAGE|UPTIME|COFFEE/i);
  });

  it("shows the real post count in the hero", () => {
    const { container } = renderHome();
    const meta = container.querySelector(".ed-hero-meta-row")?.textContent ?? "";
    expect(meta).toContain(`NO. ${getAllPosts().length}`);
  });

  it("links only to posts and series that exist", () => {
    const { container } = renderHome();
    const slugs = new Set(getAllPosts().map((p) => p.slug));
    const seriesNames = new Set(getAllSeries().map((s) => s.name));
    const hrefs = Array.from(container.querySelectorAll("a"))
      .map((a) => a.getAttribute("href") ?? "")
      .filter((href) => href.startsWith("/blog/"));

    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      const series = /^\/blog\/series\/(.+)$/.exec(href);
      if (series) {
        expect(seriesNames, href).toContain(decodeURIComponent(series[1]));
      } else {
        expect(slugs, href).toContain(href.replace(/^\/blog\//, ""));
      }
    }
  });

  it("drops the standalone consulting and CV sections", () => {
    const { container } = renderHome();
    expect(container.querySelector("#services")).toBeNull();
    expect(container.querySelector("#cv")).toBeNull();
    expect(container.querySelector('a[href="/services"]')).not.toBeNull();
  });
});
