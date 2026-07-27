# Blog Post Pipeline Consolidation Plan

**Date:** 2026-07-22
**Status:** In progress
**Goal:** One `/blog-post` entry point, callable from any repo, producing a consistent post with cover graphic, diagrams, voice QA, and validation that matches CI.

## Problems Found (audit 2026-07-22)

1. Two divergent `/blog-post` definitions: `~/.claude/commands/blog-post.md` (old phase orchestrator) and `~/.claude/skills/blog-post/skill.md` (new 5-agent captain pipeline). One shadows the other.
2. The captain pipeline lost the cover graphic phase (brand-graphics) and the parallel diagram track that the old command had. Only 29 of 84 published posts have `coverImage`.
3. 11 seriesOrder collisions in production, caused by inconsistent series quoting (`series: X` vs `series: 'X'`) plus a quote-sensitive grep instruction in the skill. `BlogSeriesNav` renders wrong "Part X of Y" data today.
4. Three validators with three rule sets (`validate-mdx.sh`, project-tools MCP `validate_blog_post`, inline command checks). None matches the real CI gate (`src/__tests__/content-security.test.ts`), which has failed publishes twice (bare `chris2ao/<private-repo>` references).
5. `blog-mdx-reference.md` is stale: lists 15 of 56 diagram components, omits YouTubeEmbed, CodePlayground, CoverImageLightbox, coverImage/coverImageAlt/schemaType frontmatter, and the backlog registry registration step.
6. `blog-writer.md` embeds drifted copies of the style guide and MDX reference.
7. Neither inventory implementation (`blog-inventory.sh`, MCP `blog_posts`) emits series/seriesOrder/coverImage/featured, yet the skill derives seriesOrder "from the inventory".
8. Manual series navigation footer instructions are obsolete: the site auto-renders `BlogSeriesNav` from frontmatter.
9. Stale facts: voice profile baselines from a 4-post sample at 46 posts (now 84), wrong repo path in `brand-graphics.md`, nonexistent `everything-claude-code:code-reviewer` agent type, hardcoded 5-series list (actual: 12+).

## Decisions (user-approved)

- Merge everything into the skill; delete `~/.claude/commands/blog-post.md`. Keep the captain architecture.
- Validation = run the repo's real CI content test (`npx vitest run src/__tests__/content-security.test.ts`) plus one upgraded `validate-mdx.sh` for style rules CI does not cover. MCP `validate_blog_post` delegates to the same script.
- Repair the 11 seriesOrder collisions and normalize series quoting (unquoted) in production now.
- Full voice profile re-baseline across the 84-post corpus (de-slop section untouched).

## Work Items

### A. cryptoflexllc repo
- [x] A1. Series repair: normalize all `series:` values to unquoted, renumber each series 1..N by ascending date. Verify build. (52 posts touched; zero collisions verified independently; backlog quote-normalized without renumbering)
- [x] A1b. Content violations found by the new validator and fixed: em dashes in 10 posts (mostly coverImageAlt), missing author/readingTime in 2 posts. Remaining em dashes are inside code fences quoting real artifacts (allowed).
- [ ] A2. This plan doc committed.

### B. ~/.claude config (claude-code-config)
- [x] B1. Rewrite `skills/blog-post/skill.md`: absolute repo resolution (works from any cwd), inventory via upgraded script, discovery questions incl. old command's topic-selection recipes (this session / today / 24h / specific feature), dynamic series options from inventory, captain spawn contract.
- [x] B2. Rewrite `agents/blog-captain.md`: add Phase 3 parallel diagram authoring track, Phase 4.5 cover graphic (brand-graphics agent), validation = CI test + validate-mdx.sh, remove obsolete manual series-nav work, quote-insensitive series handling, schemaType selection, backlog runtime notes, expanded final report.
- [x] B3. Refresh `agents/blog-writer.md` embedded style guide + MDX reference to match current site capabilities.
- [x] B4. Update `skills/blog-mdx-reference.md`: current component inventory approach (grep the registry, do not hardcode), both-registry registration, full frontmatter schema, backlog runtime differences. Corrected image guidance: raw JSX img bypasses the components map; markdown image syntax is mandatory (per verified 2026-05-13 finding).
- [x] B5. Update `skills/blog-style-guide.md`: frontmatter defers to the MDX reference as single schema source, drop manual series footer.
- [x] B6. Upgrade `scripts/blog-inventory.sh`: emit series (quote-normalized), seriesOrder, coverImage, featured; series_summary with per-series count and max_order. Tested: valid JSON, 84 posts, 12 series.
- [x] B7. Upgrade `scripts/validate-mdx.sh`: require author + readingTime, private-repo checks mirroring CI HIGH-1/HIGH-3 semantics (code-example scoping, prose warnings for unknown chris2ao repos), bare-digit JSX trap, nested-quote JSX heuristic (warning), slug charset, fence+inline-code-aware callout counting. Tested on synthetic bad post + full 84-post sweep.
- [x] B8. Fix repo path in `agents/brand-graphics.md`.
- [x] B9. Delete `commands/blog-post.md`.
- [x] B10. project-tools MCP: `validate_blog_post` delegates to `validate-mdx.sh` (legacy checks kept as fallback); `blog_posts` gains series/seriesOrder/featured/has_cover. node --check passes.
- [x] B11. Voice profile re-baseline: 84-post corpus, P10-P90 ranges + recent-15 medians. KEY FINDING: contractions collapsed to median 0 in the last 15 posts (was 12-20 per 1000) and questions to 0; both marked as TARGET metrics so voice review pushes back against the AI-monotone drift instead of codifying it.

### C. Verification
- [ ] C1. Run upgraded validate-mdx.sh against 2 recent posts (expect pass) and a synthetic bad post (expect fail).
- [ ] C2. Run content-security vitest suite after series repair.
- [ ] C3. `npm run build` in cryptoflexllc after series repair.
- [ ] C4. Review pass over all changed files.

## Pipeline Shape (target)

```
/blog-post (skill, global, cwd-independent)
  Step 1  inventory script (series-aware)
  Step 2  read voice profile
  Step 3  AskUserQuestion: destination, source material, series (dynamic), tone
  Step 4  spawn Blog Captain (opus)
            Phase 1  voice brief + research (parallel)
            Phase 2  writer drafts MDX
            Phase 3  parallel: editor, voice review, UX/build, validation
                     (CI test + script), diagram author (TSX only)
            Phase 4  writer revision (feedback + diagram placement)
            Phase 4.5 brand-graphics cover (PNG + frontmatter)
            Phase 5  final build, user approval, commit
  Step 5  display report, offer push, series data stays consistent
```
