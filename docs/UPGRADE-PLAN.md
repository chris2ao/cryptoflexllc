# CryptoFlex LLC Website Upgrade Plan

> Generated: 2026-02-26
> Status: Planning
> Baseline: Next.js 16.1.6, React 19, Tailwind v4, shadcn/ui, Neon Postgres analytics

## Audit Summary

The site is already well-built. The following are **already in place** and do NOT need work:

- `robots.ts` with proper crawl rules and sitemap reference
- RSS autodiscovery via `alternates.types` in root layout metadata
- `getRelatedPosts()` with tag-overlap scoring (used on blog slug pages)
- Tag filtering UI with clickable badges, Fuse.js search, Ctrl+K shortcut
- PersonJsonLd with `sameAs` links (GitHub, LinkedIn)
- UTM campaign performance panel in analytics dashboard
- Top converting posts panel (newsletter subscription attribution)
- Blog search query tracking via sendBeacon
- Web Vitals collection (LCP, INP, CLS, FCP, TTFB) with rating classification
- Comprehensive security headers (CSP, HSTS, X-Frame-Options, etc.)
- Vercel WAF rules blocking common probes

This plan covers **net-new improvements only**, organized into four phases.

---

## Phase 1: Quick Wins (SEO, Tracking, Accessibility)

Low-effort, high-impact items that can all run in parallel.

### 1A. 404 Page View Tracking

**Problem:** `not-found.tsx` renders a static 404 page but does not log the hit to the analytics DB. Broken links and crawler probes go undetected.

**Implementation:**
- Add a client component `NotFoundTracker` that fires a sendBeacon to `/api/analytics/track` with a special `page_path` of the attempted URL
- Import and render it inside `not-found.tsx`
- Add a "404 Hits" panel to the analytics dashboard showing path, referrer, and count

**Files to create/modify:**
- `src/components/not-found-tracker.tsx` (new, client component)
- `src/app/not-found.tsx` (add tracker)
- `src/app/analytics/_components/not-found-panel.tsx` (new dashboard panel)
- `src/app/analytics/page.tsx` (wire in panel + query)

**Agent assignment:** `general-purpose` (sonnet)

---

### 1B. Lighthouse CI in GitHub Actions

**Problem:** Web Vitals are collected at runtime but performance regressions are not caught before deploy. The CI pipeline (`ci.yml`) runs type check, lint, test, build, and audit, but no Lighthouse.

**Implementation:**
- Add `@lhci/cli` as a dev dependency
- Create `lighthouserc.js` config targeting the build output
- Add a Lighthouse CI step to `.github/workflows/ci.yml` after the build step
- Set assertion thresholds: performance >= 90, accessibility >= 95, best-practices >= 90, SEO >= 95

**Files to create/modify:**
- `lighthouserc.js` (new config)
- `.github/workflows/ci.yml` (add step)
- `package.json` (dev dependency)

**Agent assignment:** `general-purpose` (sonnet)

---

### 1C. Accessibility Hardening

**Problem:** Good ARIA foundations exist, but no verified WCAG AA contrast compliance across both themes, and no `prefers-reduced-motion` support.

**Implementation:**
- Audit all color pairings in `globals.css` (both `:root` and `.dark`) against WCAG AA 4.5:1 ratio. Fix any that fail.
- Add a `@media (prefers-reduced-motion: reduce)` block in `globals.css` that disables transitions and animations
- Verify focus ring visibility on all interactive elements in both themes
- Add `aria-label` to any remaining icon-only buttons that lack it

**Files to create/modify:**
- `src/app/globals.css` (contrast fixes, reduced-motion media query)
- Any components with unlabeled icon buttons (audit needed)

**Agent assignment:** `general-purpose` (sonnet) for contrast audit, `code-reviewer` for validation

---

### 1D. Blog Sort Toggle

**Problem:** Blog list supports search and tag filtering but no sort order control. Default is newest-first only.

**Implementation:**
- Add a sort dropdown (or toggle group) to `BlogList`: "Newest", "Oldest", "A-Z"
- Sort is applied after search/tag filtering
- Persist sort preference in URL query params (e.g., `?sort=oldest`)

**Files to modify:**
- `src/components/blog-list.tsx` (add sort state, UI control, sort logic)

**Agent assignment:** `general-purpose` (sonnet)

---

### Phase 1 Execution Strategy

All four items are independent. Launch in parallel:

```
Task 1A: general-purpose  -> 404 tracking
Task 1B: general-purpose  -> Lighthouse CI
Task 1C: general-purpose  -> Accessibility audit + fixes
Task 1D: general-purpose  -> Blog sort toggle
```

Then run `code-reviewer` on the combined diff.

---

## Phase 2: Analytics Depth (Funnels, Insights)

Depends on Phase 1A (404 tracking) being complete for a unified analytics schema, but otherwise independent items.

### 2A. Conversion Funnel Tracking

