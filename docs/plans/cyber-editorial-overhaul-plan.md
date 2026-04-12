# CryptoFlex LLC: Cyber Editorial Overhaul Plan

*Created: 2026-04-12 | Based on: Full team audit (Visual Designer + Component Architect + Performance Reviewer + UX Reviewer + Security Reviewer + Skill Compatibility Audit)*

## Executive Summary

Complete visual and architectural overhaul of cryptoflexllc.com from "Vercel template default" to a distinctive "Cyber Editorial" aesthetic. Dark-first design, bold typography, teal accent from the CryptoFlex logo, subtle circuit-board motifs, and editorial layout discipline. All existing features maintained, 6 new features added, performance issues resolved.

**Current Quality Scores:** Heuristic 3.7/5, TASTE 3.4/5, Design Rules 20/35 passed (CONDITIONAL PASS)
**Target Quality Scores:** Heuristic 4.5/5, TASTE 4.0/5, Design Rules 35/35 passed (PASS)

## Design Direction: "Cyber Editorial"

### Typography
| Role | Current | New | Why |
|------|---------|-----|-----|
| Headings | Geist Sans | **Space Grotesk** | Geometric sans with deliberate quirk (angled terminals). Looks designed, not defaulted. |
| Body | Geist Sans | **Source Serif 4** | Adobe variable serif. Creates editorial authority (Increment-style). Immediately differentiates from 95% of dev blogs. |
| Code | Geist Mono | **JetBrains Mono** | Ligatures, premium feel, more personality. |

### Color System
- **Dark mode (primary):** True near-black with blue-black tint at hue 245
- **Teal accent:** oklch(0.72 0.17 192) dark mode / oklch(0.52 0.18 195) light mode
- **Four surface levels:** stepped from oklch(0.10) to oklch(0.28) for card hierarchy
- **Light mode:** Warm off-white with cool undertone (oklch(0.97 0.005 245))
- **New tokens:** surface-1/2/3/4, border-accent, shadow-teal-glow, grid-line, scanline, primary-bright/dim/subtle, cyber-green/amber/cyan/red

### Cyber Motifs
1. **Circuit dot grid** (CSS radial-gradient, 24px repeat, 6% opacity): hero and page headers
2. **Scanlines** (1px repeating horizontal, 1.5% opacity): dark mode atmospheric texture
3. **Corner brackets** (CSS pseudo-elements): featured/highlighted content blocks

### Component Library
**Keep shadcn/ui** (only 7 components used, light footprint, no lock-in). Reduce surface area by converting `ui/separator.tsx` to server component and moving `ui/chart.tsx` to analytics route.

---

---

## Security Review Findings

**Overall assessment:** No CRITICAL findings. The codebase is well-engineered (parameterized queries, timing-safe auth, rate limiters on writes, security headers, no secrets in source).

### Existing Issues (Fix in Phase 1)

| Severity | Issue | File | Fix |
|----------|-------|------|-----|
| MEDIUM | Missing rate limiter on `/api/analytics/vitals` POST | `vitals/route.ts` | Add `createRateLimiter` (30 req/min, match track-engagement) |
| MEDIUM | `HEALTHCHECK_PING_URL` fetched without domain validation (SSRF risk) | `weekly-digest/route.ts:164` | Validate starts with `https://` and matches expected domain |
| MEDIUM | Rate limiter fails open on DB error (allows unlimited requests) | `rate-limit.ts:141` | Fall through to `checkRateLimitMemory()` instead of `{ allowed: true }` |
| MEDIUM | Comments GET has no slug format validation | `comments/route.ts:55` | Add `length <= 200 && /^[a-z0-9-]+$/` check |
| LOW | CSP `connect-src` missing Vercel Analytics domains | `next.config.ts:83` | Add `va.vercel-scripts.com`, `vitals.vercel-insights.com` |
| LOW | ip-api.com called over plain HTTP | `ip-intel/route.ts:193` | Switch to ipinfo.io free tier (HTTPS) or accept risk |
| LOW | Subscriber count GET endpoint has no rate limit | `subscribe/route.ts:40` | Add light rate limiter or serve as static build value |

### New Feature Security Notes

