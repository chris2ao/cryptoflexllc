import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { VisitorPanelHost } from "./visitor-panel";
import { openVisitor } from "./ip-link";

const DOSSIER = {
  ip: "8.8.8.8",
  firstSeen: "2026-11-01T00:00:00.000Z",
  lastSeen: "2026-11-02T00:00:00.000Z",
  hits: 7,
  classes: { human: 5, bot: 2 },
  pages: [{ page_path: "/blog/x", views: 4, last: "2026-11-02T00:00:00.000Z" }],
  userAgents: ["Mozilla/5.0"],
  locations: ["Tampa, Florida, United States"],
  referrerClasses: {},
  engagement: { scrolls: 3, maxDepth: 90, seconds: 125 },
  errors: 0,
  auth: { success: 0, fail: 0 },
  subscriber: false,
  guestbook: 0,
};

const ENRICH = {
  ip: "8.8.8.8",
  asn: "AS15169",
  asName: "GOOGLE",
  company: "Google LLC",
  country: "US",
  city: "Mountain View",
  region: "California",
  latitude: "",
  longitude: "",
  isDatacenter: true,
  isTor: false,
  isProxy: null,
  isVpn: null,
  isAbuser: null,
  abuserScore: "",
  onDrop: false,
  whoisOrg: "Google LLC",
  sources: ["ipapi.is"],
  enrichedAt: "2026-11-07",
};

describe("VisitorPanelHost", () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.show = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute("open");
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.includes("/visitor")) {
          return { ok: true, json: async () => ({ dossier: DOSSIER }) };
        }
        return { ok: true, json: async () => ({ enrichment: ENRICH, cached: true }) };
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("opens on the event, renders sections and unknown chips, and closes", async () => {
    render(<VisitorPanelHost />);
    act(() => openVisitor("8.8.8.8"));

    await waitFor(() => expect(screen.getByText("History")).toBeTruthy());
    expect(HTMLDialogElement.prototype.show).toHaveBeenCalled();
    expect(screen.getByText("Identity")).toBeTruthy();
    await waitFor(() => expect(screen.getByText("Network")).toBeTruthy());
    expect(screen.getByText(/unknown: VPN, proxy, abuser/)).toBeTruthy();
    expect(screen.getByText("datacenter")).toBeTruthy();
    expect(screen.getByText("2:05")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    expect(screen.queryByText("History")).toBeNull();
  });

  it("shows Enrichment unavailable on a non-200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        url.includes("/visitor")
          ? { ok: true, json: async () => ({ dossier: DOSSIER }) }
          : { ok: false, status: 500, json: async () => ({}) },
      ),
    );
    render(<VisitorPanelHost />);
    act(() => openVisitor("8.8.8.8"));
    await waitFor(() =>
      expect(screen.getByText("Enrichment unavailable")).toBeTruthy(),
    );
  });

  it("closes on Escape", async () => {
    render(<VisitorPanelHost />);
    act(() => openVisitor("8.8.8.8"));
    await waitFor(() => expect(screen.getByText("History")).toBeTruthy());
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText("History")).toBeNull();
  });
});
