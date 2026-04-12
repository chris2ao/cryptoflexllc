# Cyber Editorial Design System
## cryptoflexllc.com — Complete Visual Specification

**Version:** 1.0  
**Date:** 2026-04-12  
**Designer:** UI Visual Designer (ui-visual-designer agent)  
**Status:** Ready for implementation

---

## Design Philosophy

"Cyber Editorial" treats this site the way *Increment* or *MIT Technology Review* treats print: the typography carries authority, the layout creates reading paths, and the visual motifs reinforce the domain without shouting it. Dark is the native mode because cybersecurity professionals work in dark environments and dark-first signals expertise. Teal is the signal color, used sparingly so it retains meaning.

The goal is to feel like a professional published on the web — not a developer who found a pretty template.

---

## 1. Color System

### Design Rationale

The existing primary `oklch(0.52 0.18 195)` is solid but the background palette is generic. The new dark backgrounds use a true near-black with a very slight blue-black tint (hue 240) to harmonize with the teal accent without feeling warm or brown. Card surfaces step up in lightness in small increments to create a clear surface hierarchy.

The light mode uses a warm off-white with slight cool undertone — not pure white, not gray. This prevents the harsh clinical feel while keeping the editorial character.

### CSS Custom Properties — Full Token Set

```css
/* =================================================================
   CYBER EDITORIAL — cryptoflexllc.com
   Drop into src/app/globals.css, replacing existing :root and .dark
   ================================================================= */

/* ----------------------------------------------------------------
   FONT IMPORTS (add to <head> or Next.js font loader — see §2)
   ---------------------------------------------------------------- */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=JetBrains+Mono:wght@400;500&display=swap');

/* ----------------------------------------------------------------
   ROOT TOKENS (Light — secondary mode, still beautiful)
   ---------------------------------------------------------------- */
:root {
  /* --- Radius --- */
  --radius: 0.5rem;             /* 8px base — editorial crispness */

  /* --- Surface Palette --- */
  --background:           oklch(0.97 0.005 245);   /* warm off-white, cool tint */
  --surface-1:            oklch(0.99 0.003 245);   /* pure content areas */
  --surface-2:            oklch(0.94 0.006 245);   /* card backgrounds */
  --surface-3:            oklch(0.90 0.007 245);   /* hover states, inputs */
  --foreground:           oklch(0.13 0.008 245);   /* near-black, not pure */
  --foreground-secondary: oklch(0.35 0.010 245);   /* secondary text */
  --foreground-muted:     oklch(0.52 0.008 245);   /* placeholders, captions */

  /* --- Shadcn/UI semantic aliases --- */
  --card:                 var(--surface-2);
  --card-foreground:      var(--foreground);
  --popover:              var(--surface-1);
  --popover-foreground:   var(--foreground);
  --muted:                var(--surface-3);
  --muted-foreground:     var(--foreground-muted);
  --accent:               var(--surface-3);
  --accent-foreground:    var(--foreground);
  --secondary:            var(--surface-2);
  --secondary-foreground: var(--foreground-secondary);

  /* --- Primary (Teal — from logo) --- */
  --primary:              oklch(0.52 0.18 195);    /* logo teal, unchanged */
  --primary-bright:       oklch(0.60 0.19 192);    /* hover / elevated state */
  --primary-dim:          oklch(0.44 0.14 195);    /* pressed state */
  --primary-subtle:       oklch(0.52 0.18 195 / 0.08); /* tint overlay */
  --primary-foreground:   oklch(0.99 0 0);

  /* --- Semantic Colors --- */
  --success:              oklch(0.56 0.18 155);    /* green */
  --success-foreground:   oklch(0.99 0 0);
  --warning:              oklch(0.72 0.18 72);     /* amber */
  --warning-foreground:   oklch(0.15 0.01 72);
  --destructive:          oklch(0.56 0.22 22);     /* red */
  --destructive-foreground: oklch(0.99 0 0);
  --info:                 oklch(0.52 0.18 195);    /* same as primary */

  /* --- Borders --- */
  --border:               oklch(0.13 0.008 245 / 0.12);
  --border-strong:        oklch(0.13 0.008 245 / 0.22);
  --border-accent:        oklch(0.52 0.18 195 / 0.40);
  --input:                oklch(0.13 0.008 245 / 0.14);
  --ring:                 oklch(0.52 0.18 195);

  /* --- Teal Accent Bar (editorial top-of-card stripe) --- */
  --accent-bar:           oklch(0.52 0.18 195);

  /* --- Shadows (light mode: subtle) --- */
  --shadow-sm:  0 1px 2px oklch(0 0 0 / 0.05), 0 1px 3px oklch(0 0 0 / 0.04);
  --shadow-md:  0 4px 6px oklch(0 0 0 / 0.06), 0 2px 4px oklch(0 0 0 / 0.04);
  --shadow-lg:  0 10px 15px oklch(0 0 0 / 0.08), 0 4px 6px oklch(0 0 0 / 0.04);
  --shadow-xl:  0 20px 25px oklch(0 0 0 / 0.10), 0 8px 10px oklch(0 0 0 / 0.05);

  /* --- Cyber Motif Colors --- */
  --grid-line:            oklch(0.52 0.18 195 / 0.06);  /* circuit grid opacity */
  --scanline:             oklch(0 0 0 / 0.025);           /* scanline stripe */

  /* --- Sidebar (unchanged token names for Shadcn compat) --- */
  --sidebar:              var(--surface-2);
  --sidebar-foreground:   var(--foreground);
  --sidebar-primary:      var(--primary);
  --sidebar-primary-foreground: var(--primary-foreground);
  --sidebar-accent:       var(--surface-3);
  --sidebar-accent-foreground: var(--foreground);
  --sidebar-border:       var(--border);
  --sidebar-ring:         var(--ring);

  /* --- Chart colors (keep for compatibility) --- */
  --chart-1: oklch(0.52 0.18 195);
  --chart-2: oklch(0.50 0.20 162);
  --chart-3: oklch(0.60 0.20 70);
  --chart-4: oklch(0.50 0.25 303);
  --chart-5: oklch(0.50 0.23 16);
}

/* ----------------------------------------------------------------
   DARK THEME (primary mode — this is the home state)
   ---------------------------------------------------------------- */
.dark {
  /* --- Surface Palette --- */
  /* Step logic: each surface is +0.04–0.05 lightness above the last */
  --background:           oklch(0.10 0.008 245);   /* near-black, blue-tinted */
  --surface-1:            oklch(0.13 0.010 245);   /* page content areas */
  --surface-2:            oklch(0.17 0.010 245);   /* card backgrounds */
  --surface-3:            oklch(0.22 0.011 245);   /* elevated cards, inputs */
  --surface-4:            oklch(0.28 0.010 245);   /* hover states */
  --foreground:           oklch(0.95 0.005 245);   /* off-white, not pure */
  --foreground-secondary: oklch(0.78 0.008 245);   /* secondary text */
  --foreground-muted:     oklch(0.55 0.010 245);   /* placeholders, captions */

  /* --- Shadcn/UI semantic aliases --- */
  --card:                 var(--surface-2);
  --card-foreground:      var(--foreground);
  --popover:              var(--surface-3);
  --popover-foreground:   var(--foreground);
  --muted:                var(--surface-3);
  --muted-foreground:     var(--foreground-muted);
  --accent:               var(--surface-3);
  --accent-foreground:    var(--foreground);
  --secondary:            var(--surface-3);
  --secondary-foreground: var(--foreground-secondary);

  /* --- Primary (Teal — brighter in dark to compensate for luminance) --- */
  --primary:              oklch(0.72 0.17 192);    /* bright teal on dark */
  --primary-bright:       oklch(0.80 0.16 192);    /* hover */
  --primary-dim:          oklch(0.62 0.16 195);    /* pressed */
  --primary-subtle:       oklch(0.72 0.17 192 / 0.10); /* tint overlay */
  --primary-foreground:   oklch(0.10 0.008 245);   /* dark bg for contrast */

  /* --- Semantic Colors --- */
  --success:              oklch(0.72 0.17 155);
  --success-foreground:   oklch(0.12 0.010 155);
  --warning:              oklch(0.82 0.16 72);
  --warning-foreground:   oklch(0.15 0.010 72);
  --destructive:          oklch(0.70 0.19 22);
  --destructive-foreground: oklch(0.99 0 0);
  --info:                 var(--primary);

  /* --- Borders --- */
  --border:               oklch(1 0 0 / 0.08);
  --border-strong:        oklch(1 0 0 / 0.16);
  --border-accent:        oklch(0.72 0.17 192 / 0.35);
  --input:                oklch(1 0 0 / 0.10);
  --ring:                 oklch(0.72 0.17 192);

  /* --- Teal Accent Bar --- */
  --accent-bar:           oklch(0.72 0.17 192);

  /* --- Shadows (dark mode: stronger, glow-capable) --- */
  --shadow-sm:  0 1px 2px oklch(0 0 0 / 0.30), 0 1px 3px oklch(0 0 0 / 0.25);
  --shadow-md:  0 4px 8px oklch(0 0 0 / 0.35), 0 2px 4px oklch(0 0 0 / 0.25);
  --shadow-lg:  0 10px 20px oklch(0 0 0 / 0.40), 0 4px 8px oklch(0 0 0 / 0.30);
  --shadow-xl:  0 20px 40px oklch(0 0 0 / 0.50), 0 8px 16px oklch(0 0 0 / 0.35);
  --shadow-teal-glow: 0 0 24px oklch(0.72 0.17 192 / 0.25);

  /* --- Cyber Motif Colors --- */
  --grid-line:            oklch(0.72 0.17 192 / 0.06);
  --scanline:             oklch(1 0 0 / 0.015);

  /* --- Sidebar --- */
  --sidebar:              var(--surface-2);
  --sidebar-foreground:   var(--foreground);
  --sidebar-primary:      var(--primary);
  --sidebar-primary-foreground: var(--primary-foreground);
  --sidebar-accent:       var(--surface-3);
  --sidebar-accent-foreground: var(--foreground);
  --sidebar-border:       var(--border);
  --sidebar-ring:         var(--ring);

  /* --- Chart colors --- */
  --chart-1: oklch(0.72 0.17 192);
  --chart-2: oklch(0.70 0.17 162);
  --chart-3: oklch(0.77 0.19 70);
  --chart-4: oklch(0.63 0.26 303);
  --chart-5: oklch(0.64 0.25 16);
}
```

