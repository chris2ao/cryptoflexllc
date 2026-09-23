/**
 * Large media (slide PDFs, audio briefings) is served from a public Vercel
 * Blob store instead of public/, so it is not copied into every deployment.
 * Keep this origin in sync with the media-src entry in next.config.ts.
 */
export const BLOB_ASSET_ORIGIN = "https://u6qcxb8rfplaydjl.public.blob.vercel-storage.com";

export function isBlobAsset(href: string): boolean {
  try {
    return new URL(href).origin === BLOB_ASSET_ORIGIN;
  } catch {
    return false;
  }
}

/**
 * Browsers ignore the `download` attribute on cross-origin links, so Blob
 * URLs get `download=1`, which makes Blob respond with an attachment
 * Content-Disposition. Same-origin paths are returned unchanged.
 */
export function toDownloadHref(href: string): string {
  if (!isBlobAsset(href)) return href;
  const url = new URL(href);
  url.searchParams.set("download", "1");
  return url.toString();
}
