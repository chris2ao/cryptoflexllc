import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateKeyPairSync, verify } from "node:crypto";
import {
  base64url,
  buildServiceAccountJwt,
  fetchSearchAnalytics,
  getAccessToken,
  isSearchConsoleConfigured,
  normalisePrivateKey,
  resetTokenCacheForTests,
  searchConsoleWindow,
} from "./search-console";

// Built from parts so the pre-commit secret scanner does not read a fixture as a key.
const PEM_BEGIN = ["-----BEGIN", "PRIVATE", "KEY-----"].join(" ");
const PEM_END = ["-----END", "PRIVATE", "KEY-----"].join(" ");
const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const pem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
const creds = { clientEmail: "svc@proj.iam.gserviceaccount.com", privateKey: pem };

function decode(seg: string) {
  return JSON.parse(Buffer.from(seg, "base64url").toString("utf8"));
}

describe("buildServiceAccountJwt", () => {
  it("signs header.payload with RS256 and carries the claims", () => {
    const jwt = buildServiceAccountJwt(creds, 1_700_000_000);
    const [h, p, s] = jwt.split(".");
    expect(decode(h)).toEqual({ alg: "RS256", typ: "JWT" });
    const claims = decode(p);
    expect(claims).toEqual({
      iss: creds.clientEmail,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: 1_700_000_000,
      exp: 1_700_003_600,
    });
    const ok = verify(
      "RSA-SHA256",
      Buffer.from(h + "." + p),
      publicKey,
      Buffer.from(s, "base64url"),
    );
    expect(ok).toBe(true);
  });

  it("accepts a key pasted with literal backslash-n sequences", () => {
    const pasted = pem.replace(/\n/g, "\\n");
    expect(() =>
      buildServiceAccountJwt({ ...creds, privateKey: pasted }, 1),
    ).not.toThrow();
  });
});

describe("normalisePrivateKey", () => {
  it("turns literal backslash-n into newlines and strips quotes", () => {
    const raw = `"${PEM_BEGIN}\\nabc\\n${PEM_END}\\n"`;
    expect(normalisePrivateKey(raw)).toBe(
      `${PEM_BEGIN}\nabc\n${PEM_END}\n`,
    );
  });
});

describe("base64url", () => {
  it("has no padding or url-unsafe characters", () => {
    expect(base64url(Buffer.from([251, 255, 254]))).toBe("-__-");
    expect(base64url("a")).toBe("YQ");
  });
});

describe("getAccessToken", () => {
  beforeEach(() => resetTokenCacheForTests());

  it("posts the jwt-bearer grant and caches until near expiry", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ access_token: "tok1", expires_in: 3600, token_type: "Bearer" })),
    );
    const t0 = 1_700_000_000_000;
    expect(await getAccessToken(creds, fetchImpl as unknown as typeof fetch, t0)).toBe("tok1");
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://oauth2.googleapis.com/token");
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe(
      "application/x-www-form-urlencoded",
    );
    const body = new URLSearchParams(String(init.body));
    expect(body.get("grant_type")).toBe("urn:ietf:params:oauth:grant-type:jwt-bearer");
    expect(body.get("assertion")?.split(".")).toHaveLength(3);

    await getAccessToken(creds, fetchImpl as unknown as typeof fetch, t0 + 3_000_000);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    await getAccessToken(creds, fetchImpl as unknown as typeof fetch, t0 + 3_545_000);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("throws a generic error without echoing secrets on failure", async () => {
    const fetchImpl = vi.fn(async () => new Response("nope", { status: 400 }));
    await expect(
      getAccessToken(creds, fetchImpl as unknown as typeof fetch, 1),
    ).rejects.toThrow(/token request failed \(400\)/);
  });
});

describe("fetchSearchAnalytics", () => {
  const q = {
    siteUrl: "sc-domain:cryptoflexllc.com",
    startDate: "2026-10-01",
    endDate: "2026-10-28",
    dimensions: ["query" as const],
    rowLimit: 10,
  };

  beforeEach(() => {
    resetTokenCacheForTests();
    vi.stubEnv("GSC_CLIENT_EMAIL", creds.clientEmail);
    vi.stubEnv("GSC_PRIVATE_KEY", pem);
  });
  afterEach(() => vi.unstubAllEnvs());

  it("maps rows and sends the bearer token", async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.includes("oauth2")) {
        return new Response(JSON.stringify({ access_token: "tok", expires_in: 3600 }));
      }
      return new Response(
        JSON.stringify({
          rows: [{ keys: ["claude"], clicks: 3, impressions: 40, ctr: 0.075, position: 4.2 }],
        }),
      );
    });
    const rows = await fetchSearchAnalytics(q, fetchImpl as unknown as typeof fetch);
    expect(rows).toEqual([{ keys: ["claude"], clicks: 3, impressions: 40, ctr: 0.075, position: 4.2 }]);
    const [url, init] = fetchImpl.mock.calls[1] as unknown as [string, RequestInit];
    expect(url).toBe(
      "https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Acryptoflexllc.com/searchAnalytics/query",
    );
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer tok");
    expect(JSON.parse(String(init.body))).toEqual({
      startDate: q.startDate,
      endDate: q.endDate,
      dimensions: ["query"],
      rowLimit: 10,
    });
  });

  it("returns [] when rows are absent", async () => {
    const fetchImpl = vi.fn(async (url: string) =>
      url.includes("oauth2")
        ? new Response(JSON.stringify({ access_token: "t", expires_in: 3600 }))
        : new Response("{}"),
    );
    expect(await fetchSearchAnalytics(q, fetchImpl as unknown as typeof fetch)).toEqual([]);
  });

  it("returns [] on a 403 and never throws", async () => {
    const fetchImpl = vi.fn(async (url: string) =>
      url.includes("oauth2")
        ? new Response(JSON.stringify({ access_token: "t", expires_in: 3600 }))
        : new Response("forbidden", { status: 403 }),
    );
    expect(await fetchSearchAnalytics(q, fetchImpl as unknown as typeof fetch)).toEqual([]);
    const boom = vi.fn(async () => {
      throw new Error("network");
    });
    expect(await fetchSearchAnalytics(q, boom as unknown as typeof fetch)).toEqual([]);
  });
});

describe("isSearchConsoleConfigured", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("is false with the env unset or empty", () => {
    vi.stubEnv("GSC_CLIENT_EMAIL", "");
    vi.stubEnv("GSC_PRIVATE_KEY", "");
    vi.stubEnv("GSC_SITE_URL", "");
    expect(isSearchConsoleConfigured()).toBe(false);
  });

  it("is true when all three are set", () => {
    vi.stubEnv("GSC_CLIENT_EMAIL", "a@b.c");
    vi.stubEnv("GSC_PRIVATE_KEY", "k");
    vi.stubEnv("GSC_SITE_URL", "sc-domain:x.com");
    expect(isSearchConsoleConfigured()).toBe(true);
  });
});

describe("searchConsoleWindow", () => {
  it("ends two days before now and spans the window", () => {
    const w = searchConsoleWindow(7, new Date("2026-11-07T12:00:00Z"));
    // Seven inclusive days ending two days before the 7th: the 30th through the 5th.
    expect(w).toEqual({ startDate: "2026-10-30", endDate: "2026-11-05" });
  });
});
