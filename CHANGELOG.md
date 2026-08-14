# Changelog

All notable changes to this project are documented here.

## 2026-08-13 - Backlog/Blog Parity and the Editorial Diagram System

### What changed
- **Matched** backlog draft pages to the production blog: draft cards now show cover infographics and draft detail pages render the same hero/cover layout as published posts
- **Redesigned** all 10 SVG diagrams across the three backlog drafts onto a new editorial diagram system, replacing plain outlined boxes and diagonal connector lines with the cover-infographic aesthetic
- **Added** shared diagram primitives in `src/components/mdx/diagram-editorial.tsx` (EditorialFrame, NodePanel, FlowLine/elbowPath orthogonal connectors, Chip, SectionLabel, StepBadge, TerminalDots, DIAGRAM_ACCENTS) plus a quality contract, `docs/editorial-diagram-standards.md`, with a mandatory screenshot verification loop
- **Updated** `blog-captain.md` and the `/blog-post` skill to require the editorial diagram standard and reject plain-box/diagonal-line diagrams
- **Fixed** `--color-surface-1` through `--color-surface-4` missing from the `globals.css` `@theme` block, which had silently no-opped `bg-surface-2` on blog cards; registered the tokens so `fill-surface-*`/`bg-surface-*` utilities generate
- **Fixed** a third drifting copy of the `tagVarMap` interpolated-class antipattern, found in `FeaturedPosts.tsx` by code review
- **Added** a production-only module cache to the `getAllPosts()` loader
- **Set** `agentRules: false` in `next.config.ts` so `next dev` stops generating `AGENTS.md`/`CLAUDE.md` at the repo root
- **Merged and deployed** PR #45 (`dpl_G58PBFKxPGiiTwG2UeqWXDGgPQXf`, READY) after `tsc`, lint, 812 vitest tests, and a production build all passed

### What was learned
- Theme tokens must be registered in the `@theme` block before their Tailwind utilities generate at all; `bg-surface-2` compiled to nothing for months with no build error, only a visually flat card
- Accent TEXT fills in SVG diagrams must route through theme-flipping tokens (`fill-success`, `fill-warning`, `fill-destructive`, `fill-primary`; cyan has no semantic slot so it uses the literal `fill-cyan-600`) or they wash out in light theme
- Local preview of auth-gated backlog pages is broken out of the box: `.env.local` ships an empty `ANALYTICS_SECRET`, so the HMAC session cookie those pages require can't be minted locally. This session's workaround was a throwaway `ANALYTICS_SECRET=devtest-preview`, a restarted dev server, and a small localhost reverse proxy that injects the session cookie so headless Chrome can screenshot authenticated pages
- The `tagVarMap` interpolated-class antipattern (see 2026-07-21 entry) has now recurred a third time in a different file; a proactive repo-wide grep before release would catch the next copy faster than waiting on code review

---

## 2026-08-13 - Security Review Round Two: Critical RCE Fix and Hardening Batch