**Problem:** Individual page views and newsletter conversions are tracked, but the multi-step journey (blog post -> services -> contact form submission) is not modeled. No way to know which content drives business leads.

**Implementation:**
- Define funnel events: `page_view`, `services_view`, `contact_form_open`, `contact_form_submit`
- Create a `funnel_events` table in Neon: `(id, session_id, event_type, page_path, referrer_path, created_at)`
- Add a thin `trackFunnelEvent()` utility that fires sendBeacon to a new `/api/analytics/track-funnel` endpoint
- Instrument: services page load, contact form mount, contact form submit success
- Build a funnel visualization panel in the analytics dashboard (step-through with drop-off percentages)

**Files to create/modify:**
- `src/lib/funnel-tracker.ts` (new client utility)
- `src/app/api/analytics/track-funnel/route.ts` (new API route)
- `src/app/api/analytics/setup/route.ts` (add funnel_events table migration)
- `src/app/services/page.tsx` (instrument)
- `src/components/contact-form.tsx` (instrument submit)
- `src/app/analytics/_components/funnel-panel.tsx` (new visualization)
- `src/app/analytics/page.tsx` (wire in panel)

**Agent assignment:** `general-purpose` (sonnet) for implementation, `security-reviewer` for the new API route

---

### 2B. Enhanced 404 Intelligence

**Problem:** Once 1A is complete, we have raw 404 data. This item adds actionable intelligence.

**Implementation:**
- Group 404 hits by path pattern to identify systemic issues (e.g., old URL schemes, missing redirects)
- Add a "Suggested Redirects" section that recommends `next.config.ts` redirects based on fuzzy matching 404 paths to existing pages
- Add referrer breakdown to see which external sites link to broken URLs

**Files to modify:**
- `src/app/analytics/_components/not-found-panel.tsx` (enhance from 1A)
- `src/app/analytics/page.tsx` (enhanced query)

**Agent assignment:** `general-purpose` (sonnet)

---

### Phase 2 Execution Strategy

2A and 2B can run in parallel once Phase 1A is merged:

```
Task 2A: general-purpose  -> Funnel tracking (parallel)
Task 2B: general-purpose  -> 404 intelligence (parallel)
```

Then: `security-reviewer` on the new API route, `code-reviewer` on all changes.

---

## Phase 3: Design Polish (UX, Transitions, Visual)

All items are independent of each other and of Phase 2.

### 3A. Page Transitions

**Problem:** Navigation between pages is instantaneous with no visual continuity. Feels abrupt on a content-heavy site.

**Implementation:**
- Use the View Transitions API (supported in Chrome/Edge, progressive enhancement for others)
- Wrap page content in Next.js `<ViewTransition>` component (available in Next.js 15+)
- Add CSS `view-transition-name` to shared elements (nav, footer) for continuity
- Blog card -> blog post: animate the card title into the post title
- Respect `prefers-reduced-motion` (skip transitions if reduced motion preferred)

**Files to create/modify:**
- `src/app/layout.tsx` (wrap children in ViewTransition if supported)
- `src/app/globals.css` (view-transition CSS rules, keyframes)
- `src/components/blog-card.tsx` (add view-transition-name to title)

**Agent assignment:** `general-purpose` (sonnet)

---

### 3B. Blog Card Hover Effects

**Problem:** Blog cards are static. Subtle interaction feedback improves perceived quality.

**Implementation:**
- Add `hover:scale-[1.02] hover:shadow-lg transition-all duration-200` to blog card wrapper
- Add a subtle border glow on hover using `ring` utilities
- Respect `prefers-reduced-motion` (skip scale transform)

**Files to modify:**
- `src/components/blog-card.tsx`

**Agent assignment:** `general-purpose` (sonnet), can combine with 3A

---

### 3C. Portfolio Lightbox

**Problem:** Portfolio project pages lack a way to view screenshots and visuals at full resolution.

**Implementation:**
- Install a lightweight lightbox library (e.g., `yet-another-react-lightbox`, ~8KB gzipped)
- Create a `<PortfolioGallery>` component that wraps images in lightbox triggers
- Support keyboard navigation (arrow keys, Escape to close)
- Dynamically import the lightbox to avoid bundle bloat on non-portfolio pages

**Files to create/modify:**
- `src/components/portfolio-gallery.tsx` (new component)
- Portfolio page templates (integrate gallery)
- `package.json` (add dependency)

**Agent assignment:** `general-purpose` (sonnet)

---

### 3D. Sticky Table of Contents Sidebar

**Problem:** Blog posts have auto-generated TOC from headings, but on long technical posts the TOC scrolls out of view.

**Implementation:**
- Create a `<TableOfContentsSidebar>` component that renders as a sticky sidebar on `lg:` breakpoints
- Use `IntersectionObserver` to highlight the current section as the user scrolls
- On mobile, keep the existing inline TOC behavior (or collapse into an expandable section at the top)
- Use `scroll-margin-top` on heading anchors to account for the sticky nav

