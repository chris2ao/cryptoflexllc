# Cloudflare Migration Plan: Free Edge Adoption with Vercel Origin

**Date:** 2026-07-06
**Status:** Ready for implementation handoff
**Decision:** Option A from `docs/research/vercel-vs-cloudflare-2026-07-06.md`: move DNS to Cloudflare's free plan and proxy traffic in front of the existing Vercel deployment. Hosting, CI/CD, and the publish pipeline stay on Vercel unchanged. Total recurring cost: $0. Appendix B preserves the fully-researched path to a complete Workers migration ($5/month) if this is ever outgrown.

## Goals

1. Cloudflare WAF protecting cryptoflexllc.com (managed ruleset, custom rules, bot mitigation, rate limiting).
2. New Security tab data source on /analytics fed by Cloudflare's documented GraphQL Analytics API, replacing the undocumented `api.vercel.com/v1/security/firewall/*` endpoints.
3. Edge-level traffic analytics (bots, blocked requests, cache hits, status mix) alongside existing first-party tracking.
4. Full geo parity for the visitor map via Cloudflare visitor-location headers.
5. Long-term security-event history in Neon Postgres despite the free plan's 24-hour event retention.
6. Zero regression in: blog rendering, publish pipeline, newsletter, comments, guestbook, contact form, analytics tracking, GitHub Actions CI, Vercel auto-deploy.

## Non-Goals

- Moving hosting off Vercel (documented separately in Appendix B).
- Resolving the Vercel Hobby commercial-use question (separate business decision; this plan works identically on Hobby or Pro).
- Replacing Google Analytics or the first-party Neon tracking stack.

## Architecture

```
Before:  visitor -> Vercel DNS -> Vercel CDN/WAF -> Next.js on Vercel -> Neon
After:   visitor -> Cloudflare DNS -> Cloudflare proxy (WAF, cache, analytics) -> Vercel CDN -> Next.js on Vercel -> Neon
                                          |
                                          +-> GraphQL Analytics API -> /analytics Security tab + daily persistence cron -> Neon
```

## Key Constraints (verified July 2026)

| Constraint | Value | Consequence |
|---|---|---|
| Cloudflare free custom WAF rules | 5 | Rules below use 3, leaving 2 spare |
| Free rule expressions | equals/contains/starts_with/lists, no regex | vercel.json regexes rewritten as boolean logic |
| Free rate limiting | 1 rule, 10s window, 10s timeout | Use for login brute-force; app's DB limiter stays primary |
| firewallEventsAdaptive retention (free) | 24 hours | Daily persistence cron into Neon required |
| GraphQL API limit | 300 queries per 5 min | Cache API responses 60s server-side like existing tabs |
| Managed Transform "Add visitor location headers" | Free on all plans | Enables geo parity |
| SSL mode | Must be Full (Strict); never Flexible | Prevents redirect loops with Vercel HTTPS enforcement |
| Vercel Hobby cron cap | 2 jobs | Event persistence piggybacks on existing daily cron |
| Vercel stance on proxying | Unsupported but not a ToS violation | Rollback lever is the grey-cloud toggle |

## New Environment Variables

Add in Vercel project settings (all server-side only):

| Variable | Purpose |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Custom token: Account Analytics Read + Zone Analytics Read, scoped to the cryptoflexllc.com zone, with expiry + rotation reminder |
| `CLOUDFLARE_ZONE_ID` | Zone tag for GraphQL queries (from CF dashboard Overview) |

Never commit values. Validate presence at module load in the new `src/lib/cloudflare-api.ts` (mirror the `isVercelApiConfigured()` pattern in `src/lib/vercel-api.ts`).

---

## Phase 0: Prerequisites and DNS Inventory (no user-visible change)

1. Create a Cloudflare account (free) and add zone `cryptoflexllc.com` (Free plan). Cloudflare auto-scans existing records; do not trust the scan alone.
2. Re-authenticate the Vercel CLI (`vercel login`, token currently expired) and export the authoritative zone: `vercel dns ls cryptoflexllc.com`. Save output to `docs/plans/dns-snapshot-<date>.txt` (do not commit if it reveals anything sensitive; records here are public DNS anyway).
3. Recreate every record in the Cloudflare zone. Known-critical records verified by dig on 2026-07-06 (Appendix A has values): Google MX, SPF TXT, `google-site-verification` TXT, `google._domainkey` DKIM TXT, `_dmarc` TXT.
4. Create the site records pointing at Vercel, initially **DNS only (grey cloud)**:
   - `@` CNAME `cname.vercel-dns.com` (Cloudflare flattens apex CNAMEs)
   - `www` CNAME `cname.vercel-dns.com`