| Feature | Risk | Notes |
|---------|------|-------|
| Command palette search | NONE | Client-side only, searches data already in page HTML |
| Category URL params | NONE | Compared via string equality, never reflected as raw HTML |
| Featured posts | NONE | Static frontmatter, server-rendered |
| View counts API | LOW | When built: needs rate limiting, slug validation, integer-only response |
| Author profile card | NONE | Static constants |
| Newsletter popup | NONE | localStorage stores timestamp only, form reuses rate-limited subscribe API |

### Security Positives (Already Well Done)
- All DB queries use parameterized tagged template literals (Neon)
- `timingSafeEqual` on all auth comparisons (analytics, cron, unsubscribe)
- HMAC-based unsubscribe tokens with hex validation
- `httpOnly`, `secure`, `sameSite: strict` on session cookie
- Rate limiters on all write endpoints
- `escapeHtml()` in email templates, `sanitizeAiText()` for AI content
- Security headers: HSTS, X-Frame-Options, CSP, Permissions-Policy

---

## Skill and Agent Compatibility

### Contracts That MUST NOT Change

The blog production pipeline (6 agents, 3 skills, 3 scripts) hardcodes these contracts. Breaking any of them requires updating 3-8 files across `~/.claude/`.

| Contract | Used By | Status |
|----------|---------|--------|
| Callout names: `<Tip>`, `<Info>`, `<Warning>`, `<Stop>`, `<Security>` | blog-writer, blog-ux, blog-mdx-reference, validate-mdx.sh | DO NOT RENAME |
| Badge names: `<Vercel>`, `<Nextjs>`, `<Cloudflare>` | blog-writer, blog-mdx-reference | DO NOT RENAME |
| `<DiagramLightbox>`, `<ImageLightbox>` | blog-captain, blog-mdx-reference | DO NOT RENAME |
| Blog dir: `src/content/blog/`, `src/content/backlog/` | blog-post skill, blog-inventory.sh, blog-writer, notebooklm | DO NOT MOVE |
| MDX registries: `src/app/blog/[slug]/page.tsx`, `src/app/backlog/[slug]/page.tsx` | blog-captain, blog-mdx-reference | DO NOT MOVE |
| Component exports: `src/components/mdx/index.ts` | blog-captain | DO NOT REMOVE |
| Frontmatter: `title`, `date`, `description`, `tags`, `author`, `readingTime` | validate-mdx.sh, blog-inventory.sh, blog-writer | DO NOT RENAME (can ADD fields) |
| Diagram pattern: `src/components/mdx/diagrams-*.tsx` | blog-captain | DO NOT RENAME pattern |
| Build command: `npm run build` | blog-ux, blog-captain | DO NOT CHANGE |

### What IS Safe to Change
- **Moving files within `src/components/`** is safe because agents reference component NAMES, not file paths. The MDX registry (`index.ts`) re-exports by name.
- **Adding new frontmatter fields** (like `featured: true`, `category`) is safe.
- **Adding new components** to the MDX registry is safe.
- **Changing CSS/tokens/colors** is safe for most agents (exception: notebooklm-content has hardcoded brand colors).
- **Adding new pages/routes** is safe.

### Agents/Skills That Need Updating After Overhaul

| File | What Changes | When |
|------|-------------|------|
| `~/.claude/agents/notebooklm-content.md` | Font references (Geist -> Space Grotesk/Source Serif 4), brand color hex values | After Phase 1 (font swap) |
| `~/.claude/skills/blog-mdx-reference.md` | Add any new MDX components (AuthorCard, FeaturedPosts, etc.) if registered in MDX | After Phase 3 (new features) |
| `~/.claude/skills/blog-style-guide.md` | Update if new content patterns emerge (categories, featured designation) | After Phase 3 |
| `~/.claude/skills/learned/mdx-blog-design-system.md` | Update callout color descriptions if token values change | After Phase 1 |
| `~/.claude/agents/blog-writer.md` | Add `featured` and `category` to known frontmatter fields | After Phase 3.2/3.3 |
| `validate-mdx.sh` | Add `featured` and `category` as optional valid fields | After Phase 3.2/3.3 |
| `~/.claude/agents/wrap-up-orchestrator.md` | No change needed (references repo name, not structure) | N/A |
| `~/.claude/agents/multi-repo-orchestrator.md` | No change needed | N/A |

### Compatibility Verification Phase

