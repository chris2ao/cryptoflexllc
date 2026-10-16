# Home Page Refresh Plan (CLAUD-300)

Date: 2026-10-16. Branch: `feat/home-page-refresh`. Scope approved by the owner: everything below.

An evolution of the existing editorial home page, not a redesign. Same `.ed-*` design system, same tokens, zero new dependencies.

## Why

An editorial and UX review of the live page (1440px desktop and iPhone 13, dark theme) found:

- **Accuracy.** Seven of the eight ticker stats were hardcoded. "117 commits / 7 days" was 14, "589 tests" was about 777, "98% coverage" was never measured, and uptime, agents, projects and coffee had no source. "Issue #145" counted weeks since 2024-01-01, but the blog started in February 2026. "No tracking" under the subscribe form was untrue (UTM tags, GA). The owner's no-metrics-roll-call rule bans the ticker pattern.
- **Bugs.** The Lead Story tag overlapped the cover's own corner chip. Two sections were labeled "§ 03". `::first-letter` split "I'm" into "I'" + "m". The featured work card had about 220px of dead space, and its 16:10 frame cropped a 16:9 infographic's title. Services and Subscribe were full-bleed while every other section sits in the 1280px wrap. Consulting had no CTA. Game promo stats were stale.
- **Staleness.** Three of six "shipped" cards were memory-system work from spring. Third Conflict was in both Selected Work and the Arcade. Ledgerly, Cramdex, the home SOC and the site security reviews were missing.
- **Length.** 9 bands, 6,602px on desktop and 11,962px on a phone. About and the CV timeline both duplicated /about.

## Owner decisions (2026-10-16)

- Consulting: low-key. One line plus a link inside About. No services band.
- Scope: everything (fixes, refresh, Now strip, Reading paths).
- Selected Work slot six: site security reviews.
- Pull quote: "Everything I know about securing software has an expiration date."

## New running order

| Order | Section | Label | Component |
|---|---|---|---|
| 1 | Hero | none | `hero-identity.tsx` (props: `postCount`, `latestDate`) |
| 2 | Now strip | none | `now-strip.tsx` (new, replaces `ticker-strip.tsx`) |
| 3 | The Blog | § 01 | `journal-section.tsx` |
| 4 | Reading Paths | § 02 | `reading-paths.tsx` (new) |
| 5 | Selected Work | § 03 | `selected-work.tsx` |
| 6 | The Arcade | § 04 | `arcade-section.tsx` |
| 7 | About the Author | § 05 | `about-section.tsx` (absorbs CV + consulting line) |
| 8 | Subscribe | none | `subscribe-block.tsx` |

Section numbers are passed as an `index` prop from `page.tsx` and rendered by `SectionLabel`, so they live side by side in one file.

Deleted: `ticker-strip.tsx`, `consulting-section.tsx`, `cv-timeline.tsx`, and the dead `hero.tsx`, `hero.test.tsx` and `animated-counter.tsx`. Their CSS blocks (`.ed-ticker*`, `.ed-cv-*`, `.ed-services`/`.ed-svc`, `.ed-work-feat .shot`, `glow-drift`, `.ed-post-tag-bar`) are deleted too; none is used outside the home page.

## Shared foundations (written first)

`src/lib/home-content.ts`, pure functions over `BlogPost[]`, unit tested:

- `seriesHref(name)`: `/blog/series/${encodeURIComponent(name)}` (matches `blog-series-nav.tsx`).
- `summarizeSeries(posts)`: one `SeriesSummary` per series: `{ name, href, postCount, latest: { title, slug, date, part? }, firstSlug }`. Latest is the newest date, with ties broken by higher `seriesOrder`. Sorted by latest date descending, then name.
- `pickReadingPaths(summaries, { limit = 6, minPosts = 3 })`.
- `getSeriesInProgress(posts)`: the series of the newest post that has one: `{ name, href, part?, title, slug } | null`.
- `postKicker(post)`: `"<series> · Part <n>"`, then `"<series>"`, then the first tag, then `"Notes"`.

