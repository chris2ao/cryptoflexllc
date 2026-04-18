# Handoff: CryptoFlex — Chris Johnson Personal Site Redesign

## Overview

A full redesign of CryptoFlex, a personal engineering lab notebook / portfolio for Chris Johnson. The design pitches the site as an **editorial magazine** crossed with a **developer's live terminal** — long-form writing, selected work, CV, services, and a "now"-style live changelog.

Two versions live in this bundle:

- **`Redesign v1.html`** — the static editorial redesign (baseline).
- **`Redesign v2.html`** — **this is the canonical version.** Same layout and system as v1, plus a full motion layer (scroll reveals, live-tail log, marquee ticker, hover micro-interactions, shimmering accent word).

Build from **v2**. v1 is included only as a reference for the "motion-off" state.

## About the Design Files

The HTML files in this bundle are **design references, not production code**. They were built in a single-file HTML prototype to communicate the intended look, typography, layout, motion, and behavior.

Your task is to **recreate these designs in the target codebase** using its existing stack (React / Next / Astro / Vue / SwiftUI / whatever is already there). Use the existing component library, styling conventions, and routing. Do not ship the HTML as-is.

If the project has no codebase yet, the best fit is a static site framework with MDX for the posts (e.g. **Astro** or **Next.js App Router**) — the design is content-heavy and mostly server-rendered, with a small sprinkle of client-side motion.

## Fidelity

**High-fidelity.** Colors, typography, spacing, layout, and interactions are final. Recreate pixel-perfectly in your codebase's styling system. The one area that is intentionally *placeholder* is imagery — portrait, post cover art, and case-study screenshots are all striped/dot placeholders. Replace with real assets.

## Screens / Views

This is a single long-scrolling page. Top to bottom:

### 1. Masthead (sticky)
- Full-width, 1px bottom border, dark surface.
- **Left:** Brand — `CF` mark (22×22 square, 1px border, teal accent on letters) + "CryptoFlex" + small muted "// chris johnson".
- **Center:** Nav — Journal · Work · About · Services · Subscribe. Active item gets a teal underline that slides in on hover for other items.
- **Right:** `● SHIPPING` status pill (green pulsing dot) + **Subscribe** primary button (teal fill).
- **Motion:** brand mark has a teal scanline sweep on hover; nav underlines slide in; status dot pulses (2.2s infinite).

### 2. Hero (4 variants via tweak)

Default variant is **Identity**. All variants sit in the same `.hero` section.

**Identity hero** (default)
- Two-column grid: left = big wordmark title, right = portrait card.
- **Title:** `Build in public. / [italic serif] Break things [/italic] / [teal] on purpose. [/teal]` — Space Grotesk 700, clamp(44px, 7.5vw, 108px), line-height 1.02, letter-spacing -0.035em. Italic word uses Source Serif 4 italic; teal word is the accent.
- **Italic word underline:** 6px teal bar drawn in via CSS animation (1.4s, 0.4s delay) on load.
- **Accent word shimmer:** slow 6s background-position animation across a teal→lighter-teal gradient.
- **Sub:** 19px serif, 48px margin-top, max-width ~560px, muted foreground.
- **Portrait:** 300×400 placeholder with rangefinder corner brackets (teal L-shapes, top-left + bottom-right). Brackets animate in from offset positions on load.
- **Caption below portrait:** mono 11px — `CHRIS JOHNSON / ENGINEER · BUILDER · RESEARCHER`.

**Featured hero**
- Magazine cover-story layout. Full-width featured image placeholder + overline + giant headline + 2–3 blurb cards.

**Now-log hero**
- Front-and-center terminal panel (`now-panel`) showing a live log of commits/deploys/notes. Blinking teal cursor at the most recent row.

**Cover hero**
- Full-bleed magazine cover: small side metadata column + giant title with italic + teal accent + barcode strip at bottom that strokes in bar-by-bar (40ms stagger).

