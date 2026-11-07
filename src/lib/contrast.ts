/** WCAG contrast helpers for oklch design tokens. Pure functions only. */

export interface Rgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

const encodeGamma = (linear: number): number => {
  const v = clamp01(linear);
  return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
};

/** Convert oklch (l in 0..1, c, h in degrees) to gamma-encoded sRGB 0..255. */
export function oklchToSrgb(l: number, c: number, h: number): Rgb {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);

  const l_ = Math.pow(l + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m_ = Math.pow(l - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s_ = Math.pow(l - 0.0894841775 * a - 1.291485548 * b, 3);

  const lr = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const lg = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const lb = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;

  return {
    r: encodeGamma(lr) * 255,
    g: encodeGamma(lg) * 255,
    b: encodeGamma(lb) * 255,
  };
}

const decodeChannel = (value255: number): number => {
  const v = value255 / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};

/** WCAG relative luminance of an sRGB colour (0..255 channels). */
export function relativeLuminance(rgb: Rgb): number {
  return (
    0.2126 * decodeChannel(rgb.r) +
    0.7152 * decodeChannel(rgb.g) +
    0.0722 * decodeChannel(rgb.b)
  );
}

/** WCAG contrast ratio between two colours, always >= 1. */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
