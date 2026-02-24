# Website Upgrade Plan: CryptoFlex LLC

## Context

Four specialist agents (Web Developer, Tech Blogger, UX/UI Designer, SecDevOps Engineer) audited the entire cryptoflexllc.com codebase. They found 43+ actionable improvements across accessibility, UX, content features, security, analytics, and code quality. The site is in excellent shape overall, but these changes will bring it to the level of top-tier tech blogs and close operational gaps (no CI/CD, no error monitoring). The color scheme (dark + cyan) is unchanged throughout.

10 phases, ordered from easiest to hardest, grouped by logical dependency. Each phase includes a copy-paste prompt for parallel agent execution.

---

## Phase 1: Quick Fixes (One-Line to Five-Line Changes)

**Estimated effort: Small. All changes are isolated, no architectural impact.**

### 1.1 Fix error.tsx hardcoded colors
**File:** `src/app/error.tsx`
**What:** Replace `bg-gray-950`, `text-white`, `text-gray-400`, `bg-blue-600` with design system tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`).
**Why:** Only page on the site that breaks brand consistency. Visitors who hit an error see a completely different visual style, which feels broken.
**Risk:** None. Pure CSS class swap.

### 1.2 Fix LinkedIn URL mismatch
**File:** `src/components/json-ld.tsx` line 70
**What:** Change `https://www.linkedin.com/in/chris-johnson-4a2a70253/` to `https://www.linkedin.com/in/chris-johnson-secops/` to match `footer.tsx`.
**Why:** Inconsistent structured data confuses search engines about which profile is authoritative.
**Risk:** None.

### 1.3 Fix About page image missing ring/shadow
**File:** `src/app/about/page.tsx` line 235
**What:** Add `ring-1 ring-border shadow-xl` to the `CJOutside.jpeg` Image className to match `hero.tsx` treatment.
**Why:** Inconsistent image styling between the two pages. Small polish item.
**Risk:** None.

### 1.4 Add guestbook to sitemap
**File:** `src/app/sitemap.ts`
**What:** Add `{ url: 'https://www.cryptoflexllc.com/guestbook', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 }`.
**Why:** Page exists in nav but is invisible to search engines.
**Risk:** None.

### 1.5 Fix reading progress bar visibility
**File:** `src/components/reading-progress.tsx`
**What:** Change `h-0.5` to `h-1` and `top-0` to `top-16` (below the 64px nav). Keep `z-[60]`.
**Why:** Currently 2px tall and clipped behind the nav's opaque background. Moving it below the nav makes it visible as a progress underline.
**Risk:** Minor visual change. If the nav height ever changes, `top-16` would need updating.

### 1.6 Update homepage stats
**File:** `src/app/page.tsx` (StatsSection around line 23)
**What:** Update the hardcoded test count and verify coverage percentage match reality. Add a code comment noting these need manual updates.
**Why:** Stats will drift from reality as the test suite grows.
**Risk:** None.

### Prompt for Phase 1:
```
I need you to make these quick fixes across the cryptoflexllc codebase using parallel agents. Each fix is independent:

Agent 1 (general-purpose): Fix these 3 files:
- src/app/error.tsx: Replace bg-gray-950 with bg-background, text-white with text-foreground, text-gray-400 with text-muted-foreground, bg-blue-600 and hover:bg-blue-500 with the shadcn Button component using bg-primary. Import Button from @/components/ui/button if needed.
- src/components/json-ld.tsx line 70: Change the LinkedIn URL from "https://www.linkedin.com/in/chris-johnson-4a2a70253/" to "https://www.linkedin.com/in/chris-johnson-secops/" to match footer.tsx.
- src/app/about/page.tsx: Add "ring-1 ring-border shadow-xl" to the CJOutside.jpeg Image className to match hero.tsx styling.

Agent 2 (general-purpose): Fix these 3 files:
- src/app/sitemap.ts: Add guestbook page entry { url, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.5 }.
- src/components/reading-progress.tsx: Change h-0.5 to h-1 and top-0 to top-16 so the bar renders below the nav.
- src/app/page.tsx StatsSection: Run "npx vitest run --reporter=verbose 2>&1 | tail -5" to get the current test count, then update the hardcoded stats. Add a comment "// Update manually when test suite changes".

After both agents complete, run the full test suite and build to verify nothing broke.
```

---

## Phase 2: Accessibility Foundations

**Estimated effort: Small. Critical for compliance, low risk.**

### 2.1 Add skip-to-content link
**File:** `src/app/layout.tsx`
**What:** Add a visually-hidden-until-focused `<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded">Skip to main content</a>` before `<Nav />`. Add `id="main-content"` to the `<main>` element.
**Why:** Required for WCAG 2.1 keyboard navigation. Screen reader users and keyboard-only users need to skip the 9-item nav on every page.
**Risk:** None. Invisible to mouse users.

### 2.2 Add aria-current to active nav link
**File:** `src/components/nav.tsx`
**What:** Add `aria-current={isActive ? "page" : undefined}` to both desktop and mobile nav link elements.
**Why:** Screen reader users cannot identify which page they're on. Color alone is insufficient.
**Risk:** None.

