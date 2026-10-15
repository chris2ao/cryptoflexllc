import localFont from "next/font/local";

/*
 * Self-hosted fonts. next/font/google fetches from Google at build time and
 * intermittently fails Turbopack builds (vercel/next.js#99114), so the latin
 * variable subsets are vendored here from @fontsource-variable 5.3.x, which
 * republishes Google Fonts' own files. Each family's OFL licence sits beside
 * its files, as the licence requires.
 *
 * Weight ranges match what the old next/font/google calls requested. Two
 * known differences from the Google setup: only the latin subset is vendored,
 * so characters outside it (latin-ext, Greek, Cyrillic) use the fallback font,
 * and JetBrains Mono no longer gets an Arial-based size-adjusted fallback.
 * src/__tests__/self-hosted-fonts.test.ts guards the file references, the
 * licences, and the absence of next/font/google.
 *
 * Site-wide fonts, applied in src/app/layout.tsx and consumed by globals.css.
 * Route-scoped fonts live in their own modules (./carousel.ts) so the root
 * layout does not preload them on every page.
 */

export const spaceGrotesk = localFont({
  src: [{ path: "./space-grotesk-latin-wght-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-heading-var",
  display: "swap",
});

export const sourceSerif4 = localFont({
  src: [
    { path: "./source-serif-4-latin-wght-normal.woff2", weight: "400 600", style: "normal" },
    { path: "./source-serif-4-latin-wght-italic.woff2", weight: "400 600", style: "italic" },
  ],
  variable: "--font-body-var",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const jetbrainsMono = localFont({
  src: [{ path: "./jetbrains-mono-latin-wght-normal.woff2", weight: "400 600", style: "normal" }],
  variable: "--font-mono-var",
  display: "swap",
  adjustFontFallback: false,
});
