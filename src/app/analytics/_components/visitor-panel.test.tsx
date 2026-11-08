import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { VisitorPanelHost } from "./visitor-panel";
import { IpLink, openVisitor } from "./ip-link";

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

  it("shows the session message on a 401 from both endpoints", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 401, json: async () => ({}) })));
    render(<VisitorPanelHost />);
    act(() => openVisitor("8.8.8.8"));
    await waitFor(() =>
      expect(screen.getByText("Session expired. Reload the dashboard.")).toBeTruthy(),
    );
    expect(screen.getByText("Session expired")).toBeTruthy();
  });

  it("shows the generic history message on a 500", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 500, json: async () => ({}) })));
    render(<VisitorPanelHost />);
    act(() => openVisitor("8.8.8.8"));
    await waitFor(() => expect(screen.getByText("Visitor history unavailable")).toBeTruthy());
  });

  it("starts both fetches before either resolves", async () => {
    const urls: string[] = [];
    vi.stubGlobal("fetch", vi.fn((url: string) => { urls.push(url); return new Promise(() => undefined); }));
    render(<VisitorPanelHost />);
    act(() => openVisitor("8.8.8.8"));
    expect(urls).toHaveLength(2);
  });

  it("returns focus to the opener on close", async () => {
    render(
      <>
        <IpLink ip="8.8.8.8" />
        <VisitorPanelHost />
      </>,
    );
    const opener = screen.getByRole("button", { name: /Open visitor details/ });
    opener.focus();
    fireEvent.click(opener);
    await waitFor(() => expect(screen.getByText("History")).toBeTruthy());
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(document.activeElement).toBe(opener);
  });

  it("ignores a late response for a previous IP", async () => {
    const pending: Record<string, (v: unknown) => void> = {};
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        const ip = new URL(url, "http://x").searchParams.get("ip") ?? "";
        const kind = url.includes("/visitor") ? "d" : "e";
        return new Promise((resolve) => { pending[`${kind}:${ip}`] = resolve; });
      }),
    );
    render(<VisitorPanelHost />);
    act(() => openVisitor("1.1.1.1"));
    act(() => openVisitor("2.2.2.2"));
    await act(async () => {
      pending["d:2.2.2.2"]({ ok: true, json: async () => ({ dossier: { ...DOSSIER, ip: "2.2.2.2", hits: 22 } }) });
      pending["e:2.2.2.2"]({ ok: true, json: async () => ({ enrichment: { ...ENRICH, ip: "2.2.2.2", company: "Bee Co" } }) });
    });
    await waitFor(() => expect(screen.getByText("Bee Co")).toBeTruthy());
    await act(async () => {
      pending["d:1.1.1.1"]({ ok: true, json: async () => ({ dossier: { ...DOSSIER, ip: "1.1.1.1", hits: 11 } }) });
      pending["e:1.1.1.1"]({ ok: true, json: async () => ({ enrichment: { ...ENRICH, ip: "1.1.1.1", company: "Ay Co" } }) });
    });
    expect(screen.getByRole("heading", { name: "2.2.2.2" })).toBeTruthy();
    expect(screen.getByText("Bee Co")).toBeTruthy();
    expect(screen.queryByText("Ay Co")).toBeNull();
  });
});