### 2.3 Add labels to subscribe form inputs
**Files:** `src/components/subscribe-form.tsx`, `src/components/subscribe-inline.tsx`
**What:** Add `<label htmlFor="subscribe-email" className="sr-only">Email address</label>` before each email input, and add matching `id="subscribe-email"` (use `id="subscribe-inline-email"` for the inline variant).
**Why:** Placeholder text is not a label. Screen readers may not announce the field purpose after the placeholder disappears on focus.
**Risk:** None. Labels are visually hidden.

### Prompt for Phase 2:
```
I need you to fix 3 accessibility issues across the cryptoflexllc codebase. Use parallel agents:

Agent 1 (general-purpose): Fix layout and nav accessibility:
- src/app/layout.tsx: Add a skip-to-content link before the <Nav /> component. Use: <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md">Skip to main content</a>. Also add id="main-content" to the <main> element.
- src/components/nav.tsx: Add aria-current={pathname === link.href ? "page" : undefined} (or the startsWith version if Phase 3 nav fix is already done) to the Link elements in both the desktop nav loop and the mobile Sheet nav loop.

Agent 2 (general-purpose): Fix subscribe form labels:
- src/components/subscribe-form.tsx: Add <label htmlFor="subscribe-email" className="sr-only">Email address</label> before the email input. Add id="subscribe-email" to the input.
- src/components/subscribe-inline.tsx: Add <label htmlFor="subscribe-inline-email" className="sr-only">Email address</label> before the email input. Add id="subscribe-inline-email" to the input.

Run tests and build after both complete.
```

---

## Phase 3: Navigation and Layout Polish

**Estimated effort: Medium. Touches high-visibility components but changes are isolated.**

### 3.1 Fix nav active state for child routes
**File:** `src/components/nav.tsx` line 52
**What:** Change `pathname === link.href` to `link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)` in both desktop and mobile nav.
**Why:** Visiting `/blog/some-post` doesn't highlight "Blog" in the nav. Users lose context of where they are on every subpage. This affects all 19 blog posts, all portfolio items, all resources, and all backlog posts.
**Risk:** Low. The "/" special case prevents Home from being highlighted on every page. Test by navigating to child routes.

### 3.2 Remove "Home" from nav, reduce nav items
**File:** `src/components/nav.tsx` lines 16-26
**What:** Remove `{ href: "/", label: "Home" }` from the links array. The logo already links home.
**Why:** 9 items crowd the nav at medium breakpoints (768-1024px). "Home" is redundant since clicking the logo goes home (standard web convention). Reducing to 8 items gives more breathing room.
**Risk:** Low. Users who relied on the "Home" text link will need to click the logo. This is standard practice on virtually all modern sites.

### 3.3 Consolidate Games section on homepage
**File:** `src/app/page.tsx` lines 102-119
**What:** Wrap the "Games I Built" heading, ThirdConflictPromo, and CannCannPromo in a single `<section>` with one `border-t` and `py-16 sm:py-20`. Remove the individual `border-t` and `py-16` from ThirdConflictPromo and CannCannPromo wrappers. Add `space-y-8` or `gap-8` between the promo cards.
**Why:** Three consecutive border-t + full-padding blocks create excessive whitespace and visual disconnect between the section header and its content.
**Risk:** Low. The ThirdConflictPromo and CannCannPromo components may have their own section wrappers internally that also need adjusting. Check the component files.

### 3.4 Improve blog empty state
**File:** `src/components/blog-list.tsx` lines 171-173
**What:** Replace the bare `<p>` with a centered container containing a Search icon (from lucide-react), the message, and a "Clear filters" button that resets search and tag filters.
**Why:** Empty states are a key UX moment. A bare text paragraph feels unfinished and gives no actionable next step.
**Risk:** None.

### 3.5 Footer icons and RSS link
**File:** `src/components/footer.tsx` lines 53-69
**What:** Add Lucide `Linkedin`, `Github`, and `Rss` icons beside the text links. Add an RSS link pointing to `/feed.xml`.
**Why:** Text-only social links are less visually recognizable. The RSS feed exists but is not discoverable from the footer.
**Risk:** None.

### Prompt for Phase 3:
```
I need navigation and layout polish across the cryptoflexllc codebase. Use parallel agents:

Agent 1 (general-purpose): Fix nav behavior:
- src/components/nav.tsx: (a) Remove { href: "/", label: "Home" } from the links array. (b) Change active state check from `pathname === link.href` to `link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)` in BOTH the desktop link rendering and the mobile Sheet link rendering. (c) Add aria-current={isActive ? "page" : undefined} to both if not already present from Phase 2.

Agent 2 (general-purpose): Fix homepage games section and blog empty state:
- src/app/page.tsx: Consolidate the Games I Built section. The heading section, ThirdConflictPromo, and CannCannPromo should be wrapped in a single <section> with one border-t and py-16 sm:py-20. Remove individual border-t from the promo component wrappers. Check ThirdConflictPromo and CannCannPromo components to see if they have their own section/border wrappers that need adjusting. Add space-y-8 between the cards.
- src/components/blog-list.tsx lines 171-173: Replace the bare "No posts match your filters." with a centered flex-col container with items-center, a Search icon from lucide-react (size 48, text-muted-foreground/50), the message text styled larger, and an inline Button (variant="outline", size="sm") that calls the existing clear filters logic.

Agent 3 (general-purpose): Fix footer:
- src/components/footer.tsx: Import Linkedin, Github, Rss icons from lucide-react. Add the icons inline before each social link text. Add an RSS feed link: <a href="/feed.xml" ...><Rss className="h-4 w-4" /> RSS Feed</a> in the Connect section.

Run tests and build after all agents complete.
```

