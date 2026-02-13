import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { AnalyticsTracker } from "./analytics-tracker";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/test-page"),
}));

describe("AnalyticsTracker", () => {
  let sendBeaconSpy: ReturnType<typeof vi.fn>;
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    sendBeaconSpy = vi.fn(() => true);
    fetchSpy = vi.fn(() => Promise.resolve(new Response()));
    Object.defineProperty(navigator, "sendBeacon", {
      value: sendBeaconSpy,
      writable: true,
      configurable: true,
    });
    global.fetch = fetchSpy;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls sendBeacon with correct path on mount", () => {
    render(<AnalyticsTracker />);

    expect(sendBeaconSpy).toHaveBeenCalledTimes(1);
    expect(sendBeaconSpy).toHaveBeenCalledWith(
      "/api/analytics/track",
      expect.any(Blob)
    );
  });

  it("falls back to fetch when sendBeacon is not available", () => {
    Object.defineProperty(navigator, "sendBeacon", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    render(<AnalyticsTracker />);

    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/analytics/track",
      expect.objectContaining({
        method: "POST",
        keepalive: true,
      })
    );
  });

  it("renders nothing", () => {
    const { container } = render(<AnalyticsTracker />);
    expect(container.firstChild).toBeNull();
  });
});
