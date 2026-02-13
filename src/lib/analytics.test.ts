import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getDb,
  parseBrowser,
  parseOS,
  parseDeviceType,
} from "./analytics";

// Mock @neondatabase/serverless
vi.mock("@neondatabase/serverless", () => ({
  neon: vi.fn((url: string) => {
    return vi.fn(); // Return a mock SQL executor
  }),
}));

describe("analytics", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getDb", () => {
    it("returns a database executor when DATABASE_URL is set", () => {
      process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/db";

      const db = getDb();

      expect(db).toBeDefined();
      expect(typeof db).toBe("function");
    });

    it("throws error if DATABASE_URL is not set", () => {
      delete process.env.DATABASE_URL;

      expect(() => getDb()).toThrow(
        "DATABASE_URL environment variable is not set"
      );
    });

    it("strips psql prefix from DATABASE_URL", () => {
      process.env.DATABASE_URL =
        "psql postgresql://user:pass@localhost:5432/db";

      const db = getDb();

      expect(db).toBeDefined();
    });

    it("strips quotes from DATABASE_URL", () => {
      process.env.DATABASE_URL = "'postgresql://user:pass@localhost:5432/db'";

      const db = getDb();

      expect(db).toBeDefined();
    });

    it("handles psql prefix and quotes together", () => {
      process.env.DATABASE_URL =
        "psql 'postgresql://user:pass@localhost:5432/db'";

      const db = getDb();

      expect(db).toBeDefined();
    });
  });

  describe("parseBrowser", () => {
    it("detects Edge browser", () => {
      const ua =
        "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0";
      expect(parseBrowser(ua)).toBe("Edge 120");
    });

    it("detects Opera browser", () => {
      const ua =
        "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0";
      expect(parseBrowser(ua)).toBe("Opera 106");
    });

    it("detects Brave browser", () => {
      const ua =
        "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Brave/120.0.0.0";
      expect(parseBrowser(ua)).toBe("Brave 120");
    });

    it("detects Vivaldi browser", () => {
      const ua =
        "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Vivaldi/6.5.3206.50";
      expect(parseBrowser(ua)).toBe("Vivaldi 6");
    });

    it("detects Samsung Internet browser", () => {
      const ua =
        "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36";
      expect(parseBrowser(ua)).toBe("Samsung Internet 23");
    });

    it("detects Firefox browser", () => {
      const ua =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0";
      expect(parseBrowser(ua)).toBe("Firefox 121");
    });

    it("detects Chrome iOS browser", () => {
      const ua =
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1";
      expect(parseBrowser(ua)).toBe("Chrome iOS 120");
    });

    it("detects Chrome browser", () => {
      const ua =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
      expect(parseBrowser(ua)).toBe("Chrome 120");
    });

    it("detects Safari browser with Version string", () => {
      const ua =
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15";
      expect(parseBrowser(ua)).toBe("Safari 17");
    });

    it("detects Safari browser without Version string", () => {
      const ua =
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Safari/604.1";
      expect(parseBrowser(ua)).toBe("Safari 604");
    });

    it("detects bots", () => {
      expect(parseBrowser("Googlebot/2.1")).toBe("Bot");
      expect(parseBrowser("Mozilla/5.0 (compatible; Bingbot/2.0)")).toBe("Bot");
      expect(
        parseBrowser(
          "Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)"
        )
      ).toBe("Bot");
    });

    it("returns Other for unknown browsers", () => {
      const ua = "SomeUnknownBrowser/1.0";
      expect(parseBrowser(ua)).toBe("Other");
    });

    it("returns Unknown for empty UA", () => {
      expect(parseBrowser("")).toBe("Unknown");
    });

    it("prioritizes specific browsers over generic Chrome", () => {
      const edgeUA =
        "Mozilla/5.0 AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0";
      expect(parseBrowser(edgeUA)).toBe("Edge 120");
      expect(parseBrowser(edgeUA)).not.toBe("Chrome 120");
    });
  });

  describe("parseOS", () => {
    it("detects Windows 10/11", () => {
      const ua =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
      expect(parseOS(ua)).toBe("Windows 10/11");
    });

    it("detects Windows 8.1", () => {
      const ua = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36";
      expect(parseOS(ua)).toBe("Windows 8.1");
    });

    it("detects Windows 7", () => {
      const ua = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36";
      expect(parseOS(ua)).toBe("Windows 7");
    });

    it("detects macOS with version", () => {
      const ua =
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";
      expect(parseOS(ua)).toBe("macOS 10.15");
    });

    it("detects macOS with underscore separator", () => {
      const ua =
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15";
      expect(parseOS(ua)).toBe("macOS 14.2");
    });

    it("detects Chrome OS", () => {
      const ua =
        "Mozilla/5.0 (X11; CrOS x86_64 15329.0.0) AppleWebKit/537.36";
      expect(parseOS(ua)).toBe("Chrome OS");
    });

    it("detects Android with version", () => {
      const ua =
        "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36";
      expect(parseOS(ua)).toBe("Android 13");
    });

    it("detects iOS with version", () => {
      const ua =
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15";
      expect(parseOS(ua)).toBe("iOS 17");
    });

    it("detects iPadOS with version", () => {
      const ua =
        "Mozilla/5.0 (iPad; CPU iPad OS 17_2 like Mac OS X) AppleWebKit/605.1.15";
      expect(parseOS(ua)).toBe("iPadOS 17");
    });

    it("detects generic Linux", () => {
      const ua =
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
      expect(parseOS(ua)).toBe("Linux");
    });

    it("returns Other for unknown OS", () => {
      const ua = "SomeUnknownOS/1.0";
      expect(parseOS(ua)).toBe("Other");
    });

    it("returns Unknown for empty UA", () => {
      expect(parseOS("")).toBe("Unknown");
    });
  });

  describe("parseDeviceType", () => {
    it("detects bots", () => {
      expect(parseDeviceType("Googlebot/2.1")).toBe("Bot");
      expect(parseDeviceType("Mozilla/5.0 (compatible; Bingbot/2.0)")).toBe(
        "Bot"
      );
      expect(
        parseDeviceType("AhrefsBot/7.0; +http://ahrefs.com/robot/")
      ).toBe("Bot");
    });

    it("detects mobile phones", () => {
      const iphoneUA =
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15";
      expect(parseDeviceType(iphoneUA)).toBe("Mobile");

      const androidUA =
        "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
      expect(parseDeviceType(androidUA)).toBe("Mobile");
    });

    it("detects tablets", () => {
      const ipadUA =
        "Mozilla/5.0 (iPad; CPU iPad OS 17_2 like Mac OS X) AppleWebKit/605.1.15";
      expect(parseDeviceType(ipadUA)).toBe("Tablet");

      const androidTabletUA =
        "Mozilla/5.0 (Linux; Android 13; SM-X900) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
      expect(parseDeviceType(androidTabletUA)).toBe("Tablet");
    });

    it("detects desktop as default", () => {
      const desktopUA =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
      expect(parseDeviceType(desktopUA)).toBe("Desktop");

      const macUA =
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";
      expect(parseDeviceType(macUA)).toBe("Desktop");
    });

    it("prioritizes bot detection over device type", () => {
      const botUA =
        "Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 (compatible; Googlebot/2.1;";
      expect(parseDeviceType(botUA)).toBe("Bot");
    });

    it("returns Unknown for empty UA", () => {
      expect(parseDeviceType("")).toBe("Unknown");
    });

    it("distinguishes Android mobile from Android tablet", () => {
      const mobileUA =
        "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
      expect(parseDeviceType(mobileUA)).toBe("Mobile");

      const tabletUA =
        "Mozilla/5.0 (Linux; Android 13; SM-X900) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
      expect(parseDeviceType(tabletUA)).toBe("Tablet");
    });
  });
});
