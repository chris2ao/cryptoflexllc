# GSC Indexing Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce the 86 not-indexed pages in Google Search Console to under 20 by fixing www/non-www duplication, preview URL indexing, dead routes, and missing metadata.

**Architecture:** Five targeted fixes across middleware (www redirect, preview noindex), blog series metadata (noindex + canonical), portfolio dead route cleanup, and Vercel Dashboard configuration (bot protection, domain redirect). Each fix maps to a specific GSC "not indexed" reason.

**Tech Stack:** Next.js 15 App Router, Vercel hosting, TypeScript

---

## GSC Issue Mapping

| GSC Reason | Pages | Fix Task |
|------------|-------|----------|
| Alternate page with proper canonical tag | 30 | Task 1 (www redirect) |
| Discovered - currently not indexed | 32 | Task 5 (Vercel bot protection) |
| Not found (404) | 10 | Task 3 (portfolio cleanup) |
| Blocked by robots.txt | 8 | No fix needed (intentional) |
| Crawled - currently not indexed | 6 | Task 2 (series noindex) |

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/middleware.ts` | Modify | www redirect + vercel.app noindex |
| `src/app/blog/series/[name]/page.tsx` | Modify | Add noindex + canonical metadata |
| `src/app/portfolio/[slug]/page.tsx` | Delete | Remove dead route |
| `next.config.ts` | Modify | Add portfolio catch-all redirect |

---

### Task 1: Middleware SEO Hardening

**Impact:** Fixes 30 "alternate page with proper canonical tag" entries + prevents future preview URL indexing.

**Files:**
- Modify: `src/middleware.ts`

- [ ] **Step 1: Add www redirect to middleware**

In `src/middleware.ts`, add a www redirect block after the garbage path blocking and before the HTTPS enforcement. This handles requests to `cryptoflexllc.com` (non-www) by redirecting to `www.cryptoflexllc.com`:

```typescript
// Redirect non-www to www in production
if (process.env.NODE_ENV === "production") {
  const host = request.headers.get("host");
  if (host === "cryptoflexllc.com") {
    return NextResponse.redirect(
      `https://www.cryptoflexllc.com${pathname}${request.nextUrl.search}`,
      301
    );
  }
}
```

Insert this block at line 39, after the regex-like path blocking and before the HTTPS enforcement block.

- [ ] **Step 2: Add X-Robots-Tag noindex for Vercel preview domains**

Below the www redirect block, add a check for Vercel preview domains. These should be crawlable but not indexed:

```typescript
// Prevent indexing of Vercel preview/deployment URLs
const host = request.headers.get("host");
if (host && host.endsWith(".vercel.app")) {
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
```

Insert this after the www redirect block but before the HTTPS enforcement block.

- [ ] **Step 3: Verify the complete middleware reads correctly**

The full `middleware` function should now have this flow:
1. Block garbage paths (existing)
2. Block regex-like paths (existing)
3. Redirect non-www to www (new)
4. Add noindex for vercel.app domains (new)
5. Enforce HTTPS (existing)
6. NextResponse.next() (existing)

- [ ] **Step 4: Commit**

```bash
git add src/middleware.ts
git commit -m "fix(seo): add www redirect and noindex for vercel preview domains

Add 301 redirect from cryptoflexllc.com to www.cryptoflexllc.com to
eliminate duplicate content. Add X-Robots-Tag noindex header for all
*.vercel.app preview deployment URLs to prevent Google indexing them.

Fixes 30 'alternate page with proper canonical tag' entries in GSC."
```

---

### Task 2: Blog Series Pages Metadata

**Impact:** Fixes 6 "crawled - currently not indexed" entries by explicitly telling Google not to index aggregation pages.

**Files:**
- Modify: `src/app/blog/series/[name]/page.tsx`

- [ ] **Step 1: Add canonical and robots to generateMetadata**

In `src/app/blog/series/[name]/page.tsx`, update the `generateMetadata` function to include canonical URL and noindex directive:

```typescript
import { BASE_URL } from "@/lib/constants";
```

Add this import at the top of the file, then update `generateMetadata`:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  return {
    title: `Series: ${decodedName}`,
    description: `All posts in the "${decodedName}" series on CryptoFlex LLC.`,
    alternates: { canonical: `${BASE_URL}/blog/series/${name}` },
    robots: { index: false, follow: true },
  };
}
```

The `follow: true` ensures Google still follows links on series pages to discover blog posts, while `index: false` tells Google not to index these aggregation pages.

- [ ] **Step 2: Verify the file compiles**

Run: `cd /Users/chris2ao/GitProjects/cryptoflexllc && npx tsc --noEmit src/app/blog/series/\\[name\\]/page.tsx 2>&1 | head -20`

Expected: No errors (or only unrelated type warnings from other files).

- [ ] **Step 3: Commit**

```bash
git add src/app/blog/series/\[name\]/page.tsx
git commit -m "fix(seo): add noindex and canonical to blog series pages

Series pages are aggregation pages that list posts in a series. Mark
them as noindex to stop Google from crawling and then choosing not to
index them. Keep follow: true so links to blog posts are still
discovered. Add canonical URL for consistency.

Fixes 6 'crawled - currently not indexed' entries in GSC."
```

---

### Task 3: Portfolio Dead Route Cleanup

**Impact:** Fixes some of the 10 "Not found (404)" entries by removing the dead route and adding a catch-all redirect.

**Files:**
- Delete: `src/app/portfolio/[slug]/page.tsx`
- Modify: `next.config.ts`

- [ ] **Step 1: Delete the dead portfolio [slug] route**

The `/src/content/case-studies/` directory does not exist, so `getAllCaseStudies()` returns `[]` and `getCaseStudyBySlug()` always returns `undefined`. Every request to `/portfolio/*` hits `notFound()`. Remove the dead route:

```bash
rm src/app/portfolio/\[slug\]/page.tsx
rmdir src/app/portfolio/\[slug\]
```

- [ ] **Step 2: Add portfolio catch-all redirect in next.config.ts**

In `next.config.ts`, add a redirect to catch any remaining `/portfolio/*` URLs and send them to `/portfolio`:

```typescript
// Portfolio detail pages don't exist yet; redirect crawled 404s
{
  source: "/portfolio/:slug",
  destination: "/portfolio",
  permanent: false,
},
```

Use `permanent: false` (302) since case studies may be added in the future. Add this to the existing `redirects` array after the existing entries.

- [ ] **Step 3: Verify no broken imports**

Check that nothing else imports from the deleted file:

Run: `grep -r "portfolio/\[slug\]" src/ --include="*.ts" --include="*.tsx" | head -10`

Expected: No results (the page was self-contained).

- [ ] **Step 4: Commit**

```bash
git add -A src/app/portfolio/\[slug\]/ next.config.ts
git commit -m "fix(seo): remove dead portfolio/[slug] route and add redirect

The case-studies content directory never existed, so every portfolio
detail URL returned 404. Remove the dead dynamic route and add a 302
redirect from /portfolio/:slug to /portfolio.

Fixes 'not found (404)' entries in GSC for portfolio detail URLs."
```

---

### Task 4: Build Verification

**Impact:** Ensures all code changes compile and the site builds successfully.

- [ ] **Step 1: Run the Next.js build**

```bash
cd /Users/chris2ao/GitProjects/cryptoflexllc && npm run build
```

Expected: Build completes with no errors. Warnings about missing env vars are acceptable.

- [ ] **Step 2: Test middleware locally (optional smoke test)**

```bash
cd /Users/chris2ao/GitProjects/cryptoflexllc && npm run dev &
sleep 3
# Test www redirect (will only work in production mode, so verify build output instead)
# Test that the build output includes the middleware
ls .next/server/middleware*
kill %1
```

Expected: Middleware files exist in the build output.

- [ ] **Step 3: Commit if any adjustments were needed**

Only if Task 4 required fixes. Otherwise, skip this step.

---

### Task 5: Vercel Dashboard Manual Steps (User Action Required)

**Impact:** Fixes 32 "discovered - currently not indexed" entries caused by Vercel bot protection.

These steps cannot be automated in code. The user must perform them in the Vercel Dashboard.

- [ ] **Step 1: Check Vercel Firewall / Attack Challenge Mode**

1. Go to Vercel Dashboard > cryptoflexllc project > Settings > Security
2. Look for "Attack Challenge Mode" or "Bot Protection"
3. If enabled, either:
   - Disable it entirely (simplest)
   - Or configure it to allow known search engine bots (Google, Bing, etc.)
4. The current 429 responses with `x-vercel-mitigated: challenge` are blocking Googlebot from crawling 32+ pages

- [ ] **Step 2: Verify domain redirect configuration**

1. Go to Vercel Dashboard > cryptoflexllc project > Settings > Domains
2. Verify that `www.cryptoflexllc.com` is set as the **primary domain**
3. Verify that `cryptoflexllc.com` shows "Redirects to www.cryptoflexllc.com"
4. If both show as active (not redirecting), remove `cryptoflexllc.com` and re-add it so Vercel prompts for redirect configuration

- [ ] **Step 3: Enable Deployment Protection for previews**

1. Go to Vercel Dashboard > cryptoflexllc project > Settings > Deployment Protection
2. Enable "Vercel Authentication" for Preview deployments
3. This adds an extra layer preventing preview URLs from being crawled, complementing the middleware X-Robots-Tag fix from Task 1

---

### Task 6: Post-Deploy GSC Actions (User Action Required)

**Impact:** Accelerates Google's re-processing of fixed pages.

- [ ] **Step 1: Request re-validation in Google Search Console**

1. Go to Google Search Console > cryptoflexllc.com > Pages > Not indexed
2. For "Alternate page with proper canonical tag": click "Validate Fix"
3. For "Not found (404)": click "Validate Fix"
4. For "Crawled - currently not indexed": click "Validate Fix"

- [ ] **Step 2: Re-submit sitemap**

1. Go to Google Search Console > Sitemaps
2. Re-submit `https://www.cryptoflexllc.com/sitemap.xml`

- [ ] **Step 3: Inspect key URLs**

Use the URL Inspection tool on a few representative pages to verify:
- Non-www URLs show "URL is an alternate version" (expected, confirms redirect works)
- www URLs show "URL is on Google" or "URL can be indexed"
- No more 429 errors in the crawl stats
