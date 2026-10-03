import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import * as fs from "fs";
import * as path from "path";
import { MobileDiagramScroll } from "./mobile-diagram-scroll";

const css = fs.readFileSync(
  path.join(__dirname, "../../app/diagrams-mobile.css"),
  "utf8",
);

describe("MobileDiagramScroll", () => {
  it("renders children inside a scroll area with no extra tab stop", () => {
    const { container } = render(
      <MobileDiagramScroll>
        <div className="diagram-scroll-inner">
          <svg viewBox="0 0 900 400" data-testid="svg" />
        </div>
      </MobileDiagramScroll>,
    );
    const region = container.querySelector(".diagram-scroll")!;
    expect(region.hasAttribute("tabindex")).toBe(false);
    expect(region.getAttribute("role")).toBeNull();
    expect(region.className).toContain("overflow-x-auto");
    expect(region.contains(screen.getByTestId("svg"))).toBe(true);
  });

  it("highlights on hover only when enlargeable", () => {
    const plain = render(
      <MobileDiagramScroll>
        <div />
      </MobileDiagramScroll>,
    );
    expect(plain.container.querySelector(".diagram-scroll")!.className).not.toContain(
      "group-hover",
    );
    const big = render(
      <MobileDiagramScroll enlargeable>
        <div />
      </MobileDiagramScroll>,
    );
    expect(big.container.querySelector(".diagram-scroll")!.className).toContain(
      "group-hover:border-primary/40",
    );
  });

  it("shows a swipe hint, without a tap clause when not enlargeable", () => {
    render(
      <MobileDiagramScroll>
        <div />
      </MobileDiagramScroll>,
    );
    expect(screen.getByText(/Swipe to see the full diagram/)).toBeTruthy();
    expect(screen.queryByText(/Tap to enlarge/)).toBeNull();
  });

  it("adds the tap clause and a touch badge when enlargeable", () => {
    const { container } = render(
      <MobileDiagramScroll enlargeable>
        <div />
      </MobileDiagramScroll>,
    );
    expect(container.querySelector(".diagram-hint")?.textContent).toBe(
      "Swipe to see the full diagram · Tap to enlarge",
    );
    expect(container.querySelector(".diagram-badge-touch")?.textContent).toBe(
      "Tap to enlarge",
    );
    expect(container.querySelector(".diagram-badge-mouse")?.textContent).toBe(
      "Click to enlarge",
    );
  });

  it("uses no em dashes in UI text", () => {
    const { container } = render(
      <MobileDiagramScroll enlargeable>
        <div />
      </MobileDiagramScroll>,
    );
    expect(container.textContent).not.toContain("—");
  });
});

const BUCKETS = ["5", "6", "7", "8", "9", "1"] as const;

/** Bucket prefix for an outer viewBox width, or null when no rule applies. */
function bucketFor(width: number): string | null {
  if (width >= 1000 && width < 2000) return "1";
  if (width >= 500 && width < 1000) return String(Math.floor(width / 100));
  return null;
}

/** Bucket prefixes that have a real min-width rule in the CSS file. */
function cssBuckets(): Set<string> {
  const found = new Set<string>();
  const re = /\.diagram-scroll-inner > svg\[viewBox\^="0 0 (\d)"\]\s*\{[^}]*min-width:\s*\d+px/g;
  for (const m of css.matchAll(re)) found.add(m[1]);
  return found;
}

describe("phone width rules in diagrams-mobile.css", () => {
  it("has one direct-child min-width rule per 100px bucket", () => {
    expect([...cssBuckets()].sort()).toEqual([...BUCKETS].sort());
    expect(css).toMatch(
      /\.diagram-scroll-inner > svg\[viewBox\^="0 0 9"\]\s*\{\s*min-width: 720px/,
    );
  });

  it("has no descendant svg width rules for the scroll area", () => {
    expect(css).not.toMatch(/\.diagram-scroll svg\[/);
  });

  it("keeps the width rules inside the max-width 767.98px media query", () => {
    const start = css.indexOf("@media (max-width: 767.98px)");
    expect(start).toBeGreaterThan(-1);
    expect(css.slice(0, start)).not.toMatch(/min-width: \d+px/);
  });

  it("is imported from globals.css right after shadcn", () => {
    const globals = fs.readFileSync(
      path.join(__dirname, "../../app/globals.css"),
      "utf8",
    );
    const lines = globals.split("\n");
    const i = lines.indexOf('@import "shadcn/tailwind.css";');
    expect(lines[i + 1]).toBe('@import "./diagrams-mobile.css";');
    expect(globals).not.toContain("DIAGRAMS ON PHONES");
  });

  it("maps widths to buckets as documented", () => {
    expect(bucketFor(380)).toBeNull();
    expect(bucketFor(499)).toBeNull();
    expect(bucketFor(600)).toBe("6");
    expect(bucketFor(999)).toBe("9");
    expect(bucketFor(1000)).toBe("1");
    expect(bucketFor(1200)).toBe("1");
    expect(bucketFor(2000)).toBeNull();
  });
});

describe("every registered diagram is covered", () => {
  const dir = __dirname;
  const files = fs
    .readdirSync(dir)
    .filter((f) => /^diagrams.*\.tsx$/.test(f));
  const covered = cssBuckets();

  it("matches each outer svg to a real CSS bucket rule", async () => {
    let total = 0;
    let wide = 0;
    for (const f of files) {
      const mod: Record<string, unknown> = await import(path.join(dir, f));
      for (const [name, C] of Object.entries(mod)) {
        if (typeof C !== "function") continue;
        total += 1;
        const html = renderToStaticMarkup(
          (C as (p: object) => React.ReactElement)({}),
        );
        expect(html, `${name} scroll region`).toContain("diagram-scroll");
        expect(html, `${name} hint`).toContain("diagram-hint");
        const host = document.createElement("div");
        host.innerHTML = html;
        const outer = [
          ...host.querySelectorAll(".diagram-scroll-inner > svg"),
        ];
        expect(outer.length, `${name} outer svg`).toBeGreaterThan(0);
        for (const svg of outer) {
          const w = Number(/^0 0 (\d+) \d+/.exec(svg.getAttribute("viewBox") ?? "")?.[1]);
          expect(Number.isFinite(w), `${name} viewBox`).toBe(true);
          const bucket = bucketFor(w);
          if (w >= 500) {
            wide += 1;
            expect(bucket, `${name} width ${w} has no bucket`).not.toBeNull();
            expect(covered.has(bucket!), `${name} width ${w}`).toBe(true);
          } else {
            expect(bucket, `${name} width ${w} must not widen`).toBeNull();
          }
        }
      }
    }
    expect(total).toBeGreaterThanOrEqual(100);
    expect(wide).toBeGreaterThanOrEqual(100);
  });
});
