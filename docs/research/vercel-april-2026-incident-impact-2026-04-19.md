# Vercel April 2026 Security Incident: Impact Assessment for cryptoflexllc

*Generated: 2026-04-19 | Sources: Vercel KB bulletin + Vercel project/deployment MCP | Confidence: Medium-High*

## Executive Summary

As of 2026-04-19, Vercel's bulletin describes "unauthorized access to certain internal Vercel systems" affecting "a limited subset of customers" that Vercel is "engaging with directly." The bulletin names no IOCs, no specific services, and no technical scope. There is no evidence in your Vercel project (`prj_GzzTg98SmOOBH0R5kSnpKL9N6E3m`, team `team_JiUaPP7MUxE4kCcL8RWr76v6`) of anomalous activity: all 20 most recent production deployments were triggered by `chris2ao@gmail.com` from `main` of the public `chris2ao/cryptoflexllc` GitHub repo. **You are most likely not in the impacted subset** (Vercel contacts those customers directly). However, because the bulletin explicitly recommends env var rotation and activity-log review as best practice, treat this as a precautionary rotation opportunity.

## 1. Incident Scope (from the Vercel bulletin)

- **What**: Unauthorized access to certain internal Vercel systems. No technical detail published.
- **Who is impacted**: "A limited subset of customers" being contacted directly by Vercel.
- **Services**: "Remain operational." No named feature compromise.
- **IOCs**: None disclosed.
- **Status**: Investigation ongoing; Vercel has engaged external IR experts and notified law enforcement.
- **Source**: [Vercel KB bulletin](https://vercel.com/kb/bulletin/vercel-april-2026-security-incident), last updated 2026-04-19.

## 2. cryptoflexllc Vercel Footprint

Findings from the Vercel MCP:

- **Team**: `Chris Johnson's projects` (`team_JiUaPP7MUxE4kCcL8RWr76v6`)
- **Project**: `cryptoflexllc` (`prj_GzzTg98SmOOBH0R5kSnpKL9N6E3m`)
- **Domains**: `cryptoflexllc.com`, `www.cryptoflexllc.com`, plus `*.vercel.app` aliases
- **Framework**: Next.js 16.1.6 on Node 24.x, Turbopack bundler
- **Cron jobs** (`vercel.json`): `/api/cron/weekly-digest` (Mon 13:00 UTC), `/api/cron/cleanup-rate-limits` (04:00 UTC daily)
- **Vercel-platform integrations in code**: `@vercel/analytics`, `@vercel/speed-insights`, and a personal `VERCEL_API_TOKEN` integration in `src/lib/vercel-api.ts`

### Deployment audit (last 20 production deploys)

All deployments match these authenticity signals:
- Creator: `chris2ao` / `chris2ao@gmail.com`
- Source: GitHub `chris2ao/cryptoflexllc` (public), branch `main`
- Commit author: `Chris Johnson <chris.johnson@cryptoflexllc.com>`
- Latest SHA `e3aa7a5c...` matches local `git log`

No deployments from unknown actors, no rogue deploy hooks, no unexpected target environments.

## 3. Secrets Inventory (what to rotate if you rotate)

From `src/**/*.ts` grep for `process.env.*`:

| Category | Env Var | Purpose | Rotation Urgency |
|---|---|---|---|
| Database | `DATABASE_URL` | Neon Postgres | **High** (blast radius: analytics + subscribers tables) |
| AI | `ANTHROPIC_API_KEY` | Newsletter intro generation | **High** (direct billing risk) |
| Email | `GMAIL_USER`, `GMAIL_APP_PASSWORD` | Nodemailer SMTP for digest | **High** (send-as-you) |
| HMAC | `ANALYTICS_SECRET`, `SUBSCRIBER_SECRET`, `AUTH_SECRET` | Token signing | Medium (invalidates existing sessions/tokens on rotate) |
| Cron | `CRON_SECRET` | Vercel cron Bearer auth | Medium (coordinate with Vercel Crons) |
| Vercel API | `VERCEL_API_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID` | Deployment status widgets | Medium |
| GitHub | `GITHUB_TOKEN` | Repo status widgets | Medium |
| Ops | `HEALTHCHECK_PING_URL` | Cron heartbeat | Low |
| Public (no rotation) | `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_SITE_URL` | Client config | N/A |

No `.env*` files exist in the repo (confirmed), so all secrets live in Vercel env var storage.

## 4. Impact Determination

**Primary signal that you are NOT impacted**: Vercel states impacted customers are being contacted directly. Unless you have received such a notice, treat yourself as out-of-scope.

**Secondary signal**: Clean deployment history. Every deploy in the last 20 traces back to your own GitHub commits and your own Vercel account.

**Residual risk**: The bulletin is intentionally vague. "Internal Vercel systems" could in principle include env var storage, deploy secrets, or the build system, which would mean latent exposure even without visible anomalies. Vercel's own best-practice guidance acknowledges this by recommending rotation.

## 5. Recommended Remediation

### Mandatory (do now)
1. **Check your inbox** (chris2ao@gmail.com) for any direct notice from Vercel security. If one arrived, follow its specific instructions over this doc.
2. **Review the Vercel activity log**: [vercel.com/activity-log](https://vercel.com/activity-log). Look for logins, token creations, env var changes, or deploy hook usage that you did not perform.

### Recommended (precautionary, do this week)
3. **Rotate the High-urgency secrets** in the table above, in this order:
   - `ANTHROPIC_API_KEY` (regenerate at console.anthropic.com, update Vercel env, redeploy)
   - `GMAIL_APP_PASSWORD` (revoke + reissue at myaccount.google.com/apppasswords, update Vercel env)
   - `DATABASE_URL` (rotate Neon password, update Vercel env, redeploy; watch for migration-lock effects)
4. **Mark all secrets as "sensitive"** in the Vercel dashboard. Vercel's [sensitive environment variables](https://vercel.com/docs/environment-variables/sensitive-environment-variables) feature makes values write-only after save so they cannot be read back via the dashboard or API.
5. **Rotate `VERCEL_API_TOKEN`** at [vercel.com/account/tokens](https://vercel.com/account/tokens). Scope the new token to read-only if possible.
6. **Regenerate HMAC secrets** (`ANALYTICS_SECRET`, `SUBSCRIBER_SECRET`, `AUTH_SECRET`, `CRON_SECRET`). This invalidates existing analytics cookies and unsubscribe tokens, which is acceptable here.

### Optional hardening
7. Verify **2FA is enabled** on your Vercel account and GitHub account.
8. Check **deploy hooks** in project settings and revoke any you do not recognize.
9. Review **Git integration** to confirm only your GitHub account is connected.

## 6. What To Do If A Direct Notice Arrives

If Vercel contacts you directly about this incident:
1. Do not act on the email until you confirm it came from Vercel (check headers, hover links, cross-reference via [vercel.com/help](https://vercel.com/help)).
2. Follow any rotation deadlines they specify.
3. Keep the notice for your records; if you later publish a blog post about this, redact any case-specific identifiers.

## Sources
1. [Vercel April 2026 security incident](https://vercel.com/kb/bulletin/vercel-april-2026-security-incident) - Primary Vercel KB bulletin (updated 2026-04-19).
2. [Vercel activity log](https://vercel.com/activity-log) - Personal account activity.
3. [Sensitive environment variables docs](https://vercel.com/docs/environment-variables/sensitive-environment-variables).
4. Vercel MCP queries against team `team_JiUaPP7MUxE4kCcL8RWr76v6`, project `prj_GzzTg98SmOOBH0R5kSnpKL9N6E3m` (2026-04-19).
5. Local repo `vercel.json`, `package.json`, and `src/**/*.ts` env var grep (2026-04-19).

## Methodology
- Fetched bulletin via WebFetch + Firecrawl for corroboration.
- Used Vercel MCP `list_teams`, `list_projects`, `get_project`, `list_deployments` to audit the production project.
- Grep'd the repo for `process.env.*` to build the secrets inventory.
- Cross-checked latest deploy SHA against local `git log`.