### What changed
- **Fixed** a Critical RCE: gray-matter runs `eval()` on a language-tagged frontmatter fence (e.g. `---js`), so a content-only pull request could execute code; added `src/lib/frontmatter.ts` (`parseFrontmatter` guard rejecting language fences and disabling non-YAML engines), a CI fence-check script, and CODEOWNERS on `src/content/**`
- **Fixed** 2 High findings: spoofable client IP derivation (switched from the left-most `X-Forwarded-For` to Vercel-trusted `x-vercel-forwarded-for`/`x-real-ip` with a length cap) and stale dependencies (Next.js/eslint-config-next to 16.3.0, mermaid to 11.16.1; npm audit high count 11 to 7)
- **Fixed** a batch of Medium/Low/a11y findings: namespaced rate-limit keys (previously colliding across 11 endpoints), restored the CSP `frame-src` allowance for `youtube-nocookie.com` (video embeds were silently broken), added `object-src 'none'`, `upgrade-insecure-requests`, and COOP, boot-time env validation (warn-only), OG image route caching/length caps, JSON-LD escaping, contact-log email masking, 403-not-500 on malformed unsubscribe tokens, a 90-day page-view IP anonymization cron, CI least-privilege permissions plus a gitleaks secret scan, and accessible labels on comment/reply forms
- **Verified** every fix with 812 tests, `tsc`, and a full production build, then deployed (PR #43)
- **Published** a backlog post, "Round Two: The Security Review Where a Blog Draft Could Run Code" (Security Engineering #9), documenting the review at a lessons-learned level with 6 new diagram components and a cover infographic (PR #44)
- **Gitignored** `docs/security/` so the local, sensitive review report and its HTML companion stay out of the public repo

### What was learned
- `src/content` is a code directory, not a data directory: gray-matter's `eval()` on a `js`-tagged frontmatter fence means a content-only PR can carry executable code through the build/render pipeline
- A 5-lens security review (AppSec pentester captain, red teamer, researcher, threat-intel, security engineer) plus a customer-advocate agent representing the site owner, with every finding adversarially re-verified before acceptance, caught a Critical that the injection/XSS-focused lenses had all independently rated safe; the catch came from the red team's attack-chain lens
- On Vercel, client IP must come from the platform-trusted `x-vercel-forwarded-for` header, not the spoofable left-most `X-Forwarded-For`; rate limiters need per-endpoint key namespacing or they silently share one counter; a CSP `frame-src` missing `youtube-nocookie.com` breaks embeds with an HTTP 200 and only a console error, invisible without validating the policy against real site behavior
- A harness hook that blocks subagents from writing report files forced findings back through the message channel instead, which cost several round-trips before the review pipeline adapted

---

## 2026-08-02 - AI1 Blog Launch, Vercel CPU Fixes, and a 5.5-Month Comments Outage

### What changed
- **Published** the AI1 AI Security certification post, rethemed around continuous learning, with 4 custom diagrams and a new cover image
- **Fixed** post date rendering (Invalid Date and an off-by-one day bug); added `src/lib/post-date.ts` with tests
- **Fixed** dns-bypass diagram text being illegible in the light theme by registering `--color-warning` in `globals.css`
- **Fixed** GitHub API failures failing silently; added `GitHubApiError` and `describeFailure` with tests
- **Reduced** Fluid Active CPU usage: auto-paused the analytics live feed after 30 min idle, made `/blog` static, and narrowed middleware matcher scope (incl. `next/image` for MDX)
- **Fixed** `/api/comments` returning a 500 on every post since February (missing `parent_id` column) by running the migration in Neon and surfacing load failures in the UI instead of rendering an empty thread

### What was learned
- Middleware runs on the Fluid runtime and bills to Fluid Active CPU, not the Edge Middleware meter (which reads 0/1M) — middleware matcher scope is a direct CPU lever
- Vercel runtime-log queries are bounded by log retention, not traffic; identical counts across a 24h and 7d window is the tell (produced a 30x traffic underestimate here). Several Hobby Observability panels (Middleware→Request Path, Edge Requests→Paths) serve labeled placeholder "Demo Data" listing nonexistent routes, so reading them at face value gives a confidently wrong diagnosis
- Theme-aware SVG diagram text needs semantic tokens (`fill-destructive`, `fill-success`, `fill-warning`) instead of literal Tailwind shades; this site's `dark:` Tailwind variants don't apply because `globals.css` declares `@custom-variant dark (&:is(.dark *))` while dark is the `:root` default and `.light` is the override
- Silent failures are dangerous by design: a failed fetch that renders identically to an empty state can hide a bug for months. `/api/comments` was broken for 5.5 months because the client couldn't tell "no comments" from "comments failed to load"

---

## 2026-04-03 - Claude Code Features Blog Post with Custom SVG Diagrams

### What changed
- **Created** comprehensive blog post on 12 Claude Code features every engineer should know with 14 features, detailed explanations, and visual diagrams
- **Implemented** three custom SVG React diagram components (ConfigStackDiagram, PermissionLevelsDiagram, SerialVsParallelDiagram) following CryptoFlex brand colors and patterns
- **Generated** NotebookLM infographic and 18-slide presentation deck from blog post content
- **Added** diagrams-claude-code-features.tsx component with lightbox-enabled interactive visuals
- **Updated** both backlog/[slug]/page.tsx and blog/[slug]/page.tsx component maps to register new diagram components
- **Produced** LinkedIn draft post summarizing key engineering insights

### What was learned
- MDX component registration must occur in both backlog and blog post page components to ensure rendering works across both content types
- Custom SVG diagram components can be theme-aware using Tailwind color classes while maintaining visual consistency
- NotebookLM content generation produces production-ready assets (infographic, slide deck, PDF) from a single blog post, enabling rapid content repurposing
- End-to-end content pipeline spans blog creation, visual design, asset generation, and social media promotion, with each phase generating distinct deliverables

---
