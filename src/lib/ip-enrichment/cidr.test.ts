import { describe, it, expect } from "vitest";
import { ipv4ToInt, ipInCidrs } from "./cidr";
import { parseDrop } from "./providers/spamhaus-drop";

describe("cidr", () => {
  it("converts IPv4 and rejects bad input", () => {
    expect(ipv4ToInt("0.0.0.1")).toBe(1);
    expect(ipv4ToInt("1.10.16.5")).toBe(17436677);
    expect(ipv4ToInt("256.1.1.1")).toBeNull();
    expect(ipv4ToInt("::1")).toBeNull();
  });

  it("matches inside a prefix and rejects outside and IPv6", () => {
    const cidrs = parseDrop("; header\n1.10.16.0/20 ; SBL256894\n");
    expect(ipInCidrs("1.10.16.5", cidrs)).toBe(true);
    expect(ipInCidrs("1.10.31.255", cidrs)).toBe(true);
    expect(ipInCidrs("1.10.32.1", cidrs)).toBe(false);
    expect(ipInCidrs("::1", cidrs)).toBe(false);
    expect(ipInCidrs("garbage", cidrs)).toBe(false);
  });

  it("parseDrop ignores comments and blank lines", () => {
    expect(parseDrop("; Spamhaus\n\n; x\n2.2.2.0/24 ; SBL1\n")).toHaveLength(1);
  });
});
