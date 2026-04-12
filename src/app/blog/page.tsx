import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogList } from "@/components/blog-list";
import { SubscribeForm } from "@/components/subscribe-form";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { FeaturedPosts } from "@/components/blog/FeaturedPosts";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { BASE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tech articles about cybersecurity, AI-assisted development with Claude Code, web infrastructure, Next.js, and hands-on engineering projects.",
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
  openGraph: {
    title: "Blog — CryptoFlex LLC",
    description:
      "Tech articles about cybersecurity, AI-assisted development, and hands-on engineering projects.",
    url: `${BASE_URL}/blog`,
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

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = await searchParams;
  const activeCategory = category ?? null;

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

  // Server-side category filter (case-insensitive)
  const filteredPosts =
    activeCategory === null
      ? posts
      : posts.filter((post) =>
          post.tags.some(
            (tag) => tag.toLowerCase() === activeCategory.toLowerCase()
          )
        );

  // Strip raw MDX content before passing to client component
  const summaries = filteredPosts.map(({ content: _, ...rest }) => rest);

  // Featured posts (no category filter applied; always show top featured)
  const featuredSummaries = posts
    .filter((p) => p.featured)
    .map(({ content: _, ...rest }) => rest)
    .slice(0, 3);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="bracket-frame mb-12">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight">Blog</h1>
          <p className="mt-4 text-lg font-body text-muted-foreground leading-relaxed">
            Thoughts on tech projects, cybersecurity, infrastructure, and
            things I&apos;m learning.
          </p>
        </div>

        {/* Featured posts (only shown when no category filter active) */}
        {activeCategory === null && (
          <FeaturedPosts posts={featuredSummaries} />
        )}

        {posts.length === 0 ? (
          <p className="text-muted-foreground">
            No posts yet. Check back soon!
          </p>
        ) : (
          <>
            <Suspense>
              <BlogList posts={summaries} allTags={allTags} />
            </Suspense>

            {/* Category filter below posts for browsing by topic */}
            <div className="mt-16 pt-12 border-t border-border/40">
              <h2 className="font-heading text-lg font-semibold mb-4 text-muted-foreground">Browse by Topic</h2>
              <CategoryFilter categories={categories} activeCategory={activeCategory} />
            </div>

            {/* Subscribe form at the bottom */}
            <div className="mt-12 max-w-xl">
              <SubscribeForm />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