### 3. Ticker strip
- Full-width thin band, teal/white stats on dark, mono 12px uppercase, tracked 0.1em.
- Items: `POSTS PUBLISHED 68 · TESTS PASSING 589 · CODE COVERAGE 98% · ACTIVE PROJECTS 5 · AGENTS ORCHESTRATED 7 · COMMITS / 7 DAYS 117 · UPTIME / 90 DAYS 99.97% · COFFEE / WEEK 21 cups`.
- Items separated by ◆ diamond.
- **Motion:** continuous marquee scroll, 48s linear infinite. Items are duplicated in the DOM; translate track from 0 → -50%. Pauses on hover.

### 4. Section: § 01 / The Journal (`#posts`)
- Section label pinned top-left (mono 11px, `§ 01 / THE JOURNAL` with a 14px→28px teal rule before it that grows on scroll-into-view).
- Section head: overline + `From the workshop.` display headline + long serif lede + `All posts (68) →` button.
- Grid: **1 featured post** (large, 5/8 cols) + **post list** (3/8 cols, 5 rows).
  - Featured post: cover image placeholder w/ `● Lead Story` tag, category tags, display-font headline, serif body, meta row (read time / date / word count / `Read →`).
  - Post rows: 2-col grid (`32px 1fr`) — index `01`, `02`, … in mono + kicker (teal mono) + headline (Space Grotesk 500, 17px) + byline mono. On hover: subtle teal tint background, headline turns teal, 2px teal underline draws left-to-right under the row.

### 5. Section: § 02 / About the Author (`#about`)
- 2-col: portrait/pull-quote on left, bio prose on right with drop cap.
- Pull quote: serif italic 28px, tracked teal rule-above.

### 6. Section: § 03 / Selected Work (`#work`)
- Grid of 6 work cards. First card is `.work-feat` spanning 2 cols.
- Each card: image placeholder (`.shot`) at top, title + sub + year below, `↗` arrow that translates on hover.
- **Motion:** card lifts 2px on hover; arrow moves up-and-right; featured card's shot has a radial-glow that slowly drifts around; any shot gets subtle pointer parallax.

### 7. Section: § 04 / Consulting (`#services`)
- Grid of 3–4 `.svc` cards.
- Each: eyebrow, h4 title (with teal underline that draws on hover), body, small CTA.

### 8. Section: CV / Timeline
- Single column, 3-col row grid (`120px 1fr auto`): year · role + company · location.
- **Motion:** on row hover, a 3px teal vertical bar grows from the top on the left edge; year color shifts brighter teal.

### 9. Subscribe
- Wide surface with serif headline, prose, email input + button.
- On submit: button text replaces with `✓ Subscribed`, form surface gets a teal-dim gradient sweep.

### 10. Footer
- Slim: brand mark, primary links, social/mono metadata.

## Interactions & Behavior

### Global motion system

Respects `prefers-reduced-motion: reduce` — all motion disables automatically.

Motion is controlled by a single `data-motion` attribute on `<body>`:
- `0` = off
- `1` = subtle (reduced durations, simpler entries)
- `2` = full (default)

And `data-live` controls the live-feed loop:
- `0` = paused
- `1` = streaming (default)

### Scroll reveals
- Targets: every `.section`, `.post-row`, `.cv-row`, `.work`, `.svc`, `.post-hero`, `.overline`, `.section-head > div`, `.section-head .lede`, `.ticker-item`, `.now-row`, `.hero-eyebrow`, `.hero-sub`, `.hero-cta`, `.hero-meta`.
- Initial: `opacity: 0; transform: translateY(14px)`.
- On intersection (threshold 0.08, rootMargin `0px 0px -40px 0px`): add `.in`, transition opacity + transform 700ms `cubic-bezier(.2,.65,.2,1)`.
- Grouped children get a stagger delay: post-rows 60ms, cv-rows 45ms, work cells 80ms, services 60ms, now-rows 30ms.

### Live-tail log
- A pool of ~10 fake events is defined in JS.
- Every 4.2s, a new event is prepended to `.now-panel-body`, with class `.new` (teal-dim background fade-in for 520ms).
- Body trims to 7 rows.
- Only runs when `data-live=1` AND `data-motion!=0`.