---

## 2. Typography System

### Font Selection Rationale

| Role | Font | Why |
|------|------|-----|
| Heading | **Space Grotesk** | Geometric but with deliberate quirks (the angled terminals on letters like 'a', 'e', 'r'). Used by Vercel docs, Resend, Liveblocks. Looks designed, not defaulted. Strong weight contrast. |
| Body / Long-form | **Source Serif 4** | Variable optical-size serif from Adobe. Exceptional readability at 16-18px. Gives the editorial authority of a print magazine. Pairs beautifully with a geometric sans. |
| Monospace | **JetBrains Mono** | Premium coding font with ligatures, designed specifically for code. Better than Geist Mono for editorial contexts — slightly more personality. |

**Alternatives considered and rejected:**
- Syne (too decorative, loses legibility at body sizes)
- DM Sans (too plain, not distinctive enough)
- Fraunces (good quirk but too literary for cybersecurity)
- Raleway (overused in the template market)
- Clash Display (too trendy, will age poorly)

### Next.js Font Loader Implementation

```typescript
// src/app/layout.tsx — replace Geist imports with:
import { Space_Grotesk, Source_Serif_4, JetBrains_Mono } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz"],          // optical size axis — critical for quality
  weight: ["400", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

// In RootLayout body className:
className={`${spaceGrotesk.variable} ${sourceSerif4.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}
```

### CSS Typography Tokens

```css
/* Add to globals.css @theme inline block */
--font-heading: var(--font-heading), "Space Grotesk", system-ui, sans-serif;
--font-body:    var(--font-body), "Source Serif 4", Georgia, serif;
--font-mono:    var(--font-mono), "JetBrains Mono", "Fira Code", monospace;
--font-sans:    var(--font-heading);  /* Shadcn compat alias */
```

### Type Scale (add to globals.css)

```css
/* -------------------------------------------------------------------
   CYBER EDITORIAL — Typography Scale
   ------------------------------------------------------------------- */
