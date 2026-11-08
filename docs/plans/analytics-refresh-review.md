# /analytics review and refresh proposal

Date: 2026-11-07. Scope: the owner-only dashboard at `/analytics` (page, nine tabs, 54 component files, 11 API routes, the IP intelligence lookup). Method: full read of the code on `main` (924a06b), the live page at 1440px and in a 390px same-origin frame, the Vercel project via the MCP, Jira and vector memory for prior decisions.

Status: Done 2026-11-07. Built as `analytics-refresh-plan.md` in four PRs (#55 to #58) the same day; the owner's decisions are recorded in the plan header; owner steps for the external sources are CLAUD-781 and the review leftovers are CLAUD-782.

## Verdict: a refresh, with two cores rebuilt

The editorial shell from the April 17 rebuild (tab strip, KPI strip, `ax-panel` cards, the world map, the live feed) is sound and matches the rest of the site after CLAUD-765. A visual redesign would throw away the one layer that is right.

What is wrong sits underneath it:

1. The data is not telling the truth. Referrers are never captured, a forged-referrer crawler is most of the traffic, and the dashboard counts its own visits.
2. Two design generations still coexist inside the page, plus twelve orphan files, in a 1,580-line page module.
3. Nine tabs with duplicated panels, a card that claims an integration that is not enabled, and three vitals cards that can never show data.
4. The IP intelligence panel is the February version: a lookup sheet with no abuse context, no visitor history and county property links.
5. Every load runs about 43 SQL queries and 3 Vercel API calls for all nine tabs, whichever tab is open.

So: keep the chrome, rebuild the data model and the intelligence layer, consolidate the information architecture, and finish the port that April started.

## What is there today

| Area | State |
|---|---|
| Collection | `AnalyticsTracker` beacons page views, scroll depth (25/50/75/100) and time on page; `WebVitalsReporter` sends LCP, INP, CLS, FCP, TTFB; `ErrorReporter` sends client errors; blog search queries; API timing on three routes only (`/api/analytics`, `track`, `vitals`) |
| Storage | 16 Neon tables created by `/api/analytics/setup`; IPs blanked after 90 days by a daily cron |
| Page | `src/app/analytics/page.tsx`, 1,580 lines, `force-dynamic`, nine async sections each under `Suspense`, all rendered on every load |
| Shell | `analytics-shell.tsx`: tab in `localStorage` (not the URL), range in the URL, row filter, auto-refresh toggle, sticky toolbar |
| Components | 54 files: 16 editorial (`ax-*`), 34 Tailwind/shadcn era (17 of them Recharts), 12 orphans never imported |
| Tests | 3 component tests (live feed, unsubscribe panel and row) and the API route tests; no test covers a section's queries |
| Integrations | Vercel firewall via three `api.vercel.com/v1/security/firewall/*` endpoints (only `config` is in the public REST reference); GA4 tag in the layout; `@vercel/analytics` and `@vercel/speed-insights` mounted in the layout |
| Intelligence | `GET /api/analytics/ip-intel?ip=`: 7-day cache, ip-api.com over plain HTTP, RDAP, Nominatim reverse geocode; opened from the Activity visit log only |

Live numbers on 2026-11-08 (30-day range) used below:

| Measure | Value |
|---|---|
| Views / unique IPs | 2,361 / 2,011 |
| Views with referrer `www.aocr.org` | 1,668 from 1,652 IPs |
| Views with the site's own URL as referrer | 630 from 344 IPs |
| Bounce rate / new visitors shown | 97% / 95% |
| Hits classified Bot by user agent | 78 |
| Web vitals p75 | LCP 1.82s, INP 48ms, CLS 0.043, FCP 1.82s, TTFB 2.11s |
| API latency rows | 5,290 requests across exactly two routes, 0 errors |
| Subscribers / active | 37 / 30 |
| Gmail runs / unsubscribe candidates pending | 293 / 210 |

## Findings

### A. Data truth (fix first, everything else reads from it)

**A1. Referrers are never captured.** The tracker sends `{ path }` only, and the track route stores the beacon's own `Referer` header. A same-origin beacon carries the current page URL, so the Referrers panel shows `www.cryptoflexllc.com` (630 views), seven preview deployment hostnames, and no search engine at all for a 106-post blog. Fix: send `document.referrer` from the client (one line), store it, classify it.

**A2. A forged-referrer crawler is 71% of views and 82% of "unique visitors".** The `www.aocr.org` rows are one page per IP, one hit each, from a proxy pool. Three write-ups from October and November 2026 identify it as ByteDance's crawler stack sending a false referrer (tin.computer, blackmoreops, omid.dev). The two spikes in the 30-day trend chart (Oct 24, Nov 5) are this crawler. The user-agent regex (`bot|crawl|spider|slurp`) catches 78 hits. Consequence: total views, uniques, bounce (97%), new vs returning (95% new), the map, countries and the "Readers" sparkline are all artifacts.

**A3. The dashboard tracks itself.** `/analytics` and `/analytics/login` appear in the visit log, scroll depth and the live feed; the feed on load was ten rows of the dashboard's own `vitals` and `track` POSTs. TTFB "poor" at 2.11s is partly the dashboard's own force-dynamic render reporting on itself. Exclude `/analytics*` and `/backlog*` paths at the tracker and in the vitals route, and tag the owner's hits (IPs with a successful analytics login in the last 30 days) so they can be toggled off.

**A4. Bot classification needs more than a regex.** Signals already in hand: hosting or proxy ASN (ip-api gives `hosting` and `proxy`), zero engagement beacons (crawlers never send scroll or time events), forged referrer list, one hit and gone. A `traffic_class` (human, bot, owner, self) computed at insert time, backfilled once, makes every panel filterable.

**A5. KPIs have no comparison.** `KpiItem.delta` exists in the strip and nothing populates it. Every KPI should carry "vs previous period" once the numbers are honest.

**A6. Bounce rate is the wrong KPI for a blog.** Replace with Readers (humans with an engagement event), Read-through (posts scrolled to 100%) and Reader minutes. Time on page is capped at 3,600s and the chart axis runs to 60 minutes because of tabs left open; use a median, not the mean.

### B. Structure and code

**B1. Two generations in one page.** 34 components still use `rounded-lg`, `bg-card`, `text-muted-foreground`; the IP panel is a shadcn `Sheet`; the Vercel firewall and analytics cards use Tailwind pills next to editorial mono kickers. Twelve files are orphans (`browser-chart`, `countries-chart`, `device-chart`, `os-chart`, `page-views-chart`, `referrer-chart`, `section-header`, `stat-card`, `top-converting-panel`, `top-pages-chart`, `vercel-speed-insights-card`, `visitor-map`).

**B2. One 1,580-line page module** holds nine sections and their SQL. The coding-style ceiling is 800. Sections and their queries belong in `_sections/*.tsx` and `src/lib/analytics-queries/*.ts`, where the classifiers (`classifyReferrer`, `classifyTraffic`) and the SQL builders can be unit-tested. Today nothing tests a section.

**B3. Every load pays for every tab.** `force-dynamic` plus nine streamed sections means about 43 queries and 3 Vercel calls per page view even when only Overview is read. Activity re-runs the Technology and Content queries; Overview and Audience both run the new-vs-returning window query. Rendering only the tab named in the URL, or caching each section for 60 seconds, cuts this to a quarter.

### C. Information architecture and readability

**C1. Nine tabs do not fit at 1440px**: the strip overflows into arrows and "07 Newsletter" is cut off on a desktop monitor. Activity duplicates Technology and Content as plain tables. Proposed seven: Overview, Readers (Audience plus Technology), Content, Performance, Security (plus the visit log and the dossier), Newsletter, Agents.

**C2. The header is a landing page on a private tool.** Title, two lines of marketing copy, pill, three buttons and a six-item meta row push the first KPI below the fold on a phone (about 1.5 screens) and cost 300px on desktop. Keep "Signal, not slop." and the live pill; drop the sub copy; fold ISSUE, GENERATED, QUERY, CACHE, SOURCE into one small line under the toolbar.

**C3. Tab state is not in the URL**, so a tab cannot be linked or restored on a second device, while the range is in the URL. Put both in the URL.

**C4. The sticky toolbar bleeds.** At 92% background the section heading scrolls through it visibly at 1440px. Solid background, or clip the heading.

**C5. Dead and misleading cards.** FID, SI and TBT can never have data (FID is retired, SI and TBT are lab metrics). The "Vercel summary" card says "Dual tracking: custom + Vercel @vercel/analytics" and "Active", but Vercel Web Analytics is not enabled on the project (the API answers 404 "Web Analytics not found"). "Firewall Denied" counts attack-status anomalies, not denials.

**C6. Charts to change.** Trend chart: stack humans and bots and mark publish dates so a post's effect on traffic is visible. Content: one post performance table (views, readers, median read, read-through, subscribes, comments) replaces four half-panels. Referrers: grouped by class (search, social, AI assistants, newsletter, direct, forged) rather than a raw hostname list; `chatgpt.com` already shows up through its UTM tag and deserves its own class. Scroll depth and time on page: labels truncated at 18 characters; show the slug and link it.

**C7. Phone and light theme.** At 390px nothing overflows (scroll width 386) and KPIs go two-up, which is fine. The light theme was not measured in this review.

### D. IP intelligence (the "intelligence function")

What it is: a side sheet, opened only from the Activity log, that shows ISP, ASN, WHOIS org, an approximate street address from Nominatim, proxy/hosting/mobile flags, and a county property appraiser link. Unchanged since 2026-02-09.

**D1. No context that answers the question a security engineer asks**: is this address known bad, is it a scanner, is it Tor, is it a datacenter, what else did it do here. Candidates to validate in a short research step: AbuseIPDB (free key, daily quota), the Tor bulk exit list (free, no key), Spamhaus DROP (free list), GreyNoise community lookup (verify it still exists), and an HTTPS geo provider in place of plain-HTTP ip-api (ipinfo Lite, or ip-api Pro).

**D2. No dossier.** The database already holds every hit, scroll, time, error, auth attempt, subscribe and comment by IP. The panel should open with that history (first seen, last seen, pages, UA changes, engagement, errors, auth attempts) before any external call.

**D3. Reachable from one place.** The same IP appears in the live feed, client errors, auth attempts, subscribers and guestbook with no link. Make the IP a link everywhere.

**D4. No pre-enrichment.** Lookups are on demand only, so the Security tab cannot show "traffic by network type" (residential, hosting, proxy, mobile) or "known-bad overlap this week". A nightly batch inside an existing cron (Hobby caps crons) enriches new IPs within ip-api's 45 requests a minute and feeds the traffic classifier in A4.

**D5. Drop the property appraiser links and the street address.** They add nothing to an analytics question, and pointing a reader's IP at a county records search is not something this site should do.

**D6. Active response.** The Vercel firewall config endpoint is in the public REST reference and accepts rule writes. A "Block this IP" action behind a confirm step turns the panel from read-only into a response tool. Owner decision (needs a token with write scope on Vercel).

### E. Integrations: what exists, what is dead, what is cheap

| Integration | Today | Recommendation |
|---|---|---|
| Own tracker (Neon) | Primary, with the defects in A | Keep as the source of truth; fix A1 to A6 |
| GA4 tag (`NEXT_PUBLIC_GA_ID`) | Loaded on every page, never read by the dashboard | Decision: drop it (one tracker, an honest "no third-party analytics" line) or keep it only as an external cross-check |
| Vercel Web Analytics | `@vercel/analytics` mounted, feature not enabled | Enable (Hobby includes 50,000 events a month, one month of data per the Hobby plan page) and show its count beside ours as a sanity check, or remove the package and the card |
| Vercel Speed Insights | `@vercel/speed-insights` mounted, not shown | Same choice as above; our own `web_vitals` table already covers it |
| Vercel firewall | Three endpoints, two undocumented | Keep `config`; treat `attack-status` and `events` as best-effort with a visible "unavailable" state |
| Vercel deployments API (documented) | Not used | A deploy strip on Performance: last ten deployments, build time, canceled builds from the ignore script |
| Vercel runtime errors | Not visible on the dashboard; the MCP shows Neon connection timeouts on `track` and `track-engagement` as recently as Nov 6 | Record server-side failures in a `server_events` table from the routes' catch blocks and show a count on Performance |
| Cloudflare (plan from 2026-07-06) | "Ready for implementation handoff", never started | Separate decision; it would replace the firewall card and add bot scores, but it is a hosting-path change, not a dashboard change |
| Google Search Console | None | Highest-value new signal for a blog (queries, impressions, index status); needs owner-created OAuth credentials, so Waiting on me if wanted |
| GitHub (public repo API) | None | Commits and PRs per week for a "shipping" strip; no token needed for a public repo |
| Newsletter sends | The weekly digest cron records nothing | A `digest_runs` row per send (recipients, failures) and click-through from `utm_campaign=weekly-digest` visits |
| Ops | None | Table row counts and sizes, last cron runs, Neon timeout count, retention status |

## Options

**Option 1, Refresh (recommended).** Keep the editorial shell. Four waves below. Everything numbered above gets fixed. Roughly the size of CLAUD-765 (four PRs, one unattended session with fan-out). Risk: low; the shell and tokens are proven.

**Option 2, Redesign.** New layout (for example a single scrolling report with a side rail, or a command-palette-driven explorer), new chart system. Fixes the same data defects first anyway, then rebuilds every panel. Roughly twice the work, and the current shell already matches the site's editorial system, so the visual gain is small. Not recommended now.

**Option 3, Minimum fix.** Wave 1 only (data truth) plus deleting orphans and the dead cards. Two days of work, numbers become honest, nothing else changes. A fallback if the full refresh has to wait.

## Proposed plan (Option 1)

Waves run as in CLAUD-765: one PR each, parallel implementers in worktrees where tasks are separate, one review per wave, production verified with the headless harness and an authenticated browser.

**Wave 1, Data truth (no visible redesign).**
- Tracker sends `document.referrer`; the track route stores it; `classifyReferrer` (search, social, AI assistants, newsletter, internal, forged, direct) with tests.
- `traffic_class` column on `page_views` (human, bot, owner, self) computed at insert and backfilled by a one-off script; forged-referrer list and hosting-ASN rules in one module with tests.
- Tracker and vitals skip `/analytics*` and `/backlog*`; owner IPs derived from `auth_attempts`.
- KPI deltas versus the previous period; Readers, Read-through and Reader minutes replace bounce; median time on page.
- A `server_events` table fed from route catch blocks.

**Wave 2, Shell and structure.**
- Seven tabs; tab and range in the URL; render only the active tab's section on the server (or cache sections 60s).
- Header compressed; meta row moved; sticky toolbar made solid; tab strip fits at 1440 without arrows.
- `page.tsx` split into `_sections/` and `src/lib/analytics-queries/`; query modules unit-tested.
- The 34 Tailwind-era components ported to `ax-*` primitives or deleted; the 12 orphans deleted; FID, SI, TBT cards removed; the Vercel summary card replaced by the real cross-check or removed.
- Post performance table on Content; stacked human/bot trend with publish markers on Overview.

**Wave 3, Intelligence.**
- Visitor dossier panel in the editorial system (history first, enrichment second), opened from every IP on the dashboard.
- Enrichment providers chosen after a short `light-research` on quotas and terms; HTTPS geo; abuse lists; nightly pre-enrichment inside the existing cleanup cron.
- Security tab: traffic by network type, known-bad overlap, auth attempts with dossier links, firewall card with a visible unavailable state.
- Property links and street address removed. "Block this IP" if the owner approves D6.

**Wave 4, New signals.**
- Deploy strip, digest runs and newsletter click-through, ops panel, GitHub shipping strip.
- Search Console and Cloudflare only if the owner takes those decisions; they get their own items.

## Decisions needed before planning

1. Refresh (recommended), redesign, or minimum fix.
2. GA4: drop, or keep as a cross-check only.
3. Vercel Web Analytics and Speed Insights: enable and show the cross-check, or remove both packages and the card.
4. "Block this IP" from the dashboard via the Vercel firewall API (write token on Vercel, confirm step in the UI).
5. Search Console: wanted (owner creates the OAuth credentials) or not now.
6. Agents tab: stays inside `/analytics` (recommended) or moves to its own route.

## Sources

- Live dashboard, 2026-11-08 01:58Z, 30-day range, 1440px and a 390px same-origin frame.
- Vercel MCP: `get_project` (Web Analytics absent), `aggregate_pageviews` 404 "Web Analytics not found", `get_runtime_errors` 7d (Neon connection timeouts on `track`, `track-engagement`, `subscribe`).
- Hobby plan limits: vercel.com/docs/plans/hobby (50,000 Web Analytics events a month, one month of data).
- Forged referrer crawler: tin.computer "Getting traffic from aocr.org? That's ByteDance crawling your website"; blackmoreops "AOCR.org referrer spam"; omid.dev 2026-11-07 "Not traffic from aocr.org: a forged-referrer crawler".
- Prior decisions in vector memory: April 17 editorial rebuild, SVG map replacing Leaflet, July 6 Cloudflare decision, August live-feed auto-pause, September deployment storage cut.
