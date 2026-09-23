import { describe, it, expect } from "vitest";
import { BLOB_ASSET_ORIGIN, isBlobAsset, toDownloadHref } from "./asset-url";

const blobPdf = `${BLOB_ASSET_ORIGIN}/resources/pihole-mcp-slides.pdf`;

describe("isBlobAsset", () => {
  it("recognizes URLs on the Blob asset origin", () => {
    expect(isBlobAsset(blobPdf)).toBe(true);
  });

  it("rejects same-origin paths", () => {
    expect(isBlobAsset("/blog/x/infographic.webp")).toBe(false);
  });

  it("rejects look-alike hosts", () => {
    expect(
      isBlobAsset("https://u6qcxb8rfplaydjl.public.blob.vercel-storage.com.evil.test/x.pdf"),
    ).toBe(false);
  });
});

describe("toDownloadHref", () => {
  it("adds download=1 to Blob URLs so the browser saves instead of opening", () => {
    expect(toDownloadHref(blobPdf)).toBe(`${blobPdf}?download=1`);
  });

  it("preserves an existing query string", () => {
    expect(toDownloadHref(`${blobPdf}?v=2`)).toBe(`${blobPdf}?v=2&download=1`);
  });

  it("leaves same-origin paths untouched (the download attribute works there)", () => {
    expect(toDownloadHref("/blog/x/infographic.webp")).toBe("/blog/x/infographic.webp");
  });
});