@layer base {
  body {
    font-family: var(--font-body);
    font-size: 1rem;           /* 16px */
    line-height: 1.5;
    font-feature-settings: "kern" 1, "liga" 1, "onum" 1;
  }

  /* Headings use Space Grotesk */
  h1, h2, h3, h4, h5, h6,
  .font-heading {
    font-family: var(--font-heading);
    font-feature-settings: "ss01" 1;  /* Space Grotesk stylistic alt — rounds certain glyphs */
  }

  /* Display — hero, page titles */
  .text-display {
    font-size: clamp(2.5rem, 5vw + 1rem, 4.5rem);  /* 40px → 72px */
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.03em;
    font-family: var(--font-heading);
  }

  /* H1 — 44px desktop, 32px mobile */
  h1, .text-h1 {
    font-size: clamp(2rem, 3vw + 0.5rem, 2.75rem);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.025em;
    font-family: var(--font-heading);
  }

  /* H2 — 30px desktop, 24px mobile */
  h2, .text-h2 {
    font-size: clamp(1.5rem, 2vw + 0.5rem, 1.875rem);
    font-weight: 600;
    line-height: 1.22;
    letter-spacing: -0.015em;
    font-family: var(--font-heading);
  }

  /* H3 — 22px */
  h3, .text-h3 {
    font-size: clamp(1.25rem, 1.5vw + 0.25rem, 1.375rem);
    font-weight: 600;
    line-height: 1.28;
    letter-spacing: -0.01em;
    font-family: var(--font-heading);
  }

  /* H4 — 18px */
  h4, .text-h4 {
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.35;
    letter-spacing: 0;
    font-family: var(--font-heading);
  }

  /* Body — long-form serif */
  .text-body-lg {
    font-size: 1.125rem;   /* 18px */
    line-height: 1.65;     /* optimized for serif reading */
    font-family: var(--font-body);
  }

  .text-body {
    font-size: 1rem;       /* 16px */
    line-height: 1.6;
    font-family: var(--font-body);
  }

  .text-body-sm {
    font-size: 0.875rem;   /* 14px */
    line-height: 1.55;
    font-family: var(--font-body);
  }

  /* UI text — use heading font for interface elements, not body font */
  .text-ui {
    font-family: var(--font-heading);
    font-size: 0.875rem;
    line-height: 1.4;
  }

  /* Caption / metadata */
  .text-caption {
    font-size: 0.75rem;    /* 12px */
    line-height: 1.4;
    letter-spacing: 0.02em;
    font-family: var(--font-heading);
  }

  /* Overline / category labels */
  .text-overline {
    font-size: 0.6875rem;  /* 11px */
    font-weight: 600;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    font-family: var(--font-heading);
  }

  /* Code */
  code, kbd, samp, pre {
    font-family: var(--font-mono);
    font-size: 0.875em;
    font-feature-settings: "liga" 1, "calt" 1;  /* JetBrains ligatures */
  }
}
```

---

## 3. Layout Strategy

### Grid and Spacing

```css
/* Add to globals.css */
:root {
  /* Content columns */
  --container-max:       80rem;    /* 1280px — comfortable reading width */
  --container-narrow:    48rem;    /* 768px — prose, single-column content */
  --container-wide:      90rem;    /* 1440px — hero / marketing sections */

  /* Spacing rhythm — 8px base grid, strictly followed */
  --space-1:  0.25rem;   /*  4px */
  --space-2:  0.5rem;    /*  8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-5:  1.25rem;   /* 20px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */

  /* Section vertical rhythm */
  --section-gap:         clamp(4rem, 8vw, 6rem);
  --section-gap-sm:      clamp(2rem, 4vw, 3rem);
}
```

### Page-Level Layout Patterns

**Blog index:** Two-column grid (sidebar filter + article list) on desktop. Single column on mobile. Cards have 16px gap.

**Blog post:** Max-width 48rem centered prose. TOC sticky-right on large screens (>1100px) as a supplementary rail. No full-width sections inside prose.

**Homepage:** Three sections with clear visual breaks:
1. Hero — full-width with grid texture background, max-width 1280px content
2. Featured posts — 2-column asymmetric grid (1 large + 2 small)
3. About strip — horizontal, editorial pull-quote style

**Portfolio / Skills:** Dense grid with card sizes varying by importance. Not a uniform grid.

---

## 4. Component Styling Guide

### 4.1 Navigation

```
Height: 64px (h-16)
Background dark mode: oklch(0.10 0.008 245 / 0.85) + backdrop-blur-md
Background light mode: oklch(0.97 0.005 245 / 0.90) + backdrop-blur-md
Border bottom: 1px solid var(--border)
Active link: color var(--primary), no background highlight
Hover: color var(--foreground), transition 150ms ease

