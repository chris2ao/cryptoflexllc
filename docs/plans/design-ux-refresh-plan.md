# CLAUD-765: cryptoflexllc.com design and UX refresh (unattended fan-out)

Date: 2026-11-07. Jira: CLAUD-765 (Backlog -> In Progress at start). Source: Nov 6 design and UX review (Claude Doc `582d588f-97a3-41a2-92fa-0d496695b2b9`). Repo copy of this plan: `docs/plans/design-ux-refresh-plan.md`, committed in wave 1.

## Context

The April 2026 editorial rebuild and the Oct 16 home refresh hold up, but the review found consistency and finish problems: two design generations live at once (Services, blog index Featured cards), muted text under 4.5:1, rendering bugs in every post (literal backticks in inline code, white scrollbars on dark), stale and contradictory data (two Quick Tips posts both `seriesOrder: 3`, a wrong LinkedIn URL on the author card, a three-week-old "Now building"), a heavy two-row sticky header, a 103-post index with no paging and 202 tags, four different subscribe asks, and three different descriptions of Chris with a Services page that offers no proof. This is a refresh, not a redesign: same `.ed-*` system, same tokens, zero new dependencies.

Owner decisions (2026-11-07):
- Identity line: **"Security engineer by day. On my own time I build with AI agents, run a home-lab SOC, and write down what breaks."**
- Services: two security offers only; the web design and site management offer is dropped.
- All four waves merge and deploy unattended once CI, visual QA and review pass. Copy facts are restricted to what the current About and home pages already say.

## Facts that shape the plan

- Local `main` (c80494f) is 7 commits behind `origin/main` (3ef9a56). The four posts the review cites, including both Quick Tips posts, exist only on remote. **Step zero is `git pull --ff-only`.**
- Item 7 (editorial system on leftover pages) is not a task of its own: the blog index Featured cards are replaced by item 8's Start-here block, and Services is rebuilt by item 12. Both are built in the editorial system from the start.
- Tag census on the 99 local posts: 196 tags, 116 used once, Claude Code on 85. Remote adds 4 posts.
- `globals.css` (4221 lines) is the merge hotspot. Parallel tasks inside a wave are chosen so their hunks are far apart; the controller merges the header branch first in wave 2.
- Existing tests constrain the work: `NewsletterPopup.test.tsx` (20 s timer, 7-day dismissal, 60% scroll gate on mobile posts), `blog-list.test.tsx` (mobile paging keeps every card in the DOM), `nav.test.tsx` (primary links, mobile menu), `now-strip.test.tsx` (NOW_BUILDING constant), `page.test.tsx` (home images exist in `public/`, no em dashes, gapless section numbers), `public-assets.test.ts` (1.5 MB cap), `content-security.test.ts`, `published-frontmatter.test.ts`.

## Execution model

`parallel-fanout-build`: four sequential waves, one PR each, branched from the deployed `main`. Inside a wave, 2 or 3 `general-purpose` implementers (`model: "sonnet"`, `isolation: "worktree"`, **never named**, no agent spawns agents) run in parallel on the owned files below. The main session is the controller: seam commit, merges (`--no-ff`, typecheck after each), the wave checkpoint, PR, CI, merge, deploy check, Jira. Browser QA runs only in the controller, one process at a time.

Branches: `refresh/wave-1-quick-fixes`, `refresh/wave-2-chrome`, `refresh/wave-3-index-subscribe`, `refresh/wave-4-positioning`. Commit subjects carry the key: `fix: CLAUD-765 ...`, `feat: CLAUD-765 ...`, `refactor: CLAUD-765 ...`. Factual bodies, no em dashes anywhere (code, copy, commits).

Global constraints for every implementer brief: TDD (test first, then implement); immutability (new objects, never mutate); files 200 to 400 lines, functions under 50 lines; `next/link` for internal hrefs, `<a target="_blank" rel="noopener noreferrer">` for external; static class maps, never interpolated Tailwind or `ed-*` fragments; no new dependencies; no em dashes; touch only the owned files; commit on the task branch only; run only the task's own test files, not the full suite; report findings for Jira in the final message, never write report files.

Wave checkpoint (controller, after all branches merge):
1. `npx tsc --noEmit && npm run lint && npm test && npm run build` (same gate as CI).
2. Visual pass on `next start` at 320, 768, 1024, 1440 in dark and light (Chrome MCP screenshots; Playwright if it is already in `node_modules`, with the `x-forwarded-proto: https` header per memory). Each wave lists what to look at.
3. `blog-mdx-prepublish-check` where MDX changed (waves 1 and 3).
4. One `code-reviewer` (sonnet) on `git diff <wave-base>..HEAD`; wave 3 also gets one `security-reviewer`. Findings go back to the owning implementer via SendMessage; CRITICAL and HIGH fixed before the PR.
5. Push once, open the PR with a test plan, `gh run watch`, merge, confirm the production deployment (Vercel MCP `list_deployments`), spot-check the live page, `git pull --ff-only`, remove worktrees, Jira comment with the PR and merge commit.

