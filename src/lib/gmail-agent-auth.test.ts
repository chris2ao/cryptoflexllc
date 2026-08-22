import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { verifyGmailAgentAuth, agentAuthErrorBody } from "./gmail-agent-auth";

const TOKEN = "a".repeat(40);

describe("verifyGmailAgentAuth", () => {
  beforeEach(() => {
    vi.stubEnv("GMAIL_AGENT_API_TOKEN", TOKEN);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns 503 when GMAIL_AGENT_API_TOKEN is not configured", () => {
    vi.unstubAllEnvs();
    vi.stubEnv("GMAIL_AGENT_API_TOKEN", "");

    const request = new Request("http://example.com", {
      headers: { authorization: `Bearer ${TOKEN}` },
    });

    expect(verifyGmailAgentAuth(request)).toEqual({ ok: false, status: 503 });
  });

  it("returns 401 for a wrong token of the same length", () => {
    const request = new Request("http://example.com", {
      headers: { authorization: `Bearer ${"b".repeat(40)}` },
    });

    expect(verifyGmailAgentAuth(request)).toEqual({ ok: false, status: 401 });
  });

  it("returns 401 for a token of a different length without throwing", () => {
    const request = new Request("http://example.com", {
      headers: { authorization: "Bearer short" },
    });

    expect(() => verifyGmailAgentAuth(request)).not.toThrow();
    expect(verifyGmailAgentAuth(request)).toEqual({ ok: false, status: 401 });
  });

  it("returns 401 when the authorization header is missing", () => {
    const request = new Request("http://example.com");

    expect(verifyGmailAgentAuth(request)).toEqual({ ok: false, status: 401 });
  });

  it("returns ok: true for the correct token", () => {
    const request = new Request("http://example.com", {
      headers: { authorization: `Bearer ${TOKEN}` },
    });

    expect(verifyGmailAgentAuth(request)).toEqual({ ok: true });
  });
});

describe("agentAuthErrorBody", () => {
  it("builds a 401 Unauthorized body", () => {
    expect(agentAuthErrorBody(401)).toEqual({
      status: 401,
      body: { error: "Unauthorized" },
    });
  });

  it("builds a 503 not-configured body", () => {
    expect(agentAuthErrorBody(503)).toEqual({
      status: 503,
      body: { error: "Gmail agent authentication not configured" },
    });
  });
});