NO: glowing borders, heavy shadows, full-opacity background
```

**Signature element:** A single 2px horizontal line in `var(--primary)` at the very bottom of the nav, visible only on scroll (appears after 80px scroll). Not the border — separate element that fades in.

### 4.2 Hero Section

```
Background: var(--background) with circuit-grid overlay (see §5)
Min-height: 80vh desktop, auto mobile
Padding: 96px top / 80px bottom desktop; 64px / 48px mobile
```

**Text treatment:**
- Eyebrow label: `text-overline` in `var(--primary)`, letter-spacing 0.10em
- H1: `text-display`, `var(--foreground)`
- Subhead: `text-body-lg`, `var(--foreground-secondary)`, Source Serif 4 — this is intentional: the contrast between the geometric heading and the serif subhead creates editorial tension
- CTA buttons: see §4.5

**Portrait image treatment:**
```css
.hero-portrait {
  border-radius: 12px;
  outline: 1px solid var(--border-accent);
  outline-offset: 4px;
  box-shadow: var(--shadow-xl), var(--shadow-teal-glow);  /* dark mode only */
}
```

### 4.3 Blog Cards

**Anatomy of a Cyber Editorial blog card:**
```
┌─────────────────────────────────────────┐
│ 2px top accent bar (tag-specific color) │
├─────────────────────────────────────────┤
│  CATEGORY   ·  5 min read               │ ← overline text, muted
│                                         │
│  Title in Space Grotesk 600             │ ← 18px, line-height 1.28
│  (truncated to 2 lines)                 │
│                                         │
│  Description in Source Serif 4 400      │ ← 14px, 3 lines max
│                                         │
│  Author · Date                          │ ← caption, muted
└─────────────────────────────────────────┘
```

**Card CSS tokens:**
```css
.blog-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 2px);  /* 10px */
  transition: border-color 200ms ease, box-shadow 200ms ease, transform 150ms ease;
}
.blog-card:hover {
  border-color: var(--border-accent);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.blog-card .accent-bar {
  height: 2px;  /* not 3px — more refined */
  border-radius: 2px 2px 0 0;
}
```

**Tag color system (semantic, not hardcoded):**
Replace `tagColorMap` hex values with CSS custom properties:
```typescript
const TAG_COLORS: Record<string, string> = {
  "Claude Code": "oklch(0.72 0.17 192)",   /* teal */
  "Security":    "oklch(0.65 0.20 22)",    /* red-orange */
  "AI":          "oklch(0.68 0.22 295)",   /* violet */
  "Next.js":     "oklch(0.85 0.005 245)",  /* near-white */
  "DevOps":      "oklch(0.68 0.18 142)",   /* green */
  "Analytics":   "oklch(0.78 0.18 70)",    /* amber */
  "Infrastructure": "oklch(0.62 0.18 240)", /* blue */
};
```

### 4.4 Badges / Category Labels

```css
/* Default badge — replace current secondary variant */
.badge {
  font-family: var(--font-heading);
  font-size: 0.6875rem;      /* 11px */
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 4px;        /* slightly sharp for editorial feel */
  border: 1px solid var(--border);
  background: var(--surface-3);
  color: var(--foreground-secondary);
  transition: background 150ms ease, border-color 150ms ease;
}
.badge:hover,
.badge.active {
  background: var(--primary-subtle);
  border-color: var(--border-accent);
  color: var(--primary);
}
```

### 4.5 Buttons

```css
/* Primary — teal solid */
.btn-primary {
  background: var(--primary);
  color: var(--primary-foreground);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.01em;
  padding: 10px 20px;
  border-radius: var(--radius);
  border: 1px solid transparent;
  transition: background 150ms ease, box-shadow 200ms ease;
  min-height: 44px;  /* touch target */
}
.btn-primary:hover {
  background: var(--primary-bright);
  box-shadow: 0 0 16px oklch(0.72 0.17 192 / 0.30);  /* dark: subtle glow */
}
.btn-primary:active {
  background: var(--primary-dim);
  box-shadow: none;
}

/* Outline — editorial ghost style */
.btn-outline {
  background: transparent;
  color: var(--foreground);
  border: 1px solid var(--border-strong);
  font-family: var(--font-heading);
  font-weight: 500;
  font-size: 0.875rem;
  padding: 10px 20px;
  border-radius: var(--radius);
  transition: border-color 150ms ease, color 150ms ease, background 150ms ease;
  min-height: 44px;
}
.btn-outline:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-subtle);
}

