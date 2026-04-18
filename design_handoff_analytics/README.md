# Handoff: `/analytics` Redesign — CryptoFlex

## Overview
A full redesign of the authenticated `/analytics` dashboard for cryptoflexllc.com. The current page is a flat, server-rendered report; this redesign turns it into an interactive telemetry room — tabbed navigation, a sticky range/search toolbar, clickable KPI cards that retarget a unified trend chart, a world map of visitor cities, a peak-hours heatmap, a live event feed, sortable tables, donut charts, Core Web Vitals cards, and a filterable visit log.

It keeps every data surface the existing page has (overview, audience/geography, content/engagement, technology, performance, telemetry, security, newsletter/comments, activity) but reorganizes them into discoverable tabs instead of one long stream.

## About the Design Files
The files in this bundle are **design references created in HTML/CSS/vanilla JS** — prototypes showing intended look and behavior, not production code to copy directly. The task is to **recreate these designs inside the existing Next.js app** (`src/app/analytics/page.tsx` and `src/app/analytics/_components/*`) using its established patterns: server components for data fetching, `nextDynamic` for heavy chart components, Tailwind + the existing design tokens, and Recharts for plotting. The synthesized data in the prototype should be replaced with the real SQL queries already present in `page.tsx`.

## Fidelity
**High-fidelity.** Exact colors, type, spacing, borders, states, and interactions are intentional and should be matched pixel-for-pixel. The prototype uses the same design vocabulary as `Redesign v2.html` (the approved site refresh) so the analytics page feels continuous with the rest of the redesigned site.

## Design System (inherited from Redesign v2)

### Colors (OKLCH, dark theme default)
| Token | Value | Use |
|---|---|---|
| `--bg` | `oklch(0.10 0.008 245)` | Page background |
| `--surface-1` | `oklch(0.13 0.010 245)` | Panel background |
| `--surface-2` | `oklch(0.16 0.011 245)` | Panel head / hover |
| `--surface-3` | `oklch(0.20 0.012 245)` | Deeper hover / bar track |
| `--fg` | `oklch(0.95 0.005 245)` | Primary text |
| `--fg-2` | `oklch(0.78 0.008 245)` | Secondary text |
| `--fg-3` | `oklch(0.55 0.010 245)` | Muted / labels |
| `--fg-4` | `oklch(0.40 0.010 245)` | Faint text |
| `--accent` | `oklch(0.74 0.16 192)` | Cyan accent (primary) |
| `--accent-dim` | `oklch(0.74 0.16 192 / 0.15)` | Accent fills |
| `--accent-line` | `oklch(0.74 0.16 192 / 0.35)` | Accent borders |
| `--amber` | `oklch(0.80 0.15 72)` | Warn / secondary series |
| `--green` | `oklch(0.78 0.17 150)` | Success / status OK |
| `--red` | `oklch(0.72 0.20 22)` | Error / deny |
| `--violet` | `oklch(0.70 0.22 295)` | Tertiary series |
| `--border` | `oklch(1 0 0 / 0.08)` | 1px rules |
| `--border-2` | `oklch(1 0 0 / 0.14)` | Stronger rules / buttons |

### Typography
- **Display**: Space Grotesk (400/500/600/700) — headings, buttons, KPI values
- **Body**: Source Serif 4 (opsz 8–60; italic supported) — paragraphs, ledes, quotes
- **Mono**: JetBrains Mono (400/500/600) — labels, overlines, tables, numbers, kicker text

### Key type sizes
- Page title: `clamp(40px, 5.5vw, 68px)` / weight 700 / tracking -0.032em / line 0.98
- Section H2: `clamp(26px, 3vw, 34px)` / weight 700 / tracking -0.02em
- KPI value: 44px / weight 700 / tracking -0.025em / tabular-nums
- Panel title: 14px / weight 600 display
- Overline / label: 11px mono / letter-spacing 0.12em / uppercase / color `--fg-3`
- Table cell: 12px mono; table head: 10.5px mono uppercase `--fg-3`

