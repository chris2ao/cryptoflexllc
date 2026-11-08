import { createSign } from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const TIMEOUT_MS = 8000;
const REFRESH_MARGIN_MS = 60_000;

export type ServiceCreds = { clientEmail: string; privateKey: string };

export type SearchAnalyticsRow = {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type SearchAnalyticsQuery = {
  siteUrl: string;
  startDate: string;
  endDate: string;
  dimensions: Array<"query" | "page" | "date">;
  rowLimit?: number;
};

let tokenCache: { token: string; expiresAtMs: number } | null = null;

export function resetTokenCacheForTests(): void {
  tokenCache = null;
}

export function isSearchConsoleConfigured(): boolean {
  return ["GSC_CLIENT_EMAIL", "GSC_PRIVATE_KEY", "GSC_SITE_URL"].every(
    (name) => (process.env[name] ?? "").trim().length > 0,
  );
}

export function normalisePrivateKey(raw: string): string {
  return raw
    .trim()
    .replace(/^["']+|["']+$/g, "")
    .replace(/\\n/g, "\n");
}

export function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

export function buildServiceAccountJwt(creds: ServiceCreds, nowSeconds: number): string {
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: creds.clientEmail,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: nowSeconds,
      exp: nowSeconds + 3600,
    }),
  );
  const signingInput = `${header}.${claims}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  const signature = signer.sign(normalisePrivateKey(creds.privateKey));
  return `${signingInput}.${base64url(signature)}`;
}

export async function getAccessToken(
  creds: ServiceCreds,
  fetchImpl: typeof fetch = fetch,
  now: number = Date.now(),
): Promise<string> {
  if (tokenCache && now < tokenCache.expiresAtMs - REFRESH_MARGIN_MS) {
    return tokenCache.token;
  }
  const assertion = buildServiceAccountJwt(creds, Math.floor(now / 1000));
  const res = await fetchImpl(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }).toString(),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`Search Console token request failed (${res.status})`);
  }
  const json = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!json.access_token) {
    throw new Error("Search Console token response had no access token");
  }
  const expiresIn = typeof json.expires_in === "number" ? json.expires_in : 3600;
  tokenCache = { token: json.access_token, expiresAtMs: now + expiresIn * 1000 };
  return json.access_token;
}

export async function fetchSearchAnalytics(
  q: SearchAnalyticsQuery,
  fetchImpl: typeof fetch = fetch,
): Promise<SearchAnalyticsRow[]> {
  try {
    const token = await getAccessToken(
      {
        clientEmail: process.env.GSC_CLIENT_EMAIL ?? "",
        privateKey: process.env.GSC_PRIVATE_KEY ?? "",
      },
      fetchImpl,
    );
    const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      q.siteUrl,
    )}/searchAnalytics/query`;
    const res = await fetchImpl(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: q.startDate,
        endDate: q.endDate,
        dimensions: q.dimensions,
        rowLimit: q.rowLimit ?? 10,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.warn(`Search Console query failed (${res.status})`);
      return [];
    }
    const json = (await res.json()) as { rows?: Array<Partial<SearchAnalyticsRow>> };
    return (json.rows ?? []).map((r) => ({
      keys: Array.isArray(r.keys) ? r.keys.map(String) : [],
      clicks: Number(r.clicks ?? 0),
      impressions: Number(r.impressions ?? 0),
      ctr: Number(r.ctr ?? 0),
      position: Number(r.position ?? 0),
    }));
  } catch (err) {
    // Log the error class only: messages could carry request context.
    console.warn("Search Console request failed:", err instanceof Error ? err.name : "unknown");
    return [];
  }
}

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function searchConsoleWindow(
  days: number,
  now: Date = new Date(),
): { startDate: string; endDate: string } {
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 2));
  const start = new Date(end.getTime() - days * 86_400_000);
  return { startDate: isoDay(start), endDate: isoDay(end) };
}