/* Ghost — nav and utility actions */
.btn-ghost {
  background: transparent;
  color: var(--foreground-muted);
  border: none;
  font-family: var(--font-heading);
  font-size: 0.875rem;
  padding: 8px 12px;
  border-radius: var(--radius);
  transition: background 150ms ease, color 150ms ease;
  min-height: 44px;
}
.btn-ghost:hover {
  background: var(--surface-3);
  color: var(--foreground);
}
```

### 4.6 Code Blocks

Code blocks are high-frequency on this site. They need to look premium.

```css
/* Prose code block */
.prose pre {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-left: 3px solid var(--primary);  /* editorial accent */
  border-radius: var(--radius);
  padding: 1.25rem 1.5rem;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.8125rem;  /* 13px — slightly smaller than body */
  line-height: 1.7;
  tab-size: 2;
}
/* Dark mode code blocks get a subtle teal tint */
.dark .prose pre {
  background: oklch(0.13 0.012 225);  /* slightly more saturated/blue than base */
}

/* Inline code */
.prose :not(pre) > code {
  background: var(--surface-3);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 0.15em 0.4em;
  font-size: 0.875em;
  color: var(--primary);
  font-family: var(--font-mono);
}
```

### 4.7 Footer

```
Background: var(--surface-1) (slightly lifted from background in dark, slightly lower in light)
Top border: 1px solid var(--border)
Layout: 3-column grid on desktop (brand left, nav links center, social right)
Padding: 48px top / 32px bottom

