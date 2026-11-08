import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SearchConsolePanel } from "./search-console-panel";

const empty = { queries: [], pages: [], daily: [], window: null };

describe("SearchConsolePanel", () => {
  it("shows the not-configured state with the env names", () => {
    render(<SearchConsolePanel data={{ configured: false, ...empty }} />);
    expect(screen.getByText("Search Console is not configured")).toBeInTheDocument();
    for (const name of ["GSC_CLIENT_EMAIL", "GSC_PRIVATE_KEY", "GSC_SITE_URL"]) {
      expect(screen.getByText(name).tagName).toBe("CODE");
    }
    expect(
      screen.getByText(/Service account with the Search Console API, added as a Full user/),
    ).toBeInTheDocument();
  });

  it("renders ranked queries, pages with paths, and the summary line", () => {
    render(
      <SearchConsolePanel
        data={{
          configured: true,
          queries: [{ keys: ["claude code"], clicks: 5, impressions: 100, ctr: 0.05, position: 3.24 }],
          pages: [
            { keys: ["https://cryptoflexllc.com/blog/x"], clicks: 4, impressions: 80, ctr: 0.05, position: 2 },
            { keys: ["https://other.example/y"], clicks: 1, impressions: 9, ctr: 0.1, position: 8 },
          ],
          daily: [
            { keys: ["2026-10-01"], clicks: 3, impressions: 50, ctr: 0, position: 0 },
            { keys: ["2026-10-02"], clicks: 2, impressions: 50, ctr: 0, position: 0 },
          ],
          window: { startDate: "2026-10-01", endDate: "2026-10-28" },
        }}
      />,
    );
    expect(screen.getByText("claude code")).toBeInTheDocument();
    expect(screen.getByText(/100 impr · pos 3\.2/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /\/blog\/x/ })).toHaveAttribute("href", "/blog/x");
    expect(screen.getByText("https://other.example/y")).toBeInTheDocument();
    expect(screen.getByText(/5 clicks · 100 impressions · 2026-10-01 to 2026-10-28/)).toBeInTheDocument();
  });

  it("shows the empty text when configured but no rows", () => {
    render(<SearchConsolePanel data={{ configured: true, ...empty }} />);
    expect(screen.getAllByText("No Search Console rows for this window")).toHaveLength(2);
  });
});
