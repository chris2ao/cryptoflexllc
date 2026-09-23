# Deployment Storage Reduction Plan

**Date:** 2026-09-22
**Status:** In progress on branch `fix/deployment-storage`
**Trigger:** Vercel email (2026-09-23): the Hobby team used 100% of the free 10 GB **Deployment Storage** allowance.

## Root Cause

Traffic did not cause this. Two things multiply together:

1. **Every deployment carries 815 MB of `public/` assets.** 546 MB is PNG (269 files over 1 MB, NotebookLM infographics at 2752x1536 around 5 to 6 MB each), 209 MB is slide PDFs, plus a 38 MB `.m4a` and 10 MB of `.pptx`.
2. **Metrics auto-commits redeploy the site about twice a day.** `~/.claude/scripts/gmail-metrics-export.sh` commits `src/data/gmail-metrics.json` and `src/data/session-archive.json` after every gmail-agent run and pushes. `/analytics` imports those files at build time, so each metrics refresh needs a full rebuild of the 815 MB site.

Retention was 30 days with at least 10 production deployments always kept.

## Fixes

### A. Shorter deployment retention (operator, dashboard)

Project Settings, Security, Deployment Retention Policy: 7 days for all states, keep 3 production deployments. This takes effect with no code change. It is a dashboard action because it permanently deletes older deployments.

### B. Smaller deployments

| Asset set | Size | Action |
|---|---|---|
| Large PNGs (>300 KB) referenced inline in MDX/TSX | ~234 MB | Convert to WebP (max width 1920, quality 82) and rewrite references |
| Cover images (`coverImage` frontmatter, used as `og:image`) | ~123 MB | Convert to JPEG (max width 1600, quality 85). JPEG, not WebP, because some link-preview crawlers do not accept WebP for `og:image` |
| Large PNGs not referenced anywhere (mostly unused NotebookLM slide exports) | ~183 MB | Delete (still recoverable from git history) |
| PDFs, `.m4a`, `.pptx` | ~257 MB | Move to a public Vercel Blob store, rewrite links, delete from `public/` |

The email logo (`/CFLogo.png`) and small PNGs stay unchanged, since email clients handle WebP poorly.

A guard test fails CI when any file in `public/` exceeds 1 MB, so the blog pipelines cannot silently regrow the problem.

### C. Metrics at runtime instead of build time

- New Neon table `automation_snapshots (name text primary key, payload jsonb, updated_at timestamptz)` with rows `gmail-metrics` and `session-archive`.
- New `POST /api/gmail/metrics` ingest route, authenticated with the existing `GMAIL_AGENT_API_TOKEN` bearer (same hashed comparison as the unsubscribe routes), zod-validated, size-capped, and rate-limited.
- `/analytics` (already `force-dynamic`) reads the snapshots from Neon and renders an empty state when none exist.
- `gmail-metrics-export.sh` POSTs the JSON to the ingest route instead of committing and pushing. `src/data/gmail-metrics.json` and `src/data/session-archive.json` are removed from the repo.

## Rollout

1. Merge the branch (one deployment).
2. Run the export script once to seed Neon, then confirm `/analytics` shows current data.
3. Confirm the next scheduled agent run updates `/analytics` with no new deployment.
4. Check Usage, Deployment Storage after retention catches up.

## Expected Result

Each deployment drops from ~815 MB to under 100 MB, and deployments happen only on real content or code changes. Storage should settle well under 1 GB.