Brand column: Logo + 1-line description in text-body-sm / foreground-muted
Copyright: text-caption, foreground-muted
NO: gradient backgrounds, glowing elements, heavy shadows
```

### 4.8 Reading Progress Bar

```css
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: var(--primary);
  z-index: 9999;
  transform-origin: left;
  /* NO box-shadow glow — clean editorial line */
}
/* Dark mode gets a very subtle glow for visibility */
.dark .reading-progress {
  box-shadow: 0 0 8px var(--primary);
}
```

---

## 5. Background Texture and Cyber Motifs

### Philosophy

Motifs must be **atmospheric, not decorative.** A viewer shouldn't consciously notice them on first load — they should only become visible when looking for them. Think of it as texture in a fine paper stock, not a graphic element.

### 5.1 Circuit Grid (Primary Motif)

A repeating dot-grid that suggests circuit board traces without drawing actual circuits. Implemented as a CSS background pattern — zero performance cost, no images.

```css
/* Applied to hero, section backgrounds where emphasis is needed */
.bg-circuit-grid {
  background-image:
    radial-gradient(circle, var(--grid-line) 1px, transparent 1px);
  background-size: 24px 24px;
}

/* Larger grid for full-page backgrounds */
.bg-circuit-grid-lg {
  background-image:
    radial-gradient(circle, var(--grid-line) 1.5px, transparent 1.5px);
  background-size: 40px 40px;
}