After each phase, run this verification:
```bash
# 1. Blog production smoke test
cd ~/GitProjects/cryptoflexllc && npm run build

# 2. Validate existing posts still pass
bash ~/.claude/scripts/validate-mdx.sh src/content/blog/getting-started-with-claude-code.mdx

# 3. Blog inventory still works
bash ~/.claude/scripts/blog-inventory.sh --minimal | head -5

# 4. MDX component registry intact
grep -c "export" src/components/mdx/index.ts
```

---

## Current Issues to Fix (From Team Audit)

### Critical (3)
1. **Recharts bundle bloat**: 12 chart components import 300KB+ eagerly without code-splitting
2. **No Suspense streaming on analytics**: 31 queries block all rendering
3. **Oversized client components**: skills-showcase (477 lines), blog-comments (465 lines)

### High (8)
1. Reading progress bar animates `width` (layout property, causes reflow)
2. Missing `sizes` prop on hero image and nav logo
3. Visitor map has no Suspense fallback
4. No `prefers-reduced-motion` support anywhere in codebase (zero instances)
5. Hardcoded hex colors in blog-card tagColorMap (7 values)
6. `focus:` vs `focus-visible:` inconsistency across all forms
7. Tag filter buttons have no focus ring
8. `disabled:opacity-50` everywhere (research says 40%)

### Medium (12)
1. `text-green-400`/`text-red-400` for status instead of semantic tokens (6 files)
2. Arbitrary Tailwind values: `bg-[#0A66C2]` LinkedIn button
3. Silent validation failures in comments form
4. Guestbook swallows fetch errors
5. Two different button patterns (shadcn Button vs hand-rolled)
6. ThemeContext value not memoized
7. No `aria-live` on form status messages
8. Stats counter uses hardcoded "589 Tests Passing" value
9. slide-carousel has isolated 17-token color system
10. No active/pressed states on cards
11. Guestbook uses text-only loading, not skeleton
12. No help text on comments subscriber-email requirement

---

## Phase Plan

### Phase 1: Foundation (Design System + Critical Fixes)

**Goal:** New design tokens, fonts, and colors in place. Critical performance and accessibility issues fixed. No visual changes yet (old components still render, just with new tokens).

#### 1.1 Design Token Overhaul
- [ ] Replace `:root` and `.dark` blocks in `globals.css` with new Cyber Editorial color system (dark-first: dark values in `:root`, light overrides in `:root.light`)
- [ ] Add spacing tokens (8px grid: `--spacing-1` through `--spacing-24`)
- [ ] Add typography tokens (`--text-xs` through `--text-display`, line heights, letter spacing)
- [ ] Add animation tokens (`--duration-fast/normal/slow/page`, `--ease-default/out/in/spring`)
- [ ] Add z-index tokens (`--z-base` through `--z-progress`)
- [ ] Add cyber palette tokens (`--color-cyber-green/amber/cyan/red/grid/scanline`)
- [ ] Add surface tokens (`--surface-1/2/3/4`, `--border-accent`, `--shadow-teal-glow`)

#### 1.2 Font Swap
- [ ] Replace Geist/Geist_Mono imports in `layout.tsx` with Space Grotesk, Source Serif 4, JetBrains Mono via `next/font/google`
- [ ] Update CSS custom properties: `--font-heading`, `--font-body`, `--font-mono`
- [ ] Set `body { font-family: var(--font-body) }` to override shadcn sans-serif default
- [ ] Verify all pages render with new fonts

#### 1.3 Critical Performance Fixes
- [ ] `reading-progress.tsx`: Replace `transition-[width]` with `transform: scaleX()` + `transform-origin: left`
- [ ] `hero.tsx`: Add `sizes` prop to portrait image
- [ ] `nav.tsx`: Add `sizes` prop to logo image
- [ ] Add `prefers-reduced-motion` guard to: `animated-counter.tsx`, `career-timeline.tsx`, `skills-showcase.tsx`, `reading-progress.tsx`, `back-to-top.tsx`, `image-lightbox.tsx`
- [ ] Add global reduced-motion CSS block to `globals.css`