---

## Phase 4: Blog Content Experience

**Estimated effort: Medium. High-impact improvements to reading experience.**

### 4.1 Add heading anchor links
**File:** `src/app/blog/[slug]/page.tsx` lines 64-80 (createHeading function)
**What:** Extend the returned component to render a `#` anchor link alongside the heading text. The anchor should be visually hidden until the heading is hovered: `<a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity" aria-label="Link to section">#</a>`. Add `className="group"` to the heading element.
**Why:** Standard feature on every top dev blog (Josh Comeau, Lee Robinson, etc.). Allows readers to link directly to specific sections. The heading IDs already exist but there's no visible way to copy them.
**Risk:** None. Pure additive feature.

### 4.2 Add code language badge to code blocks
**File:** `src/components/mdx/code-block.tsx`
**What:** Extract the language from the code block's className (e.g., `language-typescript`) and render a small badge in the top-right corner of the code block showing the language name.
**Why:** Readers can't tell at a glance whether a code block is TypeScript, bash, JSON, etc. Especially important for posts with multiple languages.
**Risk:** None. The className pattern is standard MDX/remark behavior.

### 4.3 Fix dateModified in JSON-LD
**Files:** `src/lib/blog.ts` (frontmatter type), `src/app/blog/[slug]/page.tsx`, `src/components/json-ld.tsx`
**What:** Add an optional `updatedAt` field to the blog post frontmatter type. In `[slug]/page.tsx`, pass `updatedAt || date` to `generateMetadata`'s `modifiedTime` and to `ArticleJsonLd`'s `dateModified`. In `json-ld.tsx`, accept `dateModified` as a separate prop instead of reusing `datePublished`.
**Why:** Google uses `dateModified` for freshness ranking. Currently it always equals `datePublished`, which means updated posts get no freshness credit.
**Risk:** None. The field is optional so existing posts without it continue to work (falling back to publish date).

### 4.4 Fix ArticleJsonLd image to use dynamic OG URL
**File:** `src/components/json-ld.tsx` around line 126
**What:** Change the hardcoded `https://cryptoflexllc.com/CFLogo.png` to use the dynamic OG image URL: `` `https://www.cryptoflexllc.com/api/og?title=${encodeURIComponent(title)}` `` (matching the OpenGraph meta tags).
**Why:** Structured data image should match the OG image. Currently Google may show the logo in search results while social previews show the dynamic image.
**Risk:** None.

### 4.5 Add Bluesky and Hacker News share buttons
**File:** `src/components/social-share.tsx`
**What:** Add share buttons for Bluesky (`https://bsky.app/intent/compose?text={title} {url}`) and HN (`https://news.ycombinator.com/submitlink?u={url}&t={title}`).
**Why:** Bluesky has surpassed Twitter/X for tech audiences. HN drives significant referral traffic for dev blogs.
**Risk:** None. Additive buttons.

### Prompt for Phase 4:
```
I need blog content experience improvements across cryptoflexllc. Use parallel agents:

Agent 1 (general-purpose): Heading anchors and code language badges:
- src/app/blog/[slug]/page.tsx createHeading function (lines 64-80): Add a group class to the heading element. After the {children}, add an anchor link: <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity no-underline" aria-label="Link to section">#</a>. The heading wrapper needs "group" in its className.
- src/components/mdx/code-block.tsx: Extract language from className (split "language-" prefix). If a language is detected, render a small absolute-positioned badge in the top-right: <span className="absolute top-2 right-12 text-xs text-muted-foreground/70 font-mono uppercase">{language}</span>. Ensure the code block wrapper has relative positioning.

Agent 2 (general-purpose): JSON-LD and SEO fixes:
- src/lib/blog.ts: Add optional "updatedAt" field to the blog post frontmatter type/interface.
- src/app/blog/[slug]/page.tsx: In generateMetadata, use post.updatedAt || post.date for modifiedTime. Pass updatedAt to ArticleJsonLd as dateModified.
- src/components/json-ld.tsx: (a) Accept dateModified as a separate prop on ArticleJsonLd (default to datePublished if not provided). (b) Change the image from "https://cryptoflexllc.com/CFLogo.png" to use the dynamic OG URL: `https://www.cryptoflexllc.com/api/og?title=${encodeURIComponent(headline)}`.

