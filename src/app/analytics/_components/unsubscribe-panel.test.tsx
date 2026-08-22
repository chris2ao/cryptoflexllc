import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act, waitFor, within } from "@testing-library/react";
import { UnsubscribePanel } from "./unsubscribe-panel";
import type {
  UnsubscribePanelData,
  UnsubscribePanelRow,
  UnsubscribePanelSummary,
} from "@/lib/analytics-types";

function row(overrides: Partial<UnsubscribePanelRow> = {}): UnsubscribePanelRow {
  return {
    sender_email: "deals@example.com",
    sender_domain: "example.com",
    method: "rfc8058-post",
    trashed_count_14d: 5,
    first_seen: "2026-08-01T00:00:00.000Z",
    last_seen: "2026-08-15T00:00:00.000Z",
    last_pushed_at: "2026-08-15T00:00:00.000Z",
    decision: null,
    decided_at: null,
    note: null,
    last_attempt: null,
    attempts_since_decision: 0,
    history: [],
    ...overrides,
  };
}

function panelData(
  rows: UnsubscribePanelRow[],
  summaryOverrides: Partial<UnsubscribePanelSummary> = {}
): UnsubscribePanelData {
  return {
    ok: true,
    generated_at: "2026-08-20T00:00:00.000Z",
    summary: {
      pending: rows.filter((r) => r.decision === null).length,
      approved: rows.filter((r) => r.decision === "approve").length,
      allowed: rows.filter((r) => r.decision === "deny").length,
      unsubscribed_7d: 0,
      silence_measured: 0,
      silence_silent: 0,
      silence_rate: null,
      target: 0.8,
      ...summaryOverrides,
    },
    rows,
  };
}

describe("UnsubscribePanel", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders the summary strip and the three review sections", () => {
    const data = panelData(
      [
        row({ sender_email: "pending@example.com", decision: null }),
        row({
          sender_email: "approved@example.com",
          decision: "approve",
          decided_at: "2026-08-10T00:00:00.000Z",
          history: [{ decision: "approve", decided_at: "2026-08-10T00:00:00.000Z", note: null }],
        }),
        row({
          sender_email: "allowed@example.com",
          decision: "deny",
          decided_at: "2026-08-05T00:00:00.000Z",
          history: [{ decision: "deny", decided_at: "2026-08-05T00:00:00.000Z", note: null }],
        }),
      ],
      { pending: 1, approved: 1, allowed: 1, unsubscribed_7d: 2, silence_measured: 4, silence_silent: 3, silence_rate: 0.75 }
    );

    render(<UnsubscribePanel initial={data} />);

    expect(screen.getByRole("heading", { name: "Awaiting review" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Approved to unsubscribe" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Allowed" })).toBeTruthy();

    expect(screen.getByText("pending@example.com")).toBeTruthy();
    expect(screen.getByText("approved@example.com")).toBeTruthy();
    expect(screen.getByText("allowed@example.com")).toBeTruthy();

    expect(screen.getByLabelText("Silence rate (14d, target 80%): 75%")).toBeTruthy();
  });

  it("renders n/a for the silence rate when it is null", () => {
    const data = panelData([row({ sender_email: "pending@example.com", decision: null })]);
    render(<UnsubscribePanel initial={data} />);
    expect(screen.getByLabelText("Silence rate (14d, target 80%): n/a")).toBeTruthy();
  });

  it("approving a pending row POSTs the decision and moves it to Approved with a new history entry", async () => {
    const data = panelData([
      row({ sender_email: "pending@example.com", method: "rfc8058-post", decision: null, history: [] }),
    ]);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        decision: {
          id: 1,
          sender_email: "pending@example.com",
          decision: "approve",
          decided_at: "2026-08-21T00:00:00.000Z",
          note: null,
        },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<UnsubscribePanel initial={data} />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /approve/i }));
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/gmail/unsubscribe/decisions",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ sender_email: "pending@example.com", decision: "approve" }),
        })
      );
    });

    const approvedHeading = screen.getByRole("heading", { name: "Approved to unsubscribe" });
    const approvedSection = approvedHeading.closest("div") as HTMLElement;
    expect(within(approvedSection).getByText("pending@example.com")).toBeTruthy();

    fireEvent.click(within(approvedSection).getByLabelText(/show history/i));
    expect(within(approvedSection).getAllByRole("listitem")).toHaveLength(1);

    // Regression: the summary strip used to go stale until the next Refresh.
    expect(screen.getByLabelText("Pending: 0")).toBeTruthy();
    expect(screen.getByLabelText("Approved: 1")).toBeTruthy();
  });

  it("restores the row and shows an error banner when the POST fails", async () => {
    const data = panelData([row({ sender_email: "pending@example.com", decision: null })]);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: "Internal error" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<UnsubscribePanel initial={data} />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /approve/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/could not save the decision/i)).toBeTruthy();
    });

    const pendingHeading = screen.getByRole("heading", { name: "Awaiting review" });
    const pendingSection = pendingHeading.closest("div") as HTMLElement;
    expect(within(pendingSection).getByText("pending@example.com")).toBeTruthy();

    // Regression: the summary strip must revert along with the row.
    expect(screen.getByLabelText("Pending: 1")).toBeTruthy();
    expect(screen.getByLabelText("Approved: 0")).toBeTruthy();
  });

  it("renders a setup banner and no table when initial is null", () => {
    render(<UnsubscribePanel initial={null} />);
    expect(screen.getByText(/\/api\/analytics\/setup/)).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("disables Approve with a tooltip for a non-rfc8058-post row", () => {
    const data = panelData([
      row({ sender_email: "pending@example.com", method: "http-get", decision: null }),
    ]);
    render(<UnsubscribePanel initial={data} />);
    const approveButton = screen.getByRole("button", { name: /approve/i }) as HTMLButtonElement;
    expect(approveButton.disabled).toBe(true);
    expect(approveButton.getAttribute("title")).toMatch(/rfc 8058|one-click/i);
  });

  it("Refresh GETs the panel and replaces the data", async () => {
    const initialData = panelData([row({ sender_email: "old@example.com", decision: null })]);
    const refreshedData = panelData([row({ sender_email: "new@example.com", decision: null })]);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => refreshedData,
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<UnsubscribePanel initial={initialData} />);
    expect(screen.getByText("old@example.com")).toBeTruthy();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /refresh/i }));
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/gmail/unsubscribe/panel");
    });

    expect(screen.getByText("new@example.com")).toBeTruthy();
    expect(screen.queryByText("old@example.com")).toBeNull();
  });

  it("ignores a second click while a decision is in flight", async () => {
    const data = panelData([
      row({ sender_email: "pending@example.com", method: "rfc8058-post", decision: null }),
    ]);
    let resolveFetch: (value: unknown) => void = () => {};
    const fetchMock = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<UnsubscribePanel initial={data} />);
    const approveButton = screen.getByRole("button", { name: /approve/i });

    act(() => {
      fireEvent.click(approveButton);
      fireEvent.click(approveButton);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveFetch({
        ok: true,
        json: async () => ({
          ok: true,
          decision: {
            id: 1,
            sender_email: "pending@example.com",
            decision: "approve",
            decided_at: "2026-08-21T00:00:00.000Z",
            note: null,
          },
        }),
      });
    });
  });
});
