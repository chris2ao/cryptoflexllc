# /analytics Refresh Implementation Plan

> Execute with the `writing-plans` skill's `executing.md`. Steps use checkboxes; tick them as they finish. After a context reset, re-read this file and resume at the first unchecked box.

**Goal:** Make the owner dashboard at `/analytics` tell the truth (humans vs bots, real referrers, no self-traffic), fit on one screen of tabs, finish the editorial port, and turn the IP lookup into a visitor intelligence panel, with Vercel, Search Console, GitHub and newsletter signals added.

**Design:** `docs/plans/analytics-refresh-review.md` (review with findings A to E and the owner's decisions of 2026-11-07: refresh; GA4 stays as an external cross-check only, nothing on the dashboard reads it; Vercel Web Analytics and Speed Insights get enabled by the owner and the dashboard shows the Web Analytics cross-check; no block-IP action; Search Console yes; Agents tab stays inside `/analytics`).

**Jira:** CLAUD-779 (refresh). CLAUD-778 (data defects) closes with Wave 1.

**Execution:** parallel (owner asked for one unattended session with fan-out; `parallel-fanout-build` with worktrees, one PR per wave, controller merges)

**Architecture:** The editorial shell stays. The page is split into one server section per tab and one query module per tab; only the tab named in the URL renders. Page views gain `referrer_host`, `referrer_class` and `traffic_class` columns, computed at insert for the cheap signals and refined by a batch that the dashboard and the daily cron run until nothing is pending. Every panel reads humans by default. The IP lookup becomes a visitor dossier (our own tables first) plus enrichment from ipapi.is, the Tor exit list and Spamhaus DROP, cached in `ip_intel`.

**Tech stack:** Next.js 16 App Router (force-dynamic page, Suspense), React 19, Neon serverless SQL tag, Recharts through `src/components/ui/chart`, vitest + Testing Library (jsdom), zod, node:crypto. No new runtime dependencies.

**Status:** Wave 1 merged in PR #55 (merge commit e82b2d0, 2026-11-07), verified in production. Wave 2 in progress on `refresh/analytics-w2-shell`.

## Global Constraints

- Zero new runtime dependencies. External data comes from `fetch` with `AbortSignal.timeout`, never throws into a section, and every section query in a `Promise.all` carries `.catch(() => [])` or a defaults object.
- Editorial system only under `src/app/analytics`: `ax-*` classes and CSS tokens. No `rounded-*`, `bg-card`, `text-muted-foreground`, `border-border`, no `components/ui/sheet`, no `components/ui/badge`. Recharts stays and is themed through CSS variables.
- Files 200 to 400 lines typical, 800 max; functions under 50 lines; new objects, never mutation.
- No em dashes anywhere (code, copy, comments, commits).
- Secrets only through env names: `VERCEL_API_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID`, `IPAPI_IS_KEY`, `GSC_CLIENT_EMAIL`, `GSC_PRIVATE_KEY`, `GSC_SITE_URL`, `GITHUB_TOKEN`, `CRON_SECRET`, `DATABASE_URL`. Never log their values.
- Tracker privacy line stays true: only path, referrer and engagement numbers leave the browser; everything else is derived server-side.
- Commit subjects `<type>: CLAUD-779 <description>` (Wave 1 data fixes use CLAUD-778). Factual bodies. Trailers as in the repo's recent commits (`Co-Authored-By` and `Claude-Session`).
- Implementers: tests first, touch only the task's files, run only the task's test files, never commit, never spawn agents, report files changed, the test command and its output, and any deviation.
- Builds (`next build`) run only in the main checkout, never in a worktree (Turbopack refuses symlinked `node_modules` there). Lint, tsc and vitest run anywhere.
- Browser QA runs only in the controller: the headless CDP harness against `next start` on port 3100, and the owner's authenticated Chrome session against production after each merge.

## Edge Cases

1. A referrer that is not a URL (`javascript:`, `about:blank`, garbage over 2000 chars): host `""`, class `direct`. Pinned by Task 3.
2. A referrer on the site's own host or a `*.vercel.app` preview host: class `internal`, never `other`. Pinned by Task 3.
3. ipapi.is without a key returns no detection flags: `isDatacenter`, `isProxy`, `isVpn`, `isAbuser` stay `null` (unknown), the panel prints "unknown", and the classifier treats unknown as not hosting. Pinned by Task 9.
4. `classifyPendingPageViews` with nothing pending returns 0 and the cron loop stops after one call. Pinned by Task 3.
5. `GSC_PRIVATE_KEY` pasted with literal `\n` sequences: normalised to real newlines before signing. Pinned by Task 14.

## File Map

| File | Create/Modify | Responsibility |
|---|---|---|
| `src/app/analytics/page.tsx` | Modify | Auth gate, header, shell, renders only the active section |
| `src/app/analytics/analytics.css` | Create | The `/analytics` rules moved out of `globals.css`, with labelled regions |
| `src/app/analytics/_sections/overview.tsx` … `agents.tsx` | Create | One server component per tab |
| `src/app/analytics/_sections/registry.ts` | Create | `SECTIONS` map from tab id to section component |
| `src/app/analytics/_sections/performance-ops.tsx` | Create | Ops panel (table sizes, cron runs, server events) |
| `src/lib/analytics-queries/shared.ts` | Create | `rangeDays`, `TrafficScope`, `trafficFilter`, `deltaPercent`, `previousWindow` helpers |
| `src/lib/analytics-queries/{overview,readers,content,performance,security,newsletter,agents}.ts` | Create | Typed loaders per tab, one function per panel group |
| `src/lib/analytics-queries/posts.ts` | Create | Post performance table query |
| `src/lib/analytics-queries/visitor.ts` | Create | Visitor dossier query |
| `src/lib/analytics-queries/ops.ts` | Create | Table sizes, cron runs, server events |
| `src/lib/analytics-schema.ts` | Create | `ensureAnalyticsSchema`, idempotent ALTER and CREATE statements |
| `src/lib/analytics-tracking-rules.ts` | Create | `UNTRACKED_PREFIXES`, `isTrackedPath` shared by tracker, vitals and routes |
| `src/lib/traffic/referrer.ts` | Create | `classifyReferrer`, host lists |
| `src/lib/traffic/classify.ts` | Create | `isBotUserAgent`, `classifyAtInsert`, `classifyFromSignals` |
| `src/lib/traffic/backfill.ts` | Create | `classifyPendingPageViews` batch UPDATE |
| `src/lib/ip-enrichment/types.ts`, `enrich.ts`, `cache.ts`, `providers/ipapi-is.ts`, `providers/tor-exits.ts`, `providers/spamhaus-drop.ts`, `providers/rdap.ts`, `cidr.ts`, `batch.ts` | Create | Enrichment pipeline and cache |
| `src/lib/server-events.ts` | Create | `recordServerEvent` fire-and-forget |
| `src/lib/cron-runs.ts` | Create | `recordCronRun` |
| `src/lib/vercel-api.ts` | Modify | Add `fetchWebAnalyticsDaily`, `fetchWebAnalyticsCount`, `fetchDeployments` |
| `src/lib/search-console.ts` | Create | Service-account JWT, token, `fetchSearchAnalytics` |
| `src/lib/github-activity.ts` | Create | `fetchRecentCommits` |
| `src/components/analytics-tracker.tsx` | Modify | Send `document.referrer`, skip untracked paths |
| `src/components/web-vitals-reporter.tsx` | Modify | Skip untracked paths |
| `src/app/api/analytics/track/route.ts` | Modify | Store referrer from body, classify at insert |
| `src/app/api/analytics/vitals/route.ts` | Modify | 204 without insert for untracked paths |
| `src/app/api/analytics/live/route.ts` | Modify | Correct column names, bot tag, hide self hits |
| `src/app/api/analytics/ip-intel/route.ts` | Modify | Enrichment endpoint over the new pipeline |
| `src/app/api/analytics/visitor/route.ts` | Create | Dossier endpoint |
| `src/app/api/cron/cleanup-page-views/route.ts` | Modify | Classify pending rows and enrich new IPs |
| `src/app/api/cron/weekly-digest/route.ts`, `cleanup-rate-limits/route.ts` | Modify | Record `digest_runs` and `cron_runs` |
| `src/app/analytics/_components/analytics-shell.tsx` | Modify | Seven tabs, URL state, scope toggle |
| `src/app/analytics/_components/analytics-header.tsx` | Create | Compact header |
| `src/app/analytics/_components/visitor-panel.tsx`, `ip-link.tsx` | Create | Dossier side panel and the IP link that opens it |
| `src/app/analytics/_components/post-performance-table.tsx` | Create | Sortable post table |
| `src/app/analytics/_components/referrer-classes.tsx` | Create | Referrers grouped by class |
| `src/app/analytics/_components/web-analytics-card.tsx`, `deploys-strip.tsx`, `shipping-panel.tsx`, `search-console-panel.tsx`, `digest-runs-panel.tsx`, `network-types-panel.tsx`, `known-bad-panel.tsx` | Create | New panels |
| `src/app/analytics/_components/*` (34 Tailwind-era files) | Modify or delete | Ported to `ax-*` or removed (12 orphans, `ip-osint-panel.tsx`, `vercel-analytics-card.tsx`) |
| `src/app/analytics/_components/editorial-only.test.ts` | Create | Guards the component directory against the forbidden classes |

---

## Wave 1: the page is split, and every new hit carries its referrer and a traffic class

**Done when:** `page.tsx` is under 200 lines and renders the same nine tabs from `_sections/*`; `globals.css` no longer holds the `/analytics` block; a tracked page view stores `referrer`, `referrer_host`, `referrer_class` and `traffic_class`; `/analytics*` and `/backlog*` produce no page views and no vitals; the live feed shows subscriber and error events again; CI green; production renders every tab.

### Task 1: Mechanical split of the page and the CSS  (controller, inline, first)

**Files:**
- Modify: `src/app/analytics/page.tsx`
- Create: `src/app/analytics/_sections/{overview,audience,content,technology,performance,security,newsletter,activity,automation}.tsx`, `src/app/analytics/_sections/registry.ts`
- Create: `src/lib/analytics-queries/{overview,audience,content,technology,performance,security,newsletter,activity}.ts`, `src/lib/analytics-queries/shared.ts`
- Create: `src/app/analytics/analytics.css` (lines of `globals.css` from the `ANALYTICS REDESIGN` banner to the line before `COMPONENT OVERRIDES`, moved verbatim, then four trailing region markers: `/* ==== REGION: shell ==== */`, `/* ==== REGION: charts ==== */`, `/* ==== REGION: panels ==== */`, `/* ==== REGION: intel ==== */`, each followed by one blank line)
- Modify: `src/app/globals.css` (remove the moved block)
- Test: `src/app/analytics/_sections/registry.test.ts`, `src/lib/analytics-queries/shared.test.ts`

**Interfaces:**
- Produces: `export function rangeDays(input: string | undefined): number` (clamps 1..365, default 30) in `shared.ts`.
- Produces: `export const SECTIONS: Record<TabId, (props: { days: number }) => Promise<ReactElement>>` and `export type TabId` in `registry.ts` (nine ids today; Task 6 reduces them).
- Produces: one loader per tab, e.g. `export async function loadOverview(days: number): Promise<OverviewData>`, returning exactly the rows the section used before. No SQL text changes in this task.

- [x] **Step 1: Write the failing tests**

```ts
// shared.test.ts
it("defaults to 30 and clamps", () => {
  expect(rangeDays(undefined)).toBe(30);
  expect(rangeDays("abc")).toBe(30);
  expect(rangeDays("0")).toBe(1);
  expect(rangeDays("9999")).toBe(365);
});
// registry.test.ts
it("has one section per default tab", () => {
  expect(Object.keys(SECTIONS).sort()).toEqual(DEFAULT_TABS.map((t) => t.id).sort());
});
```

- [x] **Step 2: Run and confirm they fail** (`npx vitest run src/lib/analytics-queries/shared.test.ts src/app/analytics/_sections/registry.test.ts`, FAIL: module not found)
- [x] **Step 3: Move each `*Section` function into its `_sections` file, its SQL into the matching loader, import `./analytics.css` from `page.tsx`, and move the CSS block.** Behaviour identical. Any test that read the moved rules from `globals.css` points at `analytics.css` instead (check `src/lib/contrast.test.ts` and `src/__tests__/*css*.test.ts`).
- [x] **Step 4: Run** `npx tsc --noEmit && npx vitest run src/app/analytics src/lib/analytics-queries src/lib/contrast.test.ts src/__tests__` and `wc -l src/app/analytics/page.tsx` (under 200). PASS.
- [x] **Step 5: Commit** `refactor: CLAUD-779 split the analytics page into sections, loaders and its own stylesheet`

### Task 2: Tracker sends the referrer; the track route classifies at insert  `critical` `parallel-safe`

**Files:**
- Create: `src/lib/analytics-tracking-rules.ts`, `src/lib/analytics-schema.ts`
- Modify: `src/components/analytics-tracker.tsx`, `src/app/api/analytics/track/route.ts`
- Test: `src/lib/analytics-tracking-rules.test.ts`, `src/lib/analytics-schema.test.ts`, `src/app/api/analytics/track/route.test.ts` (extend)

**Interfaces:**
- Produces: `export const UNTRACKED_PREFIXES = ["/analytics", "/backlog"] as const; export function isTrackedPath(pathname: string): boolean`.
- Produces: `export const SCHEMA_STATEMENTS: readonly string[]` and `export async function ensureAnalyticsSchema(sql: SqlTag): Promise<void>` (runs every statement once per process, memoised promise, swallows and logs errors). Statements: `ALTER TABLE page_views ADD COLUMN IF NOT EXISTS referrer_host TEXT NOT NULL DEFAULT ''`, `... referrer_class VARCHAR(16) NOT NULL DEFAULT 'direct'`, `... traffic_class VARCHAR(8)` (nullable, NULL means pending), `CREATE INDEX IF NOT EXISTS idx_page_views_traffic_class ON page_views (traffic_class)`, `CREATE TABLE IF NOT EXISTS server_events (id SERIAL PRIMARY KEY, occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), route TEXT NOT NULL, kind VARCHAR(40) NOT NULL, message TEXT NOT NULL DEFAULT '')`, `CREATE TABLE IF NOT EXISTS cron_runs (id SERIAL PRIMARY KEY, ran_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), name VARCHAR(60) NOT NULL, ok BOOLEAN NOT NULL, duration_ms INTEGER NOT NULL DEFAULT 0, note TEXT NOT NULL DEFAULT '')`, `CREATE TABLE IF NOT EXISTS digest_runs (id SERIAL PRIMARY KEY, ran_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), recipients INTEGER NOT NULL, sent INTEGER NOT NULL, failed INTEGER NOT NULL, duration_ms INTEGER NOT NULL DEFAULT 0)`, `CREATE TABLE IF NOT EXISTS threat_lists (name VARCHAR(40) PRIMARY KEY, entries TEXT NOT NULL, fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`, plus `ip_intel` columns: `company TEXT NOT NULL DEFAULT ''`, `is_datacenter BOOLEAN`, `is_tor BOOLEAN NOT NULL DEFAULT FALSE`, `is_vpn BOOLEAN`, `is_abuser BOOLEAN`, `abuser_score VARCHAR(20) NOT NULL DEFAULT ''`, `on_drop BOOLEAN NOT NULL DEFAULT FALSE`, `sources TEXT NOT NULL DEFAULT ''`, `enriched_at TIMESTAMPTZ`.
- Consumes: `classifyReferrer`, `classifyAtInsert` from Task 3 (its Interfaces block). Until Task 3 lands in the worktree, import the names; the controller merges Task 3 first.
- Track route: body schema gains `referrer: z.string().max(2000).optional().default("")`; the `Referer` header is no longer read; untracked paths return 204 with no insert; the INSERT adds `referrer_host, referrer_class, traffic_class`; `ensureAnalyticsSchema(sql)` is awaited before the dedup SELECT.

- [x] **Step 1: Write the failing tests**

```ts
// analytics-tracking-rules.test.ts
it("excludes the dashboard and the backlog", () => {
  expect(isTrackedPath("/analytics")).toBe(false);
  expect(isTrackedPath("/analytics/login")).toBe(false);
  expect(isTrackedPath("/backlog/some-post")).toBe(false);
  expect(isTrackedPath("/blog/some-post")).toBe(true);
  expect(isTrackedPath("/")).toBe(true);
});
// analytics-schema.test.ts
it("runs every statement once per process", async () => {
  const sql = vi.fn().mockResolvedValue([]);
  await ensureAnalyticsSchema(sql as never);
  await ensureAnalyticsSchema(sql as never);
  expect(sql).toHaveBeenCalledTimes(SCHEMA_STATEMENTS.length);
  expect(SCHEMA_STATEMENTS.join("\n")).toContain("ADD COLUMN IF NOT EXISTS traffic_class");
});
// route.test.ts additions
it("stores the client referrer, its host and class, and the insert-time traffic class", ...)
  // body { path: "/blog/x", referrer: "https://www.google.com/search?q=x" }, header referer ignored
  // asserts the INSERT call's text contains "referrer_class" and its values include "google.com", "search", null
it("records nothing for /analytics paths", ...) // 204, sql not called for INSERT
it("marks a hit from the forged referrer as a bot at insert", ...) // referrer https://www.aocr.org/ -> traffic_class "bot"
```

- [x] **Step 2: Run and confirm failure** (`npx vitest run src/lib/analytics-tracking-rules.test.ts src/lib/analytics-schema.test.ts src/app/api/analytics/track/route.test.ts`)
- [x] **Step 3: Implement.** Tracker: `beacon("/api/analytics/track", { path: fullPath, referrer: document.referrer })`, and return early from both effects when `!isTrackedPath(pathname)`.
- [x] **Step 4: Run the three test files, PASS.** `npx tsc --noEmit` clean.
- [x] **Step 5: Commit** `fix: CLAUD-778 capture the client referrer and classify page views at insert`

### Task 3: Referrer and traffic classifiers, and the pending-row batch  `parallel-safe`

**Files:**
- Create: `src/lib/traffic/referrer.ts`, `src/lib/traffic/classify.ts`, `src/lib/traffic/backfill.ts`
- Test: `src/lib/traffic/referrer.test.ts`, `src/lib/traffic/classify.test.ts`, `src/lib/traffic/backfill.test.ts`

**Interfaces:**
- Produces: `export type ReferrerClass = "direct" | "internal" | "search" | "social" | "ai" | "newsletter" | "forged" | "other"`; `export function referrerHost(referrer: string): string` (lowercase hostname, leading `www.` stripped, `""` for non-URLs); `export function classifyReferrer(referrer: string, utm: { source?: string | null; medium?: string | null }): { host: string; cls: ReferrerClass }`. Lists exported: `SEARCH_HOSTS` (google.*, bing.com, duckduckgo.com, search.yahoo.com, ecosia.org, search.brave.com, yandex.*, baidu.com, startpage.com, kagi.com), `SOCIAL_HOSTS` (x.com, twitter.com, t.co, linkedin.com, lnkd.in, facebook.com, reddit.com, news.ycombinator.com, bsky.app, threads.net, mastodon.social, lobste.rs, dev.to, medium.com, youtube.com), `AI_HOSTS` (chatgpt.com, chat.openai.com, perplexity.ai, claude.ai, copilot.microsoft.com, gemini.google.com, you.com, poe.com), `FORGED_HOSTS` (aocr.org), `INTERNAL_HOST_SUFFIXES` (cryptoflexllc.com, .vercel.app, localhost). Precedence: `utm.medium === "email"` or `utm.source === "newsletter"` is `newsletter`; `utm.source` of `chatgpt.com` is `ai`; then host lists in the order forged, internal, search, social, ai; empty host is `direct`; else `other`.
- Produces: `export type TrafficClass = "human" | "bot" | "owner" | "self"`; `export function isBotUserAgent(ua: string): boolean` (case-insensitive: bot, crawl, spider, slurp, headless, bytespider, python-requests, go-http-client, curl/, wget/, scrapy, facebookexternalhit, preview, okhttp, java/, libwww); `export function classifyAtInsert(i: { userAgent: string; referrerClass: ReferrerClass; pagePath: string }): TrafficClass | null` (`self` for untracked prefixes, `bot` for bot UA or `forged`, else `null`); `export function classifyFromSignals(s: { userAgent: string; referrerClass: ReferrerClass; pagePath: string; isHosting: boolean | null; hasEngagement: boolean; isOwnerIp: boolean }): TrafficClass` (order: self, owner, bot when UA or forged or (`isHosting === true` and no engagement), else human).
- Produces: `export async function classifyPendingPageViews(sql: SqlTag, limit = 5000): Promise<number>`: one UPDATE over the oldest `limit` rows where `traffic_class IS NULL`, using a CTE with `ip_intel.is_hosting OR ip_intel.is_datacenter` as hosting, `EXISTS` on `scroll_events` or `page_engagement` for the same `ip_address` and `page_path` within one day as engagement, and `auth_attempts` successes in the last 30 days as owner; returns the row count. Consumes `isTrackedPath` prefixes from Task 2 by re-declaring the two literals in SQL (`page_path LIKE '/analytics%' OR page_path LIKE '/backlog%'`).

- [x] **Step 1: Write the failing tests**

```ts
// referrer.test.ts
it.each([
  ["", "direct", ""],
  ["javascript:void(0)", "direct", ""],
  ["https://www.google.com/search?q=x", "search", "google.com"],
  ["https://www.aocr.org/", "forged", "aocr.org"],
  ["https://www.cryptoflexllc.com/blog", "internal", "cryptoflexllc.com"],
  ["https://cryptoflexllc-abc-chris.vercel.app/", "internal", "cryptoflexllc-abc-chris.vercel.app"],
  ["https://news.ycombinator.com/item?id=1", "social", "news.ycombinator.com"],
  ["https://chatgpt.com/", "ai", "chatgpt.com"],
  ["https://example.org/post", "other", "example.org"],
])("classifies %s", (ref, cls, host) => {
  expect(classifyReferrer(ref, {})).toEqual({ host, cls });
});
it("newsletter and chatgpt utm win over the host", () => {
  expect(classifyReferrer("", { source: "newsletter", medium: "email" }).cls).toBe("newsletter");
  expect(classifyReferrer("", { source: "chatgpt.com" }).cls).toBe("ai");
});
// classify.test.ts
it("flags crawler agents", () => { expect(isBotUserAgent("Mozilla/5.0 (compatible; Bytespider; ...)")).toBe(true); expect(isBotUserAgent("Mozilla/5.0 (Windows NT 10.0) Chrome/146")).toBe(false); });
it("classifies at insert", () => {
  expect(classifyAtInsert({ userAgent: "Chrome", referrerClass: "forged", pagePath: "/" })).toBe("bot");
  expect(classifyAtInsert({ userAgent: "Chrome", referrerClass: "search", pagePath: "/analytics" })).toBe("self");
  expect(classifyAtInsert({ userAgent: "Chrome", referrerClass: "search", pagePath: "/blog/x" })).toBeNull();
});
it("hosting without engagement is a bot, hosting with engagement is human, owner wins over bot", ...)
// backfill.test.ts
it("updates a bounded batch and returns the count", async () => {
  const sql = vi.fn().mockResolvedValue([{ updated: 42 }]);
  expect(await classifyPendingPageViews(sql as never, 100)).toBe(42);
  const text = sql.mock.calls[0][0].join("?");
  expect(text).toContain("traffic_class IS NULL");
  expect(text).toContain("LIMIT");
});
it("returns 0 when nothing is pending", ...)
```

- [x] **Step 2: Run and confirm failure**
- [x] **Step 3: Implement the three modules.**
- [x] **Step 4: Run `npx vitest run src/lib/traffic`, PASS; `npx tsc --noEmit` clean.**
- [x] **Step 5: Commit** `feat: CLAUD-778 referrer and traffic classifiers with a pending-row batch`

### Task 4: Vitals and the live feed stop lying  `parallel-safe`

**Files:**
- Modify: `src/components/web-vitals-reporter.tsx`, `src/app/api/analytics/vitals/route.ts`, `src/app/api/analytics/live/route.ts`
- Test: `src/app/api/analytics/vitals/route.test.ts` (extend), `src/app/api/analytics/live/route.test.ts` (create)

**Interfaces:**
- Consumes: `isTrackedPath` from Task 2 (import; the controller merges Task 2 first).
- Live route: `subscribers` uses `subscribed_at`; `client_errors` uses `recorded_at` and `error_message`; page view rows carry `traffic_class`; hits with `traffic_class = 'self'` are skipped; hits with `traffic_class = 'bot'` get `tag: "bot"`; `EventTag` gains `"bot"`.

- [x] **Step 1: Write the failing tests**

```ts
// vitals route
it("accepts but does not store vitals for /analytics paths", ...) // 204, no INSERT
// live route (mock getDb; verifyAuthToken mocked true; rate limiter mocked allowed)
it("reads subscribers by subscribed_at and client errors by recorded_at", async () => {
  // capture every sql call's text; assert one contains "subscribed_at" and one contains "error_message"
});
it("tags bot hits and hides self hits", ...) // rows with traffic_class bot/self/human -> tags ["bot","hit"] only
```

- [x] **Step 2: Run and confirm failure**
- [x] **Step 3: Implement.** Reporter returns before registering listeners when `!isTrackedPath(pathname)`.
- [x] **Step 4: Run the two route test files, PASS.**
- [x] **Step 5: Commit** `fix: CLAUD-778 keep dashboard vitals out of the data and repair the live feed queries`

### Wave 1 checkpoint

- [x] Merge order: Task 1 (already on the wave branch), Task 3, Task 2, Task 4. Typecheck after each merge.
- [x] `npx tsc --noEmit && npm run lint && npm test && npm run build`
- [x] Headless harness on `next start` (port 3100, throwaway `ANALYTICS_SECRET`, cookie minted through `POST /api/analytics/auth` from the page context): every tab renders its empty state with no console errors and `page.tsx` under 200 lines.
- [x] One `code-reviewer` on `git diff <wave-base>..HEAD`; one `security-reviewer` in parallel (tracker input, track route, schema statements). CRITICAL and HIGH fixed before the PR.
- [x] PR, CI, merge, production check in the owner's Chrome session: dashboard renders, live feed shows a `bot` or `hit` row, Vercel runtime errors show nothing new, and after one dashboard load the schema columns exist (the live feed query succeeds).
- [x] Jira: CLAUD-778 to Done with the merge commit. Status line to the owner.

---

## Wave 2: honest numbers, seven tabs, one design system

**Done when:** every KPI shows humans only with a delta vs the previous period; the header fits in one row at 1440 with no tab overflow arrows; the tab and the scope are in the URL and only that tab's section renders; no file under `_components` uses a forbidden class; the 12 orphans and the two misleading cards are gone; the Content tab has the post performance table; CI green; production verified.

### Task 5: Honest query modules  `parallel-safe`

**Files:**
- Modify: `src/lib/analytics-queries/shared.ts`, `overview.ts`, `audience.ts` (rename to `readers.ts`), `content.ts`, `technology.ts` (fold into `readers.ts`), `performance.ts`, `security.ts`, `newsletter.ts`
- Create: `src/lib/analytics-queries/posts.ts`
- Modify: `src/app/analytics/_sections/{overview,content,readers}.tsx` (KPI items and new panels only; Task 6 owns the shell and page)
- Test: `src/lib/analytics-queries/shared.test.ts` (extend), `src/lib/analytics-queries/overview.test.ts`, `posts.test.ts`

**Interfaces:**
- Produces: `export type TrafficScope = "humans" | "all"`; `export function trafficFilter(scope: TrafficScope): string` returning `"AND traffic_class = 'human'"` or `""` (interpolated through `sql.unsafe` or a static branch, never user text); `export function deltaPercent(current: number, previous: number): { value: number; direction: "up" | "down" } | null` (null when previous is 0; one decimal); `export const PREVIOUS_WINDOW_SQL` helper documented in the file: previous window is `visited_at > NOW() - INTERVAL '1 day' * (2 * days) AND visited_at <= NOW() - INTERVAL '1 day' * days`.
- Produces: `loadOverview(days, scope): Promise<OverviewData>` where `OverviewData` adds `kpis: { views: KpiWindow; readers: KpiWindow; readThrough: KpiWindow; readerMinutes: KpiWindow; pending: number }` with `KpiWindow = { current: number; previous: number }`, `trend: Array<{ date: string; humans: number; bots: number; new: number; returning: number }>`, `publishDates: string[]` (from `getAllPosts()` within the window). Readers = distinct `ip_address` with a `scroll_events` or `page_engagement` row in the window; Read-through = `100 * depth-100 scroll events on /blog/ paths / human views of /blog/ paths`; Reader minutes = `SUM(time_seconds)/60` for humans (join `page_engagement` to human IPs); median dwell uses `PERCENTILE_CONT(0.5)`.
- Produces: `loadPostPerformance(days, scope, limit = 25): Promise<PostPerformanceRow[]>` with `{ page_path, title, views, readers, read_through_pct, median_seconds, subscribes, comments }` (title from `getAllPosts()` by slug, `page_path` for unknown slugs). Subscribes join `subscribers.source_page`; comments join `blog_comments.slug` to `/blog/<slug>`.
- Every loader takes `(days: number, scope: TrafficScope)`.

- [ ] **Step 1: Write the failing tests**

```ts
it("deltaPercent", () => {
  expect(deltaPercent(120, 100)).toEqual({ value: 20, direction: "up" });
  expect(deltaPercent(80, 100)).toEqual({ value: 20, direction: "down" });
  expect(deltaPercent(5, 0)).toBeNull();
});
it("trafficFilter", () => { expect(trafficFilter("humans")).toContain("traffic_class = 'human'"); expect(trafficFilter("all")).toBe(""); });
it("loadOverview runs the human filter and the previous window", async () => {
  // mock sql returning [] for each query; assert at least one query text contains "traffic_class = 'human'" and one contains "2 * "
});
it("loadPostPerformance maps slugs to titles", async () => { /* mock sql row for /blog/<existing slug>, expect title from getAllPosts (mock) */ });
```

- [ ] **Step 2: Run and confirm failure**
- [ ] **Step 3: Implement.** Sections: Overview KPI strip becomes Views, Readers, Read-through (percent), Reader minutes, each with `delta` from `deltaPercent`; the bounce KPI is gone; the header meta line shows `PENDING <n>` while `pending > 0` (passed up through `OverviewData`).
- [ ] **Step 4: Run `npx vitest run src/lib/analytics-queries`, PASS.**
- [ ] **Step 5: Commit** `feat: CLAUD-779 humans-only loaders with period deltas and the post performance query`

### Task 6: Seven tabs, URL state, one section per load, compact header  `parallel-safe`

**Files:**
- Modify: `src/app/analytics/page.tsx`, `src/app/analytics/_components/analytics-shell.tsx`, `src/app/analytics/_sections/registry.ts`
- Create: `src/app/analytics/_components/analytics-header.tsx`
- Modify: `src/app/analytics/analytics.css` (header and toolbar rules in place, plus the `REGION: shell` block)
- Delete: `src/app/analytics/_sections/activity.tsx`, `technology.tsx`, `audience.tsx` (content moves: visit log to `security.tsx` in Task 11, donuts to `readers.tsx` in Task 5)
- Test: `src/app/analytics/_components/analytics-shell.test.tsx`, `src/app/analytics/_sections/registry.test.ts` (update)

**Interfaces:**
- Produces: `DEFAULT_TABS` = overview "Overview", readers "Readers", content "Content", performance "Performance", security "Security", newsletter "Newsletter", agents "Agents" (numbers 01 to 07). `export type TabId = typeof DEFAULT_TABS[number]["id"]`; `export function resolveTab(param: string | undefined): TabId` (default overview); `export function resolveScope(param: string | undefined): TrafficScope` (default humans).
- Shell props become `{ activeTab: TabId; currentDays: number; scope: TrafficScope; tabs?: TabDef[] }`. Tabs render as `<Link role="tab" href={`/analytics?tab=${id}&days=${days}&scope=${scope}`}>`; the range segment and a new two-state scope segment ("Humans" / "All") also link. `localStorage` tab persistence is removed. The row filter and the auto toggle stay.
- Page: reads `tab`, `days`, `scope` from `searchParams`, renders `<Suspense>` around `SECTIONS[tab]({ days, scope })` only.
- Header: `AnalyticsHeader({ activeSessions, generatedAt, queryTimeMs, days, pending })` renders crumbs, the title "Signal, not slop.", the live pill, Refresh, Backlog, Sign out in one grid row; the sub copy is gone; the meta line (RANGE, GENERATED, QUERY, PENDING when non-zero, SOURCE) renders as one 11px mono line under the toolbar. `.ax-toolbar` gets `background: var(--background)` (opaque) and loses the blur.

- [ ] **Step 1: Write the failing tests**

```tsx
it("renders seven tab links carrying tab, days and scope", () => {
  render(<AnalyticsShell activeTab="content" currentDays={7} scope="all"><div /></AnalyticsShell>);
  const tabs = screen.getAllByRole("tab");
  expect(tabs).toHaveLength(7);
  expect(tabs[2]).toHaveAttribute("aria-selected", "true");
  expect(tabs[0]).toHaveAttribute("href", "/analytics?tab=overview&days=7&scope=all");
});
it("resolveTab and resolveScope fall back", () => { expect(resolveTab("nope")).toBe("overview"); expect(resolveScope("x")).toBe("humans"); });
```

- [ ] **Step 2: Run and confirm failure**
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run the two tests, PASS; `npx tsc --noEmit`.**
- [ ] **Step 5: Commit** `feat: CLAUD-779 seven tabs in the URL, one section per load, compact header`

### Task 7: Port the chart components to the editorial system  `parallel-safe`

**Files:**
- Modify: `src/app/analytics/_components/{api-response-chart,auth-attempts-chart,bot-trend-chart,gmail-metrics-chart,new-vs-returning-chart,peak-hours-heatmap,scroll-depth-chart,subscriber-growth-chart,time-on-page-chart}.tsx`
- Modify: `src/app/analytics/analytics.css` (`REGION: charts` block only)
- Delete: `src/app/analytics/_components/panel-wrapper.tsx` once no chart imports it
- Test: `src/app/analytics/_components/charts-editorial.test.tsx`

**Interfaces:**
- Produces: each chart keeps its props and default export name; wrappers become plain `<div className="ax-chart">` with heights from CSS; colours come from `var(--primary)`, `var(--ax-green)`, `var(--ax-amber)`, `var(--ax-red)`, text from `var(--fg-3)`; tooltips use `ChartContainer` and `ChartTooltipContent` from `src/components/ui/chart`.
- Scroll depth and time on page show the slug (`page_path` without `/blog/`) with a `title` attribute carrying the full path, and link rows with `next/link`.
- Bot trend chart gains a stacked humans and bots mode using `OverviewData.trend` shape from Task 5 (`{ date, humans, bots }`), with publish markers rendered as `ReferenceLine` elements from a `markers: string[]` prop.

- [ ] **Step 1: Write the failing test**

```ts
const CHARTS = [ ...nine file names... ];
it.each(CHARTS)("%s uses no Tailwind-era classes", (file) => {
  const src = fs.readFileSync(path.join(__dirname, file), "utf8");
  for (const bad of ["rounded-", "bg-card", "text-muted-foreground", "border-border", "panel-wrapper"]) expect(src).not.toContain(bad);
});
it("bot trend renders a publish marker", () => { /* render with markers ["2026-11-01"], expect a reference line element with that label */ });
```

- [ ] **Step 2: Run and confirm failure**
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run `npx vitest run src/app/analytics/_components/charts-editorial.test.tsx`, PASS.**
- [ ] **Step 5: Commit** `refactor: CLAUD-779 editorial chart components`

### Task 8: Port the panels, delete the orphans and the misleading cards  `parallel-safe`

**Files:**
- Modify: `src/app/analytics/_components/{campaign-panel,client-errors-panel,comments-panel,data-table,guestbook-panel,search-queries-panel,subscriber-panel,unsubscribe-panel,unsubscribe-row,vercel-firewall-card,web-vitals-grid}.tsx`
- Create: `src/app/analytics/_components/referrer-classes.tsx`, `post-performance-table.tsx`
- Delete: `browser-chart.tsx`, `countries-chart.tsx`, `device-chart.tsx`, `os-chart.tsx`, `page-views-chart.tsx`, `referrer-chart.tsx`, `section-header.tsx`, `stat-card.tsx`, `top-converting-panel.tsx`, `top-pages-chart.tsx`, `vercel-speed-insights-card.tsx`, `visitor-map.tsx`, `vercel-analytics-card.tsx`
- Modify: `src/app/analytics/analytics.css` (`REGION: panels` block only)
- Modify: `src/app/analytics/_sections/content.tsx` (mount the two new components; Task 5 owns its KPI lines, so touch only the panel grid), `_sections/performance.tsx` (remove the Vercel summary card and the FID, SI, TBT cards)
- Test: `src/app/analytics/_components/post-performance-table.test.tsx`, `referrer-classes.test.tsx`, `src/app/analytics/_components/editorial-only.test.ts`

**Interfaces:**
- Produces: `PostPerformanceTable({ rows: PostPerformanceRow[] })` sortable by views, readers, read_through_pct, median_seconds (same whitelisted `SortKey` pattern as `api-response-table.tsx`), rows link to the post.
- Produces: `ReferrerClasses({ classes: Array<{ cls: ReferrerClass; views: number; visitors: number }>; hosts: Array<{ host: string; cls: ReferrerClass; views: number }> })` with class chips in a fixed order (search, ai, social, newsletter, direct, other, internal, forged) and a ranked host list beneath.
- `web-vitals-grid.tsx`: `METRIC_ORDER` becomes `["LCP", "INP", "CLS", "FCP", "TTFB"]`; FID, SI and TBT removed.
- `editorial-only.test.ts`: reads every `.tsx` under `_components` and fails on any forbidden string from Global Constraints. Task 7's files must already pass; the controller runs this test at the wave checkpoint after both merges.
- Unsubscribe panel and row keep their test contracts (`unsubscribe-panel.test.tsx`, `unsubscribe-row.test.tsx` stay green).

- [ ] **Step 1: Write the failing tests** (table sorts by a clicked header and renders links; referrer classes render chips in order; editorial-only guard)
- [ ] **Step 2: Run and confirm failure**
- [ ] **Step 3: Implement.** Deleting the 13 files must leave `npx tsc --noEmit` clean.
- [ ] **Step 4: Run the three tests plus the unsubscribe tests, PASS.**
- [ ] **Step 5: Commit** `refactor: CLAUD-779 editorial panels, post performance table, orphan and dead-card removal`

### Wave 2 checkpoint

- [ ] Merge order: Task 5, Task 6, Task 7, Task 8. Typecheck after each. Keep both sides of any `analytics.css` region conflict.
- [ ] `npx tsc --noEmit && npm run lint && npm test && npm run build`; `editorial-only.test.ts` green across the directory.
- [ ] Harness at 1440 and 390 on `next start`: no overflow arrows on the tab strip at 1440; `document.documentElement.scrollWidth` equals the viewport at 390; the toolbar is opaque (computed `background-color` has alpha 1); only the active section's markup is in the DOM (`[data-panel]` count is 1).
- [ ] Review: one `code-reviewer` on the wave diff. Fix CRITICAL and HIGH.
- [ ] PR, CI, merge, production check in Chrome: KPIs show deltas, Readers tab shows donuts, Content shows the post table and referrer classes, `?scope=all` raises Views, `?tab=security` works as a link.
- [ ] Status line to the owner.

---

## Wave 3: visitor intelligence

**Done when:** clicking any IP on the dashboard opens the dossier panel with the visitor's history and enrichment; the Security tab shows traffic by network type and known-bad overlap; the daily cron classifies pending rows and enriches new IPs; no property links or street addresses remain; CI green; production verified with a real lookup.

### Task 9: Enrichment pipeline and cache  `critical` `parallel-safe`

**Files:**
- Create: `src/lib/ip-enrichment/types.ts`, `cidr.ts`, `providers/ipapi-is.ts`, `providers/tor-exits.ts`, `providers/spamhaus-drop.ts`, `providers/rdap.ts` (moved from the route), `cache.ts`, `enrich.ts`, `batch.ts`
- Modify: `src/app/api/analytics/ip-intel/route.ts` (keep auth, IP validation and the private-range guard; replace the body with `enrichIp`)
- Test: `src/lib/ip-enrichment/*.test.ts`, `src/app/api/analytics/ip-intel/route.test.ts` (update)

**Interfaces:**
- Produces: `export type IpEnrichment = { ip: string; asn: string; asName: string; company: string; country: string; city: string; region: string; latitude: string; longitude: string; isDatacenter: boolean | null; isTor: boolean; isProxy: boolean | null; isVpn: boolean | null; isAbuser: boolean | null; abuserScore: string; onDrop: boolean; whoisOrg: string; sources: string[]; enrichedAt: string }`.
- `fetchIpapiIs(ip: string, key: string | undefined, fetchImpl = fetch): Promise<Partial<IpEnrichment>>`: GET `https://api.ipapi.is/?q=<ip>` with `&key=` when set; anonymous responses fill asn, company, geo only and leave the four nullable flags `null`; keyed responses map `is_datacenter`, `is_vpn`, `is_proxy`, `is_tor`, `is_abuser`, `company.abuser_score`. Timeout 5s. Free key quota is 1,000 lookups a day (ipapi.is free tier page, 2026-09).
- `loadTorExitSet(sql, fetchImpl = fetch): Promise<Set<string>>` from `https://check.torproject.org/torbulkexitlist`, cached in `threat_lists` under name `tor-exits` for 24 hours and in a module variable.
- `loadDropCidrs(sql, fetchImpl = fetch): Promise<Array<[number, number]>>` from `https://www.spamhaus.org/drop/drop.txt` (lines `a.b.c.d/n ; SBLnnn`, comments start with `;`), cached as `spamhaus-drop` for 24 hours; `ipv4ToInt(ip): number | null` and `ipInCidrs(ip, cidrs): boolean` in `cidr.ts` (IPv6 returns false).
- `getCachedIntel(sql, ip): Promise<IpEnrichment | null>` (hit when `enriched_at` within 7 days); `upsertIntel(sql, data): Promise<void>` writes the legacy columns too (`isp`, `org`, `as_number`, `as_name`, `is_hosting = isDatacenter ?? false`, `is_proxy`, `country`, `city`, `region`, `latitude`, `longitude`, `whois_org`) so Wave 1's batch keeps working.
- `enrichIp(sql, ip, deps = { fetchImpl: fetch, key: process.env.IPAPI_IS_KEY }): Promise<IpEnrichment>`: cache, else ipapi.is + RDAP + Tor set + DROP, upsert, return. Nominatim is gone.
- `enrichPendingIps(sql, limit = 200): Promise<number>` in `batch.ts`: distinct IPs from `page_views` in the last 2 days with no `ip_intel` row or `enriched_at` older than 30 days, enriched sequentially with a 1.4s spacing (45 a minute), stops at `limit`.
- Route: `GET /api/analytics/ip-intel?ip=` returns `{ enrichment: IpEnrichment, cached: boolean }`.

- [ ] **Step 1: Write the failing tests** (ipapi anonymous keeps flags null; keyed maps flags; tor list parse and 24h cache hit skips fetch; DROP parse ignores comments and matches a CIDR; IPv6 never matches; `enrichIp` returns cached without fetching; route returns 400 for private IPs and 200 shape `{ enrichment, cached }`)
- [ ] **Step 2: Run and confirm failure**
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run `npx vitest run src/lib/ip-enrichment src/app/api/analytics/ip-intel`, PASS.**
- [ ] **Step 5: Commit** `feat: CLAUD-779 IP enrichment pipeline over HTTPS with abuse lists and a cache`

### Task 10: Visitor dossier endpoint, panel and IP links  `parallel-safe`

**Files:**
- Create: `src/lib/analytics-queries/visitor.ts`, `src/app/api/analytics/visitor/route.ts`, `src/app/analytics/_components/visitor-panel.tsx`, `src/app/analytics/_components/ip-link.tsx`
- Modify: `src/app/analytics/_components/{live-feed,client-errors-panel,subscriber-panel,guestbook-panel,comments-panel}.tsx` (IP text becomes `<IpLink ip=… />`), `src/app/analytics/page.tsx` (mount `<VisitorPanelHost />` once, after the shell)
- Delete: `src/app/analytics/_components/ip-osint-panel.tsx`
- Modify: `src/app/analytics/analytics.css` (`REGION: intel` block only)
- Test: `src/lib/analytics-queries/visitor.test.ts`, `src/app/api/analytics/visitor/route.test.ts`, `src/app/analytics/_components/visitor-panel.test.tsx`, `ip-link.test.tsx`

**Interfaces:**
- Produces: `export type VisitorDossier = { ip: string; firstSeen: string | null; lastSeen: string | null; hits: number; classes: Record<string, number>; pages: Array<{ page_path: string; views: number; last: string }>; userAgents: string[]; locations: string[]; engagement: { scrolls: number; maxDepth: number; seconds: number }; errors: number; auth: { success: number; fail: number }; subscriber: boolean; comments: number; guestbook: number }`; `loadVisitorDossier(sql, ip): Promise<VisitorDossier>` (every sub-query `.catch`es to its empty value).
- Route: `GET /api/analytics/visitor?ip=` with `verifyApiAuth`, same IP validation as ip-intel, returns `{ dossier }`; the panel calls this first and `/api/analytics/ip-intel` second.
- `IpLink({ ip, children? })`: a `<button type="button" className="ax-ip">` that dispatches `window.dispatchEvent(new CustomEvent("ax:open-visitor", { detail: { ip } }))`. `VisitorPanelHost()` (client) listens, fetches both endpoints, and renders `VisitorPanel` inside a native `<dialog className="ax-visitor">` (non-modal `show()`, Escape and a Close button close it, focus moves to the heading on open). Sections: Identity (class chips: human/bot/owner, datacenter, Tor, VPN, proxy, abuser, DROP; unknown flags print "unknown"), Network (ASN, company, WHOIS org), Location (city, region, country only), History (first and last seen, hits, pages, agents), Engagement, Signals (errors, auth, subscriber, comments, guestbook). No street address, no property links.

- [ ] **Step 1: Write the failing tests** (dossier maps rows; route 401 without cookie and 200 shape; IpLink dispatches the event with the ip; the host opens the dialog on the event and renders the headings)
- [ ] **Step 2: Run and confirm failure**
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run the four tests, PASS.**
- [ ] **Step 5: Commit** `feat: CLAUD-779 visitor dossier panel reachable from every IP`

### Task 11: Security tab and the daily batch  `parallel-safe`

**Files:**
- Modify: `src/lib/analytics-queries/security.ts`, `src/app/analytics/_sections/security.tsx`
- Create: `src/app/analytics/_components/network-types-panel.tsx`, `known-bad-panel.tsx`, `src/app/analytics/_components/recent-visits-table.tsx` (moved from Activity, rows use `IpLink` from Task 10 by import name)
- Modify: `src/app/api/cron/cleanup-page-views/route.ts`, `src/app/analytics/_components/vercel-firewall-card.tsx` (unavailable state)
- Test: `src/lib/analytics-queries/security.test.ts`, `src/app/api/cron/__tests__/cleanup-page-views.test.ts`

**Interfaces:**
- Produces: `loadNetworkTypes(days, scope): Promise<Array<{ type: "residential" | "datacenter" | "proxy" | "unknown"; visitors: number; views: number }>>` (join `page_views` to `ip_intel`); `loadKnownBad(days): Promise<{ visitors: number; rows: Array<{ ip: string; reasons: string[]; hits: number; last: string }> }>` (reasons from `is_abuser`, `is_tor`, `on_drop`); security KPIs become Bots, Known bad, Auth failures, Client errors, each with `deltaPercent`.
- Cron: after the retention UPDATE, loop `classifyPendingPageViews(sql, 5000)` up to 20 times until it returns 0, then `enrichPendingIps(sql, 200)`; the JSON response gains `classified` and `enriched`.
- Firewall card: when any of `config`, `attackStatus`, `events` is null, the matching block renders "Unavailable from the Vercel API" in mono instead of an empty table; "Firewall Denied" KPI is removed (it counted anomalies).

- [ ] **Step 1: Write the failing tests** (network types SQL joins `ip_intel`; known bad reasons; cron calls classify until 0 and reports counts)
- [ ] **Step 2: Run and confirm failure**
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run the two tests, PASS.**
- [ ] **Step 5: Commit** `feat: CLAUD-779 security tab with network types, known-bad overlap and the daily batch`

### Wave 3 checkpoint

- [ ] Merge order: Task 9, Task 10, Task 11. Typecheck after each.
- [ ] Full gate: `npx tsc --noEmit && npm run lint && npm test && npm run build`
- [ ] Harness: the Security tab renders; clicking an `IpLink` opens the dialog (DOM check for `dialog.ax-visitor[open]`).
- [ ] Review: `code-reviewer` plus `security-reviewer` (external fetches, SSRF guard, new endpoints). Fix CRITICAL and HIGH.
- [ ] PR, CI, merge, production: open the dossier for a bot IP from the visit log; confirm enrichment fields fill (anonymous tier until the key exists) and the Known bad panel renders.
- [ ] Status line to the owner.

---

## Wave 4: new signals and close-out

**Done when:** Performance shows the Web Analytics cross-check (or its "not enabled" state), the deploy strip and the ops panel; Overview shows the shipping panel; Content shows Search Console (or its "not configured" state); Newsletter shows digest sends and click-through; the three crons record runs; docs, memory and Jira are updated; the owner steps are filed.

### Task 12: Vercel and GitHub signals  `parallel-safe`

**Files:**
- Modify: `src/lib/vercel-api.ts`, `src/lib/vercel-api.test.ts`
- Create: `src/lib/github-activity.ts`, `src/lib/github-activity.test.ts`, `src/app/analytics/_components/web-analytics-card.tsx`, `deploys-strip.tsx`, `shipping-panel.tsx`
- Modify: `src/lib/analytics-queries/performance.ts`, `src/app/analytics/_sections/performance.tsx` (mount the card, the strip and `<PerformanceOps />` from the seam stub), `src/lib/analytics-queries/overview.ts`, `src/app/analytics/_sections/overview.tsx` (mount `ShippingPanel`)

**Interfaces:**
- Produces: `fetchWebAnalyticsDaily(since: string, until: string): Promise<Array<{ date: string; pageviews: number; visitors: number }>>` (GET `/v1/query/web-analytics/visits/aggregate?projectId&teamId&since=YYYY-MM-DD&until=YYYY-MM-DD&by=day`; response `{ data: [{ timestamp, pageviews, visitors }] }`); `fetchWebAnalyticsCount(since, until): Promise<{ pageviews: number; visitors: number } | null>`; both return `null` or `[]` on a 404 whose body contains "Web Analytics not found" and set `webAnalyticsState: "not-enabled"`; a typed `export type WebAnalyticsState = "ok" | "not-enabled" | "unavailable"`.
- Produces: `fetchDeployments(limit = 10): Promise<Array<{ id: string; state: string; createdAt: number; readyAt: number | null; target: string; commitMessage: string; commitSha: string }>>` (GET `/v6/deployments?projectId&teamId&limit`), cache `next: { revalidate: 300 }`.
- Produces: `fetchRecentCommits(repo: string, sinceIso: string, token?: string): Promise<Array<{ sha: string; message: string; date: string }>>` (GET `https://api.github.com/repos/${repo}/commits?since=&per_page=100`, `Authorization: Bearer` when `GITHUB_TOKEN` is set), `revalidate: 3600`.
- `WebAnalyticsCard({ state, ours: { pageviews, visitors }, theirs: { pageviews, visitors } | null, daily })`: when `not-enabled` prints "Web Analytics is not enabled on this project" and the command `vercel project web-analytics enable cryptoflexllc`; when ok shows both counts and the ratio.
- `DeploysStrip({ deployments })`: ten chips (state colour, relative time, short message); `ShippingPanel({ commits7d, commits14d, deploys7d, lastDeploy })` on Overview.

- [ ] **Step 1: Write the failing tests** (parsers over the documented fixtures; 404 "not found" maps to `not-enabled`; deployments map; commits map; cards render the two states)
- [ ] **Step 2: Run and confirm failure**
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run `npx vitest run src/lib/vercel-api.test.ts src/lib/github-activity.test.ts src/app/analytics/_components`, PASS.**
- [ ] **Step 5: Commit** `feat: CLAUD-779 Vercel web analytics cross-check, deploy strip and shipping panel`

### Task 13: Search Console  `critical` `parallel-safe`

**Files:**
- Create: `src/lib/search-console.ts`, `src/lib/search-console.test.ts`, `src/app/analytics/_components/search-console-panel.tsx`
- Modify: `src/lib/analytics-queries/content.ts`, `src/app/analytics/_sections/content.tsx` (mount the panel)

**Interfaces:**
- Produces: `isSearchConsoleConfigured(): boolean` (all three env names present); `normalisePrivateKey(raw: string): string` (replaces literal `\n` with newlines); `buildServiceAccountJwt(creds: { clientEmail: string; privateKey: string }, nowSeconds: number): string` (header `{ alg: "RS256", typ: "JWT" }`, claims `iss`, `scope: "https://www.googleapis.com/auth/webmasters.readonly"`, `aud: "https://oauth2.googleapis.com/token"`, `iat`, `exp = iat + 3600`, signed with `crypto.createSign("RSA-SHA256")`, base64url); `getAccessToken(creds, fetchImpl = fetch): Promise<string>` (POST the token endpoint with `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer`), cached in a module variable until 60s before expiry; `fetchSearchAnalytics(q: { siteUrl: string; startDate: string; endDate: string; dimensions: Array<"query" | "page" | "date">; rowLimit?: number }, fetchImpl = fetch): Promise<Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }>>` (POST `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`).
- `loadSearchConsole(days)` in `content.ts` returns `{ configured: boolean; queries; pages; daily }` with 28-day defaults (GSC data lags about two days; `endDate` is today minus 2).
- `SearchConsolePanel` renders the not-configured state with the three env names, else top 10 queries, top 10 pages and a clicks and impressions trend.

- [ ] **Step 1: Write the failing tests** (JWT verifies with `crypto.verify` against a key pair generated in the test with `generateKeyPairSync("rsa", { modulusLength: 2048 })`; claims carry the scope and a 3600s expiry; `normalisePrivateKey`; `getAccessToken` posts the assertion; `fetchSearchAnalytics` maps rows; `isSearchConsoleConfigured` false with env unset)
- [ ] **Step 2: Run and confirm failure**
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run the test, PASS.**
- [ ] **Step 5: Commit** `feat: CLAUD-779 Search Console queries and pages on the Content tab`

### Task 14: Digest runs, cron runs, ops panel  `parallel-safe`

**Files:**
- Create: `src/lib/cron-runs.ts`, `src/lib/server-events.ts`, `src/lib/analytics-queries/ops.ts`, `src/app/analytics/_components/digest-runs-panel.tsx`
- Modify: `src/app/analytics/_sections/performance-ops.tsx` (fill the seam stub), `src/app/api/cron/weekly-digest/route.ts`, `cleanup-rate-limits/route.ts`, `cleanup-page-views/route.ts` (wrap each in `recordCronRun`), `src/app/api/analytics/track/route.ts` and `track-engagement/route.ts` (call `recordServerEvent` in the catch blocks), `src/lib/analytics-queries/newsletter.ts`, `src/app/analytics/_sections/newsletter.tsx`
- Test: `src/lib/cron-runs.test.ts`, `src/lib/server-events.test.ts`, `src/lib/analytics-queries/ops.test.ts`, `src/app/api/cron/__tests__/weekly-digest.test.ts` (extend)

**Interfaces:**
- Produces: `recordCronRun(sql, name: string, ok: boolean, durationMs: number, note = ""): Promise<void>` (never throws); `recordServerEvent(route: string, kind: string, message: string): void` (fire-and-forget like `recordApiMetric`, message truncated to 500 chars, never includes env values).
- Produces: `loadOps(): Promise<{ tables: Array<{ name: string; rows: number; bytes: number }>; cronRuns: Array<{ name: string; ran_at: string; ok: boolean; duration_ms: number; note: string }>; serverEvents7d: Array<{ route: string; kind: string; count: number; last: string }> }>` (tables from `pg_stat_user_tables` with `pg_total_relation_size`).
- Produces: `loadDigestRuns(limit = 12): Promise<Array<{ ran_at; recipients; sent; failed; clicks7d }>>` where `clicks7d` counts human page views with `utm_campaign = 'weekly-digest'` in the seven days after `ran_at`; `DigestRunsPanel({ runs })` shows sends and click-through percent.
- Weekly digest inserts one `digest_runs` row after the send loop (`recipients`, `sent`, `failed = recipients - sent`, `duration_ms`).

- [ ] **Step 1: Write the failing tests**
- [ ] **Step 2: Run and confirm failure**
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run the four test files, PASS.**
- [ ] **Step 5: Commit** `feat: CLAUD-779 digest and cron run records, server events and the ops panel`

### Task 15: Close-out (controller, inline)

- [ ] `CHANGELOG.md` entry, README analytics section delta, `docs/plans/analytics-refresh-review.md` Status set to Done with the date, this plan's Status table (PRs and merge commits).
- [ ] Vector memory: the referrer and traffic-class model, the URL-state shell, the enrichment sources and quotas, the owner steps (tagged `cryptoflexllc`).
- [ ] Jira: CLAUD-779 to Done with the four merge commits; one bundle item for MEDIUM and LOW review findings; one Waiting on me item "[cryptoflexllc] Analytics owner steps" listing: enable Web Analytics (dashboard Analytics tab, or `vercel project web-analytics enable cryptoflexllc` with CLI 65 or newer; interactive confirmation); Speed Insights enable (note from the CLI docs: enabling upgrades the project to Speed Insights Plus, check pricing first); create the free ipapi.is key and set `IPAPI_IS_KEY` (Sensitive); create a Google Cloud service account with the Search Console API enabled, add its email to the `cryptoflexllc.com` property as a Full user, set `GSC_CLIENT_EMAIL`, `GSC_PRIVATE_KEY` (Sensitive), `GSC_SITE_URL=sc-domain:cryptoflexllc.com`; redeploy after env changes.
- [ ] Final status to the owner.

### Wave 4 checkpoint

- [ ] Seam commit first: `_sections/performance-ops.tsx` exporting `PerformanceOps` that returns `null`, so Task 12 can mount it while Task 14 fills it.
- [ ] Merge order: Task 14, Task 12, Task 13. Typecheck after each.
- [ ] Full gate; harness: Performance and Content tabs render their not-configured states locally.
- [ ] Review: `code-reviewer` plus `security-reviewer` (JWT signing, token handling, external fetches).
- [ ] PR, CI, merge, production: Web Analytics card shows the "not enabled" state until the owner enables it; deploy strip lists today's deployments; Shipping panel counts commits; Search Console panel shows the env names; Newsletter shows the digest runs table (empty until Monday).
- [ ] Task 15, then the final status line.

## Open Questions

None. Owner decisions of 2026-11-07 are recorded in the Design line above.