/* Combined with a subtle vignette so it fades at edges */
.bg-hero {
  background-color: var(--background);
  background-image:
    radial-gradient(ellipse 80% 60% at 50% 0%, var(--primary-subtle) 0%, transparent 70%),
    radial-gradient(circle, var(--grid-line) 1px, transparent 1px);
  background-size: auto, 24px 24px;
}
```

### 5.2 Scanline Texture (Secondary Motif)

Thin horizontal lines at low opacity — a nod to CRT monitors and terminal screens. Purely atmospheric.

```css
/* Only use on dark mode, on hero or section hero banners */
.dark .texture-scanlines::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(
    to bottom,
    var(--scanline) 0px,
    var(--scanline) 1px,
    transparent 1px,
    transparent 4px
  );
  z-index: 1;
}
```

**Important:** Do not stack both motifs on the same element. Pick one per section.

### 5.3 Teal Gradient Bleed

A subtle radial glow from the top/top-right that suggests ambient light from the teal accent. Use ONLY on the hero — one instance per page at most.

```css
/* The current hero already has this pattern — keep it, just update the opacity/position */
.hero-glow {
  position: absolute;
  top: -20%;
  right: 10%;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    oklch(0.72 0.17 192 / 0.08) 0%,
    transparent 70%
  );
  pointer-events: none;
  filter: blur(40px);
}
```

### 5.4 Corner Bracket Decoration (Accent Element)

Used on featured/highlighted content blocks — a corner bracket motif from technical diagrams.

```css
.bracket-frame {
  position: relative;
}
.bracket-frame::before,
.bracket-frame::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  border-color: var(--primary);
  border-style: solid;
  opacity: 0.5;
}
.bracket-frame::before {
  top: -4px; left: -4px;
  border-width: 2px 0 0 2px;
}
.bracket-frame::after {
  bottom: -4px; right: -4px;
  border-width: 0 2px 2px 0;
}
```

---

## 6. Anti-Pattern List

These patterns are explicitly banned in the Cyber Editorial system. If any appear during implementation, flag and remove them.

### Color Anti-Patterns
- **No purple gradients.** Purple has no relationship to the brand. Purple-teal gradients are the most overused "tech startup" pattern of 2023-2025.
- **No neon glows on body text.** Glow effects are reserved for `var(--shadow-teal-glow)` on the primary button hover state and the portrait image — nowhere else.
- **No rainbow or multi-stop gradients.** One gradient per component, two-stop maximum. The site uses teal, not a spectrum.
- **No pure white (#fff or oklch(1 0 0)).** Always offset with a slight hue — the off-whites in this system have hue 245.
- **No pure black.** Never `#000000`. The darkest background is `oklch(0.10 0.008 245)`.

### Typography Anti-Patterns
- **No ALL CAPS headings.** Overline labels get uppercase treatment; headings do not.
- **No mixing body serif and heading sans at the same size.** Under 18px, use heading font for UI elements. Only long-form prose uses the serif.
- **No font-weight 800+ in body text.** Space Grotesk 700 is the maximum weight. Heavy weights at 18px+ only.
- **No centered body text blocks.** Center-align is for single-line labels, eyebrows, and CTAs only. Paragraphs are always left-aligned.
- **No Geist, Inter, Roboto, or Arial as heading fonts.** These are the three most used fonts in the portfolio/blog template ecosystem.