#### 1.4 Token Compliance Fixes
- [ ] Replace `tagColorMap` hardcoded hex values in `blog-card.tsx` with CSS custom properties
- [ ] Replace `text-green-400`/`text-red-400` status colors with `text-success`/`text-destructive` tokens (6 files)
- [ ] Replace `bg-[#0A66C2]` LinkedIn button with `--color-linkedin` token
- [ ] Change `disabled:opacity-50` to `disabled:opacity-40` in `button.tsx` base class
- [ ] Replace `focus:ring-*` with `focus-visible:ring-*` in all form inputs
- [ ] Add focus ring to tag filter buttons (`blog-list.tsx:177`) and category tabs (`skills-showcase.tsx:387`)

#### 1.5 Security Fixes
- [ ] Add rate limiter to `/api/analytics/vitals` POST endpoint (30 req/min)
- [ ] Validate `HEALTHCHECK_PING_URL` starts with `https://` and matches expected domain before fetch
- [ ] Change rate limiter DB error fallback from fail-open to `checkRateLimitMemory()` in `rate-limit.ts:141`
- [ ] Add slug format validation to comments GET handler (`length <= 200 && /^[a-z0-9-]+$/`)
- [ ] Add Vercel Analytics domains to CSP `connect-src` in `next.config.ts`

#### 1.6 Skill/Agent Compatibility Updates
- [ ] Update `~/.claude/agents/notebooklm-content.md`: Change font references from Geist Sans/Mono to Space Grotesk/Source Serif 4/JetBrains Mono
- [ ] Update `~/.claude/skills/learned/mdx-blog-design-system.md`: Update color token descriptions if values changed
- [ ] Run compatibility verification (build, validate-mdx, blog-inventory, MDX registry check)

**Deliverable:** Site looks slightly different (new fonts, adjusted colors) but all features work. All critical issues resolved. Security hardened. Blog pipeline verified intact.

---

### Phase 2: Core Layout + Architecture

**Goal:** New nav, hero, footer, page shells, cyber backgrounds. Feature-based directory structure. Component splits.

#### 2.1 Directory Restructure
- [ ] Create feature-based directory structure under `src/components/`:
  - `layout/` (Nav, Footer, ThemeProvider, ThemeToggle)
  - `blog/` (BlogCard, BlogList, BlogToc, BlogSeriesNav, etc.)
  - `skills/` (SkillsShowcase split)
  - `about/` (CareerTimeline, AnimatedCounter)
  - `promos/` (TerminalPromo shared component)
  - `forms/` (SubscribeForm, ContactForm, GuestbookEntries)
  - `search/` (CommandPalette)
  - `newsletter/` (NewsletterPopup)
  - `mdx/` (existing, add diagrams/ subdirectory)
  - `ui/` (shadcn primitives, keep as-is)
  - `ui-ext/` (site-specific: AchievementBadges, SocialShare, BackToTop, SlideCarousel)
  - `analytics/` (AnalyticsTracker, WebVitalsReporter, ErrorReporter)
- [ ] Update all imports (move files as they are touched, not big-bang)

#### 2.2 Component Splits
- [ ] Split `skills-showcase.tsx` (477 lines) into: `SkillsShowcaseServer` + `SkillsFilter` client island + `SkillDetail` client island
- [ ] Split `blog-comments.tsx` (465 lines) into: `CommentThread` + `CommentForm` + `ReplyForm`
- [ ] Extract `useTypingAnimation` hook, merge `CannCannPromo` + `ThirdConflictPromo` into shared `TerminalPromo`
- [ ] Convert `ui/separator.tsx` from Radix to plain server component
- [ ] Move `ui/chart.tsx` to `analytics/` (only used there)

#### 2.3 Navigation Overhaul
- [ ] Redesign nav with Cyber Editorial aesthetic: backdrop-blur + scroll-triggered teal accent line
- [ ] Dark-first styling with proper contrast
- [ ] Mobile drawer redesign (consider CSS-only `<dialog>` to reduce client JS)

#### 2.4 Hero Redesign
- [ ] Apply Cyber Editorial typography (Space Grotesk headline, Source Serif 4 body)
- [ ] Circuit dot grid background pattern (`bg-cyber-grid` CSS utility)
- [ ] Portrait frame with teal glow shadow in dark mode
- [ ] Update CTA buttons with new styling

#### 2.5 Footer Redesign
- [ ] Editorial footer with proper sections, cyber aesthetic
- [ ] Social links with teal hover accents

