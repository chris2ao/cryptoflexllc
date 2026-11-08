# /analytics refresh leftovers (CLAUD-782)

Date: 2026-11-08. Jira: CLAUD-782 (bundle), split into CLAUD-791 (A), CLAUD-792 (B), CLAUD-793 (C) when work started. Source: the MEDIUM and LOW findings left open by the four wave reviews of CLAUD-779 (`docs/plans/analytics-refresh-plan.md`), plus one production observation (the Referrers host list shows one class per host).

Status: Done 2026-11-08. PR #61 (4043527): three implementers, one controller merge per task with a typecheck after each, one code review (one HIGH, two MEDIUM, five LOW fixed) and one security review (nothing CRITICAL or HIGH; its MEDIUM, engagement IPs outliving the page view anonymisation, fixed in the same retention stage), the full gate three times, a headless pass and a live check of the beacon limiter. An empty `_styles/.css` slipped into the merge and was removed in the docs commit that followed.

## Decisions

- **Track beacon rate limit:** in-memory sliding window per instance (60 beacons per IP per minute, 429 with Retry-After). No database query per beacon; Fluid reuses instances, so a flood is bounded where it lands.
- **Schema fallback:** `ensureAnalyticsSchema` returns a boolean. When the DDL chain failed or is in backoff, the track route inserts the legacy columns only; the nightly backfill derives the rest later.
- **Retention:** `server_events` and `cron_runs` 90 days, `digest_runs` 365 days (the Newsletter tab shows 12 sends), `ip_intel` rows older than 90 days with no remaining page view. All in the cleanup cron as one isolated stage.
- **KPI tiles:** every tile targets a daily series of its own measure (views breakdown, readers, read-through, reader minutes). The Readers sparkline shows engaged readers.
- **Spamhaus:** fetch `drop_v4.json`; the parser accepts both the text and the JSON line format; a stale or empty list fallback logs a warning.
- **Digest subjects:** em dashes replaced with a colon.
- **Stylesheet:** `analytics.css` becomes an index of `@import` lines over `_styles/*.css` split at the existing labelled regions, in the same order; the concatenation must be byte-identical to the original.

## Ownership map

| Task | Branch | Worktree | Owned files |
|---|---|---|---|
| A data and shell | `leftovers/a-data-shell` | `.claude/worktrees/lo-a` | `src/lib/traffic/classify.test.ts`, `src/lib/traffic/referrer.ts` + test, `src/lib/analytics-queries/{posts,newsletter,content,overview,shared}.ts` + tests, `src/lib/github-activity.ts` + test, `src/app/analytics/_sections/overview.tsx`, `src/app/analytics/_components/{trend-chart-panel,kpi-strip,post-performance-table,digest-runs-panel,analytics-shell}.tsx` + tests, `src/app/analytics/analytics.css` and new `src/app/analytics/_styles/` |
| B enrichment and intelligence | `leftovers/b-intel` | `.claude/worktrees/lo-b` | `src/lib/ip-enrichment/**` except `batch.ts`, `src/app/analytics/_components/{visitor-panel,visitor-panel-sections,ip-link}.tsx` + tests, `src/lib/analytics-queries/security-intel.test.ts` |
| C routes, crons and schema | `leftovers/c-routes` | `.claude/worktrees/lo-c` | `src/lib/analytics-schema.ts` + test, `src/lib/rate-limit.ts` + test, new `src/lib/analytics-retention.ts` + test, `src/app/api/analytics/track/route.ts` + test, `src/app/api/cron/{cleanup-page-views,cleanup-rate-limits,weekly-digest}/route.ts` and their tests, `src/lib/search-console.ts` + test |

Nobody else edits `analytics.css`. The controller merges A, then B, then C with `--no-ff`, typechecks after each, runs one code review and one security review on the wave diff, then opens the PR.

## Checkpoint

1. `npx tsc --noEmit && npm run lint && npm test && npm run build`.
2. Headless pass on `next start` with the minted cookie: Overview (tiles retarget the trend), Content (host list classes), Newsletter (partial marker), a dossier open and close (focus returns).
3. One `code-reviewer` and one `security-reviewer` on `git diff <base>..HEAD`; CRITICAL and HIGH fixed before the PR.
4. PR, CI, merge, production spot-check, Jira comments, bundle closed.