### Spacing / radii
- Base radius: `4px` (buttons, panels, cards)
- Page wrap max-width: 1440px, 40px horizontal padding (20px on mobile)
- Panels: 1px border `--border-2` + `--surface-1` fill + 4px radius; head 14/18, body 18, foot 10/18
- Section vertical padding: 56px top/bottom with 1px top rule between sections

## Page Structure

### 1. Masthead (sticky, shared with site)
Same component as Redesign v2. Nav includes `/analytics` as the **active** item (underline via `::after`, 2px accent bar). Right side shows live UTC clock (`span#clock`, updated every second) and a **Sign out** button linking to `/logout`.

### 2. Page Header
- Crumbs (mono, tracked): `HOME › ANALYTICS › OVERVIEW` — accent-colored active segment
- Title: **"Signal, *not* slop."** — display bold + italic serif inline for *not* + accent span for **slop**
- Sub-deck: Source Serif, 17px, `--fg-2`, max-width 620px
- Right column: live pill (pulsing green dot + session count), 3-button group (Refresh / Export CSV / Share view primary)
- Meta row below (mono 11px, letterspaced): Issue #, Range, Generated timestamp, Query time, Cache, Data sources. Pipe-separated on desktop, wraps on mobile.

### 3. Toolbar (sticky below masthead, top:64px)
Grid: `[range seg] [tabs-wrap] [search] [auto-refresh]`

- **Range segment**: 24H / 7D / 30D / 90D / 12M. Active: accent fill + `--bg` text + weight 600. Uppercase mono 11px.
- **Tabs wrap**: tabs overflow horizontally. Arrow buttons on each side (`‹ ›`) scroll by 220px; auto-hide when no overflow; disabled at ends (opacity 0.25). The active tab auto-scrolls into view. Tab list is masked with a 18px linear-gradient fade on both ends. Active tab has accent outline + `--accent-dim` background + display font.
- **Search**: 240px min-width, mono 12px, surface-1 bg. Pressing `/` anywhere (outside inputs) focuses it. Filters visible `.list .row` and `.tbl tbody tr` by textContent substring match.
- **Auto-refresh toggle**: ghost button showing live dot + `AUTO · ON/OFF`.

### 4. Tab panels (8 total)

Each tab has a section label ("01 · Overview", etc.) with accent tick prefix, an H2 with lede on the right, and content blocks.

#### 01 · Overview
- **KPI strip** (`.kpis`): 4-cell row, 1px borders between, shared panel. Each cell has:
  - Label row (mono uppercase + small `▲`/`▼` hint)
  - Large value (44px display, count-up animation)
  - Delta line (`<b>` green for positive, red via `.delta.down` class)
  - Sparkline SVG 120×32
  - Clicking a KPI sets `currentMetric`, re-renders the main trend chart, and adds an accent top-bar to the active card.
- **Main trend chart** panel: area / line / bar chip toggle. Y-grid is dashed 2/4 at `--border`. Area fill is `--accent-dim`, line 2px `--accent`, dots are 3px radius with `--bg` stroke. Invisible hit rects per x-position drive a tooltip.
- **Peak-hours heatmap** + **Live feed** (grid 2fr/1fr):
  - Heatmap: 7×24 grid, cells are square, background is `oklch(0.74 0.16 192 / {opacity})` where opacity scales with view count (min 0.08). Hover outlines cell in accent and shows a tooltip.
  - Live feed: mono 12.5px rows `[time | tag | body | meta]`. Tags: HIT (accent), API (violet), SUB (green), ERR/BOT (red). New rows animate in with a brief `--accent-dim` background flash. Rate displayed in footer. Pause chip buffers incoming rows.
- **New vs Returning stacked area** + **Quick facts list** (2-up).

#### 02 · Audience
- **Visitor map**: equirectangular projection 1000×480, simplified continent blobs (transparent fill, 0.4px `--border-2` stroke), graticule at 30° intervals. Cities rendered as accent dots (radius 2–10px by volume) with an infinite pulsing ring (`@keyframes pulse` 2.2s). Tooltip on hover. Legend overlay bottom-left with a 5-step opacity scale.
- **Top countries** list + **New vs Returning daily** area chart (2-up).