Vercel budget: one push per wave plus one fix-up push at most. Expect 8 to 10 deployments total.

---

## Wave 0: setup (controller, inline)

1. `git pull --ff-only` on `main`; confirm HEAD is 3ef9a56 or newer and `src/content/blog/pihole-tailscale-ad-blocking-on-the-go.mdx` exists.
2. Copy this plan to `docs/plans/design-ux-refresh-plan.md` (plan-docs rule). Add the ownership maps below as the durable record.
3. Jira: `CLAUD-765` -> In Progress (transition by target status name).
4. Check `node_modules/playwright` or `@playwright/test`; pick the browser QA tool.

## Wave 1: quick fixes (items 1 to 5), three implementers

Wave base: `main` after the pull. Seam commit: the plan file only.

**A1 CSS tokens (items 2, 3).** Owns `src/app/globals.css` lines 85 to 370 plus every `color: var(--fg-4)` site, and a new `src/lib/__tests__/contrast.test.ts` (or `scripts/contrast-check.mjs`).
- `color-scheme: dark` on `:root`, `color-scheme: light` on `.light` (fixes native scrollbars).
- Raise dark `--foreground-muted` (which `--fg-3` aliases) from L 0.55 to about 0.62; verify the light `--foreground-muted` (L 0.52 on L 0.97) too. Compute WCAG ratios with a small oklch -> sRGB -> relative luminance script and report the numbers; AA is 4.5:1 for `--fg-3` text on `--background`, `--surface-1` and `--surface-2`.
- `--fg-4` stops being a text colour: every `color: var(--fg-4)` (14 sites: `.ed-post-row .idx` and `.byline span`, `.ed-path-meta`, `.ed-work-idx`, `.ed-post-header-meta .sep`, `.ax-*` labels and index cells, lines near 1807, 1841, 2110, 2222, 2273, 2612, 2812, 3039, 3245, 3529, 3616, 3941, 4042) becomes `var(--fg-3)`. The one `background: var(--fg-4)` (dot) stays. Leave the token defined.
- Test: a vitest that parses the tokens out of `globals.css` and asserts the ratios, so the contrast fix cannot regress silently.

**A2 content and data (items 1, 4).** Owns `src/app/blog/[slug]/page.tsx` (line 368 only), `src/content/blog/pihole-tailscale-ad-blocking-on-the-go.mdx` (frontmatter only), `src/components/blog/AuthorCard.tsx`, `src/components/home/now-strip.tsx` + test, `src/lib/home-content.ts` + test, `src/app/page.tsx` (the `NowStrip` props line only).
- Item 1: add `prose-code:before:content-none prose-code:after:content-none` to the prose wrapper class string. Verify by rendering the DNS leaks post locally and asserting no backtick text node inside `code` (vitest on the compiled MDX is fine, or a Playwright/Chrome check noted for the controller).
- Item 4a: `seriesOrder: 4` on the Pi-hole Tailscale post. Jira post stays 3. Run `blog-mdx-prepublish-check` logic: the gray-matter load check and frontmatter colon quoting.
- Item 4b: AuthorCard LinkedIn -> `https://www.linkedin.com/in/chris-johnson-secops/` (matches nav, footer, `json-ld.tsx`). Add a test that every LinkedIn href in `src/` is that URL.
- Item 4c: Now strip derives everything. Delete `NOW_BUILDING`. New `getNowBuilding(posts)` in `home-content.ts` returns the newest series post as `{ text: "<series> · Part <n>", href: seriesHref, asOf: post.date }`; the strip shows "Now building" (derived, linked, "as of <post date>") and "Next dispatch". Remove the duplicate "In progress" cell. Update `now-strip.test.tsx` (drop the constant tests, add derivation tests) and `home-content.test.ts`.

**A3 accessibility (item 5).** Owns `src/components/promos/*` (the shared promo component that takes `headerText`), `src/components/third-conflict-promo.tsx`, `src/components/cann-cann-promo.tsx` + tests, `src/app/page.tsx` line 67 (`<main>` -> `<div>`) + `page.test.tsx`.
- The card heading's accessible name is the full `headerText`; the typing effect becomes `aria-hidden="true"` decoration (text in a visually hidden span, or `aria-label` on the heading). Test with `getByRole("heading", { name: /INCOMING TRANSMISSION/ })`.
- Home page: inner `<main>` -> `<div>`; test that the rendered home has exactly one `main` landmark when wrapped in the layout `main` (or simply that `HomePage` renders no `main`).

