# Changelog

All notable changes to this project are documented here.

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