#### 03 · Content
- **Top pages** + **Referrers** (2-up lists with bars)
- **Scroll funnel** (vertical bars with gradient `--accent-dim → --accent`, % label inside) + **Time on page** horizontal bar chart (2-up)

#### 04 · Technology
- 3 panels side by side. Each contains a donut (SVG 100×100, inner radius 28, outer 40) with a center label (big number + mono caption) and a legend with swatch, name, %, and visit count.

#### 05 · Performance
- **Web Vitals** grid: 4 columns × 2 rows = 8 cards (LCP, INP, CLS, FCP, TTFB, FID, SI, TBT). Each has label, value with unit, a stacked good/warn/poor segment bar, and a status note with `●` bullet in the appropriate color plus the budget.
- **API response times** table: sortable by every header. Method pill (GET info blue, POST ok green), P50/P75/P95 numeric right-aligned, errors in red when >5, status pill.

#### 06 · Security
- KPI strip: Firewall denied / Bot traffic / Auth failures / Client errors
- **Bot vs human** line chart (solid accent for human, dashed red for bot) + **Auth attempts** grouped bar chart (green success / red fail; failure bars fade at low counts) 2-up
- **Firewall events** table: Time / Country / IP / Path / Action / Reason. Action uses err/warn/info status pills.

#### 07 · Newsletter
- KPI strip: Subscribers / Active / Comments / Guestbook
- **Subscriber growth** combo chart (cumulative line + weekly gain bars) + **Top converting pages** list (2-up)

#### 08 · Activity
- **Recent visits** table with ALL / HITS / API / ERRORS filter chips. Columns: Time / Path / Country / Device / Browser / Referrer / Dur / Status. Live-updates: a new row is prepended every 3.2s when auto-refresh is on and this tab is active.

## Interactions & Behavior

### Tabs
- Click a tab → remove `.on` from siblings, add to self, show matching `[data-panel]`, fade-in via `@keyframes fadeIn` 220ms.
- Persist choice in `localStorage('cf_analytics_tab')`. Restore on load.
- Scroll smoothly to toolbar top on change.
- Arrow buttons scroll the tab bar 220px; disable at scrollLeft ≤ 2 or ≥ maxScroll − 2; hide entirely when `scrollWidth === clientWidth`.
- Active tab auto-scrolls into view (`scrollIntoView({inline:'center'})`) whenever its `.on` class changes — wired via a MutationObserver on the tabs container.

### Range segment
- Click → remove `.on`, apply to self, update `currentRange`, update meta "LAST XD" label, persist in `localStorage('cf_analytics_range')`, re-render: main chart, both NvR charts, heatmap, bot chart, all sparklines.

### KPIs
- Click a KPI → `currentMetric = data-metric`, re-render main trend with new multiplier + label. Selected KPI gets a 2px accent top-bar.

### Chart mode chips
- Area / Line / Bar, mutually exclusive. Re-renders main trend preserving current range + metric.

### Live feed
- Runs a `setInterval(pushFeed, 1400)`. Skips if `autoOn` is false.
- **Pause**: buffers increments instead of appending; when resumed, buffer resets (we don't flush — that's intentional to keep scroll position calm).
- Trim to 50 rows max.

### Auto refresh
- Global toggle gates the feed and the visits-tab live append.

### Global search (`/`)
- Hides rows/tr whose textContent doesn't contain the query. No debounce needed (low DOM count).

### Hover tooltips
- Single `#tip` element, positioned fixed at cursor + 12px, clipped to viewport. Used by: heatmap cells, map dots, donut slices, chart hit rects.

### Animations
- KPI count-up: `requestAnimationFrame`, 900ms, cubic ease-out.
- Feed row intro: 300ms slideIn with accent-dim background fade.
- Map dot pulse: 2.2s infinite, radius 2 → 20, opacity 0.8 → 0, staggered by `(v % 17) * 120ms`.
- Live pill dot: 1.6s box-shadow pulse.
- Sweep loader (`.pulsing-bar`): 2s linear translate.

## State Management