### Layout Anti-Patterns
- **No uniform 3-column card grids on the homepage.** Every element equal in visual weight = no visual hierarchy. Use size differentiation: 1 large + 2 small, or 1 full-width featured + grid below.
- **No full-bleed images with text directly on top** unless a 50% dark overlay is present.
- **No hero sections with centered text and a big image behind it.** This is the most used SaaS homepage pattern.
- **No sticky sidebars on mobile.** TOC and filters collapse into drawers on screens under 1024px.
- **No more than 3 sections with the circuit grid background** per page. Motif repetition kills the atmosphere.

### Interaction Anti-Patterns
- **No scale transforms on hover.** `transform: scale(1.02)` on cards is overused. Use `translateY(-2px)` and border glow instead.
- **No `outline: none` without replacement.** Focus indicators must remain visible.
- **No bounce or spring easing on UI elements.** This is a professional publication, not a game. `ease-out` and `ease-in-out` only.
- **No skeleton loaders that pulse at high opacity.** Skeleton pulse should be subtle (5-8% contrast from background).

### "AI Slop" Detection Flags
If the implementation shows any of these, stop and revise:
- Alternating feature sections (icon left / text right / icon left / text right)
- Full-page gradient from one brand color to another
- Card shadows that are too prominent (look like floating cards)
- Testimonial carousels
- Animated number counters in the hero
- Glowing animated border on every card on hover

---

## 7. Implementation Checklist

### Phase 1 — Globals (Day 1)
- [ ] Replace font imports in `layout.tsx` (Geist → Space Grotesk + Source Serif 4 + JetBrains Mono)
- [ ] Replace `:root` and `.dark` blocks in `globals.css`
- [ ] Add typography scale classes to `@layer base`
- [ ] Add spacing tokens to `:root`
- [ ] Add shadow tokens and `--shadow-teal-glow`
- [ ] Add circuit grid CSS patterns

### Phase 2 — Core Components (Day 2)
- [ ] Update `nav.tsx`: apply new nav styling, add scroll-triggered accent line
- [ ] Update `hero.tsx`: apply `.bg-hero` texture, `.hero-glow`, portrait border treatment
- [ ] Update `blog-card.tsx`: implement new card anatomy, replace `tagColorMap` hex values with oklch tokens
- [ ] Update `footer.tsx`: new background, 3-column layout

### Phase 3 — Supporting Components (Day 3)
- [ ] Update badge/tag styling
- [ ] Update button variants in shadcn theme
- [ ] Update code block styles in prose
- [ ] Update reading progress bar
- [ ] Verify all 8 interactive states on every component

### Phase 4 — QA
- [ ] Contrast check all text/background combinations (WCAG AA minimum)
- [ ] Test both light and dark themes for equal quality
- [ ] Verify no horizontal scroll on 375px viewport
- [ ] Check focus indicators on keyboard navigation
- [ ] Run Lighthouse for performance impact of new fonts

---

## 8. Quick Reference — Most-Used Tokens

| Purpose | Dark Mode | Light Mode |
|---------|-----------|------------|
| Page background | `oklch(0.10 0.008 245)` | `oklch(0.97 0.005 245)` |
| Card background | `oklch(0.17 0.010 245)` | `oklch(0.94 0.006 245)` |
| Primary text | `oklch(0.95 0.005 245)` | `oklch(0.13 0.008 245)` |
| Secondary text | `oklch(0.78 0.008 245)` | `oklch(0.35 0.010 245)` |
| Muted text | `oklch(0.55 0.010 245)` | `oklch(0.52 0.008 245)` |
| Teal accent | `oklch(0.72 0.17 192)` | `oklch(0.52 0.18 195)` |
| Border | `oklch(1 0 0 / 0.08)` | `oklch(0.13 0.008 245 / 0.12)` |
| Accent border | `oklch(0.72 0.17 192 / 0.35)` | `oklch(0.52 0.18 195 / 0.40)` |
| Heading font | Space Grotesk | Space Grotesk |
| Body font | Source Serif 4 | Source Serif 4 |
| Code font | JetBrains Mono | JetBrains Mono |
