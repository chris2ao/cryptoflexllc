import localFont from "next/font/local";

/*
 * Slide carousel fonts, scoped to .slide-carousel-theme in slide-carousel.css.
 * Kept out of ./index.ts so only routes that render the carousel preload them;
 * the root layout imports ./index.ts, which would put these on every page.
 * The old Google calls set no weights, which loads each font's full variable range.
 */

export const carouselSyne = localFont({
  src: [{ path: "./syne-latin-wght-normal.woff2", weight: "400 800", style: "normal" }],
  variable: "--font-syne",
  display: "swap",
});

export const carouselJetbrainsMono = localFont({
  src: [{ path: "./jetbrains-mono-latin-wght-normal.woff2", weight: "100 800", style: "normal" }],
  variable: "--font-jetbrains-mono",
  display: "swap",
  adjustFontFallback: false,
});

export const carouselOutfit = localFont({
  src: [{ path: "./outfit-latin-wght-normal.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-outfit",
  display: "swap",
});
