import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReferrerClasses } from "./referrer-classes";

describe("ReferrerClasses", () => {
  it("renders eight chips in the fixed order, including zero-view classes", () => {
    const { container } = render(
      <ReferrerClasses
        classes={[
          { cls: "forged", views: 3, visitors: 1 },
          { cls: "search", views: 120, visitors: 80 },
        ]}
        hosts={[]}
      />
    );
    const chips = Array.from(container.querySelectorAll("[data-class]"));
    expect(chips.map((c) => c.getAttribute("data-class"))).toEqual([
      "search", "ai", "social", "newsletter", "direct", "other", "internal", "forged",
    ]);
    expect(chips[0].textContent).toContain("120");
    expect(chips[1].textContent).toContain("0");
    expect(chips[1].className).toContain("dim");
  });

  it("shows the notes under forged and internal", () => {
    render(<ReferrerClasses classes={[]} hosts={[]} />);
    expect(screen.getByText("crawlers sending a false referrer")).toBeTruthy();
    expect(screen.getByText("our own pages and previews")).toBeTruthy();
  });

  it("renders the host list with class sublabels", () => {
    render(
      <ReferrerClasses
        classes={[]}
        hosts={[
          { host: "google.com", cls: "search", views: 90 },
          { host: "t.co", cls: "social", views: 10 },
        ]}
      />
    );
    expect(screen.getByText("google.com")).toBeTruthy();
    expect(screen.getByText(/search/, { selector: ".sub" })).toBeTruthy();
    expect(screen.getByText("90")).toBeTruthy();
  });
});
