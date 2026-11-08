import { describe, it, expect } from "vitest";
import { isPrivateIp, isValidIp } from "./ip-validate";

describe("isValidIp", () => {
  it.each(["8.8.8.8", "1.1.1.1", "2606:4700::1111", "::1", "::ffff:1.2.3.4"])("accepts %s", (ip) => {
    expect(isValidIp(ip)).toBe(true);
  });
  it.each(["999.1.1.1", "1.2.3", "abc", "", "fe80::1%eth0", "2606:4700::1111%1"])("rejects %j", (ip) => {
    expect(isValidIp(ip)).toBe(false);
  });
});

describe("isPrivateIp", () => {
  it.each([
    "0.1.2.3", "10.1.2.3", "100.64.0.1", "127.0.0.1", "169.254.1.1", "172.16.0.1", "172.31.255.254",
    "192.0.0.5", "192.0.2.9", "192.168.1.1", "198.18.0.1", "198.19.255.1", "198.51.100.7",
    "203.0.113.7", "224.0.0.1", "239.255.255.255", "240.0.0.1", "255.255.255.255",
    "::", "::1", "100::1", "2001:db8::1", "fc00::1", "fd12:3456::1", "fe80::1", "fea0::1",
    "fec0::1", "ff02::1", "64:ff9b::808:808", "2002:c0a8:101::1", "::ffff:127.0.0.1", "::ffff:7f00:1", "::ffff:10.0.0.1", "::ffff:0a00:0001",
  ])("flags %s as reserved", (ip) => {
    expect(isPrivateIp(ip)).toBe(true);
  });

  it.each(["8.8.8.8", "1.1.1.1", "2606:4700::1111", "172.32.0.1", "100.128.0.1", "::ffff:8.8.8.8", "::ffff:0808:0808"])(
    "does not flag %s",
    (ip) => {
      expect(isValidIp(ip)).toBe(true);
      expect(isPrivateIp(ip)).toBe(false);
    },
  );
});
