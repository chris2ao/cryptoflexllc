import type { Metadata } from "next";
import { Suspense } from "react";
import { SubscribeForm } from "@/components/subscribe-form";
import { BlogIndex } from "@/components/blog/blog-index";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { BASE_URL } from "@/lib/constants";

/**
 * Static metadata.
 *
 * This previously read searchParams to emit robots noindex on filtered views,
 * which forced the route to render dynamically. The canonical below already
 * consolidates every ?tag=, ?category= and ?q= variant onto /blog, which is
 * the mechanism that actually handles duplicate query-string URLs, and the
 * category links themselves carry rel="nofollow" while none of these URLs
 * appear in the sitemap.
 */
export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tech articles about cybersecurity, AI-assisted development with Claude Code, web infrastructure, Next.js, and hands-on engineering projects.",
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
  robots: { index: true, follow: true },
  openGraph: {
      title: "Blog: CryptoFlex LLC",
      description:
        "Tech articles about cybersecurity, AI-assisted development, and hands-on engineering projects.",
      url: `${BASE_URL}/blog`,
      type: "website",
      images: [
        {
          url: `${BASE_URL}/api/og?title=The+Blog&author=Chris+Johnson`,
          width: 1200,
          height: 630,
          alt: "CryptoFlex LLC Blog",
        },
    ],
  },
};

/** The primary categories shown in the filter bar. Order matters. */
const FEATURED_CATEGORIES = [
  "All",
  "Claude Code",
  "Security",
  "AI",
  "Next.js",
  "Infrastructure",
  "OpenClaw",
];

export default function BlogPage() {
  const posts = getAllPosts();
  const allTags = getAllTags();

  // Derive category list: featured first, then any extra tag-derived categories
  const tagSet = new Set(posts.flatMap((p) => p.tags));
  const extraCategories = Array.from(tagSet)
    .filter(
      (tag) =>
        !FEATURED_CATEGORIES.includes(tag) &&
        FEATURED_CATEGORIES.every((c) => c.toLowerCase() !== tag.toLowerCase())
    )
    .sort();
  const categories = [...FEATURED_CATEGORIES, ...extraCategories];

  // Strip raw MDX content before passing to client components
  const summaries = posts.map(({ content: _, ...rest }) => rest);

  // Featured posts (no category filter applied; always show top featured)
  const featuredSummaries = posts
    .filter((p) => p.featured)
    .map(({ content: _, ...rest }) => rest)
    .slice(0, 3);

  return (
    <>
      <EditorialPageHeader
        sectionLabel="§ 01 / The Blog"
        overline="Archive"
        title={<>From the <em className="text-italic-serif" style={{ color: "var(--fg-2)" }}>workshop.</em></>}
        lede="Field notes on cybersecurity, AI-assisted development, infrastructure, and the craft of shipping things that actually work."
      />
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {posts.length === 0 ? (
          <p className="text-muted-foreground">
            No posts yet. Check back soon!
          </p>
        ) : (
          <>
            <Suspense>
              <BlogIndex
                posts={summaries}
                featured={featuredSummaries}
                categories={categories}
                allTags={allTags}
              />
            </Suspense>

            {/* Subscribe form at the bottom */}
            <div className="mt-12 max-w-xl">
              <SubscribeForm />
            </div>
          </>
        )}
      </div>
      </section>
    </>
  );
}