Controller visual checks: a post with inline code (no backticks), dark-theme scrollbar colour on the TOC and a wide table, home labels readable in both themes, VoiceOver-equivalent check via the accessibility tree for the Arcade headings.

## Wave 2: header and post chrome (items 6, 9, 13), three implementers

**B1 header (item 6).** Owns `src/components/nav.tsx` + test, `src/components/footer.tsx` + test, `src/components/blog-toc.tsx` + test, `globals.css` masthead and subnav block (lines 696 to 860), the scroll-margin block (2538 to 2560) and `.ed-post-aside` top (2719).
- `.ed-subnav` becomes `position: static` (scrolls away) at every width; keep its links. Add Skills, Resources, Guestbook to the footer links (Contact is already there).
- `.masthead` background `color-mix(... 97%, transparent)`.
- Remove `{ href: "/#subscribe", label: "Subscribe" }` from `links`; keep a Subscribe entry in `mobileLinks` so phones still have it; the masthead button remains the single desktop Subscribe.
- Header is now 88px (72px at 768 and below). TOC sidebar `top-20` -> `top-[100px]`, observer `rootMargin: "-100px 0px -80% 0px"`, `.ed-post-aside { top: 100px }`, `scroll-margin-top` 84px at 768 and below and 100px above (rewrite the comment). Update `nav.test.tsx` expectations and add a footer test for the three new links.

**B2 post page (item 9).** Owns `src/components/blog-series-nav.tsx` + new test, `src/app/blog/[slug]/page.tsx` lines 348 to 357 and 381 to 385, and a **new appended block** at the end of the post-page CSS section (do not edit lines 2697 to 2721) plus `.prose-table-wrap` at 4188.
- Series nav collapses to one row: "Series: X" link, "Part N of M", previous and next links, progress bar, and a native `<details><summary>Show all parts</summary><ol>...</ol></details>` for the full list (no client JS, keyboard accessible). Tests: collapsed by default, prev/next correct at the ends, all titles present in the details.
- Wide tables: at `min-width: 1024px` widen `.ed-post-layout` to 1280px so the article column is 972px; `.prose-table-wrap` may grow to the full column (`width: calc(100% + 2 * var(--table-bleed))`, negative margins, centred) while paragraphs stay at 720px; it must never overlap the 260px aside. Verify in the DNS leaks post at 1024 and 1440.

**B3 house-style cover (item 13).** `brand-graphics` agent. Owns `public/home/home-soc-cover.jpg` (new) and the `image`/`imageAlt` of the first project in `src/components/home/selected-work.tsx`.
- Editorial house style per `docs/cover-graphics-standards.md`, bespoke composition for "A home SOC, built from the logs up" (Wazuh, ClickHouse log lake, Mission Control). JPEG, 1600px wide, q85, under 1.5 MB. The SIEM post keeps its own cover. Controller does the art-director pass on the render before merge. `page.test.tsx` already asserts the file exists.

Controller merge order: B1, then B2, then B3. Visual checks: header height and opacity over a post heading, TOC heading clear of the header, anchor jumps land below the header at 320/768/1440, Security Engineering part 13 opening paragraph within one screen of the cover, DNS post table width at 1024 and 1440, the new cover beside the other work cards in both themes.

## Wave 3: blog index and subscribe (items 8, 10), two implementers