Agent 3 (general-purpose): Social share buttons:
- src/components/social-share.tsx: Add share buttons for Bluesky (https://bsky.app/intent/compose?text={encodedTitle}%20{encodedUrl}), and Hacker News (https://news.ycombinator.com/submitlink?u={encodedUrl}&t={encodedTitle}). Create simple SVG icon components for Bluesky and HN following the existing TwitterIcon/LinkedInIcon pattern. Place them after the existing X and LinkedIn buttons.

Run tests and build after all agents complete.
```

---

## Phase 5: Blog Card Visual Differentiation and Homepage Polish

**Estimated effort: Medium. Design-focused changes with visual impact.**

### 5.1 Add color accent bars to blog cards
**File:** `src/components/blog-card.tsx`
**What:** Add a 3px colored bar at the top of each card based on the primary tag. Create a tag-to-color mapping (e.g., "Claude Code" = cyan, "Security" = red, "AI" = purple, "Next.js" = white, "DevOps" = green, default = border color). Render as a `<div className="h-0.75 w-full rounded-t-lg" style={{ backgroundColor: tagColor }} />` at the top of the Card.
**Why:** 19 text-only cards create a monotonous visual wall. Color coding by topic gives instant visual differentiation and helps readers scan for content they care about.
**Risk:** Low. Need to pick colors that work in both dark and light mode and don't clash with the cyan brand. Keep them muted/desaturated.

### 5.2 Vary homepage section treatments
**File:** `src/app/page.tsx`
**What:** Add subtle background tints to alternating sections. Give the "Need IT Help?" / Services section a distinct CTA treatment with `bg-muted/20` and a stronger border accent.
**Why:** 7+ sections using identical `py-16 + border-t` creates visual monotony. Alternating backgrounds create visual rhythm and help users distinguish sections.
**Risk:** Low. Subtle background tints (`bg-muted/20`) are minor. Test in both themes.

### 5.3 Add service card icons
**File:** `src/app/services/page.tsx`
**What:** Import `Shield`, `Server`, `Lightbulb`, `Globe` from lucide-react. Add the appropriate icon to each service card header.
**Why:** Four identical cards with no visual hierarchy feel like a plain list. Icons add instant recognition.
**Risk:** None.

### 5.4 Improve hero portrait size on mobile
**File:** `src/components/hero.tsx` line 47
**What:** Change `w-48` to `w-56` for the mobile default. The responsive chain becomes `w-56 sm:w-64 md:w-72 lg:w-80`.
**Why:** At 192px, the portrait is the first thing mobile users see (due to `flex-col-reverse`) but feels undersized. 224px is a better starting point.
**Risk:** None. Minor sizing adjustment.

### Prompt for Phase 5:
```
I need visual polish improvements across cryptoflexllc. Use parallel agents:

Agent 1 (general-purpose): Blog card color accents:
- src/components/blog-card.tsx: Add a colored accent bar at the top of each card. Create a tagColorMap object mapping tag names to OKLCH or hex colors that work in dark mode: "Claude Code" -> "hsl(187 100% 50%)" (cyan), "Security" -> "hsl(0 70% 60%)" (red), "AI" -> "hsl(270 70% 65%)" (purple), "Next.js" -> "hsl(0 0% 80%)" (light gray), "DevOps" -> "hsl(150 70% 50%)" (green), "Hooks" -> "hsl(45 90% 55%)" (amber). Default to "hsl(187 50% 30%)" (muted cyan). Use the first tag of the post to select the color. Add a <div> with h-0.75 (3px) rounded-t-lg and the background color at the very top inside the Card, before CardHeader.

Agent 2 (general-purpose): Homepage section variation and service icons:
- src/app/page.tsx: Add bg-muted/10 to alternating sections (the About Me teaser and the Services teaser sections) to create visual rhythm. Give the Services/IT Help section a slightly stronger treatment with bg-muted/20. Don't change the hero or stats sections.
- src/app/services/page.tsx: Import Shield, Server, Lightbulb, Globe from lucide-react. Add the appropriate icon to each service card's CardHeader: Security Consulting = Shield, IT Infrastructure = Server, IT Strategy & Support = Lightbulb, Web Development = Globe. Style: className="h-8 w-8 text-primary mb-2".
- src/components/hero.tsx: Change w-48 to w-56 for the mobile portrait size.

Run tests and build after both agents complete.
```

---

## Phase 6: Code Quality and DRY Cleanup

**Estimated effort: Medium. Refactoring with broad file touch but low risk.**

### 6.1 Extract BASE_URL to shared constants
**New file:** `src/lib/constants.ts`
**What:** Create `export const BASE_URL = "https://www.cryptoflexllc.com";` and replace all 7+ inline definitions across `layout.tsx`, `subscribe/route.ts`, `blog/[slug]/page.tsx`, `cron/weekly-digest/route.ts`, `sitemap.ts`, `robots.ts`, `json-ld.tsx`, `feed.xml/route.ts`, etc.
**Why:** DRY principle. If the domain ever changes, it needs updating in one place, not seven.
**Risk:** Low. Import path changes only. Run full test suite to catch any issues.

### 6.2 Extract maskEmail to shared utility
**Files:** `src/app/api/subscribe/route.ts`, `src/app/api/cron/weekly-digest/route.ts`
**What:** Move the `maskEmail` function to `src/lib/utils.ts` (or `src/lib/email-utils.ts`) and import it in both routes.
**Why:** Identical function duplicated in two files. If masking logic changes, both need updating.
**Risk:** None.

### 6.3 Extract subscribe hook (DRY for subscribe forms)
**Files:** `src/components/subscribe-form.tsx`, `src/components/subscribe-inline.tsx`
**What:** Create `src/hooks/use-subscribe.ts` with the shared API call logic, loading state, error state, and success state. Both components import the hook and provide only their visual layer.
**Why:** Two components duplicate the same fetch call, state management, and GA tracking. Divergence risks inconsistent behavior.
**Risk:** Low. Behavioral change is zero; only the code organization changes. Test both subscribe forms manually.

### 6.4 Remove redundant security headers from middleware
**File:** `src/middleware.ts`
**What:** Remove the `X-Frame-Options` and `X-Content-Type-Options` header setting from middleware since they're already set in `next.config.ts` headers function.
**Why:** Redundant code. The `next.config.ts` headers are the canonical source and apply to all routes including static assets.
**Risk:** Low. Verify with `curl -I` that headers still appear on responses after removing from middleware.

### 6.5 Remove potentially redundant @next/mdx dependency
**File:** `package.json`
**What:** Check if `@next/mdx` is actually imported anywhere. If only referenced in `outputFileTracingIncludes`, remove it from dependencies. The site uses `next-mdx-remote/rsc` for MDX rendering.
**Why:** Unused dependency adds to install size and potential confusion.
**Risk:** Low. Need to verify the `outputFileTracingIncludes` reference doesn't depend on the package being installed.

### Prompt for Phase 6:
```
I need code quality cleanup across cryptoflexllc. Use parallel agents:

Agent 1 (general-purpose): Extract BASE_URL constant:
- Create src/lib/constants.ts with: export const BASE_URL = "https://www.cryptoflexllc.com";
- Search for all files containing the string "https://www.cryptoflexllc.com" or "https://cryptoflexllc.com" in the src/ directory.
- In each file, replace the inline URL string with an import from @/lib/constants. Be careful with files that use both www and non-www variants. The canonical URL is "https://www.cryptoflexllc.com".
- Do NOT change URLs inside MDX blog post content files. Only change TypeScript/TSX source files.

Agent 2 (general-purpose): Extract shared utilities and clean up middleware:
- Move the maskEmail function from src/app/api/subscribe/route.ts to a new file src/lib/email-utils.ts. Import it in both subscribe/route.ts and cron/weekly-digest/route.ts. Remove the duplicate.
- Create src/hooks/use-subscribe.ts: Extract the shared subscribe API call logic, loading/error/success state, and GA tracking from subscribe-form.tsx and subscribe-inline.tsx. Both components should import useSubscribe() and provide only their visual layer.
- src/middleware.ts: Remove the X-Frame-Options and X-Content-Type-Options header setting since they're already in next.config.ts.

Agent 3 (general-purpose): Audit @next/mdx dependency:
- Search the codebase for any imports or requires of "@next/mdx". Check if it's actually used in next.config.ts or anywhere else. If the only reference is in outputFileTracingIncludes (which traces files, not code), remove @next/mdx from package.json dependencies.
- Run npm install after removing to update package-lock.json.

Run the full test suite after all agents complete. Then run the build to verify.
```

---

## Phase 7: Sticky TOC and Blog Layout Enhancement

**Estimated effort: Medium-High. Requires restructuring blog post layout at desktop breakpoints.**

### 7.1 Sticky sidebar TOC on desktop
**Files:** `src/app/blog/[slug]/page.tsx`, `src/components/blog-toc.tsx`
**What:** Restructure the blog post layout to use a two-column grid at `lg:` breakpoints: `lg:grid lg:grid-cols-[1fr_16rem] lg:gap-8`. The TOC moves into the right column with `sticky top-20` positioning. On mobile, the existing inline collapsible TOC behavior is preserved.
**Why:** Long posts lose the TOC as soon as the user scrolls past it. A sticky sidebar lets readers navigate at any point. Standard feature on major tech blogs.
**Risk:** Medium. Requires careful layout restructuring. The article max-width (`max-w-3xl`) may need adjustment at the `lg:` breakpoint to accommodate the sidebar. Test with posts of varying TOC lengths (short, long, none). Ensure the TOC doesn't overlap content on `md:` screens.

### 7.2 Move theme toggle in mobile menu
**File:** `src/components/nav.tsx` lines 108-110
**What:** Move the ThemeToggle from the bottom of the Sheet (after all nav links) to just below the logo area in the Sheet header.
**Why:** Currently buried as the last item. Moving it to the header area makes it more discoverable without requiring scrolling past all nav links.
**Risk:** None. Visual repositioning only.

### Prompt for Phase 7:
```
I need the blog TOC to become a sticky sidebar on desktop and the theme toggle moved in the mobile menu. This is a single focused task:

Read these files first: src/app/blog/[slug]/page.tsx, src/components/blog-toc.tsx, src/components/nav.tsx.

For the sticky TOC:
- In src/app/blog/[slug]/page.tsx: Restructure the article area to use a two-column layout at lg: breakpoint. The current max-w-3xl article wrapper should become lg:grid lg:grid-cols-[minmax(0,_1fr)_16rem] lg:gap-8 at large screens. The main article content goes in the first column. The BlogToc component goes in the second column.
- In src/components/blog-toc.tsx: Add a variant or responsive behavior. On mobile (default), keep the current inline collapsible behavior. On lg: screens, render the TOC in a sticky container with "lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto". Remove the border and collapsible toggle on desktop (they should only appear on mobile). The TOC should be hidden on mobile if it's being rendered in the sidebar (use lg:hidden on the inline version and hidden lg:block on the sidebar version, OR use a single component with responsive classes).
- Test with: a post with many headings, a post with few headings (< 3), and verify the 3-heading threshold still works.

For the theme toggle:
- src/components/nav.tsx: In the mobile Sheet, move the ThemeToggle from the bottom (after the nav links and border-t) to the Sheet header area, next to or below the logo.

Run tests and build after completing.
```

---

## Phase 8: Security Hardening

**Estimated effort: Medium. Security changes require careful testing.**

### 8.1 Fix Bearer auth to use HMAC token
**File:** `src/lib/analytics-auth.ts` lines 81-98
**What:** Change the Bearer token fallback to accept the HMAC-derived token instead of the raw `ANALYTICS_SECRET`. The token is the same one stored in the cookie: `createHmac("sha256", secret).update("analytics-auth").digest("hex")`.
**Why:** Currently the raw secret is compared over the wire and could appear in access logs or Vercel request logs. Using the derived token means the raw secret never leaves the server.
**Risk:** Low. Any existing programmatic clients using the raw secret would need to switch to the HMAC-derived token. Document the change.

### 8.2 Add rate limiting to track-engagement endpoint
**File:** `src/app/api/analytics/track-engagement/route.ts`
**What:** Import and apply the existing rate limiter (from `src/lib/rate-limit.ts`) with a reasonable limit (e.g., 30 requests per minute per IP). The endpoint already has DB-level deduplication, but adding rate limiting prevents write pressure from bot spam.
**Why:** Only write endpoint without rate limiting. A bot rotating user agents could spam scroll/time events.
**Risk:** Low. The deduplication already handles data integrity; rate limiting just adds resource protection. Verify the limit doesn't interfere with legitimate single-user scrolling (which fires at 25/50/75/100% depth = 4 events).

### 8.3 Add guestbook and contact to vercel.json WAF allowlist
**File:** `vercel.json` line 33
**What:** Add `guestbook|contact` to the negative lookahead regex: `/api/(?!analytics|subscribe|unsubscribe|cron/weekly-digest|cron/cleanup-rate-limits|comments|subscribers|backlog|guestbook|contact)(.*)`
**Why:** These API routes may be inadvertently blocked by the WAF deny rule.
**Risk:** Low. Verify by testing the guestbook submit and contact form after deployment.

### 8.4 Tighten CSP connect-src
**File:** `next.config.ts` line 52
**What:** Remove `https://neon.tech` from `connect-src` if no client-side code connects to Neon (all DB calls are server-side).
**Why:** Tighter CSP reduces attack surface. If an XSS vulnerability existed, the attacker couldn't exfiltrate data to neon.tech.
**Risk:** Low. If any client-side analytics code uses Neon directly, this would break it. Search for `neon` imports in client components to verify.

### 8.5 Run npm audit fix
**What:** Run `npm audit fix` to resolve the 14 HIGH minimatch vulnerabilities in devDependencies.
**Why:** Clutters audit output and may fail CI pipelines with strict security gates.
**Risk:** Low. These are devDependency updates. Run tests after to verify no regressions.

### Prompt for Phase 8:
```
I need security hardening across the cryptoflexllc codebase. Use parallel agents:

Agent 1 (general-purpose): Fix auth and rate limiting:
- src/lib/analytics-auth.ts: In the verifyApiAuth function's Bearer token fallback section (~lines 81-98), instead of comparing the raw ANALYTICS_SECRET, derive the HMAC token the same way the cookie token is created: createHmac("sha256", secret).update("analytics-auth").digest("hex"), then compare that to the Bearer token using timingSafeEqual. This ensures the raw secret never travels over the wire.
- src/app/api/analytics/track-engagement/route.ts: Import the rate limiter from @/lib/rate-limit. Add rate limiting of 30 requests per minute per IP to the POST handler, before the Zod validation. Follow the same pattern used in the comments or subscribe routes.

Agent 2 (general-purpose): Fix WAF, CSP, and dependencies:
- vercel.json line 33: Add guestbook|contact to the WAF allowlist regex negative lookahead. The new pattern should be: /api/(?!analytics|subscribe|unsubscribe|cron/weekly-digest|cron/cleanup-rate-limits|comments|subscribers|backlog|guestbook|contact)(.*)
- next.config.ts: Search the src/ directory for any client-side imports of @neondatabase/serverless (files that have "use client" directive AND import neon). If none exist, remove "https://neon.tech" from the connect-src CSP directive.
- Run: npm audit fix

Run the full test suite and build after both agents complete.
```

---

## Phase 9: CI/CD Pipeline and Monitoring

**Estimated effort: Medium-High. New infrastructure, not code changes.**

### 9.1 Create GitHub Actions CI workflow
**New file:** `.github/workflows/ci.yml`
**What:** Create a CI pipeline that runs on push to main and on pull requests:
1. Checkout
2. Setup Node.js 22
3. `npm ci`
4. `npm run type-check` (or `npx tsc --noEmit`)
5. `npm run lint`
6. `npm test`
7. `npm run build`
8. `npm audit --audit-level=moderate`
**Why:** The project has 524 tests with 98% coverage but they're never run automatically. A CI pipeline catches regressions before they reach production. This was flagged as the #1 operational gap by SecDevOps.
**Risk:** Low. The workflow only runs checks; it doesn't deploy. May need to handle env var secrets for tests that require DATABASE_URL (mock or skip in CI).

### 9.2 Add Sentry error tracking (optional, requires account)
**What:** Install `@sentry/nextjs`, configure with DSN env var, add to `next.config.ts` via `withSentryConfig()`. Create `sentry.client.config.ts` and `sentry.server.config.ts`.
**Why:** No visibility into client-side JS errors in production. If a React component throws, there's no notification.
**Risk:** Low. Sentry's free tier handles 5K events/month. Adds ~30KB to client bundle. Can be skipped if cost is a concern and revisited later.

### 9.3 Add healthcheck ping for weekly digest cron
**File:** `src/app/api/cron/weekly-digest/route.ts`
**What:** After successful digest send, make a fetch call to a healthcheck service (healthchecks.io free tier) to confirm the cron ran. If the cron stops firing, the healthcheck service alerts via email.
**Why:** Vercel Cron fails silently sometimes. If the weekly digest stops sending, there's no detection until a subscriber notices.
**Risk:** Low. The fetch call is fire-and-forget; if the healthcheck service is down, the digest still sends normally.

### Prompt for Phase 9:
```
I need CI/CD and monitoring infrastructure for cryptoflexllc. Use parallel agents:

Agent 1 (general-purpose): Create GitHub Actions CI pipeline:
- Create .github/workflows/ci.yml with a workflow that runs on push to main and on pull_request:
  - name: CI
  - runs-on: ubuntu-latest
  - Steps: checkout, setup-node (v22, cache npm), npm ci, npx tsc --noEmit, npm run lint, npm test, npm run build
  - Add env vars needed for tests: DATABASE_URL (check if tests mock this or need a real connection). If tests use vi.mock for DB, no real DATABASE_URL is needed. Check the test files to determine this.
  - Add npm audit --audit-level=moderate as a separate step that continues-on-error (so it warns but doesn't block merges for low-severity issues).

Agent 2 (general-purpose): Add cron healthcheck:
- src/app/api/cron/weekly-digest/route.ts: After the successful digest send (after all emails are sent), add a non-blocking healthcheck ping. Use fetch to ping a configurable URL from env var HEALTHCHECK_PING_URL (optional). Wrap in try/catch so failures don't affect the digest. Only ping if the env var is set.
- src/lib/env.ts: Add HEALTHCHECK_PING_URL as an optional string field to the env schema.

Run tests and build after both agents complete.
```

---

## Phase 10: Advanced Features (Analytics, Newsletter, Schema)

**Estimated effort: High. Involves database schema changes and new UI components.**

### 10.1 Add UTM parameter parsing to analytics tracking
**File:** `src/app/api/analytics/track/route.ts`, database migration
**What:** Extract `utm_source`, `utm_medium`, `utm_campaign` from the tracked page URL query params. Store in new columns on the `page_views` table. Surface in the analytics dashboard with a "Campaign Performance" section.
**Why:** Newsletter links already include UTM parameters, but they're not extracted for analysis. This enables newsletter click-through attribution.
**Risk:** Medium. Requires a database migration (ALTER TABLE page_views ADD COLUMN). Run migration on Neon before deploying the code change.

### 10.2 Add subscriber count social proof
**Files:** `src/components/subscribe-form.tsx`, `src/app/api/subscribe/route.ts`
**What:** Add a GET handler to the subscribe route that returns the total active subscriber count (no PII). Display "Join X readers" above the subscribe form.
**Why:** Social proof increases conversion rates. Showing subscriber count builds trust.
**Risk:** Low. The count is not sensitive (no emails exposed). Cache the count (5-minute TTL) to avoid DB hits on every page load.

### 10.3 Add subscriber growth trend chart to analytics
**File:** Analytics dashboard components
**What:** Query subscriber creation dates grouped by week/month. Render a line chart showing subscriber growth over time.
**Why:** Currently the subscriber panel shows totals but no trend. Growth trends reveal whether content strategy is working.
**Risk:** Low. Read-only query on existing data.

### 10.4 Add conversion funnel tracking
**Files:** `src/app/api/subscribe/route.ts`, analytics dashboard
**What:** Record the referrer page (which blog post the user was reading) when they subscribe. Store as `source_page` in the subscribers table. Surface as "Top Converting Posts" in the analytics dashboard.
**Why:** Knowing which posts drive subscriptions informs content strategy. Currently there's no attribution.
**Risk:** Low. Optional column addition. May require migration.

### 10.5 Add TechArticle / HowTo schema for tutorial posts
**File:** `src/components/json-ld.tsx`, `src/app/blog/[slug]/page.tsx`
**What:** Add a `schemaType` frontmatter field (optional, defaults to "Article"). Support "TechArticle" and "HowTo" variants in ArticleJsonLd. Pass through to the `@type` field in the JSON-LD output.
**Why:** Tutorial-style posts (like "Getting Started with Claude Code") benefit from richer schema. Google can display HowTo steps directly in search results.
**Risk:** Low. Optional field; existing posts default to "Article" as before.

### 10.6 Add search query analytics
**File:** `src/components/blog-list.tsx`, analytics tracking
**What:** When a user searches the blog (via Fuse.js), fire a tracking event with the search query (debounced, 1s delay). Store in a new `search_queries` table. Surface as "Top Searches" in the analytics dashboard.
**Why:** Knowing what users search for reveals content gaps. If people search for "hooks" but no post ranks, that's a signal to write about hooks.
**Risk:** Low. Privacy consideration: search queries are anonymous (IP-based, no PII). Debounce prevents tracking every keystroke.

### Prompt for Phase 10:
```
I need advanced analytics and content features for cryptoflexllc. Use parallel agents. NOTE: Some of these require database migrations on Neon Postgres. Run migrations first, then deploy code.

Agent 1 (general-purpose): UTM parsing and search analytics:
- src/app/api/analytics/track/route.ts: After extracting the page path, also parse the URL for utm_source, utm_medium, and utm_campaign query parameters. Store them in the page_views insert (add these columns to the INSERT statement). Write the Neon SQL migration to add these 3 nullable TEXT columns to the page_views table. Include the migration SQL in a comment at the top of the file for manual execution.
- src/components/blog-list.tsx: When the user types in the search input (debounced 1 second), fire a fetch to /api/analytics/track-engagement with type "search" and the query text. This lets the analytics dashboard show what users search for.

Agent 2 (general-purpose): Subscriber social proof and conversion tracking:
- src/app/api/subscribe/route.ts: Add a GET handler that returns { count: number } with the total active subscriber count. Cache the response with Cache-Control: public, max-age=300.
- src/components/subscribe-form.tsx: Fetch the subscriber count on mount from GET /api/subscribe. Display "Join {count} readers" above the email input. Show nothing while loading (no layout shift).
- src/app/api/subscribe/route.ts POST handler: Extract Referer header from the request. Store it as source_page in the subscribers INSERT (add nullable TEXT column). Write the migration SQL in a comment.

Agent 3 (general-purpose): Schema and analytics dashboard enhancements:
- src/lib/blog.ts: Add optional "schemaType" field to frontmatter (values: "Article", "TechArticle", "HowTo", default "Article").
- src/components/json-ld.tsx ArticleJsonLd: Accept schemaType prop, use it as the @type value instead of hardcoded "Article".
- src/app/blog/[slug]/page.tsx: Pass post.schemaType to ArticleJsonLd.

Run tests and build after all agents complete. Database migrations must be run manually on Neon before deploying.
```

---

## Verification Plan

After all 10 phases:

1. **Test suite**: `npx vitest run` (all 524+ tests pass)
2. **Type check**: `npx tsc --noEmit` (zero errors)
3. **Lint**: `npm run lint` (zero warnings)
4. **Build**: `npx next build` (zero errors, all pages generated)
5. **Manual checks**:
   - Visit `/blog` and verify card accent bars, search empty state, tag filtering
   - Visit a blog post and verify heading anchors, code language badges, sticky TOC on desktop, reading progress bar below nav
   - Visit `/` and verify consolidated Games section, varied section backgrounds, updated stats
   - Test subscribe form labels with screen reader (or browser dev tools accessibility audit)
   - Verify skip-to-content link appears on Tab press
   - Check nav highlights "Blog" when on `/blog/some-post`
   - Test social share buttons (Bluesky, HN)
   - Check footer icons and RSS link
   - Run `curl -I https://www.cryptoflexllc.com` and verify security headers
   - Submit guestbook and contact form to verify WAF allowlist
   - Check analytics dashboard for new sections (if Phase 10 deployed)
6. **CI verification**: Push to a branch, verify GitHub Actions workflow runs

---

## Phase Summary

| Phase | Focus | Files Changed | Risk |
|-------|-------|--------------|------|
| 1 | Quick fixes (colors, URLs, sizing) | 6 | None |
| 2 | Accessibility (skip-link, labels, aria) | 4 | None |
| 3 | Nav, layout, footer polish | 5 | Low |
| 4 | Blog content (anchors, JSON-LD, sharing) | 6 | Low |
| 5 | Visual differentiation (cards, icons, hero) | 4 | Low |
| 6 | Code quality (DRY, constants, cleanup) | 12+ | Low |
| 7 | Sticky TOC, theme toggle | 3 | Medium |
| 8 | Security (auth, CSP, WAF, rate limit) | 5 | Low |
| 9 | CI/CD and monitoring | 3 (new files) | Low |
| 10 | Advanced analytics and schema | 8+ DB migrations | Medium |