### Client state (vanilla JS in prototype; use `useState` + `useReducer` or Zustand in React)
- `currentRange` — number of days (1, 7, 30, 90, 365)
- `currentMetric` — `'views' | 'uniques' | 'bounce' | 'duration'`
- `chartMode` — `'area' | 'line' | 'bar'`
- `activeTab` — string (persisted)
- `activityFilter` — `'all' | 'hit' | 'api' | 'err'`
- `autoOn` — bool
- `feedPaused` — bool
- `apiSort` — `{ key, dir }`
- `searchQuery` — string

### Data fetching (server components)
Keep the existing split in `page.tsx`:
- `OverviewSection`, `AudienceSection`, `ContentSection`, `TechnologySection`, `TelemetrySection`, `SecuritySection`, `NewsletterSection`, `ClaudeAutomationSection`
- Each `Suspense`-wrapped with the skeletons already defined.
- The tab switcher on the client shouldn't refetch — render all sections server-side and toggle visibility with CSS (`display:none`) to keep navigation instant. Only the range change triggers a re-fetch (pass `days` via query param + `router.push`).
- For live feed + live visit append, add a lightweight SSE endpoint `/api/analytics/live` that streams new rows; the client appends to the feed panel.

## Files to Recreate / Update

Map of prototype panels → existing Next.js components (update in place):

| Prototype panel | File |
|---|---|
| Masthead | `src/components/nav.tsx` (add `/analytics` link w/ active state) |
| Page header + toolbar | `src/app/analytics/page.tsx` (new client wrapper) |
| KPI cards | `src/app/analytics/_components/stat-card.tsx` |
| Trend chart | `src/app/analytics/_components/page-views-chart.tsx` |
| Heatmap | `src/app/analytics/_components/peak-hours-heatmap.tsx` |
| Live feed | **new** `src/app/analytics/_components/live-feed.tsx` (SSE client) |
| World map | `src/app/analytics/_components/visitor-map.tsx` (replace leaflet if used, or keep) |
| Country list | `src/app/analytics/_components/countries-chart.tsx` (switch to list style) |
| Top pages / referrers | `_components/top-pages-chart.tsx`, `referrer-chart.tsx` (list style) |
| Scroll funnel | `_components/scroll-depth-chart.tsx` |
| Time on page | `_components/time-on-page-chart.tsx` |
| Donuts (Browser/Device/OS) | `_components/browser-chart.tsx`, `device-chart.tsx`, `os-chart.tsx` |
| Web Vitals | `_components/vercel-speed-insights-card.tsx` |
| API response | `_components/api-response-chart.tsx` |
| Bot / Auth / Firewall | `_components/bot-trend-chart.tsx`, `auth-attempts-chart.tsx`, `vercel-firewall-card.tsx` |
| Subscriber growth | `_components/subscriber-growth-chart.tsx` |
| Recent visits | `_components/recent-visits-table.tsx` |

## Accessibility
- All interactive chips/tabs are keyboard-focusable buttons (`<button>` in real implementation)
- Tooltip is `aria-hidden="true"` and visual only; pair with `<title>` inside SVG for screen readers
- Tab bar arrows have `aria-label`
- Color is never the only signal — status tags include text ("DENY", "GOOD", etc.)
- Ensure min contrast 4.5:1 for body text (current design passes; `--fg-3` on `--surface-1` is borderline — bump to `--fg-2` if axe flags)

## Screenshots
See `./screenshots/`:
1. `01-analytics.png` — Overview tab (KPIs, trend, heatmap, live feed)
2. `02-analytics.png` — Audience tab (world map, countries)
3. `03-analytics.png` — Content tab (pages, referrers, funnel)
4. `04-analytics.png` — Technology tab (donuts)
5. `05-analytics.png` — Performance tab (Web Vitals + API table)
6. `06-analytics.png` — Security tab (bot/auth charts + firewall log)
7. `07-analytics.png` — Activity tab (visit log)

## Files in this bundle
- `Analytics Redesign.html` — full working prototype (self-contained, opens in any browser)
- `screenshots/*.png` — tab screenshots
- `README.md` — this file
