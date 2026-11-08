import { describe, it, expect, vi, beforeEach } from "vitest";
import { recordCronRun, withCronRun } from "./cron-runs";

type Call = { text: string; values: unknown[] };
const calls: Call[] = [];
let fail = false;
const sql = ((strings: TemplateStringsArray, ...values: unknown[]) => {
  calls.push({ text: strings.join("?"), values });
  return fail ? Promise.reject(new Error("db down")) : Promise.resolve([]);
}) as never;

beforeEach(() => {
  calls.length = 0;
  fail = false;
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("recordCronRun", () => {
  it("inserts into cron_runs with a truncated note", async () => {
    await recordCronRun(sql, "job", true, 12.6, "x".repeat(900));
    expect(calls[0].text).toContain("INSERT INTO cron_runs");
    expect(calls[0].values[0]).toBe("job");
    expect(calls[0].values[1]).toBe(true);
    expect(calls[0].values[2]).toBe(13);
    expect((calls[0].values[3] as string).length).toBe(500);
  });

  it("never throws when the insert fails", async () => {
    fail = true;
    await expect(recordCronRun(sql, "job", false, 1)).resolves.toBeUndefined();
    expect(console.error).toHaveBeenCalled();
  });
});

describe("withCronRun", () => {
  it("records success and returns the result", async () => {
    const out = await withCronRun(sql, "job", async () => 7, (n) => `n=${n}`);
    expect(out).toBe(7);
    expect(calls[0].values[1]).toBe(true);
    expect(calls[0].values[3]).toBe("n=7");
  });

  it("records failure with the message and rethrows", async () => {
    await expect(
      withCronRun(sql, "job", async () => {
        throw new Error("kaput");
      }),
    ).rejects.toThrow("kaput");
    expect(calls[0].values[1]).toBe(false);
    expect(calls[0].values[3]).toBe("kaput");
  });
});