#### 2.6 Cyber Background Patterns
- [ ] Add `.bg-cyber-grid` CSS utility (radial-gradient dot pattern)
- [ ] Add `.texture-scanlines` pseudo-element (dark mode only)
- [ ] Add `.bracket-frame` pseudo-element for featured content
- [ ] Apply to hero, page headers, and featured sections

#### 2.7 Compatibility Verification
- [ ] Run `npm run build` (verify no breakage)
- [ ] Run `validate-mdx.sh` on 3 sample posts (old posts still valid)
- [ ] Run `blog-inventory.sh --minimal` (inventory still works)
- [ ] Verify MDX component registry exports unchanged (`src/components/mdx/index.ts`)
- [ ] Verify blog post renders with new typography (check a long-form post for readability)

**Deliverable:** New visual identity visible across all pages. Component architecture cleaned up. Core layout components rebuilt. Blog pipeline verified intact.

---

### Phase 3: New Features

**Goal:** All 6 new features implemented and integrated.

#### 3.1 Command Palette Search (Ctrl+K)
- [ ] Build `CommandPalette.tsx` client component (cmdk library or custom `<dialog>`)
- [ ] Mount in `RootLayout`, posts/pages array as serialized server prop
- [ ] Search: blog posts by title/tags, nav links, recent posts
- [ ] Keyboard: Esc closes, Enter navigates, arrow keys cycle
- [ ] Remove duplicate Ctrl+K handler from `BlogList`

#### 3.2 Category Filter Bar
- [ ] Build `CategoryFilter.tsx` server component
- [ ] Move category state to URL search params (`?category=Claude+Code`)
- [ ] Server-side filtering: page reads `searchParams`, filters posts, passes to `BlogList`
- [ ] Reduce `BlogList` from ~233 lines to ~100 lines (only fuzzy search remains client)
- [ ] Styled category tabs with teal accent active state

#### 3.3 Featured/Pinned Posts
- [ ] Add `featured: true` frontmatter field support
- [ ] Build `FeaturedPosts.tsx` server component
- [ ] Large card design with category accent bar, larger title, excerpt
- [ ] Horizontal row on desktop, stacked on mobile (container query)
- [ ] Place above chronological blog list on `/blog` page

#### 3.4 View Counts + Read Time
- [ ] Build `PostMetaStatic` server component (date, read time, author)
- [ ] Build `PostMetaLive` client island (view count + thumbs-up from API)
- [ ] Wrap `PostMetaLive` in Suspense with null fallback
- [ ] Display on blog cards and blog post pages
- [ ] Merge `BlogPostThumbsUp` into `PostMetaLive`

#### 3.5 Author Profile Card
- [ ] Build `AuthorCard.tsx` server component
- [ ] Author data from `lib/constants.ts` (name, bio, avatar, socials)
- [ ] Render below every blog post, above related posts
- [ ] Cyber Editorial styling with portrait and social links

#### 3.6 Scroll-Triggered Newsletter Popup
- [ ] Build `NewsletterPopup.tsx` client component
- [ ] Trigger: 70% scroll depth OR 3 minutes time-on-page
- [ ] Gate: `localStorage` with 7-day cooldown
- [ ] Reuse `useSubscribe` hook
- [ ] Mobile: full-width bottom sheet; desktop: centered modal
- [ ] Respects `prefers-reduced-motion`
- [ ] Add `<NewsletterSentinel>` server component at article bottom

#### 3.7 Security for New Features
- [ ] View counts API (`/api/views`): Add rate limiter (30 req/min), slug validation, integer-only response
- [ ] Newsletter popup: Verify only timestamp stored in localStorage (no email, no tokens)
- [ ] Command palette: Verify search data is already in page HTML (no new data exposure)

#### 3.8 Skill/Agent Updates for New Features
- [ ] Update `~/.claude/agents/blog-writer.md`: Add `featured` and `category` to known frontmatter fields
- [ ] Update `~/.claude/scripts/validate-mdx.sh`: Add `featured` and `category` as optional valid fields
- [ ] Update `~/.claude/skills/blog-mdx-reference.md`: Document any new MDX components added to registry
- [ ] Update `~/.claude/skills/blog-style-guide.md`: Add guidance on featured post designation and categories
- [ ] Run full compatibility verification