**Files to create/modify:**
- `src/components/table-of-contents-sidebar.tsx` (new component)
- Blog `[slug]/page.tsx` layout (two-column grid on lg:, single column on mobile)
- `src/app/globals.css` (scroll-margin-top for headings)

**Agent assignment:** `general-purpose` (sonnet)

---

### Phase 3 Execution Strategy

All four items are independent. Launch in parallel:

```
Task 3A: general-purpose  -> Page transitions
Task 3B: general-purpose  -> Card hover effects (can merge with 3A agent)
Task 3C: general-purpose  -> Portfolio lightbox
Task 3D: general-purpose  -> Sticky TOC sidebar
```

Then: `code-reviewer` on all changes, `build-error-resolver` if any type issues.

---

## Phase 4: Content and Growth

These items involve content strategy and longer-term features.

### 4A. Newsletter Archive Page

**Problem:** Weekly digest emails are sent via cron but past issues are not publicly viewable. No way for new subscribers to see what they missed. No SEO value from newsletter content.

**Implementation:**
- Create a `newsletters` table (or reuse digest history if stored): `(id, subject, html_body, sent_at)`
- Log each weekly digest to this table when the cron fires
- Create `/newsletter` page listing past digests with date and subject
- Create `/newsletter/[id]` page rendering the HTML content
- Add to sitemap and navigation

**Files to create/modify:**
- `src/app/newsletter/page.tsx` (new listing page)
- `src/app/newsletter/[id]/page.tsx` (new detail page)
- `src/app/api/cron/weekly-digest/route.ts` (add DB logging of sent digests)
- `src/app/api/analytics/setup/route.ts` (add newsletters table)
- `src/app/sitemap.ts` (add newsletter entries)
- `src/components/nav.tsx` (add nav link)

**Agent assignment:** `general-purpose` (sonnet)

---

### 4B. Services Page Case Studies

**Problem:** Services page is descriptive but lacks proof. Short case studies with measurable outcomes build credibility.

**Implementation:**
- Create a `CaseStudy` component: client name (or anonymized), challenge, solution, result (quantified)
- Add 2-3 case study cards to the services page below the service descriptions
- Use the same card styling as blog cards for visual consistency
- Structured data: add `@type: "Service"` JSON-LD to services page

**Files to create/modify:**
- `src/components/case-study-card.tsx` (new component)
- `src/app/services/page.tsx` (add case studies section + Service JSON-LD)
- `src/components/json-ld.tsx` (add ServiceJsonLd component)

**Agent assignment:** `general-purpose` (sonnet) for scaffolding, content is manual

---

### 4C. Enhanced PersonJsonLd

**Problem:** PersonJsonLd has GitHub and LinkedIn in `sameAs`, but could include more signals for knowledge graph enrichment.

**Implementation:**
- Add any additional profiles: Twitter/X, personal site, Credly, etc.
- Add `knowsAbout` property with key skill areas
- Add `alumniOf` if applicable for education signals

**Files to modify:**
- `src/components/json-ld.tsx` (enhance PersonJsonLd)
- `src/app/layout.tsx` (pass additional props)

**Agent assignment:** `general-purpose` (haiku), small change

---

### Phase 4 Execution Strategy

4A, 4B, and 4C are independent:

```
Task 4A: general-purpose (sonnet) -> Newsletter archive
Task 4B: general-purpose (sonnet) -> Case study scaffolding
Task 4C: general-purpose (haiku)  -> PersonJsonLd enrichment
```

Then: `code-reviewer` on all, `security-reviewer` on 4A (new API route + DB table).

---

## Execution Summary

| Phase | Items | Parallel Agents | Dependencies |
|-------|-------|-----------------|--------------|
| 1 | 1A, 1B, 1C, 1D | 4 agents | None (start immediately) |
| 2 | 2A, 2B | 2 agents | 1A must be merged first |
| 3 | 3A, 3B, 3C, 3D | 3-4 agents | None (can run with Phase 1) |
| 4 | 4A, 4B, 4C | 3 agents | None (can run with Phase 2) |

**Maximum parallelism:** Phases 1 and 3 can run simultaneously (up to 8 agents).
Then Phases 2 and 4 can run simultaneously (up to 5 agents).

**Review pipeline (after each phase):**
1. `code-reviewer` agent on combined diff
2. `security-reviewer` agent on any new API routes or DB changes
3. `build-error-resolver` agent if type check or build fails
4. Run test suite (`npm test`) and verify 80%+ coverage on new code

## Post-Implementation Verification

After all phases:
- [ ] Run full Lighthouse audit (target: 90+ all categories)
- [ ] Verify sitemap includes all new pages
- [ ] Test 404 tracking with intentional bad URLs
- [ ] Verify funnel events fire on services -> contact flow
- [ ] Check View Transitions in Chrome, graceful fallback in Firefox/Safari
- [ ] Accessibility: run axe-core or pa11y on key pages
- [ ] Mobile: test all new components on 375px viewport
- [ ] Run `npm audit` for any new dependency vulnerabilities
