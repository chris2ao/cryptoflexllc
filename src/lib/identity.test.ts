import { describe, it, expect } from "vitest";
import { IDENTITY_LINE, SITE_DESCRIPTION } from "./identity";

describe("identity", () => {
  it("keeps the owner's identity line verbatim", () => {
    expect(IDENTITY_LINE).toBe(
      "Security engineer by day. On my own time I build with AI agents, run a home-lab SOC, and write down what breaks."
    );
  });

  it("builds the site description from the identity line", () => {
    expect(SITE_DESCRIPTION).toBe(`${IDENTITY_LINE} Field notes from CryptoFlex LLC.`);
  });

  it("keeps the description under 160 characters", () => {
    expect(SITE_DESCRIPTION.length).toBeLessThan(160);
  });

  it("contains no em dash", () => {
    expect(IDENTITY_LINE + SITE_DESCRIPTION).not.toContain(String.fromCharCode(8212));
  });
});