**Deliverable:** All 6 new features live and integrated. Blog pipeline updated for new frontmatter fields.

---

### Phase 4: Page-by-Page Rebuild + Polish

**Goal:** Every page rebuilt with Cyber Editorial aesthetic. Performance optimized. Final QA pass.

#### 4.1 Blog List Page
- [ ] Rebuild with category filter bar, featured posts section, new card design
- [ ] Source Serif 4 for card descriptions
- [ ] Teal accent bars on cards (from token system, not hardcoded hex)
- [ ] View counts and read time on cards

#### 4.2 Blog Post Page
- [ ] Rebuild post layout with editorial typography
- [ ] New TOC styling (teal active state, cyber aesthetic)
- [ ] Author card below content
- [ ] Redesigned comments section (from split components)
- [ ] Newsletter sentinel for popup trigger
- [ ] Code blocks with teal left accent bar

#### 4.3 Home Page
- [ ] Rebuilt hero with cyber grid background and new typography
- [ ] Stats section: wire to real data or replace with meaningful metrics
- [ ] Featured blog posts (from Phase 3.3)
- [ ] Redesigned about teaser
- [ ] Game promos using shared TerminalPromo component

#### 4.4 Skills Page
- [ ] Rebuilt from split components (server shell + client islands)
- [ ] Cyber aesthetic on category tabs and detail view
- [ ] Reduced motion support on animations

#### 4.5 About Page
- [ ] Career timeline with reduced motion support
- [ ] Editorial typography for bio sections

#### 4.6 Portfolio Page
- [ ] Redesigned project cards with cyber aesthetic
- [ ] Bracket-frame treatment on featured projects

#### 4.7 Other Pages
- [ ] Contact: consolidate button patterns, add semantic token for LinkedIn color
- [ ] Guestbook: skeleton loading state, better error handling
- [ ] Resources: consistent with new design system
- [ ] Backlog: consistent with blog list design

#### 4.8 Analytics Dashboard Performance
- [ ] Wrap chart sections in Suspense with skeleton fallbacks
- [ ] Add `dynamic()` to all 12 Recharts chart components
- [ ] Stream independent sections in parallel

#### 4.9 Final QA Pass
- [ ] Run UX Reviewer with full Playwright QA at all 5 viewports
- [ ] Verify all 35 design rules pass
- [ ] Target: Heuristic 4.5/5, TASTE 4.0/5
- [ ] Performance: client components < 35%, all images optimized, Suspense streaming
- [ ] Accessibility: reduced motion, focus-visible, aria-live on forms, semantic colors

#### 4.10 Final Security Review
- [ ] Run security reviewer agent on completed codebase
- [ ] Verify all new API endpoints have rate limiting
- [ ] Verify no new hardcoded secrets
- [ ] Verify CSP headers cover all new domains
- [ ] Check for XSS vectors in any new user-facing features

#### 4.11 Final Skill/Agent Compatibility
- [ ] Full blog production pipeline test: run `/blog-post` skill end-to-end on a test post
- [ ] Verify all agents can spawn and complete without errors
- [ ] Run `validate-mdx.sh` on 5 posts (mix of old and new)
- [ ] Verify notebooklm-content agent references match new design system
- [ ] Update knowledge graph with all new/modified components (`/Knowledge-Graph-Sync`)

**Deliverable:** Complete overhaul. All pages rebuilt. All issues resolved. Security hardened. Blog pipeline fully verified. Quality gate PASS.

---

## File Manifest (New + Modified)

### New Files
| File | Type | Phase |
|------|------|-------|
| `src/components/search/CommandPalette.tsx` | Client | 3.1 |
| `src/components/blog/CategoryFilter.tsx` | Server | 3.2 |
| `src/components/blog/FeaturedPosts.tsx` | Server | 3.3 |
| `src/components/blog/PostMeta.tsx` | Server + client island | 3.4 |
| `src/components/blog/AuthorCard.tsx` | Server | 3.5 |
| `src/components/newsletter/NewsletterPopup.tsx` | Client | 3.6 |
| `src/components/promos/TerminalPromo.tsx` | Client | 2.2 |
| `src/components/skills/SkillsFilter.tsx` | Client island | 2.2 |
| `src/components/skills/SkillDetail.tsx` | Client island | 2.2 |
| `src/components/blog/CommentThread.tsx` | Client island | 2.2 |
| `src/components/blog/CommentForm.tsx` | Client island | 2.2 |
| `src/hooks/use-typing-animation.ts` | Hook | 2.2 |
| `src/hooks/use-intersection.ts` | Hook | 2.2 |
| `src/hooks/use-debounce.ts` | Hook | 2.2 |