**C1 blog index and taxonomy (item 8, plus item 7's Featured half).** Owns `src/app/blog/page.tsx` (everything except the subscribe lines), `src/components/blog/blog-index.tsx`, `src/components/blog/FeaturedPosts.tsx` (delete) and a new `src/components/blog/start-here.tsx` + test, `src/components/blog-list.tsx` + test, `src/components/blog-card.tsx` + test, `src/components/blog/CategoryFilter.tsx` + test, `src/lib/tag-accent.ts` + test, `src/content/tag-taxonomy.json` (new), `scripts/consolidate-tags.mjs` (new), `src/__tests__/tag-taxonomy.test.ts` (new), the `tags:` block of every file in `src/content/blog/` and `src/content/backlog/`, and new editorial CSS appended to `globals.css`.
- Start here: replace Featured with a "Start here" block of up to 6 series cards from `summarizeSeries`/`pickReadingPaths` (`src/lib/home-content.ts`), styled with the existing `.ed-path` card rules (Source Serif heading, hairline square border, mono chips). Shown only with no filter active.
- Paging at every width: reuse the existing signature-keyed paging, PAGE_SIZE 12 under `sm`, 24 at `sm+`, "Show more posts (n of m)" button visible at all widths; every card stays in the DOM (hidden beyond the count) so crawlers and the existing tests keep working and hidden lazy covers never load. Update `blog-list.test.tsx`.
- Cards show `tags.slice(0, 3)`.
- Taxonomy (12 topics): Claude Code, AI Agents, MCP, Memory, Security, Detection & SIEM, Home Lab, Web Development, Python & Data, Game Development, Open Source, Career & Life. `tag-taxonomy.json` holds the topics and an `old -> topic | null` map covering all 196+ tags (AI Agents absorbs Agents, Multi-Agent, Agent Teams, Persona Teams, AI, OpenClaw, Ollama, Deep Research; Home Lab absorbs Pi-hole, UniFi, Tailscale, Raspberry Pi, Mission Control; Detection & SIEM absorbs SIEM, Wazuh, ClickHouse, Vector-as-log-shipper; Web Development absorbs Next.js, React, TypeScript, Vercel, Analytics, SEO; Python & Data absorbs Python, FastAPI, SQLite, Neon Postgres, Personal Finance; Claude Code absorbs Workflow, Automation, Hooks, Skills, Configuration, Features). Each post ends with 1 to 3 topics, most specific first (the first tag drives the accent bar); Claude Code stays only where the title or description is about Claude Code itself, so it lands on well under half the posts.
- `consolidate-tags.mjs`: rewrites only the `tags:` block (inline or list form) byte-for-byte otherwise, never gray-matter stringify; re-parses every file with `src/lib/frontmatter.ts` afterwards. Committed so it can be rerun.
- `tag-taxonomy.test.ts`: every live and backlog post uses only taxonomy tags, 1 to 3 each. `FEATURED_CATEGORIES` becomes "All" plus the 12 topics; the extra-tag append is removed. `tag-accent.ts` keys move to the topics. Run `blog-mdx-prepublish-check` on the changed posts.

**C2 subscribe (item 10).** Owns `src/components/home/subscribe-block.tsx` + test, `src/components/subscribe-form.tsx` and `src/components/subscribe-inline.tsx` (delete after checking usages), new `src/components/subscribe/subscribe-card.tsx` + test and `src/lib/subscribe-copy.ts`, `src/components/newsletter/NewsletterPopup.tsx` + test, `src/hooks/use-subscribe.ts` + test, the subscribe import and usage lines in `src/app/blog/page.tsx` (lines 3 and 105 to 108) and `src/app/blog/[slug]/page.tsx` (line 556), `src/components/blog-comments.tsx` and `src/components/blog/CommentForm.tsx` + tests.
- One name and one copy source: `subscribe-copy.ts` exports the title "Field notes, every Monday.", the body line, and `MIN_SOCIAL_PROOF = 100`. `SubscribeBlock` (home) stays the canonical editorial look; `SubscribeCard` is its compact editorial variant for the post footer and blog index; the popup uses the same copy. No "Weekly Digest", no "Stay in the Loop".
- Reader count renders only when `subscriberCount >= MIN_SOCIAL_PROOF` (hook or component, tested).
- Popup: remove the 20 s timer. Reveal when scroll depth reaches 60% on any route (excluded prefixes unchanged), desktop and mobile; keep the 7-day dismissal and permanent subscribed suppression, the dialog/non-modal split and Escape handling. Rewrite the timer tests as scroll tests.
- Comments: stay subscriber-only (deliberate spam guard). Reaction is no longer preselected: state starts `null`; if the API or DB requires a value (check `src/app/api/comments` and the schema), the submit button stays disabled until the reader picks one. No DB migration.

Controller: merge C1 then C2 (both touch `blog/page.tsx` in different hunks). One `security-reviewer` on the wave diff (comment form state, popup storage, subscribe surfaces). Visual checks: index with Start here at 320/768/1440, show-more at desktop, three chips per card, 13 category chips, popup appears only after scrolling 60% on home and on a post, post footer subscribe card in both themes.

## Wave 4: positioning and consulting (items 11, 12, plus item 7's Services half), two implementers

**D1 identity (item 11).** Owns `src/components/home/hero-identity.tsx` + test, `src/app/about/page.tsx`, `src/components/blog/AuthorCard.tsx`, `src/app/layout.tsx` (metadata description, PersonJsonLd description and jobTitle), `src/app/page.tsx` metadata, `src/components/home/about-section.tsx` + test, new `src/lib/identity.ts` exporting `IDENTITY_LINE`.
- `IDENTITY_LINE` = the owner's line above. Use it verbatim as the hero sub (replacing the current two sentences), the About lede, the author card bio opening, and the site and home meta descriptions (trim to 160 chars where a suffix is needed). Author card title: "Security Engineer · Builder" (matches the hero caption). PersonJsonLd jobTitle "Security Engineer".
- Rewrite About in the voice of the recent posts (read the three newest posts in `src/content/blog` for voice: direct, concrete, first person, no roll calls). Facts allowed: only those already on About and the home page (career path, FIU B.S. IT Magna Cum Laude, Florida, day job in cyber defense operations, the series and projects named on the home page). Move About to the editorial layout (`.ed-wrap`, `.ed-overline`, Source Serif headings, hairline rules; drop the Badge skill cloud or restyle it as `.ed-tag` chips). Retire "Sometimes it's security-related. Often it's not" and "Welcome to the playground". A test asserts the identity line appears on home, About and the author card.

**D2 Services (item 12).** Owns `src/app/services/page.tsx` + new test, new editorial CSS appended to `globals.css` (`.ed-offer*`), and `src/lib/case-studies.ts` only if it is the right home for the proof list.
- Rebuild in the editorial system (no shadcn `Card`, no rounded cards, no pill tags): header, then two offers as `.ed-work`-style panels: (1) "Security review of AI agent setups" with proof links to `security-review-round-two`, the first site security review, and the prompt injection post; (2) "Detection engineering for small teams" with proof links to the Custom SIEM, Homelab Wazuh and Mission Control series pages. Each offer: one paragraph, three bullets of what you get, two or three linked posts. Then a three-step "How an engagement works" strip (scoping call, fixed-scope review or build, written report and handoff), then the contact button (`btn-editorial--primary` to `/contact`). Web design is removed. Update the metadata description and the home `about-section.tsx` consulting line to name the two offers (coordinate: D1 owns that file, so D2 reports the one-line change for the controller to apply).
- Test: both offer headings render, every proof href resolves to a post or series that exists (reuse the pattern in `page.test.tsx` "links only to posts and series that exist"), no em dashes, no "web design" text.

Controller: merge D1 then D2, apply the about-section line. Visual checks: hero, About and Services at 320/768/1440 in both themes; author card on a post; `view-source` meta descriptions.

## Close-out (controller)

- Jira: comment per wave with PR and merge commit; `CLAUD-765` -> Done with the four merge commits once the wave 4 production deployment is live and spot-checked.
- File one follow-up: the `/blog-post` pipeline's `blog-writer` agent (harness, outside this repo) must choose tags from `src/content/tag-taxonomy.json`, otherwise the new CI test fails the next publish. Search `project = CLAUD AND statusCategory != Done` for a match first.
- Bundle any leftover LOW/MEDIUM review findings into one Jira item.
- Vector memory: the taxonomy decision, the Now strip derivation, the subscribe copy source, and the header height constants (tagged `cryptoflexllc`).
- `/wrap-up` for CHANGELOG, README deltas, memory and the final push.

## Verification summary

| Gate | Where |
|---|---|
| `tsc`, lint, vitest, build | every wave, locally before push, then CI on the PR |
| Contrast ratios by script | wave 1 (A1 test) |
| Visual pass 320/768/1024/1440, dark and light | every wave, controller |
| `blog-mdx-prepublish-check` | waves 1 and 3 |
| `code-reviewer` once per wave | every wave |
| `security-reviewer` | wave 3 |
| Production deployment live and spot-checked | every wave |
| Speed Insights and lazy covers on the index | wave 3 close |

## Status (2026-11-07)

All four waves merged to main and deployed the same day, unattended, with one sonnet implementer per task in its own worktree and the main session as controller.

| Wave | PR | Merge commit | Items |
|---|---|---|---|
| 1 quick fixes | #50 | 226240c | 1, 2, 3, 4, 5 |
| 2 header and post chrome | #51 | 1cfdfba | 6, 9, 13 (plus the pre-existing 1024px prose overflow) |
| 3 blog index and subscribe | #52 | 61f2f9d | 8, 10, item 7's Featured half |
| 4 positioning and consulting | #53 | 8b6d242 | 11, 12, item 7's Services half |

Each wave passed tsc, eslint, the full vitest suite, next build and CI, a visual pass measured with headless Chrome at 320, 1024 and 1440 (plus 768 in wave 1), and one code review; wave 3 also had a security review. Production was verified after each merge with headless Chrome (curl receives the Vercel Security Checkpoint page, not the site). Follow-ups: CLAUD-767 (the blog pipeline must pick tags from the taxonomy) and CLAUD-768 (eight minor review findings).