`src/components/home/section-label.tsx`: `SectionLabel({ index, name })` renders `§ 0N / Name` in `.ed-section-label`.

## Section specs and exact copy

No em dashes anywhere (owner rule). Internal links use `next/link`; external links use `<a target="_blank" rel="noopener noreferrer">`.

### Hero

- Meta row: `NO. <b>{postCount}</b>` · `CRYPTOFLEX / ENGINEERING LAB` (hidden at 600px and below) · `UPDATED <b>{LATEST POST DATE}</b>` (uppercase short date). It no longer reads `new Date()`, so the static build shows true values.
- Subhead: "I work in cybersecurity defense and build with AI agents on my own time. This is where I write it all down: the security reviews, the home-lab SOC, the agent workflows, and the bugs that got past all of them."
- Portrait caption: **Chris Johnson** / "Security Engineer · Builder".
- Headline, overline and CTAs unchanged.
- Metadata title: "CryptoFlex LLC | Chris Johnson: Build in public. Break things on purpose." OG image alt: "CryptoFlex LLC, Chris Johnson".

### Now strip (replaces the ticker)

Static row, no marquee. The old ticker auto-scrolled with no pause control for users without reduced motion, which fails WCAG 2.2.2. Up to three cells, label above value:

1. **Now building**: `NOW_BUILDING` constant `{ text, href?, asOf }`. The cell is hidden when the constant is `null`. Hand-maintained; the as-of date is shown.
2. **In progress**: `getSeriesInProgress` → link "{series} · Part {n}" to the series page.
3. **Next dispatch**: "Every Monday" plus a "Subscribe" link to `#subscribe`.

### The Blog (§ 01)

- The "● Lead Story" chip moves out of the image and becomes the first chip in the tag row under the image.
- Drop `priority` from the lead cover (it is below the fold; the portrait is the LCP image).
- Row kickers use `postKicker`.
- Copy unchanged.

### Reading Paths (§ 02, new)

- Overline "Series", h2 "Pick a thread.", lede "Most posts belong to a running series. Pick one and read it in order, from part one." (Revised after code review: cards link to the series page, which lists parts in order, so "jump in at the latest" promised a link the card does not have.)
- Up to 6 cards from `pickReadingPaths`. Each card is one link to the series page and shows "{n} parts · Updated {short date}", the series name, "Latest: {title}" (hidden at 600px and below) and "Read the series →".
- Grid: 3 columns on desktop, 2 at 900px and below, 1 compact row per series at 600px and below.

### Selected Work (§ 03)

Layout: the featured card spans the full width (image left, text right; stacked at 900px and below), then two half-width cards with images, then three third-width compact text cards. Images use post covers (1600x893, 16:9 frames, `object-cover`, no meaningful crop). Index reads "NN / {projects.length}".

1. **Featured, a container (not a link)**
   - Title: "A home SOC, built from the logs up"
   - Copy: "Wazuh on four hosts, a ClickHouse log lake fed by the UDM Pro and Pi-hole, and a Mission Control dashboard that turns DNS traffic into threat-intel detections. Planned, deployed, and debugged in public across three series."
   - Image: `/blog/building-a-custom-siem-part-1-why-and-architecture/infographic.jpg`
   - Series links (counts derived): Homelab Wazuh Deployment, Custom SIEM, Home Network Mission Control, each "{name} · {n} parts →".
   - Chips: Wazuh / ClickHouse / FastAPI
2. **Security reviews of this site** → `/blog/security-review-round-two`, cover image.
   - Copy: "Two rounds so far. In round two, five security agents and an advocate for my priorities had to agree before anything shipped. They caught a blog draft that could have run code on the server. It's fixed, deployed, and checked in CI on every push."
   - Chips: AppSec / OWASP / Multi-agent
3. **Ledgerly** → `/blog/series/Ledgerly`, cover `/blog/building-ledgerly-v1/infographic.jpg`.
   - Copy: "A local-first personal finance app. Bank exports land in one SQLite file on my machine, and the chat answers questions by querying that database through MCP tools, using the Claude CLI I already had."
   - Chips: Next.js / SQLite / MCP
