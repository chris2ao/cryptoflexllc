import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/test-page"),
}));

vi.mock("web-vitals", () => ({
  onLCP: vi.fn(),
  onINP: vi.fn(),
  onCLS: vi.fn(),
  onFCP: vi.fn(),
  onTTFB: vi.fn(),
}));

describe("WebVitalsReporter", () => {
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
    global.fetch = fetchSpy as unknown as typeof global.fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("registers all 5 web vital callbacks on mount", async () => {
    const { onLCP, onINP, onCLS, onFCP, onTTFB } = await import("web-vitals");
    const { WebVitalsReporter } = await import("./web-vitals-reporter");

    render(<WebVitalsReporter />);

    expect(onLCP).toHaveBeenCalledTimes(1);
    expect(onINP).toHaveBeenCalledTimes(1);
    expect(onCLS).toHaveBeenCalledTimes(1);
    expect(onFCP).toHaveBeenCalledTimes(1);
    expect(onTTFB).toHaveBeenCalledTimes(1);
  });

  it("sends metric via sendBeacon when callback fires", async () => {
    const { onLCP } = await import("web-vitals");
    const { WebVitalsReporter } = await import("./web-vitals-reporter");

    render(<WebVitalsReporter />);

    // Get the callback registered with onLCP and invoke it
    const lcpCallback = vi.mocked(onLCP).mock.calls[0][0];
    lcpCallback({
      name: "LCP",
      value: 2500,
      rating: "good",
      navigationType: "navigate",
      id: "v1-123",
      delta: 2500,
      entries: [],
    });

    expect(sendBeaconSpy).toHaveBeenCalledWith(
      "/api/analytics/vitals",
      expect.any(Blob)
    );
  });

  it("falls back to fetch when sendBeacon is not available", async () => {
    Object.defineProperty(navigator, "sendBeacon", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const { onFCP } = await import("web-vitals");
    const { WebVitalsReporter } = await import("./web-vitals-reporter");

    render(<WebVitalsReporter />);

    // Fire the callback
    const fcpCallback = vi.mocked(onFCP).mock.calls[0][0];
    fcpCallback({
      name: "FCP",
      value: 1800,
      rating: "needs-improvement",
      navigationType: "navigate",
      id: "v1-456",
      delta: 1800,
      entries: [],
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/analytics/vitals",
      expect.objectContaining({
        method: "POST",
        keepalive: true,
      })
    );
  });

  it("renders nothing", async () => {
    const { WebVitalsReporter } = await import("./web-vitals-reporter");
    const { container } = render(<WebVitalsReporter />);
    expect(container.firstChild).toBeNull();
  });
});