### Modified Files (Key Changes)
| File | Change | Phase |
|------|--------|-------|
| `src/app/globals.css` | Complete token overhaul (dark-first, new tokens, cyber palette) | 1.1 |
| `src/app/layout.tsx` | Font swap, dark-first default | 1.2 |
| `src/components/reading-progress.tsx` | scaleX transform, reduced motion | 1.3 |
| `src/components/hero.tsx` | Sizes prop, full redesign | 1.3, 2.4 |
| `src/components/nav.tsx` | Sizes prop, full redesign | 1.3, 2.3 |
| `src/components/blog-card.tsx` | Token colors, new design | 1.4, 4.1 |
| `src/components/ui/button.tsx` | opacity-40, focus-visible | 1.4 |
| `src/components/subscribe-form.tsx` | Semantic status colors | 1.4 |
| `src/components/blog-list.tsx` | Focus rings, category filter integration | 1.4, 3.2 |
| `src/components/skills-showcase.tsx` | Split into 3 components | 2.2 |
| `src/components/blog-comments.tsx` | Split into 3 components | 2.2 |
| `src/app/analytics/page.tsx` | Suspense + dynamic imports | 4.8 |

---

## Risk Mitigation

1. **Font swap may change layout metrics:** Space Grotesk and Source Serif 4 have different metrics than Geist. Test all pages for text overflow, truncation, and line-clamp issues.

2. **Dark-first token inversion:** Swapping `:root` from light to dark default means the theme script in layout.tsx must update. Flash of incorrect theme is possible if script ordering changes.

3. **Directory restructure breaks imports:** Move files incrementally as they are touched, not in a big-bang rename. Update imports and tests together.

4. **Blog post content relies on current typography:** MDX content renders through Tailwind Typography plugin. The serif body font changes reading experience. Test long-form posts for readability.

5. **Comments component split is complex:** The 465-line component has interleaved state. Extract carefully with E2E test coverage before splitting.

6. **Blog pipeline compatibility:** 6 agents + 3 skills + 3 scripts depend on specific component names, paths, and frontmatter fields. The "Contracts That MUST NOT Change" table above is the definitive reference. Run the compatibility verification after every phase.

7. **MDX component names are load-bearing:** Renaming `<Tip>`, `<Info>`, `<Warning>`, `<Stop>`, `<Security>`, `<DiagramLightbox>`, or `<ImageLightbox>` would break 5+ agents/skills AND require find-replace across 58 content files. Do not rename these.

8. **Security: rate limiter fail-open:** The current rate-limit.ts fails open on DB error. Fix this in Phase 1.5 before adding new API endpoints that rely on rate limiting.

9. **NotebookLM content agent:** Has hardcoded Geist font names and brand color hex values. Must be updated after Phase 1 font swap or future infographic generation will reference old fonts.

---

## Success Criteria

- [ ] Heuristic evaluation average >= 4.5/5
- [ ] TASTE framework average >= 4.0/5
- [ ] All 35 design rules pass
- [ ] Client components < 35% of total
- [ ] All images have `sizes` prop
- [ ] `prefers-reduced-motion` respected on all animations
- [ ] All interactive elements have 8 states
- [ ] No hardcoded colors, no arbitrary Tailwind values, no inline styles
- [ ] Command palette, categories, featured posts, view counts, author card, newsletter popup all functional
- [ ] Playwright QA passes at all 5 viewports
- [ ] Site feels unique and intentional, not template-generated
- [ ] All security findings addressed (rate limiters, SSRF validation, CSP)
- [ ] Blog pipeline works end-to-end (`/blog-post` skill completes without errors)
- [ ] `validate-mdx.sh` passes on all existing and new posts
- [ ] All agent/skill references updated for new fonts and frontmatter fields
- [ ] No new security vulnerabilities introduced by new features
- [ ] Knowledge graph updated with all new/modified components