### Hero accent shimmer
- `.hero-title .accent`, `.cover-title .accent` use `background-clip: text` on a 3-stop teal gradient; `background-position` animates 0→100%→0 over 6s infinite.

### Hero italic underline draw
- `.hero-title .it::after` — 6px teal bar, `transform: scaleX(0)` → `scaleX(1)` over 1.4s with 0.4s delay, `cubic-bezier(.7,0,.3,1)`.

### Portrait brackets
- Corner L-brackets animate from `translate(±12px, ±12px)` with opacity 0 → 1 over 600ms at 0.7s delay.

### Ticker marquee
- Track translates 0 → -50% over 48s linear infinite. Pauses on hover.

### Post row hover
- 2px teal bar (`::after`) scaleX(0→1) from left, 360ms.

### Work card hover
- Card translateY(-2px), 220ms.
- Arrow translate(3px, -3px).
- `.shot` parallaxes up to 6px based on cursor position within the card.

### CV row hover
- Left edge 3px teal bar scaleY(0→1) from top, 320ms.
- Year color brightens.

### Services hover
- Card background lifts one surface step.
- `h4` gets a 2px teal underline scaleX(0→1) from left, 280ms.

### Status dot
- 6px green dot, `::after` pseudo is a larger green circle animating `scale(1)→scale(2.8)` with opacity 0.6→0 over 2.2s infinite.

### Brand mark scanline
- On hover: a vertical teal gradient band (transparent→teal→transparent) sweeps top→bottom over 420ms.

### Subscribe success
- Form gets `.ok`, button swaps to `✓ Subscribed`, `.meta` background sweeps teal-dim → transparent over 900ms.

### Cover barcode
- Each `<i>` bar animates `scaleY(0→1)` and opacity 0→0.7 with a 40ms stagger, 800ms each.

## State Management

Minimal client state, all captured in `data-*` attributes on `<body>`:

```js
{
  hero: "identity" | "featured" | "now" | "cover",  // Tweak: hero variant
  accent: "teal" | "amber" | "green" | "red" | "violet",  // Tweak: accent color
  theme: "dark" | "light",  // Tweak: theme
  motif: 0 | 1 | 2,  // Tweak: background texture intensity
  motion: 0 | 1 | 2,  // Tweak: motion intensity
  live: 0 | 1  // Tweak: live feed on/off
}
```

In production, **drop the tweak panel entirely** — it's a prototype affordance for exploring variants. Pick one final set of values (recommended: `hero=identity`, `accent=teal`, `theme=dark`, `motif=2`, `motion=2`, `live=1`).

The subscribe form needs real handling (email validation, POST to mailing-list provider). The live-log should fetch real data (e.g. GitHub API commits, deploy webhooks) rather than cycle a fake pool.

## Design Tokens

### Colors (OKLCH)
```css
--bg:         oklch(0.10 0.008 245)     /* page bg */
--surface-1:  oklch(0.13 0.010 245)     /* cards */
--surface-2:  oklch(0.16 0.011 245)     /* elevated */
--surface-3:  oklch(0.20 0.012 245)     /* higher */
--fg:         oklch(0.95 0.005 245)     /* primary text */
--fg-2:       oklch(0.78 0.008 245)     /* secondary text */
--fg-3:       oklch(0.55 0.010 245)     /* tertiary / mono labels */
--fg-4:       oklch(0.40 0.010 245)     /* muted / index numbers */
--accent:     oklch(0.74 0.16 192)      /* teal primary */
--accent-dim: oklch(0.74 0.16 192 / 0.15)
--accent-line:oklch(0.74 0.16 192 / 0.35)
--amber:      oklch(0.80 0.15 72)       /* warn */
--border:     oklch(1 0 0 / 0.08)
--border-2:   oklch(1 0 0 / 0.14)
```

Hex approximations (for systems that need them):
- bg `#0A0D10`, surface-1 `#111418`, surface-2 `#171B20`, fg `#EEF1F3`, fg-2 `#C0C5C9`, fg-3 `#858A8F`, accent (teal) `#4ECFCB`, amber `#E3A955`.

