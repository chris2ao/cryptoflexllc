import { describe, it, expect, vi } from "vitest";
import { fetchIpapiIs } from "./ipapi-is";

const reply = (body: unknown, status = 200) =>
  vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));

describe("fetchIpapiIs", () => {
  it("anonymous payload keeps the four flags null and maps asn, company, geo", async () => {
    const f = reply({
      ip: "1.2.3.4", is_bogon: false, company: "Free SAS", asn: "AS12322 Free SAS",
      city: "Paris", region: "Ile-de-France", country: "FR", lat: 48.85, lon: 2.35,
    });
    const r = await fetchIpapiIs("1.2.3.4", undefined, f as never);
    expect(r).toMatchObject({
      asn: "AS12322", asName: "Free SAS", company: "Free SAS", country: "FR",
      city: "Paris", region: "Ile-de-France", latitude: "48.85", longitude: "2.35",
      isDatacenter: null, isProxy: null, isVpn: null, isAbuser: null, isTor: false,
    });
    expect(String(f.mock.calls[0][0])).toBe("https://api.ipapi.is/?q=1.2.3.4");
  });

  it("keyed payload maps flags and abuser_score and sends the key", async () => {
    const f = reply({
      company: { name: "Hetzner", abuser_score: "0.0039 (Low)" }, asn: "AS24940 Hetzner Online",
      is_datacenter: true, is_vpn: false, is_proxy: false, is_tor: true, is_abuser: false,
      lat: 1, lon: 2,
    });
    const r = await fetchIpapiIs("5.6.7.8", "k3y", f as never);
    expect(r).toMatchObject({
      company: "Hetzner", abuserScore: "0.0039 (Low)", isDatacenter: true,
      isVpn: false, isProxy: false, isAbuser: false, isTor: true, asn: "AS24940",
    });
    expect(String(f.mock.calls[0][0])).toContain("&key=k3y");
  });

  it("returns {} on http error, bad json and thrown fetch", async () => {
    expect(await fetchIpapiIs("1.2.3.4", undefined, reply({}, 429) as never)).toEqual({});
    expect(await fetchIpapiIs("1.2.3.4", undefined, vi.fn().mockRejectedValue(new Error("x")) as never)).toEqual({});
    const bad = vi.fn().mockResolvedValue(new Response("nope", { status: 200 }));
    expect(await fetchIpapiIs("1.2.3.4", undefined, bad as never)).toEqual({});
  });
});
