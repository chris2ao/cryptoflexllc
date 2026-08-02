import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { LiveFeed } from "./live-feed";

const POLL_MS = 4200;
const IDLE_LIMIT_MS = 30 * 60 * 1000;

function setVisibility(state: "visible" | "hidden") {
  Object.defineProperty(document, "visibilityState", {
    value: state,
    configurable: true,
  });
  document.dispatchEvent(new Event("visibilitychange"));
}

/** Advance timers and flush the promise chain inside poll(). */
async function advance(ms: number) {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
}

describe("LiveFeed polling budget", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    setVisibility("visible");
    document.body.dataset.axAuto = "1";
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ events: [], cursor: "" }),
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("polls on an interval while visible", async () => {
    await act(async () => {
      render(<LiveFeed />);
    });
    const initial = fetchMock.mock.calls.length;
    await advance(POLL_MS * 3);
    expect(fetchMock.mock.calls.length).toBeGreaterThan(initial);
  });

  // Regression: a backgrounded tab used to keep polling every 4.2s.
  it("makes no requests while the tab is hidden", async () => {
    await act(async () => {
      render(<LiveFeed />);
    });
    setVisibility("hidden");
    const before = fetchMock.mock.calls.length;
    await advance(POLL_MS * 10);
    expect(fetchMock.mock.calls.length).toBe(before);
  });

  it("resumes polling when the tab becomes visible again", async () => {
    await act(async () => {
      render(<LiveFeed />);
    });
    setVisibility("hidden");
    await advance(POLL_MS * 5);
    const whileHidden = fetchMock.mock.calls.length;

    setVisibility("visible");
    await advance(POLL_MS * 2);
    expect(fetchMock.mock.calls.length).toBeGreaterThan(whileHidden);
  });

  it("auto-pauses and prompts after the idle limit", async () => {
    await act(async () => {
      render(<LiveFeed />);
    });
    expect(screen.queryByText("Still watching?")).toBeNull();

    await advance(IDLE_LIMIT_MS + POLL_MS);

    expect(screen.getByText("Still watching?")).toBeTruthy();
    const afterPause = fetchMock.mock.calls.length;
    await advance(POLL_MS * 10);
    expect(fetchMock.mock.calls.length).toBe(afterPause);
  });

  it("keeps refreshing and restarts the idle window when asked to continue", async () => {
    await act(async () => {
      render(<LiveFeed />);
    });
    await advance(IDLE_LIMIT_MS + POLL_MS);

    await act(async () => {
      fireEvent.click(screen.getByText("Keep refreshing"));
    });
    expect(screen.queryByText("Still watching?")).toBeNull();

    const afterResume = fetchMock.mock.calls.length;
    await advance(POLL_MS * 3);
    expect(fetchMock.mock.calls.length).toBeGreaterThan(afterResume);
  });

  it("stays paused and dismisses the prompt when declined", async () => {
    await act(async () => {
      render(<LiveFeed />);
    });
    await advance(IDLE_LIMIT_MS + POLL_MS);

    await act(async () => {
      fireEvent.click(screen.getByText("Stay paused"));
    });
    expect(screen.queryByText("Still watching?")).toBeNull();

    const afterDecline = fetchMock.mock.calls.length;
    await advance(POLL_MS * 10);
    expect(fetchMock.mock.calls.length).toBe(afterDecline);
  });
});