4. **Cramdex** (compact) → `/blog/cramdex-open-source-sans-study-app`.
   - Copy: "An MIT-licensed study app for open-book GIAC exams: a page-accurate book reader, full-text search that cites book and page, quiz decks, and grounded Q&A over your own course PDFs."
   - Chips: FastAPI / React / SQLite FTS5
5. **Custom UniFi MCP** (compact) → `/blog/building-a-custom-unifi-mcp-103-tools-across-three-days`.
   - Copy: "A lazy-loading MCP server for UniFi Network, Protect, and Access, packaged as a Claude Code plugin. Built in three days, then maintained in the open with issues, releases, and semver."
   - Chips: Python / FastMCP / UniFi
6. **My Claude Code setup** (compact, external) → `https://github.com/chris2ao/claude-code-config`.
   - Copy: "The open-source harness behind everything above: memory that survives sessions, specialist agents, hooks, and multi-agent workflows for writing, reviewing, and shipping."
   - Chips: Claude Code / MCP / Hooks

Lede: "What I built this year, from a home SOC to the AI setup behind all of it. More on the [portfolio page](/portfolio)." (Shortened during QA: the first draft listed all six cards and ran four lines.)

### The Arcade (§ 04)

Copy unchanged. Promo stats, verified against the game repos on 2026-10-16:

- Cann-Cann (`fbb5d4f`): 12 Weapons, 7 Biomes, Online Multiplayer. Subtitle: "Aim. Fire. Adjust. Now online: send a friend the invite link." (Play is invite-link based with no account, so "no accounts" in the lede stays true.)
- Third Conflict (`dac2fd3`): 7 Unit Types, 14 Random Events, 5 Difficulty Levels.

These promos also render on /portfolio, so that page gets the fix too.

### About the Author (§ 05, merged)

- Left: a `<figure>` with blockquote "Everything I know about securing software has an expiration date." and the figcaption "**Chris Johnson**, in [Building With AI, Defending Against It](/blog/tryhackme-ai1-ai-security-certification)".
- Right, paragraph 1 (drop cap lands on "M"): "My day job is cybersecurity defense operations: detection, response, and resilience. The road here was unusual, and every stop left a fingerprint on how I build:"
- Career path `<ol>`:
  1. Military intelligence (Analyst, Iraq & Afghanistan)
  2. Chem/bio defense (Pentagon & US Capitol)
  3. IT operations (Service desk to developer)
  4. Security & cloud engineering (Controls & infrastructure)
  5. Cyber defense operations (Now)
- Paragraph 2: "This blog is where I build in public. Most posts are postmortems of projects I'm still wrestling with, from security reviews of my own code to a home-lab SOC and the agent workflows behind all of it. They're written from inside the build, not from the tidy other side."
- Note: "I also take on a small number of security and infrastructure engagements through CryptoFlex LLC." Links: "See services →" (/services) and "More about me →" (/about).

### Subscribe

- Content sits inside the 1280px wrap; the dotted background stays full-bleed.
- Body: "One email each Monday with what I published that week. No tracking pixels, no growth hacks, and an unsubscribe link in every issue."
- Fallback meta: "Weekly · Unsubscribe anytime · No tracking pixels".

## Motion layer

The stagger groups become `.ed-post-list .ed-post-row`, `.ed-paths .ed-path` and `.ed-work-grid .ed-work`. The `.shot` parallax block goes, since nothing renders `.shot` any more.

## Testing

- TDD: unit tests for `home-content.ts` first, then component tests for every touched or new home component (none existed before).
- Verification: `npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build`, then Playwright screenshots of a local production build at 390 and 1440 (scrollWidth check, section labels unique and sequential, no em dashes in the rendered text).
- Reviews: code-reviewer and security-reviewer agents before commit.

## Follow-ups (not in this pass)

- "Most read this month" from analytics page views, with ISR. Medium effort; makes the home page ISR instead of fully static.
- The publish API leaves backlog-only `published: false` frontmatter on 5 live posts. The field is ignored by the loader, but it is misleading.