5. Verify the unswitched zone answers correctly: `dig @<assigned>.ns.cloudflare.com cryptoflexllc.com A/MX/TXT` and compare against production answers.
6. Create the `CLOUDFLARE_API_TOKEN` (scopes above) and record `CLOUDFLARE_ZONE_ID`. Smoke-test GraphQL access with the requests-by-country query in Phase 5 (it returns empty data before cutover; a 200 with a valid shape is the pass signal).

**Acceptance:** every record in the Vercel zone exists in the Cloudflare zone; dig against Cloudflare nameservers matches production answers; GraphQL token authenticates.

## Phase 1: Nameserver Cutover in DNS-Only Mode (behaviorally neutral)

1. At Squarespace (registrar): Domains -> cryptoflexllc.com -> DNS -> use custom nameservers -> enter the two Cloudflare-assigned nameservers.
2. Monitor propagation: `dig +short NS cryptoflexllc.com` until both Cloudflare nameservers answer (minutes to 24h).
3. Because all records are grey-cloud, traffic still flows straight to Vercel. Nothing changes for visitors, Vercel TLS, or Vercel's geo headers.
4. Soak for 24 to 48 hours. Validation checklist:
   - Site loads on apex and www with valid Vercel certificate
   - Send and receive a test email (Google Workspace)
   - Publish pipeline: push any commit, confirm Vercel auto-deploys
   - Google Search Console still shows the property verified
5. Vercel dashboard note: the Domains panel may warn that nameservers are no longer Vercel's. This is expected; do not remove the domain from the project.

**Rollback:** re-enter Vercel nameservers at Squarespace (restores the old zone exactly; keep it intact in Vercel until Phase 6 sign-off).

## Phase 2: Enable the Proxy (the real cutover)

1. Cloudflare SSL/TLS settings, before flipping any cloud orange:
   - Encryption mode: **Full (Strict)** (Vercel serves valid certs for the domain)
   - Always Use HTTPS: On
   - Do NOT enable: Rocket Loader (breaks Next.js hydration), Auto Minify, Mirage/Polish (paid, unnecessary), Email Obfuscation (leave off until validated against MDX content), Hotlink Protection (would break OG images fetched by social scrapers)
2. Caching posture (defaults are close to correct: Cloudflare does not cache HTML by default and respects origin Cache-Control):
   - Caching -> Configuration: leave "Respect origin" defaults, Browser Cache TTL "Respect existing headers"
   - Cache Rule 1: `http.request.uri.path starts_with "/api/"` -> Bypass cache (belt and braces for JSON endpoints)
   - No cache-everything rules. `_next/static/*` assets carry immutable headers and cache correctly by default.
3. Flip `@` and `www` to Proxied (orange cloud).
4. Immediate validation (run within minutes):
   - `curl -sI https://www.cryptoflexllc.com` shows `cf-ray` header, HTTP 200, no redirect loop
   - `curl -sI https://cryptoflexllc.com` still 301s to www exactly once (middleware behavior preserved)
   - `curl -sI http://cryptoflexllc.com` upgrades to HTTPS (single hop from Cloudflare edge)
   - Blog post page renders with images; check `/_next/image?...` URLs return 200 (known proxy risk area; this site only optimizes local images which keeps risk low)
   - `/analytics` login works (cookie flows), live tab polls, `/api/analytics/track` beacon returns 200
   - Contact form, guestbook, comments post successfully