Light theme: `--bg: oklch(0.97 0.005 245)`, `--fg: oklch(0.13 0.008 245)`, `--accent: oklch(0.48 0.15 195)`, etc.

### Typography
- Display: **Space Grotesk** (400, 500, 600, 700) — headlines, nav, UI.
- Body/italic: **Source Serif 4** (opsz 8..60, 400 / 600 / italic 400) — prose, italic accents.
- Mono: **JetBrains Mono** (400, 500, 600) — labels, metadata, code, ticker.

Scale:
- Hero display: `clamp(44px, 7.5vw, 108px)`, lh 1.02, ls -0.035em, weight 700.
- Section h2: ~56–72px display.
- Post headline: 22px display 600.
- Post row h4: 17px display 500.
- Body: 19px serif, lh 1.55.
- Lede: 16–17px serif muted.
- Mono labels: 11px, letter-spacing 0.1em, uppercase.

### Spacing
- Grid wrap: `max-width: 1280px`, horizontal padding 40px (desktop) / 20px (mobile).
- Section vertical padding: 96–120px.
- Section label offset: 40px left, 32px top.
- Grid gap (posts, work): 40–48px.

### Radii & borders
- `--radius: 4px` (tight, editorial, not pill-shaped).
- Rules: `1px solid var(--border)` everywhere.

### Easing
- Entry/reveal: `cubic-bezier(.2,.65,.2,1)`, 700ms.
- Hover: `cubic-bezier(.2,.8,.2,1)`, 220–360ms.
- Draw-underline: `cubic-bezier(.7,0,.3,1)`, 1.4s.

## Assets

**Images needed** (replace placeholders):
- `hero-portrait.jpg` — 3:4, ~600×800, used in Identity hero.
- `post-featured-cover.jpg` — 16:9 or 3:2, lead story cover art.
- 5× `work-shot-<n>.jpg` — 4:3 or 3:2, selected-work screenshots.
- `cover-hero-art.jpg` — large, magazine cover of Cover hero variant.

**Icons:** No icon library used. Arrows are literal `→` and `↗` glyphs in the display font. Status dot and ◆ separators are CSS/text.

**Fonts:** Loaded from Google Fonts in the prototype. For production, self-host via `next/font`, fontsource, or your preferred pipeline — three families total.

## Files

Inside this handoff:

- `Redesign v2.html` — canonical source of truth (motion-enabled).
- `Redesign v1.html` — static fallback / motion-off reference.
- `screenshots/01-hero-identity.png` — default hero (Identity variant).
- `screenshots/02-hero-featured.png` — Featured hero variant.
- `screenshots/03-hero-now-log.png` — Now-log hero variant.
- `screenshots/04-hero-cover.png` — Cover hero variant.
- `screenshots/05-posts.png` — The Journal section.
- `screenshots/06-ticker-posts.png` — Ticker strip + start of Journal.
- `screenshots/07-about.png` — About section.
- `screenshots/08-work.png` — Selected Work grid.
- `screenshots/09-services-subscribe.png` — Consulting + Subscribe.
- `screenshots/10-light-theme.png` — Light-theme variant (if the site ships light-mode toggle).

## Implementation Notes

- **Don't port the tweak panel.** It's a prototype affordance.
- **Don't port the sample event pool for the live log.** Wire it to real data (GitHub commits, deploy hooks, manual entries in a `/now.md`).
- **Respect `prefers-reduced-motion`.** All animation code is already gated; preserve this.
- **Accessibility:** the teal accent on the dark surface hits WCAG AA (4.8:1). On the light theme the accent is darkened to `oklch(0.48 0.15 195)` to keep contrast. Don't weaken either.
- **Intersection observers** — use the native `IntersectionObserver` API (all evergreen browsers support it). No need for a lib.
- **Marquee ticker** — the pure-CSS `animation: translate 0 → -50%` with duplicated DOM is the simplest approach. Don't reach for react-fast-marquee or similar.
- **Self-host fonts** and subset Space Grotesk + Source Serif 4 to Latin basic if the site targets English only — cuts ~80% of the font payload.
