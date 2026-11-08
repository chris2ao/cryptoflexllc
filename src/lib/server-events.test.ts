import { describe, it, expect, vi, beforeEach } from "vitest";

const calls: Array<{ text: string; values: unknown[] }> = [];
let mode: "ok" | "reject" | "throw" = "ok";
const sql = (strings: TemplateStringsArray, ...values: unknown[]) => {
  calls.push({ text: strings.join("?"), values });
  return mode === "reject" ? Promise.reject(new Error("x")) : Promise.resolve([]);
};
vi.mock("@/lib/analytics", () => ({
  getDb: () => {
    if (mode === "throw") throw new Error("no db");
    return sql;
  },
}));

import { recordServerEvent } from "./server-events";

beforeEach(() => {
  calls.length = 0;
  mode = "ok";
});

describe("recordServerEvent", () => {
  it("inserts a row with the message truncated to 500", () => {
    recordServerEvent("/api/x", "db-error", "m".repeat(800));
    expect(calls[0].text).toContain("INSERT INTO server_events");
    expect(calls[0].values[0]).toBe("/api/x");
    expect(calls[0].values[1]).toBe("db-error");
    expect((calls[0].values[2] as string).length).toBe(500);
  });

  it("swallows a rejected insert", async () => {
    mode = "reject";
    expect(() => recordServerEvent("/a", "k", "m")).not.toThrow();
    await new Promise((r) => setTimeout(r, 0));
  });

  it("swallows getDb throwing", () => {
    mode = "throw";
    expect(() => recordServerEvent("/a", "k", "m")).not.toThrow();
  });
});