5. Cert renewal watch: Vercel renews Let's Encrypt certs behind the proxy via HTTP-01 on `/.well-known/acme-challenge/*`. Nothing in this plan blocks that path. Set a reminder to confirm the cert renews at its next cycle; if renewal fails, temporarily grey-cloud the records for renewal or follow Vercel's custom-cert guidance.
6. Soak 24 hours watching the first-party `web_vitals` table for TTFB/LCP regression (community reports exist of added latency; the site's own RUM data is the arbiter).

**Rollback:** toggle records back to DNS only (grey cloud). Takes effect in seconds and restores the exact Phase 1 state.

## Phase 3: WAF and Security Configuration

1. Confirm the **Free Managed Ruleset** is active (deployed by default on new zones).
2. Custom rules (Security -> WAF -> Custom rules), replicating and exceeding `vercel.json` mitigations. The vercel.json rules stay in place as origin defense in depth.

   - **Rule 1: Block sensitive file probes** (action Block):
     `(http.request.uri.path contains "/.env") or (http.request.uri.path contains "/.git") or (http.request.uri.path contains "/.svn") or (http.request.uri.path contains "/.htaccess") or (http.request.uri.path contains "/.htpasswd") or (http.request.uri.path contains "/.DS_Store")`
   - **Rule 2: Block CMS and scanner probes** (action Block):
     `(http.request.uri.path starts_with "/wp-") or (http.request.uri.path eq "/xmlrpc.php") or (http.request.uri.path starts_with "/phpmyadmin") or (http.request.uri.path starts_with "/pma") or (http.request.uri.path starts_with "/adminer") or (http.request.uri.path starts_with "/mysqladmin")`
   - **Rule 3: API default-deny** (action Block), mirroring the vercel.json allowlist:
     `(http.request.uri.path starts_with "/api/") and not ((http.request.uri.path starts_with "/api/analytics") or (http.request.uri.path starts_with "/api/subscribe") or (http.request.uri.path starts_with "/api/unsubscribe") or (http.request.uri.path starts_with "/api/cron/") or (http.request.uri.path starts_with "/api/comments") or (http.request.uri.path starts_with "/api/subscribers") or (http.request.uri.path starts_with "/api/backlog") or (http.request.uri.path starts_with "/api/og") or (http.request.uri.path starts_with "/api/guestbook") or (http.request.uri.path starts_with "/api/contact"))`
     Deploy Rule 3 in **Log** action for 48 hours first; promote to Block only after confirming zero false positives in Security Events (Vercel cron invocations may or may not traverse the proxy; the `/api/cron/` allowance covers them either way).
3. **Rate limiting rule** (1 free): path equals `/api/analytics/auth`, method POST, more than 5 requests per 10 seconds per IP -> Block for 10 seconds. Complements the app's 5-per-15-minutes DB limiter against burst brute force.
4. **Bot Fight Mode:** On. Watch for two side effects during the first week: (a) the analytics `sendBeacon` calls come from real browsers and should be unaffected; verify `page_views` insert rate holds steady; (b) BFM cannot be bypassed by custom rules on the free plan, so if Let's Encrypt renewals or legitimate integrations get challenged, the remedy is toggling BFM off temporarily.
5. **Managed Transforms:** Rules -> Settings -> enable **Add visitor location headers**. This is the Phase 4 dependency.
6. Security level: Medium. Under Attack Mode: document the toggle location in the runbook; leave off.

**Acceptance:** Security Events shows the managed ruleset active; a `curl https://www.cryptoflexllc.com/wp-admin` returns a Cloudflare block page; `curl -X POST .../api/analytics/auth` seven times in 10 seconds gets a 429/block from the edge; normal browsing, tracking, and publishing unaffected for 48 hours.

## Phase 4: Application Code Changes (geo parity and IP correctness)

TDD applies: write the unit tests first (vitest), then implement.

1. **New `src/lib/request-geo.ts`:** a single adapter for geo + client IP used by every consumer.
   - `getRequestGeo(headers)` returns `{ country, city, region, latitude, longitude }`, preferring Cloudflare managed-transform headers, falling back to Vercel headers, then nulls:
     - country: `cf-ipcountry` else `x-vercel-ip-country`
     - city: `cf-ipcity` else `x-vercel-ip-city` (URI-decode defensively; Vercel encodes, Cloudflare sends plain)
     - region: `cf-region` else `x-vercel-ip-country-region`
     - latitude/longitude: `cf-iplatitude`/`cf-iplongitude` else `x-vercel-ip-latitude`/`x-vercel-ip-longitude`
   - `getClientIp(headers)`: `cf-connecting-ip` else first entry of `x-forwarded-for` else `x-real-ip` else "unknown".
   - Tests: all-Cloudflare headers, all-Vercel headers, mixed, missing, encoded city names, XFF chains.
2. **Consumers to update:**
   - `src/app/api/analytics/track/route.ts:96-106` (geo capture)
   - `src/app/api/subscribe/route.ts` (signup geolocation)
   - `src/lib/rate-limit.ts:177-182` (IP extraction; critical, otherwise all visitors behind one Cloudflare colo share a bucket)
3. Deploy order safety: this change is safe to ship before or after Phase 2 because of the fallback chain. Ship it before flipping the proxy so geo data has no gap.
4. Middleware check (`src/middleware.ts`): the HTTPS enforcement reads `x-forwarded-proto`, which Vercel still sets correctly behind Cloudflare; the `*.vercel.app` noindex logic is untouched. No change expected; add a test if one does not exist.

**Acceptance:** unit tests green; after proxy cutover, new rows in `page_views` carry country/city/lat/long again (compare a 24h window against pre-cutover rates); rate-limit keys show distinct real client IPs in the `rate_limits` table.

## Phase 5: Analytics Dashboard Upgrades

1. **New `src/lib/cloudflare-api.ts`** (mirror the structure of `src/lib/vercel-api.ts`):
   - `isCloudflareApiConfigured()` checks both env vars
   - `getSecurityEvents(limit)` -> GraphQL `firewallEventsAdaptive` (datetime, action, source/ruleId, clientCountry, clientIP, clientRequestHTTPHost, path, userAgent)
   - `getSecuritySummary(hours)` -> `firewallEventsAdaptiveGroups` grouped by action, then by clientCountry, then by ruleId
   - `getEdgeTraffic(days)` -> `httpRequestsAdaptiveGroups` (requests, bytes, cache status, status codes, clientCountry, bot-class dimensions where exposed)
   - Endpoint `POST https://api.cloudflare.com/client/v4/graphql`, `Authorization: Bearer`, 60-second server-side response cache to respect the 300-per-5-minutes limit
   - Reference query shape (validated in research):
     ```graphql
     query($zoneTag: string, $start: Time, $end: Time) {
       viewer { zones(filter: { zoneTag: $zoneTag }) {
         firewallEventsAdaptive(filter: { datetime_gt: $start, datetime_lt: $end }, limit: 100, orderBy: [datetime_DESC]) {
           datetime action clientCountry clientIP clientRequestHTTPHost ruleId source userAgent clientRequestPath
         } } }
     }
     ```
     Field availability on the free plan should be confirmed against the schema on first run; drop unsupported fields rather than failing the tab.
2. **Security tab v2** (`src/app/analytics/page.tsx` Security section + `_components/`):
   - Primary source: Cloudflare (when `isCloudflareApiConfigured()`), showing live events, top blocked countries/rules/paths, action mix, managed vs custom rule hits
   - Keep the Vercel firewall cards rendered as a secondary panel while `VERCEL_API_TOKEN` remains configured; delete them in a later cleanup once Cloudflare data is trusted
   - Follow the existing tab pattern: server component, private cache headers, lazy chart components
3. **Event persistence (free retention workaround):**
   - New Neon table `cf_firewall_events` (add to `/api/analytics/setup` as table 13): `id, event_at timestamptz, action text, rule_id text, source text, country text, client_ip text, host text, path text, user_agent text, raw jsonb, UNIQUE(event_at, client_ip, path, rule_id)` plus an index on `event_at`
   - Extend the existing daily cron `/api/cron/cleanup-rate-limits` (04:00 UTC, inside the Hobby 2-cron cap) to also pull the previous 24 hours of `firewallEventsAdaptive` and upsert into the table (ON CONFLICT DO NOTHING). Failure to reach Cloudflare must not fail the cleanup job; log and continue.
   - Security tab trend charts (7/30/90 day) read from Neon, live feed reads from GraphQL
4. **Edge traffic panel** on the Overview or Technology tab: edge requests vs first-party pageviews, cache hit ratio, status mix, bot share. Label it clearly as edge-level (includes bots and blocked traffic).
5. **Tests:** unit tests for the GraphQL client (mock fetch, schema-shape guards, config detection), the cron persistence upsert, and a smoke test for the tab's data mappers. Target the standard 80% coverage on new files.

**Acceptance:** with env vars set, the Security tab renders Cloudflare events within 60s of a synthetic probe (`curl .../wp-admin`); the daily cron inserts rows into `cf_firewall_events`; dashboards degrade gracefully (config-missing state) when env vars are absent.

## Phase 6: Validation, Monitoring, and Sign-Off

1. 7-day soak with checks:
   - `web_vitals` TTFB/LCP medians within 10% of the pre-cutover baseline
   - `page_views` daily volume within normal variance (Bot Fight Mode should reduce junk, not humans)
   - Newsletter digest Monday run succeeds (Gmail SMTP from Vercel is unaffected by the proxy)
   - Publish one backlog post end to end
   - Google Search Console: no new coverage errors; sitemap fetch OK
   - Cert validity date rolls forward at next renewal
2. Documentation: update `BUILD-GUIDE.md` (DNS/proxy architecture, new env vars, WAF rule inventory, runbook for Under Attack Mode and grey-cloud rollback).
3. Cleanup (only after sign-off): none required on Vercel; keep the Vercel DNS zone contents exported for archival. Decide separately whether to remove the Vercel firewall cards and `VERCEL_API_TOKEN`.

## Rollback Matrix

| Failure | Lever | Time to effect |
|---|---|---|
| Redirect loop / TLS errors after Phase 2 | SSL mode recheck, else grey-cloud toggle | Seconds |
| Broken images or forms behind proxy | Grey-cloud toggle, diagnose offline | Seconds |
| WAF false positives | Set offending rule to Log (rules were staged via Log first) | Seconds |
| Beacon/tracking volume drops | Disable Bot Fight Mode | Seconds |
| Email problems | Records are identical; verify zone records, else revert nameservers | Minutes to hours |
| Anything catastrophic | Revert nameservers at Squarespace to ns1/ns2.vercel-dns.com | Propagation, minutes to hours |

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| next/image optimization misbehaves behind proxy | Low (local images only) | Medium | Phase 2 validation step; fallback: grey cloud while diagnosing; worst case custom loader |
| TTFB regression from extra hop | Medium | Low-Medium | Own RUM data as arbiter; rollback threshold defined (10%) |
| Bot Fight Mode challenges legit automation (ACME, uptime checks) | Medium | Medium | Cannot be excepted on free; toggle BFM off if observed |
| Vercel treats topology as unsupported during a future incident | Low | Medium | Grey-cloud restores a supported topology instantly |
| GraphQL field availability differs on free plan | Medium | Low | Schema-shape guards; drop fields, never fail the tab |
| Hobby commercial-use enforcement by Vercel | Unknown | High | Out of scope here; flagged to owner; Pro upgrade or Appendix B both compatible with this plan |

## Appendix A: DNS Records to Recreate (verified by dig, 2026-07-06)

| Type | Name | Value | Proxy |
|---|---|---|---|
| CNAME (flattened) | @ | cname.vercel-dns.com | Orange after Phase 2 |
| CNAME | www | cname.vercel-dns.com | Orange after Phase 2 |
| MX | @ | 1 smtp.google.com | DNS only |
| TXT | @ | v=spf1 include:_spf.google.com ~all | DNS only |
| TXT | @ | google-site-verification=wbuqMahDroorToTb6IATJku-GdZ_n3LPIjyVxpdMdFY | DNS only |
| TXT | google._domainkey | v=DKIM1;k=rsa;p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv4MQ... (full value in zone export) | DNS only |
| TXT | _dmarc | v=DMARC1; p=quarantine; rua=mailto:ChrisJohnson@cryptoflexllc.com | DNS only |

Plus anything else revealed by `vercel dns ls` in Phase 0 (authoritative list).

## Appendix B: Future Path, Full Workers Migration (Option B, $5/month)

Fully researched on 2026-07-06; all blockers catalogued from a real build of this repo:

1. **Measured size:** `wrangler deploy --dry-run` reported 19,416 KiB raw / 3,985 KiB gzip. Exceeds the 3 MiB free cap; fits the 10 MiB paid cap. Workers Paid ($5/month) is required.
2. **Next.js version:** `@opennextjs/cloudflare@1.20.1` peers on `next >=15.5.18 <16 || >=16.2.6`; upgrade from 16.1.6 to >=16.2.6 first.
3. **Config artifacts:** `open-next.config.ts` (defineCloudflareConfig) and `wrangler.jsonc` (main `.open-next/worker.js`, `nodejs_compat`, assets binding, KV/R2 bindings for cache) as used in the spike.
4. **Blockers to resolve:** nodemailer/Gmail SMTP replaced with Resend or Gmail HTTPS API for the weekly digest; `resources/mcp-security-risks-audio-briefing.m4a` (38.2 MiB) moved to R2 or compressed under the 25 MiB static-asset cap; both `vercel.json` crons rewritten as Cron Triggers with a `scheduled()` handler; geo code switched to `request.cf` (the Phase 4 adapter above already does the header half); `@vercel/analytics` and Speed Insights removed; CSP entries for Vercel scripts dropped; VERCEL_* env vars retired.
5. **CI/CD:** Workers Builds (push-to-deploy, PR previews) or `cloudflare/wrangler-action`; rollback via `wrangler rollback` (100 versions retained); GitHub Actions CI, publish API, and gmail-metrics automation need no changes.
6. **Note on the build spike:** the OpenNext build reported copy errors for ~23 mdx/micromark packages under a hybrid node_modules state; re-verify with a clean install during any real migration and re-measure size.

## Appendix C: Optional Enhancements (enable any time after Phase 3)

- **Turnstile** (free, 20 widgets): invisible challenge on guestbook, contact, and comment forms; server-side siteverify in the respective API routes.
- **Cloudflare Web Analytics** (free RUM): beacon in root layout plus CSP additions (`static.cloudflareinsights.com` in script-src, `cloudflareinsights.com` in connect-src). Dashboard-only on free (no API), so it complements the first-party vitals rather than feeding the Security tab.
- **Zone dashboards:** Traffic/Security/Performance panels in the Cloudflare dashboard come free with the zone; link them from the analytics page footer for quick pivots.
